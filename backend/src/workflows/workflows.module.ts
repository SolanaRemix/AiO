import { Module } from '@nestjs/common';
import { AgentsModule } from '../agents/agents.module';
import { KnowledgeEngineModule } from '../knowledge-engine/knowledge-engine.module';
import { WorkflowsService } from './workflows.service';

@Module({
  imports: [AgentsModule, KnowledgeEngineModule],
  providers: [WorkflowsService],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
