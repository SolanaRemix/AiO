import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class AgentRunDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(4000)
  prompt!: string;
}
