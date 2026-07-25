import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { DeployService } from './deploy.service';

@ApiTags('deploy')
@Controller('deploy')
export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  @Post('build')
  @ApiOperation({ summary: 'Trigger a project build' })
  build(@Body() dto: CreateDeploymentDto) {
    return this.deployService.build(dto);
  }

  @Post('preview')
  @ApiOperation({ summary: 'Deploy to preview environment' })
  preview(@Body() dto: CreateDeploymentDto) {
    return this.deployService.deploy({ ...dto, environment: 'preview' });
  }

  @Post('production')
  @ApiOperation({ summary: 'Deploy to production environment' })
  production(@Body() dto: CreateDeploymentDto) {
    return this.deployService.deploy({ ...dto, environment: 'production' });
  }

  @Post(':id/rollback')
  @ApiOperation({ summary: 'Rollback to a previous deployment' })
  rollback(@Param('id') id: string) {
    return this.deployService.rollback(id);
  }

  @Get()
  @ApiOperation({ summary: 'List deployments' })
  list(@Query('projectId') projectId?: string) {
    return this.deployService.listDeployments(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a deployment by ID' })
  get(@Param('id') id: string) {
    return this.deployService.getDeployment(id);
  }

  @Patch(':id/env')
  @ApiOperation({ summary: 'Set environment variables for a deployment' })
  setEnvVars(
    @Param('id') id: string,
    @Body() envVars: Record<string, string>,
  ) {
    return this.deployService.setEnvVars(id, envVars);
  }

  @Patch(':id/secrets')
  @ApiOperation({ summary: 'Add secrets to a deployment' })
  addSecrets(
    @Param('id') id: string,
    @Body() body: { secrets: string[] },
  ) {
    return this.deployService.addSecrets(id, body.secrets);
  }
}
