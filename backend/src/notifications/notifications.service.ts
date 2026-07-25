import { Injectable, NotFoundException } from '@nestjs/common';
import { type JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { DatabaseService } from '../database/database.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly databaseService: DatabaseService,
  ) {}

  async createAlert(user: JwtPayload, dto: CreateAlertDto) {
    await this.projectsService.findOne(dto.projectId, user);
    return this.projectsService.createAlert(dto.projectId, {
      type: dto.type,
      severity: dto.severity,
      message: dto.message,
    });
  }

  async listAlerts(user: JwtPayload, projectId?: string) {
    const alerts = await this.databaseService.list('projectAlerts');
    if (projectId != null) {
      await this.projectsService.findOne(projectId, user);
      return alerts.filter((entry) => entry.projectId === projectId);
    }

    const projectIds =
      await this.projectsService.listAccessibleProjectIds(user);
    return alerts.filter((entry) => projectIds.has(entry.projectId));
  }

  async resolveAlert(user: JwtPayload, id: string) {
    const alert = (await this.databaseService.list('projectAlerts')).find(
      (entry) => entry.id === id,
    );
    if (alert == null) {
      throw new NotFoundException('Alert not found.');
    }
    await this.projectsService.findOne(alert.projectId, user);

    return this.databaseService.mutate((draft) => {
      const mutableAlert = draft.projectAlerts.find((entry) => entry.id === id);
      if (mutableAlert == null) {
        throw new NotFoundException('Alert not found.');
      }
      mutableAlert.status = 'resolved';
      mutableAlert.resolvedAt = new Date().toISOString();

      const project = draft.projects.find(
        (entry) => entry.id === mutableAlert.projectId,
      );
      if (project != null) {
        project.alerts = draft.projectAlerts.filter(
          (entry) =>
            entry.projectId === mutableAlert.projectId &&
            entry.status === 'open',
        ).length;
      }

      return mutableAlert;
    });
  }
}
