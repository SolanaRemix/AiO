import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { GitProviderAdapters } from './adapters/git-provider-adapters';
import { GitController } from './git.controller';
import { GitService } from './git.service';

@Module({
  imports: [ProjectsModule],
  controllers: [GitController],
  providers: [GitService, GitProviderAdapters],
  exports: [GitService],
})
export class GitModule {}
