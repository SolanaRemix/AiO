import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ScheduleAgentsDto {
  @ApiProperty({
    description: 'Natural-language prompt to schedule agents for',
  })
  @IsString()
  @IsNotEmpty()
  prompt!: string;
}
