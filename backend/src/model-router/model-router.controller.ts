import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ModelRouteRequestDto } from './dto/model-route-request.dto';
import { type ModelRouteResponse } from './interfaces/provider.interface';
import { ModelRouterService } from './model-router.service';

@ApiTags('model-router')
@Controller('model-router')
export class ModelRouterController {
  constructor(private readonly modelRouterService: ModelRouterService) {}

  @Get('providers')
  @ApiOperation({ summary: 'List supported model providers' })
  listProviders() {
    return this.modelRouterService.listProviders();
  }

  @Get('health')
  @ApiOperation({ summary: 'Run provider health checks' })
  health() {
    return this.modelRouterService.healthCheck();
  }

  @Post('route')
  @ApiOperation({ summary: 'Route a model inference request' })
  route(@Body() dto: ModelRouteRequestDto): Promise<ModelRouteResponse> {
    return this.modelRouterService.route(dto);
  }
}
