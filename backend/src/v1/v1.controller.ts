import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Request } from 'express';
import { AgentsService } from '../agents/agents.service';
import { AccessGuard } from '../auth/guards/access.guard';
import { type JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateFileDto } from '../files/dto/create-file.dto';
import { FilesService } from '../files/files.service';
import { KnowledgeEngineService } from '../knowledge-engine/knowledge-engine.service';
import { CreateMemoryDto } from '../memory/dto/create-memory.dto';
import { MemoryService } from '../memory/memory.service';
import { ModelRouterService } from '../model-router/model-router.service';
import { CreateTaskDto } from '../orchestrator/dto/create-task.dto';
import { OrchestratorService } from '../orchestrator/orchestrator.service';
import { CreateProjectDto } from '../projects/dto/create-project.dto';
import { ProjectsService } from '../projects/projects.service';
import { RunWorkflowDto } from '../workflows/dto/run-workflow.dto';
import { WorkflowsService } from '../workflows/workflows.service';
import { AgentRunDto } from './dto/agent-run.dto';
import { ChatDto } from './dto/chat.dto';
import { SearchDto } from './dto/search.dto';

@ApiTags('v1')
@ApiBearerAuth()
@UseGuards(AccessGuard)
@Controller('v1')
export class V1Controller {
  constructor(
    private readonly modelRouterService: ModelRouterService,
    private readonly agentsService: AgentsService,
    private readonly workflowsService: WorkflowsService,
    private readonly projectsService: ProjectsService,
    private readonly knowledgeEngineService: KnowledgeEngineService,
    private readonly orchestratorService: OrchestratorService,
    private readonly filesService: FilesService,
    private readonly memoryService: MemoryService,
  ) {}

  @Post('chat')
  @ApiOperation({ summary: 'Run a provider-routed chat request' })
  chat(@Body() dto: ChatDto) {
    return this.modelRouterService.route(dto);
  }

  @Post('agents/run')
  @ApiOperation({ summary: 'Execute an agent runtime plan' })
  runAgents(@Body() dto: AgentRunDto) {
    return this.agentsService.execute(dto.prompt);
  }

  @Post('workflows/run')
  @ApiOperation({ summary: 'Run a workflow definition' })
  runWorkflow(
    @Body() dto: RunWorkflowDto,
    @Req() request: Request & { user: JwtPayload },
  ) {
    return this.workflowsService.run(dto, request.user.email);
  }

  @Post('projects')
  @ApiOperation({ summary: 'Create a project workspace' })
  createProject(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get('projects')
  @ApiOperation({ summary: 'List projects' })
  listProjects() {
    return this.projectsService.findAll();
  }

  @Post('search')
  @ApiOperation({ summary: 'Run a knowledge search query' })
  search(@Body() dto: SearchDto) {
    return this.knowledgeEngineService.search(dto.query, dto.projectId);
  }

  @Post('rag/query')
  @ApiOperation({ summary: 'Run a retrieval-augmented query' })
  ragQuery(@Body() dto: SearchDto) {
    return this.knowledgeEngineService.ragQuery(dto.query, dto.projectId);
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Queue an orchestration task' })
  createTask(@Body() dto: CreateTaskDto) {
    return this.orchestratorService.processPrompt(dto.prompt, dto.projectId);
  }

  @Post('files')
  @ApiOperation({ summary: 'Store file metadata for a project' })
  createFile(@Body() dto: CreateFileDto) {
    return this.filesService.create(dto);
  }

  @Get('files')
  @ApiOperation({ summary: 'List stored files' })
  listFiles(@Query('projectId') projectId?: string) {
    return this.filesService.list(projectId);
  }

  @Post('vector/search')
  @ApiOperation({ summary: 'Run a vector-style knowledge query' })
  vectorSearch(@Body() dto: SearchDto) {
    return this.knowledgeEngineService.vectorSearch(dto.query, dto.projectId);
  }

  @Post('memory')
  @ApiOperation({ summary: 'Store a memory record' })
  createMemory(@Body() dto: CreateMemoryDto) {
    return this.memoryService.create(dto);
  }

  @Get('memory')
  @ApiOperation({ summary: 'List memory records' })
  listMemory(
    @Query('scope') scope?: CreateMemoryDto['scope'],
    @Query('projectId') projectId?: string,
  ) {
    return this.memoryService.list(scope, projectId);
  }
}
