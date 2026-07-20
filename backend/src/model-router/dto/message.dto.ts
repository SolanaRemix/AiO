import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class MessageDto {
  @ApiProperty({ enum: ['system', 'user', 'assistant'] })
  @IsIn(['system', 'user', 'assistant'])
  role!: string;

  @ApiProperty()
  @IsString()
  content!: string;
}
