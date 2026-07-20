import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentsModule } from './agents/agents.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { KnowledgeEngineModule } from './knowledge-engine/knowledge-engine.module';
import { MemoryModule } from './memory/memory.module';
import { ModelRouterModule } from './model-router/model-router.module';
import { OrchestratorModule } from './orchestrator/orchestrator.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
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
