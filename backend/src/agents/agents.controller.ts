import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { ScheduleAgentsDto } from './dto/schedule-agents.dto';
import { ValidatePromptDto } from './dto/validate-prompt.dto';
import {
  type AgentDefinition,
  type AgentExecutionSummary,
} from './interfaces/agent.interface';

@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  @ApiOperation({ summary: 'List the agent registry' })
  listAgents(): AgentDefinition[] {
    return this.agentsService.listAgents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single agent definition' })
  getAgent(@Param('id') id: string): AgentDefinition {
    return this.agentsService.getAgent(id);
  }

  @Post('schedule')
  @ApiOperation({ summary: 'Schedule the best-fit agents for a prompt' })
  schedule(@Body() dto: ScheduleAgentsDto): AgentExecutionSummary {
    return this.agentsService.scheduleAgents(dto.prompt);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a prompt before dispatching agents' })
  validate(@Body() dto: ValidatePromptDto) {
    return this.agentsService.validate(dto.prompt);
  }

  @Post(':id/learn')
  @ApiOperation({ summary: 'Extract learnings from an agent execution' })
  learn(@Param('id') id: string) {
    return this.agentsService.learn(id);
  }

  @Post(':id/summarize')
  @ApiOperation({ summary: 'Summarize an agent execution' })
  summarize(@Param('id') id: string) {
    return this.agentsService.summarize(id);
  }
}
