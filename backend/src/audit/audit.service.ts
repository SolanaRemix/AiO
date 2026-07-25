import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuditService {
  constructor(private readonly databaseService: DatabaseService) {}

  async list(limit = 200) {
    const logs = await this.databaseService.list('auditLogs');
    return logs.slice(0, Math.max(1, Math.min(limit, 1_000)));
  }
}
