import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity } from './entities/project.entity';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('projects')
  @ApiOperation({ summary: 'Create a project workspace' })
  create(@Body() dto: CreateProjectDto): Promise<ProjectEntity> {
    return this.projectsService.create(dto);
  }

  @Get('projects')
  @ApiOperation({ summary: 'List projects' })
  findAll(): Promise<ProjectEntity[]> {
    return this.projectsService.findAll();
  }

  @Get('projects/:id')
  @ApiOperation({ summary: 'Get a project by id' })
  findOne(@Param('id') id: string): Promise<ProjectEntity> {
    return this.projectsService.findOne(id);
  }

  @Post('api/projects')
  @ApiOperation({ summary: 'Create enterprise project workspace' })
  createEnterprise(@Body() dto: CreateProjectDto): Promise<ProjectEntity> {
    return this.projectsService.create(dto);
  }

  @Get('api/projects')
  @ApiOperation({ summary: 'List enterprise projects' })
  findAllEnterprise(): Promise<ProjectEntity[]> {
    return this.projectsService.findAll();
  }

  @Get('api/projects/dashboard')
  @ApiOperation({ summary: 'Get project intelligence dashboard' })
  dashboard() {
    return this.projectsService.dashboard();
  }

  @Get('api/projects/:id')
  @ApiOperation({ summary: 'Get an enterprise project by id' })
  findOneEnterprise(@Param('id') id: string): Promise<ProjectEntity> {
    return this.projectsService.findOne(id);
  }

  @Put('api/projects/:id')
  @ApiOperation({ summary: 'Update enterprise project state and lifecycle' })
  updateEnterprise(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    return this.projectsService.update(id, dto);
  }
}
