import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMemoryDto {
  @ApiProperty({ enum: ['user', 'workspace', 'project'] })
  @IsIn(['user', 'workspace', 'project'])
  scope!: 'user' | 'workspace' | 'project';

  @ApiProperty()
  @IsString()
  key!: string;

  @ApiProperty()
  @IsString()
  value!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: string;
}
