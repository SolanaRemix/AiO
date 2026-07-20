import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiPropertyOptional()
  repositoryUrl?: string;

  @ApiProperty({ example: 'active' })
  status!: 'active' | 'archived';

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
