import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Summarize this repository and plan the next sprint.',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(4000)
  prompt!: string;

  @ApiPropertyOptional({ example: 'project_123' })
  @IsOptional()
  @IsString()
  projectId?: string;
}
