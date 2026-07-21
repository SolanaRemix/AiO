export type DeploymentEnvironment = 'preview' | 'production';
export type DeploymentStatus =
  | 'queued'
  | 'building'
  | 'deploying'
  | 'succeeded'
  | 'failed'
  | 'rolled_back';

export interface DeploymentSummary {
  id: string;
  projectId?: string;
  name: string;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeploymentDetail extends DeploymentSummary {
  buildId?: string;
  rollbackTargetId?: string;
  envVars: Record<string, string>;
  secrets: string[];
  logs: string[];
}
