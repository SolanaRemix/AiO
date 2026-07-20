import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  type ModelRouteRequest,
  type ModelRouteResponse,
} from './interfaces/provider.interface';
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

  @Post('route')
  @ApiOperation({ summary: 'Route a model inference request' })
  route(@Body() request: ModelRouteRequest): Promise<ModelRouteResponse> {
    return this.modelRouterService.route(request);
  }
}
