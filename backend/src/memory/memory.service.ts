import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';

export interface MemoryRecord {
  id: string;
  scope: 'user' | 'workspace' | 'project';
  key: string;
  value: string;
  projectId?: string;
  createdAt: string;
}

@Injectable()
export class MemoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async list(
    scope?: MemoryRecord['scope'],
    projectId?: string,
  ): Promise<MemoryRecord[]> {
    const records = await this.databaseService.list('memoryRecords');
    return records.filter((record) => {
      const scopeMatches = scope == null || record.scope === scope;
      const projectMatches =
        projectId == null || record.projectId === projectId;
      return scopeMatches && projectMatches;
    });
  }

  async create(
    entry: Omit<MemoryRecord, 'id' | 'createdAt'>,
  ): Promise<MemoryRecord> {
    const record: MemoryRecord = {
      ...entry,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    await this.databaseService.mutate((draft) => {
      draft.memoryRecords.unshift(record);
    });
    return record;
  }
}
