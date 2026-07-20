import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class WorkflowBranchDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  prompt?: string;
}

export class WorkflowStepDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: ['task', 'parallel', 'condition', 'approval', 'event'] })
  @IsIn(['task', 'parallel', 'condition', 'approval', 'event'])
  type!: 'task' | 'parallel' | 'condition' | 'approval' | 'event';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  prompt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  timeoutMs?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  retryLimit?: number;

  @ApiPropertyOptional({ type: [WorkflowBranchDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowBranchDto)
  branches?: WorkflowBranchDto[];
}
