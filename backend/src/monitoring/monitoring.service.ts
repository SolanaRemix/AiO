import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import {
  type StoredAuditLog,
  type StoredProviderRecord,
  type StoredRequestMetric,
} from '../database/database.types';

@Injectable()
export class MonitoringService {
  constructor(private readonly databaseService: DatabaseService) {}

  async recordApiRequest(metric: {
    method: string;
    path: string;
    statusCode: number;
    latencyMs: number;
    actor?: string;
  }): Promise<StoredRequestMetric> {
    const record: StoredRequestMetric = {
      id: randomUUID(),
      ...metric,
      createdAt: new Date().toISOString(),
    };

    await this.databaseService.mutate((draft) => {
      draft.requestMetrics.unshift(record);
      draft.requestMetrics = draft.requestMetrics.slice(0, 500);
    });

    return record;
  }

  async recordAuditEvent(event: {
    action: string;
    actor: string;
    resource: string;
    status: 'success' | 'failure';
    detail?: string;
  }): Promise<StoredAuditLog> {
    const record: StoredAuditLog = {
      id: randomUUID(),
      ...event,
      createdAt: new Date().toISOString(),
    };

    await this.databaseService.mutate((draft) => {
      draft.auditLogs.unshift(record);
      draft.auditLogs = draft.auditLogs.slice(0, 500);
    });

    return record;
  }

  async recordProviderOutcome(
    providerId: string,
    outcome: {
      latencyMs?: number;
      success: boolean;
      inputTokens?: number;
      outputTokens?: number;
      estimatedCostUsd?: number;
      detail?: string;
      timeoutMs?: number;
      threshold?: number;
      cooldownMs?: number;
    },
  ): Promise<StoredProviderRecord | null> {
    return this.databaseService.mutate((draft) => {
      const provider = draft.providers.find((entry) => entry.id === providerId);
      if (provider == null) {
        return null;
      }

      provider.lastCheckedAt = new Date().toISOString();
      provider.updatedAt = provider.lastCheckedAt;
      if (outcome.latencyMs != null) {
        provider.latencyMs = outcome.latencyMs;
      }

      if (outcome.success) {
        provider.health = 'healthy';
        provider.failureCount = 0;
        provider.circuitOpenUntil = undefined;
        provider.requestCount += 1;
        provider.totalInputTokens += outcome.inputTokens ?? 0;
        provider.totalOutputTokens += outcome.outputTokens ?? 0;
        provider.estimatedCostUsd += outcome.estimatedCostUsd ?? 0;
        provider.lastUsedAt = provider.updatedAt;
      } else {
        provider.failureCount += 1;
        provider.health =
          provider.failureCount > 1 ? 'degraded' : 'unavailable';
        if (
          outcome.threshold != null &&
          outcome.cooldownMs != null &&
          provider.failureCount >= outcome.threshold
        ) {
          provider.circuitOpenUntil = new Date(
            Date.now() + outcome.cooldownMs,
          ).toISOString();
        }
      }

      return { ...provider };
    });
  }

  async summary(): Promise<{
    requests: number;
    errors: number;
    auditEvents: number;
    providers: number;
  }> {
    const snapshot = await this.databaseService.snapshot();
    return {
      requests: snapshot.requestMetrics.length,
      errors: snapshot.requestMetrics.filter((item) => item.statusCode >= 400)
        .length,
      auditEvents: snapshot.auditLogs.length,
      providers: snapshot.providers.length,
    };
  }
}
