import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  KnowledgeEngineService,
  type KnowledgeHit,
} from './knowledge-engine.service';

@ApiTags('knowledge-engine')
@Controller('knowledge-engine')
export class KnowledgeEngineController {
  constructor(
    private readonly knowledgeEngineService: KnowledgeEngineService,
  ) {}

  @Get('search')
  @ApiOperation({
    summary: 'Search indexed knowledge and retrieve relevant context',
  })
  search(
    @Query('query') query: string,
    @Query('projectId') projectId?: string,
  ): Promise<KnowledgeHit[]> {
    return this.knowledgeEngineService.search(query ?? '', projectId);
  }

  @Post('ingest')
  @ApiOperation({ summary: 'Add a document to the knowledge corpus' })
  ingest(
    @Body()
    document: {
      title: string;
      excerpt: string;
      content?: string;
      tags?: string[];
      projectId?: string;
    },
  ): Promise<KnowledgeHit> {
    return this.knowledgeEngineService.ingest(document);
  }
}
