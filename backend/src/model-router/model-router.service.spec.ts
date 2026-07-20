import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { validateEnvironment } from '../common/config/env.validation';
import { DatabaseModule } from '../database/database.module';
import { MonitoringModule } from '../monitoring/monitoring.module';
import { ModelRouterService } from './model-router.service';
import { ModelRouterModule } from './model-router.module';

describe('ModelRouterService', () => {
  const originalEnv = { ...process.env };
  const originalFetch = global.fetch;
  let dataFile: string;
  let service: ModelRouterService;

  beforeEach(async () => {
    dataFile = join(process.cwd(), 'tmp', `${randomUUID()}.json`);
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test-secret',
      AIO_DATA_FILE: dataFile,
      OPENAI_API_KEY: 'openai-key',
      ANTHROPIC_API_KEY: 'anthropic-key',
      ANTHROPIC_BASE_URL: 'https://anthropic-openai-compat.example.com/v1',
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
        DatabaseModule,
        MonitoringModule,
        ModelRouterModule,
      ],
    }).compile();

    service = moduleRef.get(ModelRouterService);
    await service.onModuleInit();
  });

  afterEach(async () => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    await rm(dataFile, { force: true });
  });

  it('falls back to the next configured provider when the first provider fails', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            model: 'claude-3-7-sonnet',
            choices: [{ message: { content: 'Recovered response' } }],
            usage: {
              prompt_tokens: 10,
              completion_tokens: 4,
              total_tokens: 14,
            },
          }),
      });
    global.fetch = fetchMock as typeof fetch;

    const response = await service.route({
      messages: [{ role: 'user', content: 'Recover this request.' }],
      maxTokens: 32,
    });

    expect(response.provider).toBe('anthropic');
    expect(response.content).toBe('Recovered response');
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});
