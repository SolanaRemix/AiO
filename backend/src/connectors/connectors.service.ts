import { Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { GitRepositoryConnector } from './providers/git-repository.connector';

@Injectable()
export class ConnectorsService {
  private readonly connectors = [
    new GitRepositoryConnector(join(process.cwd(), '..')),
  ];

  list() {
    return this.connectors.map((connector) => ({
      id: connector.id,
      name: connector.name,
    }));
  }
}
