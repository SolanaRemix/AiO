import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import { type StoredUser } from '../database/database.types';
import { MonitoringService } from '../monitoring/monitoring.service';
import { LoginDto } from './dto/login.dto';
import { type JwtPayload } from './interfaces/jwt-payload.interface';

const SCRYPT_KEYLEN = 64;
const DEFAULT_ADMIN_EMAIL = 'admin@aio.local';
const DEFAULT_ADMIN_PASSWORD = 'ChangeMe123!';
const DEFAULT_ADMIN_ROLES = ['admin'];

function buildPasswordEntry(password: string, salt: string): string {
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, entry: string): boolean {
  const separatorIdx = entry.indexOf(':');
  if (separatorIdx === -1) return false;
  const salt = entry.slice(0, separatorIdx);
  const storedHash = Buffer.from(entry.slice(separatorIdx + 1), 'hex');
  if (storedHash.length !== SCRYPT_KEYLEN) return false;
  const incoming = scryptSync(password, salt, SCRYPT_KEYLEN);
  try {
    return timingSafeEqual(incoming, storedHash);
  } catch {
    return false;
  }
}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly monitoringService: MonitoringService,
  ) {}

  async onModuleInit(): Promise<void> {
    const adminEmail =
      this.configService.get<string>('ADMIN_EMAIL') ?? DEFAULT_ADMIN_EMAIL;
    const adminPassword =
      this.configService.get<string>('ADMIN_PASSWORD') ??
      DEFAULT_ADMIN_PASSWORD;

    await this.databaseService.mutate((draft) => {
      const existing = draft.users.find((user) => user.email === adminEmail);
      if (existing != null) {
        return;
      }

      const salt = randomBytes(16).toString('hex');
      const timestamp = new Date().toISOString();
      const adminUser: StoredUser = {
        id: randomUUID(),
        email: adminEmail,
        passwordEntry: buildPasswordEntry(adminPassword, salt),
        roles: DEFAULT_ADMIN_ROLES,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      draft.users.push(adminUser);
    });
  }

  async login(dto: LoginDto): Promise<{
    accessToken: string;
    user: { id: string; email: string; roles: string[] };
  }> {
    const users = await this.databaseService.list('users');
    const user = users.find((candidate) => candidate.email === dto.email);
    if (user == null || !verifyPassword(dto.password, user.passwordEntry)) {
      await this.monitoringService.recordAuditEvent({
        action: 'auth.login',
        actor: dto.email,
        resource: 'session',
        status: 'failure',
        detail: 'Invalid credentials provided.',
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    await this.monitoringService.recordAuditEvent({
      action: 'auth.login',
      actor: user.email,
      resource: 'session',
      status: 'success',
      detail: 'JWT session issued.',
    });

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
      },
    };
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validateApiKey(apiKey: string): JwtPayload | null {
    const configured = this.configService.get<string>('AIO_API_KEYS') ?? '';
    const entries = configured
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [key, roles] = entry.split(':');
        return {
          key,
          roles: roles?.split('|').filter(Boolean) ?? ['system'],
        };
      });

    const match = entries.find((entry) => entry.key === apiKey);
    if (match == null) {
      return null;
    }

    return {
      sub: 'api-key',
      email: 'api-key@aio.local',
      roles: match.roles,
    };
  }
}
