import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { type ProjectLifecycleState } from '../../database/database.types';

export class ProjectEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiPropertyOptional()
  repositoryUrl?: string;

  @ApiProperty({ example: 'active' })
  status!: 'active' | 'archived';

  @ApiProperty({ example: 'Planning' })
  lifecycleState!: ProjectLifecycleState;

  @ApiProperty({ example: 12 })
  completionPercentage!: number;

  @ApiProperty({ example: 'Discovery' })
  pipelineStage!: string;

  @ApiProperty({ example: 'not_configured' })
  deploymentStatus!:
    'not_configured' | 'queued' | 'in_progress' | 'succeeded' | 'failed';

  @ApiProperty({ example: 'clean' })
  gitStatus!: 'clean' | 'changes_pending' | 'conflict' | 'disconnected';

  @ApiProperty({ example: 4 })
  activeAgents!: number;

  @ApiProperty({ example: 1 })
  alerts!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
