import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SearchDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  query!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectId?: string;
}
