export type UserPreferences = {
  theme: 'dark' | 'light' | 'system';
  timezone: string;
  locale: string;
};

export type UserAiSettings = {
  defaultModel: string;
  memoryEnabled: boolean;
  autonomyLevel: 'guided' | 'balanced' | 'autonomous';
};

export type UserNotificationSettings = {
  emailAlerts: boolean;
  pushAlerts: boolean;
  securityAlerts: boolean;
};

export type UserSecuritySettings = {
  mfaEnabled: boolean;
  suspiciousActivityLock: boolean;
};

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  passwordHash: string;
  roles: string[];
  workspaceId: string;
  emailVerified: boolean;
  preferences: UserPreferences;
  aiSettings: UserAiSettings;
  notificationSettings: UserNotificationSettings;
  securitySettings: UserSecuritySettings;
  createdAt: string;
  updatedAt: string;
}

export interface StoredSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  device: string;
  ip: string;
  csrfToken: string;
  rememberDevice: boolean;
  createdAt: string;
  updatedAt: string;
  revokedAt?: string;
}

export interface StoredOAuthAccount {
  id: string;
  userId: string;
  provider: 'google' | 'github' | 'microsoft' | 'enterprise-sso';
  providerAccountId: string;
  accessToken: string;
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectLifecycleState =
  | 'Planning'
  | 'Architecture'
  | 'Development'
  | 'Testing'
  | 'Security Review'
  | 'Deployment Ready'
  | 'Production'
  | 'Monitoring';

export interface StoredProject {
  id: string;
  ownerId?: string;
  workspaceId?: string;
  name: string;
  description: string;
  repositoryUrl?: string;
  status: 'active' | 'archived';
  lifecycleState: ProjectLifecycleState;
  completionPercentage: number;
  pipelineStage: string;
  deploymentStatus:
    'not_configured' | 'queued' | 'in_progress' | 'succeeded' | 'failed';
  gitStatus: 'clean' | 'changes_pending' | 'conflict' | 'disconnected';
  activeAgents: number;
  alerts: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredProjectAlert {
  id: string;
  projectId: string;
  type:
    | 'build_failure'
    | 'security_issue'
    | 'failed_agent'
    | 'deployment_problem'
    | 'merge_conflict'
    | 'missing_configuration'
    | 'performance_issue';
  severity: 'low' | 'medium' | 'high';
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface StoredProjectActivity {
  id: string;
  projectId: string;
  actor: string;
  action: string;
  category: 'agent' | 'commit' | 'deployment' | 'workflow' | 'user' | 'system';
  detail: string;
  createdAt: string;
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
  status:
    | 'queued'
    | 'building'
    | 'deploying'
    | 'succeeded'
    | 'failed'
    | 'rolled_back';
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

export interface StoredGitConnection {
  id: string;
  userId: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  encryptedCredential: string;
  scope: string[];
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredRepository {
  id: string;
  projectId: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  name: string;
  defaultBranch: string;
  branches: string[];
  connected: boolean;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredGitCommit {
  id: string;
  repositoryId: string;
  projectId: string;
  branch: string;
  message: string;
  agent: string;
  validation: 'passed' | 'pending' | 'failed';
  kind: 'manual' | 'milestone';
  createdAt: string;
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
  sessions: StoredSession[];
  oauthAccounts: StoredOAuthAccount[];
  projects: StoredProject[];
  projectAlerts: StoredProjectAlert[];
  projectActivities: StoredProjectActivity[];
  memoryRecords: StoredMemoryRecord[];
  knowledgeDocuments: StoredKnowledgeDocument[];
  providers: StoredProviderRecord[];
  workflows: StoredWorkflowDefinition[];
  workflowExecutions: StoredWorkflowExecution[];
  files: StoredFileRecord[];
  agentExecutions: StoredAgentExecution[];
  deployments: StoredDeployment[];
  gitConnections: StoredGitConnection[];
  repositories: StoredRepository[];
  gitCommits: StoredGitCommit[];
  auditLogs: StoredAuditLog[];
  requestMetrics: StoredRequestMetric[];
}

export const DEFAULT_DATABASE_STATE: DatabaseState = {
  users: [],
  sessions: [],
  oauthAccounts: [],
  projects: [],
  projectAlerts: [],
  projectActivities: [],
  memoryRecords: [],
  knowledgeDocuments: [],
  providers: [],
  workflows: [],
  workflowExecutions: [],
  files: [],
  agentExecutions: [],
  deployments: [],
  gitConnections: [],
  repositories: [],
  gitCommits: [],
  auditLogs: [],
  requestMetrics: [],
};
