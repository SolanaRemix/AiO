export interface ModelRouterMessage {
  role: string;
  content: string;
}

export interface ModelRouteRequest {
  model?: string;
  messages: ModelRouterMessage[];
  maxTokens?: number;
}

export interface ModelRouteResponse {
  content: string;
  usage: {
    input: number;
    output: number;
  };
  provider: string;
}

export interface ModelProvider {
  name: string;
  models: string[];
  supportsStreaming: boolean;
  route(request: ModelRouteRequest): Promise<ModelRouteResponse>;
}
