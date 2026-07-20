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
  id?: string;
  requestedPrompt: string;
  selectedAgents: string[];
  queuedAt: string;
  summary?: string;
  steps?: string[];
  validations?: string[];
}

export interface AgentExecutionDetail extends AgentExecutionSummary {
  status: 'planned' | 'running' | 'completed';
  report: string;
}
