import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { AgentsModule } from '../agents/agents.module';
import { validateEnvironment } from '../common/config/env.validation';
import { DatabaseModule } from '../database/database.module';
import { KnowledgeEngineModule } from '../knowledge-engine/knowledge-engine.module';
import { MonitoringModule } from '../monitoring/monitoring.module';
import { WorkflowsModule } from './workflows.module';
import { WorkflowsService } from './workflows.service';

describe('WorkflowsService', () => {
  const originalEnv = { ...process.env };
  let dataFile: string;
  let service: WorkflowsService;

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
        MonitoringModule,
        AgentsModule,
        KnowledgeEngineModule,
        WorkflowsModule,
      ],
    }).compile();

    service = moduleRef.get(WorkflowsService);
  });

  afterEach(async () => {
    process.env = originalEnv;
    await rm(dataFile, { force: true });
  });

  it('waits for approval when an approval step is not approved', async () => {
    const execution = await service.run({
      name: 'Release Gate',
      steps: [
        { id: 'task-1', name: 'Plan release', type: 'task', action: 'plan' },
        { id: 'approval-1', name: 'Approve release', type: 'approval' },
      ],
      input: { approved: false },
    });

    expect(execution.status).toBe('waiting_approval');
    expect(execution.steps[1]?.status).toBe('waiting_approval');
  });

  it('completes workflow steps when conditions are met', async () => {
    const execution = await service.run({
      name: 'Launch workflow',
      steps: [
        {
          id: 'condition-1',
          name: 'Check ticket',
          type: 'condition',
          condition: 'ticket == REL-42',
        },
        {
          id: 'parallel-1',
          name: 'Parallel checks',
          type: 'parallel',
          branches: [
            { id: 'qa', name: 'QA', action: 'qa review' },
            { id: 'sec', name: 'Security', action: 'security review' },
          ],
        },
      ],
      input: { ticket: 'REL-42', approved: true },
    });

    expect(execution.status).toBe('completed');
    expect(execution.steps).toHaveLength(2);
    expect(execution.steps[0]?.status).toBe('completed');
  });
});
