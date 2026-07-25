import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { type JwtPayload } from './interfaces/jwt-payload.interface';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  @ApiOperation({ summary: 'Issue a JWT access token for a user' })
  login(@Body() dto: LoginDto, @Ip() ip: string, @Req() request: Request) {
    return this.authService.login(dto, {
      ip,
      device: request.get('user-agent') ?? 'unknown-device',
    });
  }

  @Get('auth/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return the authenticated user profile' })
  profile(@Req() request: Request & { user: JwtPayload }) {
    return this.authService.getSession(request.user);
  }

  @Post('api/auth/register')
  @ApiOperation({ summary: 'Register enterprise user and initialize workspace' })
  register(@Body() dto: RegisterDto, @Ip() ip: string) {
    return this.authService.register(dto, {
      ip,
      device: dto.device,
      rememberDevice: dto.rememberDevice,
    });
  }

  @Post('api/auth/login')
  @ApiOperation({ summary: 'Login with email and password' })
  enterpriseLogin(@Body() dto: LoginDto, @Ip() ip: string, @Req() request: Request) {
    return this.authService.login(dto, {
      ip,
      device: request.get('user-agent') ?? 'unknown-device',
    });
  }

  @Post('api/auth/oauth/login')
  @ApiOperation({ summary: 'Login using configured OAuth provider' })
  oauthLogin(@Body() dto: OAuthLoginDto, @Ip() ip: string) {
    return this.authService.loginWithOAuth(dto, {
      ip,
      device: dto.device,
      rememberDevice: dto.rememberDevice,
    });
  }

  @Get('api/auth/oauth/providers')
  @ApiOperation({ summary: 'List OAuth providers supported by AiO enterprise identity' })
  oauthProviders() {
    return { providers: this.authService.listOauthProviders() };
  }

  @Post('api/auth/refresh')
  @ApiOperation({ summary: 'Rotate refresh token and issue a new access token' })
  refresh(@Body() dto: RefreshDto, @Ip() ip: string, @Req() request: Request) {
    return this.authService.refresh(dto.refreshToken, {
      ip,
      device: request.get('user-agent') ?? 'unknown-device',
    });
  }

  @Post('api/auth/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Securely logout and revoke session' })
  logout(
    @Req() request: Request & { user: JwtPayload },
    @Body() dto: LogoutDto,
    @Headers('x-csrf-token') csrfToken?: string,
  ) {
    if (csrfToken == null || csrfToken.length === 0) {
      throw new BadRequestException('x-csrf-token header is required.');
    }
    return this.authService.logout(request.user, csrfToken, dto.refreshToken);
  }

  @Get('api/auth/session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active enterprise session and profile data' })
  session(@Req() request: Request & { user: JwtPayload }) {
    return this.authService.getSession(request.user);
  }
}
