export interface ModelRouterMessage {
  role: string;
  content: string;
}

export interface ModelRouteRequest {
  model?: string;
  messages: ModelRouterMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface ModelRouteResponse {
  content: string;
  usage: {
    input: number;
    output: number;
    total: number;
    estimatedCostUsd: number;
  };
  provider: string;
  model: string;
  latencyMs: number;
}

export interface EmbeddingResponse {
  provider: string;
  model: string;
  embedding: number[];
}

export type AIProviderType = 'cloud' | 'local' | 'self-hosted';
export type ProviderHealthStatus = 'healthy' | 'degraded' | 'unavailable';

export interface ProviderRegistryEntry {
  id: string;
  name: string;
  type: AIProviderType;
  enabled: boolean;
  priority: number;
  baseUrl: string;
  apiKey?: string;
  models: string[];
  timeoutMs: number;
  maxRetries: number;
  headers: Record<string, string>;
  health: ProviderHealthStatus;
  latencyMs?: number;
  failureCount: number;
  circuitOpenUntil?: string;
  requestCount: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedCostUsd: number;
  lastCheckedAt?: string;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProviderRegistryEntry extends Omit<
  ProviderRegistryEntry,
  'apiKey'
> {
  apiKeyConfigured: boolean;
}

export interface AIProviderHealth {
  status: ProviderHealthStatus;
  checkedAt: string;
  latencyMs?: number;
  detail?: string;
}

export interface AIProvider {
  chat(
    provider: ProviderRegistryEntry,
    request: ModelRouteRequest,
    signal: AbortSignal,
  ): Promise<ModelRouteResponse>;
  stream(
    provider: ProviderRegistryEntry,
    request: ModelRouteRequest,
    signal: AbortSignal,
  ): Promise<ReadableStream<Uint8Array> | null>;
  embed(
    provider: ProviderRegistryEntry,
    input: string,
    model: string,
    signal: AbortSignal,
  ): Promise<EmbeddingResponse>;
  generate(
    provider: ProviderRegistryEntry,
    prompt: string,
    signal: AbortSignal,
  ): Promise<ModelRouteResponse>;
  healthCheck(
    provider: ProviderRegistryEntry,
    signal: AbortSignal,
  ): Promise<AIProviderHealth>;
}
