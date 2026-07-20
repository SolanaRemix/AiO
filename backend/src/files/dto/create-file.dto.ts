import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ example: 'launch-checklist.md' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ example: 'projects/apollo/launch-checklist.md' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  path?: string;

  @ApiPropertyOptional({ example: 'project-id' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ example: 'text/markdown' })
  @IsOptional()
  @IsString()
  mediaType?: string;

  @ApiPropertyOptional({ example: '# Launch checklist' })
  @IsOptional()
  @IsString()
  @MaxLength(50_000)
  content?: string;
}
