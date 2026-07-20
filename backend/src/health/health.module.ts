import { Module } from '@nestjs/common';
import { ModelRouterModule } from '../model-router/model-router.module';
import { HealthController } from './health.controller';

@Module({
  imports: [ModelRouterModule],
  controllers: [HealthController],
})
export class HealthModule {}
