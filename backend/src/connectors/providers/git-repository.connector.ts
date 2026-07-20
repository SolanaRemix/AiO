import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  type Connector,
  type ConnectorResult,
} from '../interfaces/connector.interface';

const execFileAsync = promisify(execFile);

export class GitRepositoryConnector implements Connector {
  id = 'git-repository';
  name = 'Git Repository Connector';

  constructor(private readonly repositoryPath: string) {}

  async connect(): Promise<ConnectorResult> {
    return this.health();
  }

  authenticate(): Promise<ConnectorResult> {
    return Promise.resolve({
      success: true,
      detail: 'Authentication is delegated to the local git environment.',
    });
  }

  async sync(): Promise<ConnectorResult> {
    const { stdout } = await execFileAsync('git', ['status', '--short'], {
      cwd: this.repositoryPath,
    });
    return {
      success: true,
      detail: 'Repository status collected.',
      metadata: { changes: stdout.trim() },
    };
  }

  async search(query: string): Promise<ConnectorResult> {
    const { stdout } = await execFileAsync('git', ['grep', '-n', query], {
      cwd: this.repositoryPath,
    }).catch(() => ({ stdout: '' }));
    return {
      success: true,
      detail: 'Repository search complete.',
      metadata: { matches: stdout.trim().split('\n').filter(Boolean) },
    };
  }

  async health(): Promise<ConnectorResult> {
    const { stdout } = await execFileAsync(
      'git',
      ['rev-parse', '--is-inside-work-tree'],
      {
        cwd: this.repositoryPath,
      },
    );
    return {
      success: stdout.trim() === 'true',
      detail: 'Git repository is reachable.',
    };
  }
}
