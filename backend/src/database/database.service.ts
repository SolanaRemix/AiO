import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { type DatabaseState, DEFAULT_DATABASE_STATE } from './database.types';

function clone<T>(value: T): T {
  if (value === undefined || value === null) {
    return value;
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  private state: DatabaseState = clone(DEFAULT_DATABASE_STATE);
  private readonly ready: Promise<void>;
  private writeQueue = Promise.resolve();
  private readonly dataFile: string;

  constructor(configService: ConfigService) {
    this.dataFile = configService.getOrThrow<string>('AIO_DATA_FILE');
    this.ready = this.load();
  }

  async onModuleInit(): Promise<void> {
    await this.ready;
  }

  async list<K extends keyof DatabaseState>(key: K): Promise<DatabaseState[K]> {
    await this.ready;
    return clone(this.state[key]);
  }

  async mutate<T>(
    mutator: (draft: DatabaseState) => T | Promise<T>,
  ): Promise<T> {
    await this.ready;

    let result!: T;
    this.writeQueue = this.writeQueue.then(async () => {
      const draft = clone(this.state);
      result = await mutator(draft);
      this.state = draft;
      await this.persist();
    });

    await this.writeQueue;
    return clone(result);
  }

  async snapshot(): Promise<DatabaseState> {
    await this.ready;
    return clone(this.state);
  }

  private async load(): Promise<void> {
    await mkdir(dirname(this.dataFile), { recursive: true });

    try {
      const raw = await readFile(this.dataFile, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<DatabaseState>;
      this.state = {
        ...clone(DEFAULT_DATABASE_STATE),
        ...parsed,
      };
    } catch {
      this.state = clone(DEFAULT_DATABASE_STATE);
      await this.persist();
    }
  }

  private async persist(): Promise<void> {
    await writeFile(this.dataFile, JSON.stringify(this.state, null, 2));
  }
}
