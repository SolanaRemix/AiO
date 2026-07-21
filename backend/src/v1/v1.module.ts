import { Module } from '@nestjs/common';
import { AgentsModule } from '../agents/agents.module';
import { AuthModule } from '../auth/auth.module';
import { DeployModule } from '../deploy/deploy.module';
import { FilesModule } from '../files/files.module';
import { KnowledgeEngineModule } from '../knowledge-engine/knowledge-engine.module';
import { MemoryModule } from '../memory/memory.module';
import { ModelRouterModule } from '../model-router/model-router.module';
import { OrchestratorModule } from '../orchestrator/orchestrator.module';
import { ProjectsModule } from '../projects/projects.module';
import { WorkflowsModule } from '../workflows/workflows.module';
import { V1Controller } from './v1.controller';

@Module({
  imports: [
    AuthModule,
    AgentsModule,
    DeployModule,
    FilesModule,
    KnowledgeEngineModule,
    MemoryModule,
    ModelRouterModule,
    OrchestratorModule,
    ProjectsModule,
    WorkflowsModule,
  ],
  controllers: [V1Controller],
})
export class V1Module {}
