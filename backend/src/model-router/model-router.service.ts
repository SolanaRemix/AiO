import { Injectable } from '@nestjs/common';
import {
  type ModelProvider,
  type ModelRouteRequest,
  type ModelRouteResponse,
} from './interfaces/provider.interface';

@Injectable()
export class ModelRouterService {
  private readonly providers: ModelProvider[] = [
    {
      name: 'openai',
      models: ['gpt-4.1', 'gpt-4o', 'gpt-4o-mini'],
      supportsStreaming: true,
      route: async (request) => this.buildResponse('openai', request),
    },
    {
      name: 'anthropic',
      models: ['claude-3-7-sonnet', 'claude-3-5-haiku'],
      supportsStreaming: true,
      route: async (request) => this.buildResponse('anthropic', request),
    },
    {
      name: 'google',
      models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
      supportsStreaming: true,
      route: async (request) => this.buildResponse('google', request),
    },
  ];

  async route(request: ModelRouteRequest): Promise<ModelRouteResponse> {
    const provider = this.selectProvider(request.model);
    return provider.route(request);
  }

  listProviders(): Array<
    Pick<ModelProvider, 'name' | 'models' | 'supportsStreaming'>
  > {
    return this.providers.map(({ name, models, supportsStreaming }) => ({
      name,
      models,
      supportsStreaming,
    }));
  }

  private selectProvider(model?: string): ModelProvider {
    if (model != null) {
      const matchedProvider = this.providers.find((provider) =>
        provider.models.includes(model),
      );
      if (matchedProvider != null) {
        return matchedProvider;
      }
    }

    return this.providers[0];
  }

  private buildResponse(
    provider: string,
    request: ModelRouteRequest,
  ): Promise<ModelRouteResponse> {
    const flattenedPrompt = request.messages
      .map((message) => message.content)
      .join('\n');
    const input = flattenedPrompt.length;
    const content = `Mock ${provider} response generated for ${request.messages.length} message(s).`;

    return Promise.resolve({
      content,
      usage: {
        input,
        output: Math.min(content.length, request.maxTokens ?? 256),
      },
      provider,
    });
  }
}
