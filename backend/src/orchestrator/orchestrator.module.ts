import { Module } from '@nestjs/common';
import { AgentsModule } from '../agents/agents.module';
import { KnowledgeEngineModule } from '../knowledge-engine/knowledge-engine.module';
import { ModelRouterModule } from '../model-router/model-router.module';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorService } from './orchestrator.service';

@Module({
  imports: [AgentsModule, KnowledgeEngineModule, ModelRouterModule],
  controllers: [OrchestratorController],
  providers: [OrchestratorService],
  exports: [OrchestratorService],
})
export class OrchestratorModule {}
