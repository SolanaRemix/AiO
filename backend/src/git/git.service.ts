import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createHash, randomBytes, randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import {
  type StoredGitCommit,
  type StoredGitConnection,
  type StoredProjectActivity,
  type StoredProjectAlert,
  type StoredRepository,
} from '../database/database.types';
import { MonitoringService } from '../monitoring/monitoring.service';
import { GitProviderAdapters } from './adapters/git-provider-adapters';
import { type GitProvider } from './adapters/git-provider-adapter.interface';
import { ConnectGitDto } from './dto/connect-git.dto';
import { CreateCommitDto } from './dto/create-commit.dto';
import { InitRepoDto } from './dto/init-repo.dto';

@Injectable()
export class GitService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly monitoringService: MonitoringService,
    private readonly providerAdapters: GitProviderAdapters,
  ) {}

  async connect(userId: string, dto: ConnectGitDto): Promise<StoredGitConnection> {
    const now = new Date().toISOString();
    const connection: StoredGitConnection = {
      id: randomUUID(),
      userId,
      provider: dto.provider,
      encryptedCredential: this.encrypt(dto.accessToken),
      scope: dto.scope ?? ['repo'],
      expiresAt: new Date(
        Date.now() + (dto.expiresInDays ?? 30) * 24 * 60 * 60 * 1_000,
      ).toISOString(),
      createdAt: now,
      updatedAt: now,
    };

    await this.databaseService.mutate((draft) => {
      draft.gitConnections.unshift(connection);
      draft.gitConnections = draft.gitConnections.slice(0, 500);
    });

    await this.monitoringService.recordAuditEvent({
      action: 'git.connect',
      actor: userId,
      resource: dto.provider,
      status: 'success',
      detail: 'Git provider connected using encrypted credentials.',
    });

    return connection;
  }

  async initRepository(dto: InitRepoDto): Promise<StoredRepository> {
    const project = (await this.databaseService.list('projects')).find(
      (entry) => entry.id === dto.projectId,
    );
    if (project == null) {
      throw new NotFoundException('Project was not found for repository initialization.');
    }

    const now = new Date().toISOString();
    const repository: StoredRepository = {
      id: randomUUID(),
      projectId: dto.projectId,
      provider: dto.provider,
      name: dto.repositoryName,
      defaultBranch: dto.defaultBranch ?? 'main',
      branches:
        dto.branches?.length != null && (dto.branches?.length ?? 0) > 0
          ? dto.branches!
          : [dto.defaultBranch ?? 'main'],
      connected: true,
      lastSyncAt: now,
      createdAt: now,
      updatedAt: now,
    };

    await this.databaseService.mutate((draft) => {
      draft.repositories = draft.repositories.filter(
        (entry) => entry.projectId !== dto.projectId,
      );
      draft.repositories.unshift(repository);

      const mutableProject = draft.projects.find((entry) => entry.id === dto.projectId);
      if (mutableProject != null) {
        mutableProject.repositoryUrl = `${dto.provider}://${dto.repositoryName}`;
        mutableProject.gitStatus = 'clean';
        mutableProject.updatedAt = now;
      }

      const activity: StoredProjectActivity = {
        id: randomUUID(),
        projectId: dto.projectId,
        actor: 'system',
        action: 'git.init',
        category: 'commit',
        detail: `Repository ${dto.repositoryName} initialized on ${dto.provider}.`,
        createdAt: now,
      };
      draft.projectActivities.unshift(activity);
    });

    return repository;
  }

  async commit(dto: CreateCommitDto): Promise<StoredGitCommit> {
    const repository = await this.getRepositoryForProject(dto.projectId);
    const now = new Date().toISOString();
    const commit: StoredGitCommit = {
      id: randomUUID(),
      repositoryId: repository.id,
      projectId: dto.projectId,
      branch: dto.branch ?? repository.defaultBranch,
      message: dto.message,
      agent: dto.agent ?? 'Backend Agent',
      validation: dto.validation ?? 'pending',
      kind: 'manual',
      createdAt: now,
    };

    await this.databaseService.mutate((draft) => {
      draft.gitCommits.unshift(commit);

      const project = draft.projects.find((entry) => entry.id === dto.projectId);
      if (project != null) {
        project.gitStatus = 'changes_pending';
        project.updatedAt = now;
      }

      const activity: StoredProjectActivity = {
        id: randomUUID(),
        projectId: dto.projectId,
        actor: commit.agent,
        action: 'git.commit',
        category: 'commit',
        detail: `${commit.message} (${commit.branch})`,
        createdAt: now,
      };
      draft.projectActivities.unshift(activity);
    });

    return commit;
  }

  async push(projectId: string, branch = 'main'): Promise<{ status: string; detail: string }> {
    const repository = await this.getRepositoryForProject(projectId);
    const detail = this.providerAdapters
      .get(repository.provider)
      .sync('push', repository.name, branch);

    await this.databaseService.mutate((draft) => {
      const repo = draft.repositories.find((entry) => entry.id === repository.id);
      if (repo != null) {
        repo.lastSyncAt = new Date().toISOString();
        repo.updatedAt = repo.lastSyncAt;
      }

      const project = draft.projects.find((entry) => entry.id === projectId);
      if (project != null) {
        project.gitStatus = 'clean';
      }

      const activity: StoredProjectActivity = {
        id: randomUUID(),
        projectId,
        actor: 'Git Service',
        action: 'git.push',
        category: 'commit',
        detail,
        createdAt: new Date().toISOString(),
      };
      draft.projectActivities.unshift(activity);
    });

    return { status: 'ok', detail };
  }

  async pull(projectId: string, branch = 'main'): Promise<{ status: string; detail: string }> {
    const repository = await this.getRepositoryForProject(projectId);
    const detail = this.providerAdapters
      .get(repository.provider)
      .sync('pull', repository.name, branch);

    const alertChance = Math.random() < 0.15;
    await this.databaseService.mutate((draft) => {
      const repo = draft.repositories.find((entry) => entry.id === repository.id);
      if (repo != null) {
        repo.lastSyncAt = new Date().toISOString();
        repo.updatedAt = repo.lastSyncAt;
      }

      const activity: StoredProjectActivity = {
        id: randomUUID(),
        projectId,
        actor: 'Git Service',
        action: 'git.pull',
        category: 'commit',
        detail,
        createdAt: new Date().toISOString(),
      };
      draft.projectActivities.unshift(activity);

      if (alertChance) {
        const alert: StoredProjectAlert = {
          id: randomUUID(),
          projectId,
          type: 'merge_conflict',
          severity: 'medium',
          message: 'Potential merge conflict detected after pull.',
          status: 'open',
          createdAt: new Date().toISOString(),
        };
        draft.projectAlerts.unshift(alert);
      }

      const project = draft.projects.find((entry) => entry.id === projectId);
      if (project != null) {
        project.alerts = draft.projectAlerts.filter(
          (entry) => entry.projectId === projectId && entry.status === 'open',
        ).length;
      }
    });

    return { status: 'ok', detail };
  }

  async history(projectId?: string): Promise<StoredGitCommit[]> {
    const commits = await this.databaseService.list('gitCommits');
    if (projectId == null) {
      return commits.slice(0, 200);
    }
    return commits.filter((entry) => entry.projectId === projectId).slice(0, 200);
  }

  listProviders(): GitProvider[] {
    return this.providerAdapters.list();
  }

  private async getRepositoryForProject(projectId: string): Promise<StoredRepository> {
    const repository = (await this.databaseService.list('repositories')).find(
      (entry) => entry.projectId === projectId,
    );
    if (repository == null) {
      throw new NotFoundException('Repository is not initialized for this project.');
    }
    return repository;
  }

  private encrypt(secretValue: string): string {
    const secret = this.configService.get<string>('GIT_CREDENTIAL_SECRET') ?? 'aio-git-secret';
    const key = createHash('sha256').update(secret).digest();
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(secretValue, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`;
  }
}
