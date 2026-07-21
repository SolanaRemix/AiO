export interface StoredUser {
  id: string;
  email: string;
  passwordEntry: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StoredProject {
  id: string;
  name: string;
  description: string;
  repositoryUrl?: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface StoredMemoryRecord {
  id: string;
  scope: 'user' | 'workspace' | 'project';
  key: string;
  value: string;
  projectId?: string;
  createdAt: string;
}

export interface StoredKnowledgeDocument {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProviderType = 'cloud' | 'local' | 'self-hosted';
export type ProviderHealthStatus = 'healthy' | 'degraded' | 'unavailable';

export interface StoredProviderRecord {
  id: string;
  name: string;
  type: ProviderType;
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

export interface StoredWorkflowStep {
  id: string;
  name: string;
  type: 'task' | 'parallel' | 'condition' | 'approval' | 'event';
  action?: string;
  prompt?: string;
  condition?: string;
  timeoutMs?: number;
  retryLimit?: number;
  branches?: Array<{
    id: string;
    name: string;
    action?: string;
    prompt?: string;
  }>;
}

export interface StoredWorkflowDefinition {
  id: string;
  name: string;
  steps: StoredWorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface StoredWorkflowExecution {
  id: string;
  workflowId?: string;
  name: string;
  status: 'queued' | 'running' | 'waiting_approval' | 'completed' | 'failed';
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  steps: Array<{
    stepId: string;
    name: string;
    status: 'completed' | 'skipped' | 'waiting_approval' | 'failed';
    attempts: number;
    startedAt: string;
    finishedAt?: string;
    output?: Record<string, unknown>;
    error?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface StoredFileRecord {
  id: string;
  projectId?: string;
  name: string;
  path?: string;
  mediaType: string;
  content?: string;
  size: number;
  createdAt: string;
}

export interface StoredDeployment {
  id: string;
  projectId?: string;
  name: string;
  environment: 'preview' | 'production';
  status: 'queued' | 'building' | 'deploying' | 'succeeded' | 'failed' | 'rolled_back';
  buildId?: string;
  url?: string;
  rollbackTargetId?: string;
  envVars: Record<string, string>;
  secrets: string[];
  logs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StoredAgentExecution {
  id: string;
  prompt: string;
  selectedAgents: string[];
  status: 'planned' | 'running' | 'completed';
  summary: string;
  steps: string[];
  validations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StoredAuditLog {
  id: string;
  action: string;
  actor: string;
  resource: string;
  status: 'success' | 'failure';
  detail?: string;
  createdAt: string;
}

export interface StoredRequestMetric {
  id: string;
  method: string;
  path: string;
  statusCode: number;
  latencyMs: number;
  actor?: string;
  createdAt: string;
}

export interface DatabaseState {
  users: StoredUser[];
  projects: StoredProject[];
  memoryRecords: StoredMemoryRecord[];
  knowledgeDocuments: StoredKnowledgeDocument[];
  providers: StoredProviderRecord[];
  workflows: StoredWorkflowDefinition[];
  workflowExecutions: StoredWorkflowExecution[];
  files: StoredFileRecord[];
  agentExecutions: StoredAgentExecution[];
  deployments: StoredDeployment[];
  auditLogs: StoredAuditLog[];
  requestMetrics: StoredRequestMetric[];
}

export const DEFAULT_DATABASE_STATE: DatabaseState = {
  users: [],
  projects: [],
  memoryRecords: [],
  knowledgeDocuments: [],
  providers: [],
  workflows: [],
  workflowExecutions: [],
  files: [],
  agentExecutions: [],
  deployments: [],
  auditLogs: [],
  requestMetrics: [],
};
