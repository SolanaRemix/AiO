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

export interface AgentLearnResult {
  executionId: string;
  learnedAt: string;
  patterns: string[];
  confidence: number;
}

export interface AgentSummarizeResult {
  executionId: string;
  summarizedAt: string;
  summary: string;
  keyPoints: string[];
}

export interface AgentValidateResult {
  prompt: string;
  validatedAt: string;
  passed: boolean;
  issues: string[];
  recommendations: string[];
}
