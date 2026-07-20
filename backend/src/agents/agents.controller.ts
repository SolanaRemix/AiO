import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { ScheduleAgentsDto } from './dto/schedule-agents.dto';
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
}
