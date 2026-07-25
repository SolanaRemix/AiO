import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class ConnectGitDto {
  @ApiProperty({ enum: ['github', 'gitlab', 'bitbucket'] })
  @IsIn(['github', 'gitlab', 'bitbucket'])
  provider!: 'github' | 'gitlab' | 'bitbucket';

  @ApiProperty({ example: 'ghp_xxx_or_oauth_token' })
  @IsString()
  @MinLength(8)
  accessToken!: string;

  @ApiPropertyOptional({ example: ['repo', 'workflow'] })
  @IsOptional()
  scope?: string[];

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  expiresInDays?: number;
}
