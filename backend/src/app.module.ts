import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './common/config/env.validation';
import { ConnectorsModule } from './connectors/connectors.module';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './files/files.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentsModule } from './agents/agents.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { KnowledgeEngineModule } from './knowledge-engine/knowledge-engine.module';
import { MemoryModule } from './memory/memory.module';
import { ModelRouterModule } from './model-router/model-router.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { OrchestratorModule } from './orchestrator/orchestrator.module';
import { ProjectsModule } from './projects/projects.module';
import { V1Module } from './v1/v1.module';
import { WorkflowsModule } from './workflows/workflows.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: validateEnvironment,
    }),
    DatabaseModule,
    MonitoringModule,
    ConnectorsModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 120,
      },
    ]),
    AuthModule,
    HealthModule,
    ProjectsModule,
    MemoryModule,
    AgentsModule,
    ModelRouterModule,
    KnowledgeEngineModule,
    OrchestratorModule,
    FilesModule,
    WorkflowsModule,
    V1Module,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
