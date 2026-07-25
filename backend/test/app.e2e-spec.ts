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
  let refreshToken: string;
  let csrfToken: string;

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
    refreshToken = (loginResponse.body as { refreshToken: string })
      .refreshToken;
    csrfToken = (loginResponse.body as { csrfToken: string }).csrfToken;
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

  it('registers and refreshes an enterprise session', async () => {
    const email = `enterprise.user.${randomUUID()}@aio.local`;
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Enterprise User',
        email,
        password: 'StrongPassword123!',
        device: 'e2e-suite',
        rememberDevice: true,
      })
      .expect(201);

    const body = registerResponse.body as {
      accessToken: string;
      refreshToken: string;
      user: { email: string; workspaceId: string };
    };
    expect(body.user.email).toBe(email);
    expect(body.user.workspaceId).toBeDefined();

    const refreshResponse = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: body.refreshToken })
      .expect(201);

    expect(
      (refreshResponse.body as { accessToken: string }).accessToken,
    ).toBeDefined();
  });

  it('supports OAuth login and session retrieval', async () => {
    const oauthResponse = await request(app.getHttpServer())
      .post('/api/auth/oauth/login')
      .send({
        provider: 'github',
        oauthCode: 'oauth-code-123456',
        providerAccountId: 'github-uo-2001',
        email: 'oauth.user@aio.local',
        name: 'OAuth User',
      })
      .expect(201);

    const oauthToken = (oauthResponse.body as { accessToken: string })
      .accessToken;
    const sessionResponse = await request(app.getHttpServer())
      .get('/api/auth/session')
      .set('Authorization', 'Bearer '.concat(oauthToken))
      .expect(200);

    expect((sessionResponse.body as { email: string }).email).toBe(
      'oauth.user@aio.local',
    );
  });

  it('logs out a session using csrf protection', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .set('x-csrf-token', csrfToken)
      .send({ refreshToken })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken })
      .expect(401);
  });

  it('rejects attempts to logout another user session', async () => {
    const userOne = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Session Owner One',
        email: `session.one.${randomUUID()}@aio.local`,
        password: 'StrongPassword123!',
      })
      .expect(201);
    const userTwo = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Session Owner Two',
        email: `session.two.${randomUUID()}@aio.local`,
        password: 'StrongPassword123!',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set(
        'Authorization',
        'Bearer '.concat((userOne.body as { accessToken: string }).accessToken),
      )
      .set('x-csrf-token', (userTwo.body as { csrfToken: string }).csrfToken)
      .send({
        refreshToken: (userTwo.body as { refreshToken: string }).refreshToken,
      })
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({
        refreshToken: (userTwo.body as { refreshToken: string }).refreshToken,
      })
      .expect(201);
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

  it('updates enterprise project lifecycle and loads dashboard cards', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/projects')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({
        name: 'Lifecycle Project',
        description: 'Project lifecycle for enterprise dashboard checks.',
      })
      .expect(201);

    const projectId = (createResponse.body as { id: string }).id;

    await request(app.getHttpServer())
      .put(`/api/projects/${projectId}`)
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({
        lifecycleState: 'Architecture',
        completionPercentage: 30,
        pipelineStage: 'Solution architecture',
      })
      .expect(200);

    const dashboard = await request(app.getHttpServer())
      .get('/api/projects/dashboard')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .expect(200);

    expect((dashboard.body as { cards: Array<{ id: string }> }).cards).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: projectId })]),
    );
  });

  it('records metadata activity when lifecycle is unchanged', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/projects')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({
        name: 'Metadata Project',
        description: 'Project metadata update activity validation.',
      })
      .expect(201);
    const projectId = (createResponse.body as { id: string }).id;

    await request(app.getHttpServer())
      .put(`/api/projects/${projectId}`)
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({
        name: 'Metadata Project Updated',
      })
      .expect(200);

    const dashboardResponse = await request(app.getHttpServer())
      .get('/api/projects/dashboard')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .expect(200);

    const timeline = (
      dashboardResponse.body as {
        timeline: Array<{ projectId: string; detail: string }>;
      }
    ).timeline;
    const entry = timeline.find(
      (item) =>
        item.projectId === projectId &&
        item.detail.includes('Project metadata'),
    );
    expect(entry?.detail).toBe('Project metadata updated.');
  });

  it('initializes repository and executes git commit/push/pull/history flow', async () => {
    const projectResponse = await request(app.getHttpServer())
      .post('/api/projects')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({
        name: 'Git Workspace Project',
        description: 'Project for native git workspace API testing.',
      })
      .expect(201);
    const projectId = (projectResponse.body as { id: string }).id;

    await request(app.getHttpServer())
      .post('/api/git/connect')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({
        provider: 'github',
        accessToken: 'gho_test_token_123456',
        scope: ['repo', 'workflow'],
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/git/init')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({
        projectId,
        provider: 'github',
        repositoryName: 'aio-enterprise-test',
        defaultBranch: 'main',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/git/commit')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({
        projectId,
        message: 'feat: enterprise auth completed',
        validation: 'passed',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/git/push')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({ projectId, branch: 'main' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/git/pull')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .send({ projectId, branch: 'main' })
      .expect(201);

    const historyResponse = await request(app.getHttpServer())
      .get('/api/git/history')
      .query({ projectId })
      .set('Authorization', 'Bearer '.concat(accessToken))
      .expect(200);

    expect(
      (historyResponse.body as Array<{ projectId: string }>).length,
    ).toBeGreaterThan(0);
  });

  it('enforces enterprise project ownership across projects, notifications, and git', async () => {
    const ownerLogin = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Owner User',
        email: `owner.${randomUUID()}@aio.local`,
        password: 'StrongPassword123!',
      })
      .expect(201);
    const viewerLogin = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Viewer User',
        email: `viewer.${randomUUID()}@aio.local`,
        password: 'StrongPassword123!',
      })
      .expect(201);

    const ownerToken = (ownerLogin.body as { accessToken: string }).accessToken;
    const viewerToken = (viewerLogin.body as { accessToken: string })
      .accessToken;

    const projectResponse = await request(app.getHttpServer())
      .post('/api/projects')
      .set('Authorization', 'Bearer '.concat(ownerToken))
      .send({
        name: 'Owned Project',
        description: 'Owner-only project authorization validation.',
      })
      .expect(201);
    const projectId = (projectResponse.body as { id: string }).id;

    await request(app.getHttpServer())
      .post('/api/git/connect')
      .set('Authorization', 'Bearer '.concat(ownerToken))
      .send({
        provider: 'github',
        accessToken: 'gho_owner_token_123456',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/git/init')
      .set('Authorization', 'Bearer '.concat(ownerToken))
      .send({
        projectId,
        provider: 'github',
        repositoryName: 'owner-only-repo',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/notifications')
      .set('Authorization', 'Bearer '.concat(ownerToken))
      .send({
        projectId,
        type: 'build_failure',
        severity: 'high',
        message: 'Owner-visible alert',
      })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/api/projects/${projectId}`)
      .set('Authorization', 'Bearer '.concat(viewerToken))
      .expect(403);

    const viewerProjects = await request(app.getHttpServer())
      .get('/api/projects')
      .set('Authorization', 'Bearer '.concat(viewerToken))
      .expect(200);
    expect(viewerProjects.body).toEqual([]);

    await request(app.getHttpServer())
      .get('/api/notifications')
      .query({ projectId })
      .set('Authorization', 'Bearer '.concat(viewerToken))
      .expect(403);

    await request(app.getHttpServer())
      .post('/api/git/pull')
      .set('Authorization', 'Bearer '.concat(viewerToken))
      .send({ projectId, branch: 'main' })
      .expect(403);
  });

  it('limits /api/audit to admin users', async () => {
    const standardUser = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Standard User',
        email: `standard.${randomUUID()}@aio.local`,
        password: 'StrongPassword123!',
      })
      .expect(201);
    const userToken = (standardUser.body as { accessToken: string })
      .accessToken;

    await request(app.getHttpServer())
      .get('/api/audit')
      .set('Authorization', 'Bearer '.concat(userToken))
      .expect(403);

    await request(app.getHttpServer())
      .get('/api/audit')
      .set('Authorization', 'Bearer '.concat(accessToken))
      .expect(200);
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
      .send({
        prompt: 'Build a secure authentication service for enterprise users.',
      })
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

    expect((learnResponse.body as { executionId: string }).executionId).toBe(
      execution.id,
    );

    const summarizeResponse = await request(app.getHttpServer())
      .post(`/agents/${execution.id}/summarize`)
      .expect(201);

    expect(
      (summarizeResponse.body as { executionId: string }).executionId,
    ).toBe(execution.id);
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
      .send({
        name: 'frontend',
        projectId: 'proj-front',
        environment: 'production',
      })
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

    const health = healthResponse.body as Array<{
      id: string;
      success: boolean;
    }>;
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
