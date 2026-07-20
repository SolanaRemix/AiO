import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WorkflowStepDto } from './workflow-step.dto';

export class RunWorkflowDto {
  @ApiProperty({ example: 'AI Builder Flow' })
  @IsString()
  name!: string;

  @ApiProperty({ type: [WorkflowStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowStepDto)
  steps!: WorkflowStepDto[];

  @ApiPropertyOptional({ example: { approved: true, ticket: 'REL-42' } })
  @IsOptional()
  @IsObject()
  input?: Record<string, unknown>;
}
