import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { validateEnvironment } from '../common/config/env.validation';
import { DatabaseModule } from '../database/database.module';
import { DeployModule } from './deploy.module';
import { DeployService } from './deploy.service';

describe('DeployService', () => {
  const originalEnv = { ...process.env };
  let dataFile: string;
  let service: DeployService;

  beforeEach(async () => {
    dataFile = join(process.cwd(), 'tmp', `${randomUUID()}.json`);
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test-secret',
      AIO_DATA_FILE: dataFile,
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
        DatabaseModule,
        DeployModule,
      ],
    }).compile();

    service = moduleRef.get(DeployService);
  });

  afterEach(async () => {
    process.env = originalEnv;
    await rm(dataFile, { force: true });
  });

  it('builds a deployment with status building', async () => {
    const result = await service.build({
      name: 'api-service',
      projectId: 'proj-1',
      environment: 'preview',
    });
    expect(result.status).toBe('building');
    expect(result.name).toBe('api-service');
    expect(result.logs.length).toBeGreaterThan(0);
  });

  it('deploys to preview and returns a preview URL', async () => {
    const result = await service.deploy({
      name: 'api service',
      projectId: 'proj-1',
      environment: 'preview',
    });
    expect(result.status).toBe('succeeded');
    expect(result.url).toContain('preview');
  });

  it('deploys to production and returns a production URL', async () => {
    const result = await service.deploy({
      name: 'api service',
      projectId: 'proj-1',
      environment: 'production',
    });
    expect(result.status).toBe('succeeded');
    expect(result.url).toContain('aio.app');
    expect(result.url).not.toContain('preview');
  });

  it('lists deployments and filters by projectId', async () => {
    await service.deploy({
      name: 'alpha',
      projectId: 'proj-a',
      environment: 'preview',
    });
    await service.deploy({
      name: 'beta',
      projectId: 'proj-b',
      environment: 'preview',
    });

    const all = await service.listDeployments();
    expect(all.length).toBe(2);

    const filtered = await service.listDeployments('proj-a');
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.name).toBe('alpha');
  });

  it('gets a specific deployment by id', async () => {
    const created = await service.deploy({
      name: 'gamma',
      projectId: 'proj-g',
      environment: 'production',
    });
    const fetched = await service.getDeployment(created.id);
    expect(fetched.id).toBe(created.id);
    expect(fetched.name).toBe('gamma');
  });

  it('rolls back a deployment and returns rolled_back status', async () => {
    const original = await service.deploy({
      name: 'delta',
      projectId: 'proj-d',
      environment: 'production',
    });
    const rollback = await service.rollback(original.id);
    expect(rollback.status).toBe('rolled_back');
    expect(rollback.rollbackTargetId).toBe(original.id);
  });

  it('throws when rolling back a non-existent deployment', async () => {
    await expect(service.rollback('non-existent-id')).rejects.toThrow();
  });

  it('throws when getting a non-existent deployment', async () => {
    await expect(service.getDeployment('non-existent-id')).rejects.toThrow();
  });
});
