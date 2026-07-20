import { Module } from '@nestjs/common';
import { ModelRouterController } from './model-router.controller';
import { ModelRouterService } from './model-router.service';

@Module({
  controllers: [ModelRouterController],
  providers: [ModelRouterService],
  exports: [ModelRouterService],
})
export class ModelRouterModule {}
