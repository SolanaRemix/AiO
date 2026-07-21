import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  RegisterProviderDto,
  UpdateProviderDto,
} from './dto/provider-management.dto';
import { ModelRouteRequestDto } from './dto/model-route-request.dto';
import { type ModelRouteResponse } from './interfaces/provider.interface';
import { ModelRouterService } from './model-router.service';
import { ProviderRegistryService } from './provider-registry.service';

@ApiTags('model-router')
@Controller('model-router')
export class ModelRouterController {
  constructor(
    private readonly modelRouterService: ModelRouterService,
    private readonly providerRegistryService: ProviderRegistryService,
  ) {}

  @Get('providers')
  @ApiOperation({ summary: 'List supported model providers' })
  listProviders() {
    return this.modelRouterService.listProviders();
  }

  @Post('providers')
  @ApiOperation({ summary: 'Register a new AI provider' })
  async registerProvider(@Body() dto: RegisterProviderDto) {
    const record = this.providerRegistryService.createCustomProvider({
      name: dto.name,
      type: dto.type,
      baseUrl: dto.baseUrl,
      apiKey: dto.apiKey,
      models: dto.models,
      priority: dto.priority,
      enabled: dto.enabled,
    });
    return this.providerRegistryService.register(record);
  }

  @Patch('providers/:id')
  @ApiOperation({ summary: 'Update an existing provider configuration' })
  async updateProvider(
    @Param('id') id: string,
    @Body() dto: UpdateProviderDto,
  ) {
    const existing = await this.providerRegistryService.findById(id);
    if (existing == null) {
      throw new NotFoundException(`Provider ${id} was not found.`);
    }

    const updated = {
      ...existing,
      ...(dto.name != null && { name: dto.name }),
      ...(dto.baseUrl != null && { baseUrl: dto.baseUrl }),
      ...(dto.apiKey != null && { apiKey: dto.apiKey }),
      ...(dto.models != null && { models: dto.models }),
      ...(dto.priority != null && { priority: dto.priority }),
      ...(dto.enabled != null && { enabled: dto.enabled }),
      ...(dto.headers != null && { headers: dto.headers }),
    };

    return this.providerRegistryService.register(updated);
  }

  @Delete('providers/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a provider from the registry' })
  async deleteProvider(@Param('id') id: string) {
    const existing = await this.providerRegistryService.findById(id);
    if (existing == null) {
      throw new NotFoundException(`Provider ${id} was not found.`);
    }
    await this.providerRegistryService.deleteProvider(id);
  }

  @Post('providers/:id/enable')
  @ApiOperation({ summary: 'Enable a provider' })
  async enableProvider(@Param('id') id: string) {
    const existing = await this.providerRegistryService.findById(id);
    if (existing == null) {
      throw new NotFoundException(`Provider ${id} was not found.`);
    }
    return this.providerRegistryService.register({ ...existing, enabled: true });
  }

  @Post('providers/:id/disable')
  @ApiOperation({ summary: 'Disable a provider' })
  async disableProvider(@Param('id') id: string) {
    const existing = await this.providerRegistryService.findById(id);
    if (existing == null) {
      throw new NotFoundException(`Provider ${id} was not found.`);
    }
    return this.providerRegistryService.register({ ...existing, enabled: false });
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
