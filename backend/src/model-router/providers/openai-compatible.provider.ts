import {
  type AIProvider,
  type AIProviderHealth,
  type EmbeddingResponse,
  type ModelRouteRequest,
  type ModelRouteResponse,
  type ProviderRegistryEntry,
} from '../interfaces/provider.interface';

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  model?: string;
}

interface EmbeddingApiResponse {
  data?: Array<{ embedding?: number[] }>;
  model?: string;
}

export class OpenAICompatibleProvider implements AIProvider {
  async chat(
    provider: ProviderRegistryEntry,
    request: ModelRouteRequest,
    signal: AbortSignal,
  ): Promise<ModelRouteResponse> {
    const startedAt = Date.now();
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.buildHeaders(provider),
      body: JSON.stringify({
        model: request.model ?? provider.models[0],
        messages: request.messages,
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        stream: false,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(
        `Provider ${provider.id} chat request failed with ${response.status}.`,
      );
    }

    const payload = (await response.json()) as ChatCompletionResponse;
    const content = payload.choices?.[0]?.message?.content?.trim();
    if (content == null || content.length === 0) {
      throw new Error(`Provider ${provider.id} returned an empty response.`);
    }

    const input =
      payload.usage?.prompt_tokens ?? this.estimateTokens(request.messages);
    const output =
      payload.usage?.completion_tokens ??
      Math.max(1, Math.ceil(content.length / 4));
    const total = payload.usage?.total_tokens ?? input + output;
    const estimatedCostUsd = Number((total / 1000) * 0.003).toFixed(6);

    return {
      content,
      usage: {
        input,
        output,
        total,
        estimatedCostUsd: Number(estimatedCostUsd),
      },
      provider: provider.id,
      model: payload.model ?? request.model ?? provider.models[0],
      latencyMs: Date.now() - startedAt,
    };
  }

  async stream(
    provider: ProviderRegistryEntry,
    request: ModelRouteRequest,
    signal: AbortSignal,
  ): Promise<ReadableStream<Uint8Array> | null> {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.buildHeaders(provider),
      body: JSON.stringify({
        model: request.model ?? provider.models[0],
        messages: request.messages,
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(
        `Provider ${provider.id} stream request failed with ${response.status}.`,
      );
    }

    return response.body;
  }

  async embed(
    provider: ProviderRegistryEntry,
    input: string,
    model: string,
    signal: AbortSignal,
  ): Promise<EmbeddingResponse> {
    const response = await fetch(`${provider.baseUrl}/embeddings`, {
      method: 'POST',
      headers: this.buildHeaders(provider),
      body: JSON.stringify({ input, model }),
      signal,
    });

    if (!response.ok) {
      throw new Error(
        `Provider ${provider.id} embedding request failed with ${response.status}.`,
      );
    }

    const payload = (await response.json()) as EmbeddingApiResponse;
    const embedding = payload.data?.[0]?.embedding;
    if (embedding == null) {
      throw new Error(`Provider ${provider.id} returned no embedding vector.`);
    }

    return {
      provider: provider.id,
      model: payload.model ?? model,
      embedding,
    };
  }

  async generate(
    provider: ProviderRegistryEntry,
    prompt: string,
    signal: AbortSignal,
  ): Promise<ModelRouteResponse> {
    return this.chat(
      provider,
      {
        messages: [{ role: 'user', content: prompt }],
      },
      signal,
    );
  }

  async healthCheck(
    provider: ProviderRegistryEntry,
    signal: AbortSignal,
  ): Promise<AIProviderHealth> {
    const startedAt = Date.now();
    const response = await fetch(`${provider.baseUrl}/models`, {
      headers: this.buildHeaders(provider),
      signal,
    });

    return {
      status: response.ok ? 'healthy' : 'degraded',
      checkedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
      detail: response.ok
        ? 'Provider responded successfully.'
        : `Provider responded with status ${response.status}.`,
    };
  }

  private buildHeaders(
    provider: ProviderRegistryEntry,
  ): Record<string, string> {
    return {
      'content-type': 'application/json',
      ...(provider.apiKey
        ? { authorization: 'Bearer ' + provider.apiKey }
        : {}),
      ...provider.headers,
    };
  }

  private estimateTokens(messages: ModelRouteRequest['messages']): number {
    return messages
      .map((message) => message.content.length)
      .reduce((sum, value) => sum + Math.ceil(value / 4), 0);
  }
}
