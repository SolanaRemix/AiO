import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class CreateAlertDto {
  @ApiProperty()
  @IsString()
  projectId!: string;

  @ApiProperty({ enum: ['build_failure', 'security_issue', 'failed_agent', 'deployment_problem', 'merge_conflict', 'missing_configuration', 'performance_issue'] })
  @IsIn([
    'build_failure',
    'security_issue',
    'failed_agent',
    'deployment_problem',
    'merge_conflict',
    'missing_configuration',
    'performance_issue',
  ])
  type!:
    | 'build_failure'
    | 'security_issue'
    | 'failed_agent'
    | 'deployment_problem'
    | 'merge_conflict'
    | 'missing_configuration'
    | 'performance_issue';

  @ApiProperty({ enum: ['low', 'medium', 'high'] })
  @IsIn(['low', 'medium', 'high'])
  severity!: 'low' | 'medium' | 'high';

  @ApiProperty()
  @IsString()
  message!: string;
}
