import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MessageDto } from './message.dto';

export class ModelRouteRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ type: [MessageDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages!: MessageDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxTokens?: number;
}
