import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import { type StoredFileRecord } from '../database/database.types';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateFileDto): Promise<StoredFileRecord> {
    const record: StoredFileRecord = {
      id: randomUUID(),
      projectId: dto.projectId,
      name: dto.name,
      path: dto.path,
      mediaType: dto.mediaType ?? 'text/plain',
      content: dto.content,
      size: Buffer.byteLength(dto.content ?? '', 'utf-8'),
      createdAt: new Date().toISOString(),
    };

    await this.databaseService.mutate((draft) => {
      draft.files.unshift(record);
    });

    return record;
  }

  async list(projectId?: string): Promise<StoredFileRecord[]> {
    const files = await this.databaseService.list('files');
    return files.filter(
      (file) => projectId == null || file.projectId === projectId,
    );
  }
}
