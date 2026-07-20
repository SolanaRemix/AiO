import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import { type StoredProviderRecord } from '../database/database.types';
import {
  type AIProviderType,
  type ProviderRegistryEntry,
} from './interfaces/provider.interface';

interface ProviderSeed {
  id: string;
  name: string;
  type: AIProviderType;
  enabled: boolean;
  priority: number;
  baseUrl: string;
  apiKey?: string;
  models: string[];
}

@Injectable()
export class ProviderRegistryService implements OnModuleInit {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefaults();
  }

  async listProviders(options?: {
    enabledOnly?: boolean;
  }): Promise<ProviderRegistryEntry[]> {
    const providers = await this.databaseService.list('providers');
    return providers
      .filter((provider) => !options?.enabledOnly || provider.enabled)
      .sort((left, right) => left.priority - right.priority);
  }

  async findById(id: string): Promise<ProviderRegistryEntry | undefined> {
    const providers = await this.databaseService.list('providers');
    return providers.find((provider) => provider.id === id);
  }

  async register(
    provider: Omit<StoredProviderRecord, 'createdAt' | 'updatedAt'>,
  ): Promise<StoredProviderRecord> {
    const timestamp = new Date().toISOString();
    const record: StoredProviderRecord = {
      ...provider,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.databaseService.mutate((draft) => {
      const existingIndex = draft.providers.findIndex(
        (entry) => entry.id === provider.id,
      );
      if (existingIndex >= 0) {
        draft.providers[existingIndex] = record;
      } else {
        draft.providers.push(record);
      }
    });

    return record;
  }

  async markHealth(
    id: string,
    update: Partial<
      Pick<
        StoredProviderRecord,
        | 'health'
        | 'latencyMs'
        | 'lastCheckedAt'
        | 'failureCount'
        | 'circuitOpenUntil'
      >
    >,
  ): Promise<void> {
    await this.databaseService.mutate((draft) => {
      const provider = draft.providers.find((entry) => entry.id === id);
      if (provider != null) {
        Object.assign(provider, update, {
          updatedAt: new Date().toISOString(),
        });
      }
    });
  }

  private async seedDefaults(): Promise<void> {
    const existing = await this.databaseService.list('providers');
    if (existing.length > 0) {
      return;
    }

    const seeds: ProviderSeed[] = [
      {
        id: 'openai',
        name: 'OpenAI Compatible',
        type: 'cloud',
        enabled: Boolean(this.configService.get<string>('OPENAI_API_KEY')),
        priority: 1,
        baseUrl:
          this.configService.get<string>('OPENAI_BASE_URL') ??
          'https://api.openai.com/v1',
        apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        models: ['gpt-4.1', 'gpt-4o', 'gpt-4o-mini'],
      },
      {
        id: 'anthropic',
        name: 'Anthropic Compatible',
        type: 'cloud',
        enabled: Boolean(this.configService.get<string>('ANTHROPIC_API_KEY')),
        priority: 2,
        baseUrl:
          this.configService.get<string>('ANTHROPIC_BASE_URL') ??
          'https://api.anthropic.com/v1',
        apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
        models: ['claude-3-7-sonnet', 'claude-3-5-haiku'],
      },
      {
        id: 'google',
        name: 'Google Compatible',
        type: 'cloud',
        enabled: Boolean(this.configService.get<string>('GOOGLE_API_KEY')),
        priority: 3,
        baseUrl:
          this.configService.get<string>('GOOGLE_BASE_URL') ??
          'https://generativelanguage.googleapis.com/v1beta/openai',
        apiKey: this.configService.get<string>('GOOGLE_API_KEY'),
        models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
      },
    ];

    await this.databaseService.mutate((draft) => {
      draft.providers = seeds.map((seed) => this.toRecord(seed));
    });
  }

  private toRecord(seed: ProviderSeed): StoredProviderRecord {
    const timestamp = new Date().toISOString();
    return {
      id: seed.id,
      name: seed.name,
      type: seed.type,
      enabled: seed.enabled,
      priority: seed.priority,
      baseUrl: seed.baseUrl,
      apiKey: seed.apiKey,
      models: seed.models,
      timeoutMs:
        this.configService.get<number>('PROVIDER_TIMEOUT_MS') ?? 15_000,
      maxRetries: 2,
      headers: {},
      health: seed.enabled ? 'degraded' : 'unavailable',
      latencyMs: undefined,
      failureCount: 0,
      circuitOpenUntil: undefined,
      requestCount: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      estimatedCostUsd: 0,
      lastCheckedAt: undefined,
      lastUsedAt: undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  createCustomProvider(input: {
    name: string;
    type: AIProviderType;
    baseUrl: string;
    apiKey?: string;
    models: string[];
    priority?: number;
    enabled?: boolean;
  }): StoredProviderRecord {
    const timestamp = new Date().toISOString();
    return {
      id: randomUUID(),
      name: input.name,
      type: input.type,
      enabled: input.enabled ?? true,
      priority: input.priority ?? 10,
      baseUrl: input.baseUrl,
      apiKey: input.apiKey,
      models: input.models,
      timeoutMs:
        this.configService.get<number>('PROVIDER_TIMEOUT_MS') ?? 15_000,
      maxRetries: 2,
      headers: {},
      health: 'degraded',
      latencyMs: undefined,
      failureCount: 0,
      circuitOpenUntil: undefined,
      requestCount: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      estimatedCostUsd: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }
}
