import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { type JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { DatabaseService } from '../database/database.service';
import {
  type ProjectLifecycleState,
  type StoredGitCommit,
  type StoredProject,
  type StoredProjectActivity,
  type StoredProjectAlert,
} from '../database/database.types';
import { MonitoringService } from '../monitoring/monitoring.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity } from './entities/project.entity';

const MILESTONE_MESSAGES: Partial<Record<ProjectLifecycleState, string>> = {
  Architecture: 'Completed architecture module',
  Development: 'Completed feature module',
  Testing: 'Tests passed',
  'Deployment Ready': 'Deployment prepared',
  Production: 'Release created',
};

@Injectable()
export class ProjectsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly monitoringService: MonitoringService,
  ) {}

  async create(
    dto: CreateProjectDto,
    viewer?: JwtPayload,
  ): Promise<ProjectEntity> {
    const timestamp = new Date().toISOString();
    const project: StoredProject = {
      id: randomUUID(),
      ownerId: viewer?.sub,
      workspaceId: viewer?.workspaceId,
      name: dto.name,
      description: dto.description,
      repositoryUrl: dto.repositoryUrl,
      status: 'active',
      lifecycleState: 'Planning',
      completionPercentage: 5,
      pipelineStage: 'Prompt received',
      deploymentStatus: 'not_configured',
      gitStatus: 'disconnected',
      activeAgents: 0,
      alerts: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.databaseService.mutate((draft) => {
      draft.projects.unshift(project);
    });

    await this.recordActivity({
      projectId: project.id,
      actor: 'system',
      action: 'project.created',
      category: 'user',
      detail: `Project ${project.name} created and initialized.`,
    });

    return project;
  }

  async findAll(viewer?: JwtPayload): Promise<ProjectEntity[]> {
    const projects = await this.databaseService.list('projects');
    if (viewer == null || this.isAdmin(viewer)) {
      return projects;
    }
    return projects.filter((project) => this.canAccessProject(viewer, project));
  }

  async findOne(id: string, viewer?: JwtPayload): Promise<ProjectEntity> {
    const projects = await this.databaseService.list('projects');
    const project = projects.find((candidate) => candidate.id === id);
    if (project == null) {
      throw new NotFoundException(
        `Project with ID ${id} was not found. Verify the project ID or create a new project.`,
      );
    }
    this.ensureProjectAccess(viewer, project);
    return project;
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    viewer?: JwtPayload,
  ): Promise<ProjectEntity> {
    await this.findOne(id, viewer);

    const updatedState = await this.databaseService.mutate((draft) => {
      const project = draft.projects.find((candidate) => candidate.id === id);
      if (project == null) {
        throw new NotFoundException(`Project with ID ${id} was not found.`);
      }
      const previousLifecycle = project.lifecycleState;
      const previousDeploymentStatus = project.deploymentStatus;

      if (dto.name != null) project.name = dto.name;
      if (dto.description != null) project.description = dto.description;
      if (dto.repositoryUrl != null) project.repositoryUrl = dto.repositoryUrl;
      if (dto.status != null) project.status = dto.status;
      if (dto.lifecycleState != null)
        project.lifecycleState = dto.lifecycleState;
      if (dto.completionPercentage != null) {
        project.completionPercentage = dto.completionPercentage;
      }
      if (dto.pipelineStage != null) project.pipelineStage = dto.pipelineStage;
      if (dto.deploymentStatus != null)
        project.deploymentStatus = dto.deploymentStatus;
      if (dto.gitStatus != null) project.gitStatus = dto.gitStatus;
      if (dto.activeAgents != null) project.activeAgents = dto.activeAgents;
      project.updatedAt = new Date().toISOString();

      const milestone =
        dto.lifecycleState != null && dto.lifecycleState !== previousLifecycle
          ? MILESTONE_MESSAGES[dto.lifecycleState]
          : undefined;
      if (milestone != null) {
        const repository = draft.repositories.find(
          (repo) => repo.projectId === project.id,
        );
        if (repository != null) {
          const commit: StoredGitCommit = {
            id: randomUUID(),
            repositoryId: repository.id,
            projectId: project.id,
            branch: repository.defaultBranch,
            message: `feat: ${milestone}`,
            agent: 'Backend Agent',
            validation: 'passed',
            kind: 'milestone',
            createdAt: new Date().toISOString(),
          };
          draft.gitCommits.unshift(commit);
          project.gitStatus = 'changes_pending';
        }
      }

      return {
        project,
        previousLifecycle,
        previousDeploymentStatus,
      };
    });
    const {
      project: updated,
      previousLifecycle,
      previousDeploymentStatus,
    } = updatedState;

    const lifecycleDetail =
      dto.lifecycleState != null && dto.lifecycleState !== previousLifecycle
        ? `Project lifecycle moved from ${previousLifecycle} to ${updated.lifecycleState}.`
        : 'Project metadata updated.';

    await this.recordActivity({
      projectId: id,
      actor: 'system',
      action: 'project.updated',
      category: 'workflow',
      detail: lifecycleDetail,
    });

    if (updated.gitStatus === 'conflict') {
      await this.createAlert(id, {
        type: 'merge_conflict',
        severity: 'high',
        message: 'Merge conflict detected in connected repository.',
      });
    }

    if (
      previousDeploymentStatus !== 'failed' &&
      updated.deploymentStatus === 'failed'
    ) {
      await this.createAlert(id, {
        type: 'deployment_problem',
        severity: 'high',
        message: 'Deployment pipeline reported a failed stage.',
      });
    }

    await this.monitoringService.recordAuditEvent({
      action: 'project.update',
      actor: 'system',
      resource: id,
      status: 'success',
      detail: `Updated project ${updated.name}.`,
    });

    return updated;
  }

  async createAlert(
    projectId: string,
    alert: Pick<StoredProjectAlert, 'type' | 'severity' | 'message'>,
  ): Promise<StoredProjectAlert> {
    const record: StoredProjectAlert = {
      id: randomUUID(),
      projectId,
      ...alert,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    await this.databaseService.mutate((draft) => {
      draft.projectAlerts.unshift(record);
      const project = draft.projects.find((entry) => entry.id === projectId);
      if (project != null) {
        project.alerts = draft.projectAlerts.filter(
          (entry) => entry.projectId === projectId && entry.status === 'open',
        ).length;
      }
    });

    return record;
  }

  async recordActivity(input: {
    projectId: string;
    actor: string;
    action: string;
    category: StoredProjectActivity['category'];
    detail: string;
  }): Promise<StoredProjectActivity> {
    const activity: StoredProjectActivity = {
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
    };

    await this.databaseService.mutate((draft) => {
      draft.projectActivities.unshift(activity);
      draft.projectActivities = draft.projectActivities.slice(0, 2_500);
    });

    return activity;
  }

  async dashboard(viewer?: JwtPayload): Promise<{
    cards: StoredProject[];
    alerts: StoredProjectAlert[];
    timeline: StoredProjectActivity[];
    quickActions: Array<{ action: string; description: string }>;
  }> {
    const [projects, alerts, activity] = await Promise.all([
      this.databaseService.list('projects'),
      this.databaseService.list('projectAlerts'),
      this.databaseService.list('projectActivities'),
    ]);
    const visibleProjectIds =
      viewer == null || this.isAdmin(viewer)
        ? new Set(projects.map((project) => project.id))
        : new Set(
            projects
              .filter((project) => this.canAccessProject(viewer, project))
              .map((project) => project.id),
          );
    const visibleProjects = projects.filter((project) =>
      visibleProjectIds.has(project.id),
    );

    return {
      cards: visibleProjects,
      alerts: alerts
        .filter(
          (entry) =>
            entry.status === 'open' && visibleProjectIds.has(entry.projectId),
        )
        .slice(0, 20),
      timeline: activity
        .filter((entry) => visibleProjectIds.has(entry.projectId))
        .slice(0, 30),
      quickActions: [
        {
          action: 'New Project',
          description: 'Starts Prompt → Intent → Workflow Creation',
        },
        {
          action: 'Resume Project',
          description: 'Loads memory, agents, workflow, files, and history',
        },
        {
          action: 'Import Project',
          description:
            'Import from Git repository, workspace, or documentation',
        },
      ],
    };
  }

  async listAccessibleProjectIds(viewer: JwtPayload): Promise<Set<string>> {
    if (this.isAdmin(viewer)) {
      return new Set(
        (await this.databaseService.list('projects')).map((p) => p.id),
      );
    }
    const projects = await this.databaseService.list('projects');
    return new Set(
      projects
        .filter((project) => this.canAccessProject(viewer, project))
        .map((project) => project.id),
    );
  }

  private isAdmin(viewer: JwtPayload): boolean {
    return viewer.roles.includes('admin');
  }

  private canAccessProject(
    viewer: JwtPayload,
    project: StoredProject,
  ): boolean {
    if (project.ownerId != null) {
      return project.ownerId === viewer.sub;
    }
    if (project.workspaceId != null && viewer.workspaceId != null) {
      return project.workspaceId === viewer.workspaceId;
    }
    return false;
  }

  private ensureProjectAccess(
    viewer: JwtPayload | undefined,
    project: StoredProject,
  ): void {
    if (viewer == null || this.isAdmin(viewer)) {
      return;
    }
    if (!this.canAccessProject(viewer, project)) {
      throw new ForbiddenException(
        'You are not authorized to access this project.',
      );
    }
  }
}
