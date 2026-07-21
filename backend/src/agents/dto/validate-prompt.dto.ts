import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidatePromptDto {
  @ApiProperty()
  @IsString()
  prompt!: string;
}
