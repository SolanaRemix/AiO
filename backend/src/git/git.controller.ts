import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Request } from 'express';
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
  init(
    @Req() request: Request & { user: JwtPayload },
    @Body() dto: InitRepoDto,
  ) {
    return this.gitService.initRepository(request.user, dto);
  }

  @Post('commit')
  @ApiOperation({ summary: 'Create a commit in the integrated workspace' })
  commit(
    @Req() request: Request & { user: JwtPayload },
    @Body() dto: CreateCommitDto,
  ) {
    return this.gitService.commit(request.user, dto);
  }

  @Post('push')
  @ApiOperation({ summary: 'Push local workspace changes to provider' })
  push(
    @Req() request: Request & { user: JwtPayload },
    @Body() dto: SyncGitDto,
  ) {
    return this.gitService.push(request.user, dto.projectId, dto.branch);
  }

  @Post('pull')
  @ApiOperation({ summary: 'Pull remote updates from provider' })
  pull(
    @Req() request: Request & { user: JwtPayload },
    @Body() dto: SyncGitDto,
  ) {
    return this.gitService.pull(request.user, dto.projectId, dto.branch);
  }

  @Get('history')
  @ApiOperation({ summary: 'View commit history in workspace' })
  history(
    @Req() request: Request & { user: JwtPayload },
    @Query('projectId') projectId?: string,
  ) {
    return this.gitService.history(request.user, projectId);
  }
}
