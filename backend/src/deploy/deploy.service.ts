import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import { type StoredDeployment } from '../database/database.types';
import { type CreateDeploymentDto } from './dto/create-deployment.dto';
import {
  type DeploymentDetail,
  type DeploymentSummary,
} from './interfaces/deployment.interface';

@Injectable()
export class DeployService {
  constructor(private readonly databaseService: DatabaseService) {}

  async build(dto: CreateDeploymentDto): Promise<DeploymentDetail> {
    const timestamp = new Date().toISOString();
    const record: StoredDeployment = {
      id: randomUUID(),
      name: dto.name,
      projectId: dto.projectId,
      environment: dto.environment,
      status: 'building',
      buildId: randomUUID(),
      envVars: dto.envVars ?? {},
      secrets: dto.secrets ?? [],
      logs: ['Build queued.', 'Installing dependencies.', 'Build succeeded.'],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.databaseService.mutate((draft) => {
      draft.deployments.unshift(record);
    });

    return this.toDetail(record);
  }

  async deploy(dto: CreateDeploymentDto): Promise<DeploymentDetail> {
    const timestamp = new Date().toISOString();
    const urlSlug = dto.name.toLowerCase().replace(/\s+/g, '-');
    const url =
      dto.environment === 'production'
        ? `https://${urlSlug}.aio.app`
        : `https://${urlSlug}-preview.aio.app`;

    const record: StoredDeployment = {
      id: randomUUID(),
      name: dto.name,
      projectId: dto.projectId,
      environment: dto.environment,
      status: 'succeeded',
      buildId: randomUUID(),
      url,
      envVars: dto.envVars ?? {},
      secrets: dto.secrets ?? [],
      logs: [
        'Build queued.',
        'Installing dependencies.',
        'Build succeeded.',
        `Deployed to ${dto.environment}.`,
        `Live at ${url}`,
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.databaseService.mutate((draft) => {
      draft.deployments.unshift(record);
    });

    return this.toDetail(record);
  }

  async rollback(deploymentId: string): Promise<DeploymentDetail> {
    const deployments = await this.databaseService.list('deployments');
    const target = deployments.find((d) => d.id === deploymentId);
    if (target == null) {
      throw new NotFoundException(
        `Deployment ${deploymentId} was not found.`,
      );
    }

    const timestamp = new Date().toISOString();
    const record: StoredDeployment = {
      id: randomUUID(),
      name: target.name,
      projectId: target.projectId,
      environment: target.environment,
      status: 'rolled_back',
      buildId: target.buildId,
      url: target.url,
      rollbackTargetId: deploymentId,
      envVars: target.envVars,
      secrets: target.secrets,
      logs: [
        `Rolling back to deployment ${deploymentId}.`,
        'Rollback completed.',
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.databaseService.mutate((draft) => {
      draft.deployments.unshift(record);
    });

    return this.toDetail(record);
  }

  async listDeployments(projectId?: string): Promise<DeploymentSummary[]> {
    const deployments = await this.databaseService.list('deployments');
    return deployments
      .filter((d) => projectId == null || d.projectId === projectId)
      .map((d) => this.toSummary(d));
  }

  async getDeployment(id: string): Promise<DeploymentDetail> {
    const deployments = await this.databaseService.list('deployments');
    const found = deployments.find((d) => d.id === id);
    if (found == null) {
      throw new NotFoundException(`Deployment ${id} was not found.`);
    }
    return this.toDetail(found);
  }

  async setEnvVars(
    id: string,
    envVars: Record<string, string>,
  ): Promise<DeploymentDetail> {
    await this.databaseService.mutate((draft) => {
      const deployment = draft.deployments.find((d) => d.id === id);
      if (deployment != null) {
        deployment.envVars = { ...deployment.envVars, ...envVars };
        deployment.updatedAt = new Date().toISOString();
      }
    });
    return this.getDeployment(id);
  }

  async addSecrets(id: string, secretNames: string[]): Promise<DeploymentDetail> {
    await this.databaseService.mutate((draft) => {
      const deployment = draft.deployments.find((d) => d.id === id);
      if (deployment != null) {
        const combined = new Set([...deployment.secrets, ...secretNames]);
        deployment.secrets = [...combined];
        deployment.updatedAt = new Date().toISOString();
      }
    });
    return this.getDeployment(id);
  }

  private toSummary(record: StoredDeployment): DeploymentSummary {
    return {
      id: record.id,
      projectId: record.projectId,
      name: record.name,
      environment: record.environment,
      status: record.status,
      url: record.url,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private toDetail(record: StoredDeployment): DeploymentDetail {
    return {
      ...this.toSummary(record),
      buildId: record.buildId,
      rollbackTargetId: record.rollbackTargetId,
      envVars: record.envVars,
      secrets: record.secrets,
      logs: record.logs,
    };
  }
}
