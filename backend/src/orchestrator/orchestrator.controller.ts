import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  OrchestratorService,
  type OrchestrationResult,
} from './orchestrator.service';

@ApiTags('orchestrator')
@Controller('orchestrator')
export class OrchestratorController {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  @Post('tasks')
  @ApiOperation({ summary: 'Process a prompt into an executable task plan' })
  createTask(@Body() dto: CreateTaskDto): Promise<OrchestrationResult> {
    return this.orchestratorService.processPrompt(dto.prompt, dto.projectId);
  }
}
