import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

const providers = ['google', 'github', 'microsoft', 'enterprise-sso'] as const;

export class OAuthLoginDto {
  @ApiProperty({ enum: providers })
  @IsIn(providers)
  provider!: (typeof providers)[number];

  @ApiProperty({ example: 'oauth-authorization-code' })
  @IsString()
  @MinLength(8)
  oauthCode!: string;

  @ApiProperty({ example: 'enterprise-user-1842' })
  @IsString()
  @MinLength(3)
  providerAccountId!: string;

  @ApiProperty({ example: 'sarah@enterprise.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: 'Sarah Johnson' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: 'https://cdn.enterprise.com/avatar.png' })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({ example: 'Chrome on Linux' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  device?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  rememberDevice?: boolean;
}
