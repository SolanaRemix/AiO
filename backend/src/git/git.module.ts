import { Module } from '@nestjs/common';
import { GitProviderAdapters } from './adapters/git-provider-adapters';
import { GitController } from './git.controller';
import { GitService } from './git.service';

@Module({
  controllers: [GitController],
  providers: [GitService, GitProviderAdapters],
  exports: [GitService],
})
export class GitModule {}
