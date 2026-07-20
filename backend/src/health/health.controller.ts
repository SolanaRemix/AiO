import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Return service health information' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: 'up',
        redis: process.env.REDIS_URL ? 'configured' : 'not_configured',
        database: process.env.DATABASE_URL ? 'configured' : 'not_configured',
      },
    };
  }
}
