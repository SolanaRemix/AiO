import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const lifecycleStates = [
  'Planning',
  'Architecture',
  'Development',
  'Testing',
  'Security Review',
  'Deployment Ready',
  'Production',
  'Monitoring',
] as const;

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  repositoryUrl?: string;

  @ApiPropertyOptional({ enum: ['active', 'archived'] })
  @IsOptional()
  @IsIn(['active', 'archived'])
  status?: 'active' | 'archived';

  @ApiPropertyOptional({ enum: lifecycleStates })
  @IsOptional()
  @IsIn(lifecycleStates)
  lifecycleState?: (typeof lifecycleStates)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  completionPercentage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pipelineStage?: string;

  @ApiPropertyOptional({
    enum: ['not_configured', 'queued', 'in_progress', 'succeeded', 'failed'],
  })
  @IsOptional()
  @IsIn(['not_configured', 'queued', 'in_progress', 'succeeded', 'failed'])
  deploymentStatus?:
    'not_configured' | 'queued' | 'in_progress' | 'succeeded' | 'failed';

  @ApiPropertyOptional({
    enum: ['clean', 'changes_pending', 'conflict', 'disconnected'],
  })
  @IsOptional()
  @IsIn(['clean', 'changes_pending', 'conflict', 'disconnected'])
  gitStatus?: 'clean' | 'changes_pending' | 'conflict' | 'disconnected';

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  activeAgents?: number;
}
