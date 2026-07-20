export interface ConnectorResult {
  success: boolean;
  detail: string;
  metadata?: Record<string, unknown>;
}

export interface Connector {
  id: string;
  name: string;
  connect(): Promise<ConnectorResult>;
  authenticate(): Promise<ConnectorResult>;
  sync(): Promise<ConnectorResult>;
  search(query: string): Promise<ConnectorResult>;
  health(): Promise<ConnectorResult>;
}
