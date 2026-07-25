import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  const originalEnv = { ...process.env };
  let app: INestApplication<App>;
  let dataFile: string;
  let accessToken: string;

  beforeEach(async () => {
    dataFile = join(process.cwd(), 'tmp', `${randomUUID()}.json`);
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      JWT_SECRET: 'test-secret',
      AIO_API_KEYS: 'test-key:admin|operator',
      AIO_DATA_FILE: dataFile,
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@aio.local',
        password: 'ChangeMe123!',
      })
      .expect(201);
    accessToken = (loginResponse.body as { accessToken: string }).accessToken;
  });

  afterEach(async () => {
    process.env = originalEnv;
    await app.close();
    await rm(dataFile, { force: true });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('rejects unauthenticated /v1 requests', () => {
    return request(app.getHttpServer())
      .post('/v1/projects')
      .send({})
      .expect(401);
  });

  it('creates and lists projects through the authenticated /v1 gateway', async () => {
    const server = app.getHttpServer();

    const createResponse = await request(server)
      .post('/v1/projects')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({
        name: 'AiO Enterprise',
        description: 'Production enterprise AI operating system workspace.',
        repositoryUrl: 'https://github.com/SolanaRemix/AiO',
      })
      .expect(201);

    const createdProject = createResponse.body as { id: string; name: string };
    expect(createdProject.name).toBe('AiO Enterprise');

    const listResponse = await request(server)
      .get('/v1/projects')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .expect(200);

    expect(listResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdProject.id,
          name: 'AiO Enterprise',
        }),
      ]),
    );
  });

  it('runs workflows through the authenticated /v1 gateway', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/workflows/run')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({
        name: 'Release flow',
        steps: [
          { id: 'task-1', name: 'Plan', type: 'task', action: 'plan release' },
          { id: 'approval-1', name: 'Approval', type: 'approval' },
        ],
        input: { approved: true },
      })
      .expect(201);

    expect((response.body as { status: string }).status).toBe('completed');
  });

  it('validates a prompt via the agents SDK endpoint', async () => {
    const response = await request(app.getHttpServer())
      .post('/agents/validate')
      .send({ prompt: 'Build a secure authentication service for enterprise users.' })
      .expect(201);

    const body = response.body as { passed: boolean; issues: string[] };
    expect(body.passed).toBe(true);
    expect(body.issues).toHaveLength(0);
  });

  it('executes an agent, then learns and summarizes from the execution', async () => {
    const execResponse = await request(app.getHttpServer())
      .post('/agents/schedule')
      .send({ prompt: 'Design a data ingestion pipeline for analytics.' })
      .expect(201);

    const plan = execResponse.body as { selectedAgents: string[] };
    expect(plan.selectedAgents.length).toBeGreaterThan(0);

    const runResponse = await request(app.getHttpServer())
      .post('/v1/agents/run')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({ prompt: 'Design a data ingestion pipeline for analytics.' })
      .expect(201);

    const execution = runResponse.body as { id: string; status: string };
    expect(execution.status).toBe('completed');

    const learnResponse = await request(app.getHttpServer())
      .post(`/agents/${execution.id}/learn`)
      .expect(201);

    expect((learnResponse.body as { executionId: string }).executionId).toBe(execution.id);

    const summarizeResponse = await request(app.getHttpServer())
      .post(`/agents/${execution.id}/summarize`)
      .expect(201);

    expect((summarizeResponse.body as { executionId: string }).executionId).toBe(execution.id);
  });

  it('builds and deploys through /v1/deploy', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/deploy')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({
        name: 'api-gateway',
        projectId: 'proj-e2e',
        environment: 'preview',
      })
      .expect(201);

    const body = response.body as { status: string; url: string };
    expect(body.status).toBe('succeeded');
    expect(body.url).toContain('preview');
  });

  it('lists and deploys via the /deploy controller', async () => {
    await request(app.getHttpServer())
      .post('/deploy/production')
      .send({ name: 'frontend', projectId: 'proj-front', environment: 'production' })
      .expect(201);

    const listResponse = await request(app.getHttpServer())
      .get('/deploy')
      .expect(200);

    expect(Array.isArray(listResponse.body)).toBe(true);
    expect((listResponse.body as unknown[]).length).toBeGreaterThan(0);
  });

  it('lists connectors and runs a health check', async () => {
    const listResponse = await request(app.getHttpServer())
      .get('/connectors')
      .expect(200);

    expect(Array.isArray(listResponse.body)).toBe(true);
    const connectors = listResponse.body as Array<{ id: string; name: string }>;
    expect(connectors.length).toBeGreaterThan(0);

    const healthResponse = await request(app.getHttpServer())
      .get('/connectors/health')
      .expect(200);

    const health = healthResponse.body as Array<{ id: string; success: boolean }>;
    expect(health.length).toBe(connectors.length);
  });

  it('registers and lists a provider via the model-router CRUD endpoints', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/model-router/providers')
      .send({
        name: 'Test Provider',
        type: 'self-hosted',
        baseUrl: 'https://api.test-provider.example.com/v1',
        apiKey: 'test-api-key',
        models: ['test-model-7b'],
        priority: 5,
      })
      .expect(201);

    const registered = registerResponse.body as { id: string; name: string };
    expect(registered.name).toBe('Test Provider');

    const listResponse = await request(app.getHttpServer())
      .get('/model-router/providers')
      .expect(200);

    const providers = listResponse.body as Array<{ id: string }>;
    expect(providers.some((p) => p.id === registered.id)).toBe(true);
  });
});
