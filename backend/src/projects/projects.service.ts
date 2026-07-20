import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectEntity } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  private readonly projects = new Map<string, ProjectEntity>();

  create(dto: CreateProjectDto): ProjectEntity {
    const timestamp = new Date().toISOString();
    const project: ProjectEntity = {
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
      repositoryUrl: dto.repositoryUrl,
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.projects.set(project.id, project);
    return project;
  }

  findAll(): ProjectEntity[] {
    return [...this.projects.values()];
  }

  findOne(id: string): ProjectEntity {
    const project = this.projects.get(id);
    if (project == null) {
      throw new NotFoundException(
        `Project with ID ${id} was not found. Verify the project ID or create a new project.`,
      );
    }
    return project;
  }
}
