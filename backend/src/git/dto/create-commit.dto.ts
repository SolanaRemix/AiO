import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCommitDto {
  @ApiProperty()
  @IsString()
  projectId!: string;

  @ApiPropertyOptional({ default: 'main' })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  message!: string;

  @ApiPropertyOptional({ default: 'Backend Agent' })
  @IsOptional()
  @IsString()
  agent?: string;

  @ApiPropertyOptional({ enum: ['passed', 'pending', 'failed'], default: 'pending' })
  @IsOptional()
  @IsIn(['passed', 'pending', 'failed'])
  validation?: 'passed' | 'pending' | 'failed';
}
