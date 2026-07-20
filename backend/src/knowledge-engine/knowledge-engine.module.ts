import { Module } from '@nestjs/common';
import { KnowledgeEngineController } from './knowledge-engine.controller';
import { KnowledgeEngineService } from './knowledge-engine.service';

@Module({
  controllers: [KnowledgeEngineController],
  providers: [KnowledgeEngineService],
  exports: [KnowledgeEngineService],
})
export class KnowledgeEngineModule {}
