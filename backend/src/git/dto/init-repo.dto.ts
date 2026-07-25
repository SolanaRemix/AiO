import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class InitRepoDto {
  @ApiProperty()
  @IsString()
  projectId!: string;

  @ApiProperty({ enum: ['github', 'gitlab', 'bitbucket'] })
  @IsIn(['github', 'gitlab', 'bitbucket'])
  provider!: 'github' | 'gitlab' | 'bitbucket';

  @ApiProperty()
  @IsString()
  @MinLength(2)
  repositoryName!: string;

  @ApiPropertyOptional({ default: 'main' })
  @IsOptional()
  @IsString()
  defaultBranch?: string;

  @ApiPropertyOptional({ default: ['main'] })
  @IsOptional()
  @IsArray()
  branches?: string[];

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  generateReadme?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  generateGitignore?: boolean;
}
