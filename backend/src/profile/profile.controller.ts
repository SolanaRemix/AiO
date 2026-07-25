import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get enterprise user profile' })
  getProfile(@Req() request: Request & { user: JwtPayload }) {
    return this.profileService.getProfile(request.user.sub);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile fields' })
  updateProfile(
    @Req() request: Request & { user: JwtPayload },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(request.user.sub, dto);
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update user preferences and security settings' })
  updatePreferences(
    @Req() request: Request & { user: JwtPayload },
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.profileService.updatePreferences(request.user.sub, dto);
  }
}
