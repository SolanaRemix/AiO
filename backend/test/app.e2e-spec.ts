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
});
