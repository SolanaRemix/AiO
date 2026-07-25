import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { type DeploymentEnvironment } from '../interfaces/deployment.interface';

export class CreateDeploymentDto {
  @ApiProperty({ description: 'Human-readable deployment name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiProperty({ enum: ['preview', 'production'], default: 'preview' })
  @IsEnum(['preview', 'production'])
  environment!: DeploymentEnvironment;

  @ApiPropertyOptional({ description: 'Environment variables (non-secret)' })
  @IsObject()
  @IsOptional()
  envVars?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Names of secrets to inject' })
  @IsString({ each: true })
  @IsOptional()
  secrets?: string[];
}
