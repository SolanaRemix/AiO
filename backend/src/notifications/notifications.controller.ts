import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateAlertDto } from './dto/create-alert.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List dashboard alerts and notifications' })
  list(
    @Req() request: Request & { user: JwtPayload },
    @Query('projectId') projectId?: string,
  ) {
    return this.notificationsService.listAlerts(request.user, projectId);
  }

  @Post()
  @ApiOperation({ summary: 'Create an enterprise project alert' })
  create(
    @Req() request: Request & { user: JwtPayload },
    @Body() dto: CreateAlertDto,
  ) {
    return this.notificationsService.createAlert(request.user, dto);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolve an open alert' })
  resolve(
    @Req() request: Request & { user: JwtPayload },
    @Param('id') id: string,
  ) {
    return this.notificationsService.resolveAlert(request.user, id);
  }
}
