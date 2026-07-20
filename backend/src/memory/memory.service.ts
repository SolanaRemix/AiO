import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

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
  private readonly records: MemoryRecord[] = [];

  list(scope?: MemoryRecord['scope'], projectId?: string): MemoryRecord[] {
    return this.records.filter((record) => {
      const scopeMatches = scope == null || record.scope === scope;
      const projectMatches =
        projectId == null || record.projectId === projectId;
      return scopeMatches && projectMatches;
    });
  }

  create(entry: Omit<MemoryRecord, 'id' | 'createdAt'>): MemoryRecord {
    const record: MemoryRecord = {
      ...entry,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.records.unshift(record);
    return record;
  }
}
