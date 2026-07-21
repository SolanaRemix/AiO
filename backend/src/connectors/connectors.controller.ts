import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConnectorsService } from './connectors.service';

@ApiTags('connectors')
@Controller('connectors')
export class ConnectorsController {
  constructor(private readonly connectorsService: ConnectorsService) {}

  @Get()
  @ApiOperation({ summary: 'List available integration connectors' })
  list() {
    return this.connectorsService.list();
  }

  @Get('health')
  @ApiOperation({ summary: 'Run health checks on all connectors' })
  health() {
    return this.connectorsService.health();
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Trigger a sync for a connector' })
  sync(@Param('id') id: string) {
    return this.connectorsService.sync(id);
  }

  @Post(':id/search')
  @ApiOperation({ summary: 'Search via a connector' })
  search(@Param('id') id: string, @Body() body: { query: string }) {
    return this.connectorsService.search(id, body.query);
  }
}
