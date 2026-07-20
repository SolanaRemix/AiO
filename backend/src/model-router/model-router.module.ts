import { Module } from '@nestjs/common';
import { ModelRouterController } from './model-router.controller';
import { ModelRouterService } from './model-router.service';
import { ProviderRegistryService } from './provider-registry.service';

@Module({
  controllers: [ModelRouterController],
  providers: [ProviderRegistryService, ModelRouterService],
  exports: [ProviderRegistryService, ModelRouterService],
})
export class ModelRouterModule {}
