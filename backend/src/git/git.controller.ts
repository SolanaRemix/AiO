import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ConnectGitDto } from './dto/connect-git.dto';
import { CreateCommitDto } from './dto/create-commit.dto';
import { InitRepoDto } from './dto/init-repo.dto';
import { SyncGitDto } from './dto/sync-git.dto';
import { GitService } from './git.service';

@ApiTags('git')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/git')
export class GitController {
  constructor(private readonly gitService: GitService) {}

  @Post('connect')
  @ApiOperation({ summary: 'Connect a Git provider account' })
  connect(
    @Req() request: Request & { user: JwtPayload },
    @Body() dto: ConnectGitDto,
  ) {
    return this.gitService.connect(request.user.sub, dto);
  }

  @Get('providers')
  @ApiOperation({ summary: 'List supported Git providers' })
  providers() {
    return { providers: this.gitService.listProviders() };
  }

  @Post('init')
  @ApiOperation({ summary: 'Initialize repository and branch configuration' })
  init(@Body() dto: InitRepoDto) {
    return this.gitService.initRepository(dto);
  }

  @Post('commit')
  @ApiOperation({ summary: 'Create a commit in the integrated workspace' })
  commit(@Body() dto: CreateCommitDto) {
    return this.gitService.commit(dto);
  }

  @Post('push')
  @ApiOperation({ summary: 'Push local workspace changes to provider' })
  push(@Body() dto: SyncGitDto) {
    return this.gitService.push(dto.projectId, dto.branch);
  }

  @Post('pull')
  @ApiOperation({ summary: 'Pull remote updates from provider' })
  pull(@Body() dto: SyncGitDto) {
    return this.gitService.pull(dto.projectId, dto.branch);
  }

  @Get('history')
  @ApiOperation({ summary: 'View commit history in workspace' })
  history(@Query('projectId') projectId?: string) {
    return this.gitService.history(projectId);
  }
}
