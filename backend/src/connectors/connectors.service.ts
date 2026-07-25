import { Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { CloudStorageConnector } from './providers/cloud-storage.connector';
import { DatabaseConnector } from './providers/database.connector';
import { DocsPlatformConnector } from './providers/docs-platform.connector';
import { GitRepositoryConnector } from './providers/git-repository.connector';
import { MessagingConnector } from './providers/messaging.connector';

@Injectable()
export class ConnectorsService {
  private readonly connectors = [
    new GitRepositoryConnector(join(process.cwd(), '..')),
    new DocsPlatformConnector(),
    new DatabaseConnector(),
    new MessagingConnector(),
    new CloudStorageConnector(),
  ];

  list() {
    return this.connectors.map((connector) => ({
      id: connector.id,
      name: connector.name,
    }));
  }

  async health() {
    const results = await Promise.all(
      this.connectors.map(async (connector) => {
        const result = await connector.health().catch(() => ({
          success: false,
          detail: 'Health check failed.',
        }));
        return { id: connector.id, name: connector.name, ...result };
      }),
    );
    return results;
  }

  async sync(id: string) {
    const connector = this.connectors.find((c) => c.id === id);
    if (connector == null) {
      return { success: false, detail: `Connector ${id} not found.` };
    }
    return connector.sync();
  }

  async search(id: string, query: string) {
    const connector = this.connectors.find((c) => c.id === id);
    if (connector == null) {
      return { success: false, detail: `Connector ${id} not found.` };
    }
    return connector.search(query);
  }
}
