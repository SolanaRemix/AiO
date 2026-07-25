export type GitProvider = 'github' | 'gitlab' | 'bitbucket';

export interface GitProviderAdapter {
  readonly provider: GitProvider;
  sync(operation: 'push' | 'pull', repository: string, branch: string): string;
}
