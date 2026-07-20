import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'AiO Enterprise' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    example: 'AI operating system for enterprise software teams.',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description!: string;

  @ApiPropertyOptional({ example: 'https://github.com/example/aio-enterprise' })
  @IsOptional()
  @IsUrl()
  repositoryUrl?: string;
}
