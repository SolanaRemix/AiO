import {
  Injectable,
  ServiceUnavailableException,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MonitoringService } from '../monitoring/monitoring.service';
import {
  type EmbeddingResponse,
  type ModelRouteRequest,
  type ModelRouteResponse,
  type PublicProviderRegistryEntry,
  type ProviderRegistryEntry,
} from './interfaces/provider.interface';
import { OpenAICompatibleProvider } from './providers/openai-compatible.provider';
import { ProviderRegistryService } from './provider-registry.service';

@Injectable()
export class ModelRouterService implements OnModuleInit {
  private readonly providerImplementation = new OpenAICompatibleProvider();

  constructor(
    private readonly providerRegistryService: ProviderRegistryService,
    private readonly monitoringService: MonitoringService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.providerRegistryService.onModuleInit();
  }

  async route(request: ModelRouteRequest): Promise<ModelRouteResponse> {
    const providers = await this.getCandidateProviders(request.model);
    if (providers.length === 0) {
      throw new ServiceUnavailableException(
        'No enabled AI providers are configured for this request.',
      );
    }

    const errors: string[] = [];
    for (const provider of providers) {
      const attempts = Math.max(1, provider.maxRetries + 1);
      for (let attempt = 1; attempt <= attempts; attempt += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(
          () => controller.abort(),
          provider.timeoutMs,
        );

        try {
          const response = await this.providerImplementation.chat(
            provider,
            request,
            controller.signal,
          );
          clearTimeout(timeout);
          await this.monitoringService.recordProviderOutcome(provider.id, {
            success: true,
            latencyMs: response.latencyMs,
            inputTokens: response.usage.input,
            outputTokens: response.usage.output,
            estimatedCostUsd: response.usage.estimatedCostUsd,
          });
          return response;
        } catch (error) {
          clearTimeout(timeout);
          errors.push(
            `${provider.id} attempt ${attempt}: ${
              error instanceof Error ? error.message : 'Unknown provider error'
            }`,
          );
          await this.monitoringService.recordProviderOutcome(provider.id, {
            success: false,
            threshold:
              this.configService.get<number>(
                'PROVIDER_CIRCUIT_BREAKER_THRESHOLD',
              ) ?? 3,
            cooldownMs:
              this.configService.get<number>(
                'PROVIDER_CIRCUIT_BREAKER_COOLDOWN_MS',
              ) ?? 30_000,
          });
        }
      }
    }

    throw new ServiceUnavailableException({
      message: 'All configured AI providers failed to serve the request.',
      providers: errors,
    });
  }

  async listProviders(): Promise<PublicProviderRegistryEntry[]> {
    const providers = await this.providerRegistryService.listProviders();
    return providers.map(({ apiKey, ...provider }) => ({
      ...provider,
      apiKeyConfigured: Boolean(apiKey),
    }));
  }

  async healthCheck(): Promise<PublicProviderRegistryEntry[]> {
    const providers = await this.providerRegistryService.listProviders();
    await Promise.all(
      providers
        .filter((provider) => provider.enabled)
        .map(async (provider) => {
          const controller = new AbortController();
          const timeout = setTimeout(
            () => controller.abort(),
            provider.timeoutMs,
          );

          try {
            const health = await this.providerImplementation.healthCheck(
              provider,
              controller.signal,
            );
            clearTimeout(timeout);
            await this.providerRegistryService.markHealth(provider.id, {
              health: health.status,
              latencyMs: health.latencyMs,
              lastCheckedAt: health.checkedAt,
            });
          } catch {
            clearTimeout(timeout);
            await this.providerRegistryService.markHealth(provider.id, {
              health: 'unavailable',
              lastCheckedAt: new Date().toISOString(),
              failureCount: provider.failureCount + 1,
            });
          }
        }),
    );

    return this.listProviders();
  }

  async embed(input: string, model?: string): Promise<EmbeddingResponse> {
    const providers = await this.getCandidateProviders(model);
    const provider = providers[0];
    if (provider == null) {
      throw new ServiceUnavailableException(
        'No enabled AI providers are configured for embedding requests.',
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), provider.timeoutMs);
    try {
      return await this.providerImplementation.embed(
        provider,
        input,
        model ?? provider.models[0],
        controller.signal,
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private async getCandidateProviders(
    model?: string,
  ): Promise<ProviderRegistryEntry[]> {
    const now = Date.now();
    const providers = await this.providerRegistryService.listProviders({
      enabledOnly: true,
    });

    return providers.filter((provider) => {
      const matchesModel = model == null || provider.models.includes(model);
      const circuitOpen =
        provider.circuitOpenUntil != null &&
        new Date(provider.circuitOpenUntil).getTime() > now;
      return matchesModel && !circuitOpen;
    });
  }
}
