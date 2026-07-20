export type AgentType =
  | 'orchestration'
  | 'planning'
  | 'engineering'
  | 'analysis'
  | 'operations'
  | 'security'
  | 'data'
  | 'governance';

export interface AgentDefinition {
  id: string;
  name: string;
  type: AgentType;
  capabilities: string[];
  maxConcurrency: number;
}

export interface AgentExecutionSummary {
  requestedPrompt: string;
  selectedAgents: string[];
  queuedAt: string;
}
