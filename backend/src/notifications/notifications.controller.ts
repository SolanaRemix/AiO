import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAlertDto } from './dto/create-alert.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List dashboard alerts and notifications' })
  list(@Query('projectId') projectId?: string) {
    return this.notificationsService.listAlerts(projectId);
  }

  @Post()
  @ApiOperation({ summary: 'Create an enterprise project alert' })
  create(@Body() dto: CreateAlertDto) {
    return this.notificationsService.createAlert(dto);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolve an open alert' })
  resolve(@Param('id') id: string) {
    return this.notificationsService.resolveAlert(id);
  }
}
