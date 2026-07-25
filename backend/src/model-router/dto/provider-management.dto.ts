import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { type AIProviderType } from '../interfaces/provider.interface';

export class RegisterProviderDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: ['cloud', 'local', 'self-hosted'] })
  @IsEnum(['cloud', 'local', 'self-hosted'])
  type!: AIProviderType;

  @ApiProperty()
  @IsString()
  baseUrl!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  apiKey?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  models!: string[];

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}

export class UpdateProviderDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  baseUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  apiKey?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  models?: string[];

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  headers?: Record<string, string>;
}
