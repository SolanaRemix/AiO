import { Injectable } from '@nestjs/common';
import { type GitProvider, type GitProviderAdapter } from './git-provider-adapter.interface';

class DefaultProviderAdapter implements GitProviderAdapter {
  constructor(readonly provider: GitProvider) {}

  sync(operation: 'push' | 'pull', repository: string, branch: string): string {
    const verb = operation === 'push' ? 'Pushed' : 'Pulled';
    return `${verb} ${branch} on ${repository} via ${this.provider}.`;
  }
}

@Injectable()
export class GitProviderAdapters {
  private readonly adapters: GitProviderAdapter[] = [
    new DefaultProviderAdapter('github'),
    new DefaultProviderAdapter('gitlab'),
    new DefaultProviderAdapter('bitbucket'),
  ];

  get(provider: GitProvider): GitProviderAdapter {
    const adapter = this.adapters.find((entry) => entry.provider === provider);
    if (adapter == null) {
      throw new Error(`Provider adapter ${provider} is not configured.`);
    }
    return adapter;
  }

  list(): GitProvider[] {
    return this.adapters.map((entry) => entry.provider);
  }
}
