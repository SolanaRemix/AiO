import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ModelRouterService } from '../model-router/model-router.service';
import { MonitoringService } from '../monitoring/monitoring.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly modelRouterService: ModelRouterService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Return service health information' })
  async check() {
    const metrics = await this.monitoringService.summary();
    const providers = await this.modelRouterService.listProviders();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: 'up',
        redis: process.env.REDIS_URL ? 'configured' : 'not_configured',
        database: process.env.DATABASE_URL ? 'configured' : 'not_configured',
      },
      metrics,
      providers: providers.map((provider) => ({
        id: provider.id,
        enabled: provider.enabled,
        health: provider.health,
        latencyMs: provider.latencyMs,
      })),
    };
  }
}
