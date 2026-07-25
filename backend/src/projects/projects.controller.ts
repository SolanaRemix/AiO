import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type JwtPayload } from '../auth/interfaces/jwt-payload.interface';
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create enterprise project workspace' })
  createEnterprise(
    @Req() request: Request & { user: JwtPayload },
    @Body() dto: CreateProjectDto,
  ): Promise<ProjectEntity> {
    return this.projectsService.create(dto, request.user);
  }

  @Get('api/projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List enterprise projects' })
  findAllEnterprise(
    @Req() request: Request & { user: JwtPayload },
  ): Promise<ProjectEntity[]> {
    return this.projectsService.findAll(request.user);
  }

  @Get('api/projects/dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project intelligence dashboard' })
  dashboard(@Req() request: Request & { user: JwtPayload }) {
    return this.projectsService.dashboard(request.user);
  }

  @Get('api/projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an enterprise project by id' })
  findOneEnterprise(
    @Req() request: Request & { user: JwtPayload },
    @Param('id') id: string,
  ): Promise<ProjectEntity> {
    return this.projectsService.findOne(id, request.user);
  }

  @Put('api/projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update enterprise project state and lifecycle' })
  updateEnterprise(
    @Req() request: Request & { user: JwtPayload },
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    return this.projectsService.update(id, dto, request.user);
  }
}
