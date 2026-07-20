import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import { type StoredProject } from '../database/database.types';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectEntity } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateProjectDto): Promise<ProjectEntity> {
    const timestamp = new Date().toISOString();
    const project: StoredProject = {
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
      repositoryUrl: dto.repositoryUrl,
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.databaseService.mutate((draft) => {
      draft.projects.unshift(project);
    });
    return project;
  }

  async findAll(): Promise<ProjectEntity[]> {
    return this.databaseService.list('projects');
  }

  async findOne(id: string): Promise<ProjectEntity> {
    const projects = await this.databaseService.list('projects');
    const project = projects.find((candidate) => candidate.id === id);
    if (project == null) {
      throw new NotFoundException(
        `Project with ID ${id} was not found. Verify the project ID or create a new project.`,
      );
    }
    return project;
  }
}
