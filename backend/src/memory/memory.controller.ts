import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemoryService, type MemoryRecord } from './memory.service';

@ApiTags('memory')
@Controller('memory')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Get()
  @ApiOperation({ summary: 'List stored memory records' })
  list(
    @Query('scope') scope?: MemoryRecord['scope'],
    @Query('projectId') projectId?: string,
  ): MemoryRecord[] {
    return this.memoryService.list(scope, projectId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a memory record' })
  create(
    @Body()
    body: {
      scope: MemoryRecord['scope'];
      key: string;
      value: string;
      projectId?: string;
    },
  ): MemoryRecord {
    return this.memoryService.create(body);
  }
}
