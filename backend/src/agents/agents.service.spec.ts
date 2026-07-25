import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { validateEnvironment } from '../common/config/env.validation';
import { DatabaseModule } from '../database/database.module';
import { AgentsModule } from './agents.module';
import { AgentsService } from './agents.service';

describe('AgentsService', () => {
  const originalEnv = { ...process.env };
  let dataFile: string;
  let service: AgentsService;

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
        AgentsModule,
      ],
    }).compile();

    service = moduleRef.get(AgentsService);
  });

  afterEach(async () => {
    process.env = originalEnv;
    await rm(dataFile, { force: true });
  });

  it('validates a short prompt and returns issues', () => {
    const result = service.validate('hi');
    expect(result.passed).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('validates a valid prompt and passes', () => {
    const result = service.validate('Build a scalable API for user authentication and authorization.');
    expect(result.passed).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('executes a prompt and returns a completed execution record', async () => {
    const result = await service.execute('Design a data pipeline for real-time analytics.');
    expect(result.status).toBe('completed');
    expect(result.selectedAgents.length).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
  });

  it('learns from a completed execution', async () => {
    const execution = await service.execute('Implement security scanning for the CI pipeline.');
    const learned = await service.learn(execution.id!);
    expect(learned.executionId).toBe(execution.id);
    expect(learned.patterns.length).toBeGreaterThan(0);
    expect(learned.confidence).toBeGreaterThan(0);
  });

  it('summarizes a completed execution', async () => {
    const execution = await service.execute('Plan the frontend migration to React 19.');
    const summary = await service.summarize(execution.id!);
    expect(summary.executionId).toBe(execution.id);
    expect(summary.keyPoints.length).toBeGreaterThan(0);
  });

  it('throws when learning from a non-existent execution id', async () => {
    await expect(service.learn('non-existent-id')).rejects.toThrow();
  });

  it('throws when summarizing a non-existent execution id', async () => {
    await expect(service.summarize('non-existent-id')).rejects.toThrow();
  });
});
