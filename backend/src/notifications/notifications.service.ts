import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly databaseService: DatabaseService,
  ) {}

  createAlert(dto: CreateAlertDto) {
    return this.projectsService.createAlert(dto.projectId, {
      type: dto.type,
      severity: dto.severity,
      message: dto.message,
    });
  }

  async listAlerts(projectId?: string) {
    const alerts = await this.databaseService.list('projectAlerts');
    return alerts.filter((entry) =>
      projectId == null ? true : entry.projectId === projectId,
    );
  }

  async resolveAlert(id: string) {
    return this.databaseService.mutate((draft) => {
      const alert = draft.projectAlerts.find((entry) => entry.id === id);
      if (alert == null) {
        throw new NotFoundException('Alert not found.');
      }
      alert.status = 'resolved';
      alert.resolvedAt = new Date().toISOString();

      const project = draft.projects.find(
        (entry) => entry.id === alert.projectId,
      );
      if (project != null) {
        project.alerts = draft.projectAlerts.filter(
          (entry) =>
            entry.projectId === alert.projectId && entry.status === 'open',
        ).length;
      }

      return alert;
    });
  }
}
