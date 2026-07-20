import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectEntity } from './entities/project.entity';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project workspace' })
  create(@Body() dto: CreateProjectDto): Promise<ProjectEntity> {
    return this.projectsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List projects' })
  findAll(): Promise<ProjectEntity[]> {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id' })
  findOne(@Param('id') id: string): Promise<ProjectEntity> {
    return this.projectsService.findOne(id);
  }
}
