import {
  BadRequestException,
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  createHash,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import {
  type StoredOAuthAccount,
  type StoredSession,
  type StoredUser,
} from '../database/database.types';
import { MonitoringService } from '../monitoring/monitoring.service';
import { LoginDto } from './dto/login.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { RegisterDto } from './dto/register.dto';
import { type JwtPayload } from './interfaces/jwt-payload.interface';
import { getOAuthProvider, listOAuthProviders } from './oauth/oauth.providers';

const SCRYPT_KEYLEN = 64;
const DEFAULT_ADMIN_EMAIL = 'admin@aio.local';
const DEFAULT_ADMIN_PASSWORD = 'ChangeMe123!';
const DEFAULT_ADMIN_NAME = 'AiO Admin';
const DEFAULT_ADMIN_ROLES = ['admin'];

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
const REFRESH_TOKEN_REMEMBER_TTL_SECONDS = 60 * 60 * 24 * 30;

export type SessionRequestContext = {
  ip?: string;
  device?: string;
  rememberDevice?: boolean;
};

export type AuthSessionResponse = {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
  expiresIn: number;
  session: { id: string; expiresAt: string };
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    roles: string[];
    workspaceId: string;
    preferences: StoredUser['preferences'];
    aiSettings: StoredUser['aiSettings'];
    notificationSettings: StoredUser['notificationSettings'];
    securitySettings: StoredUser['securitySettings'];
  };
};

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

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function buildDefaultUser(email: string, name: string, password: string): StoredUser {
  const salt = randomBytes(16).toString('hex');
  const timestamp = new Date().toISOString();
  return {
    id: randomUUID(),
    email,
    name,
    passwordHash: buildPasswordEntry(password, salt),
    roles: ['user'],
    workspaceId: randomUUID(),
    emailVerified: false,
    preferences: {
      theme: 'system',
      timezone: 'UTC',
      locale: 'en-US',
    },
    aiSettings: {
      defaultModel: 'AIO Ultra Reasoning',
      memoryEnabled: true,
      autonomyLevel: 'balanced',
    },
    notificationSettings: {
      emailAlerts: true,
      pushAlerts: true,
      securityAlerts: true,
    },
    securitySettings: {
      mfaEnabled: false,
      suspiciousActivityLock: true,
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function normalizeUser(candidate: StoredUser): StoredUser {
  return {
    ...candidate,
    name: candidate.name ?? candidate.email,
    passwordHash:
      candidate.passwordHash ??
      (candidate as StoredUser & { passwordEntry?: string }).passwordEntry ??
      '',
    roles: candidate.roles ?? ['user'],
    workspaceId: candidate.workspaceId ?? randomUUID(),
    emailVerified: candidate.emailVerified ?? true,
    preferences: {
      theme: candidate.preferences?.theme ?? 'system',
      timezone: candidate.preferences?.timezone ?? 'UTC',
      locale: candidate.preferences?.locale ?? 'en-US',
    },
    aiSettings: {
      defaultModel: candidate.aiSettings?.defaultModel ?? 'AIO Ultra Reasoning',
      memoryEnabled: candidate.aiSettings?.memoryEnabled ?? true,
      autonomyLevel: candidate.aiSettings?.autonomyLevel ?? 'balanced',
    },
    notificationSettings: {
      emailAlerts: candidate.notificationSettings?.emailAlerts ?? true,
      pushAlerts: candidate.notificationSettings?.pushAlerts ?? true,
      securityAlerts: candidate.notificationSettings?.securityAlerts ?? true,
    },
    securitySettings: {
      mfaEnabled: candidate.securitySettings?.mfaEnabled ?? false,
      suspiciousActivityLock:
        candidate.securitySettings?.suspiciousActivityLock ?? true,
    },
  };
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
      this.configService.get<string>('ADMIN_PASSWORD') ?? DEFAULT_ADMIN_PASSWORD;

    await this.databaseService.mutate((draft) => {
      const existing = draft.users.find((user) => user.email === adminEmail);
      if (existing == null) {
        const adminUser = buildDefaultUser(
          adminEmail,
          DEFAULT_ADMIN_NAME,
          adminPassword,
        );
        adminUser.roles = DEFAULT_ADMIN_ROLES;
        adminUser.emailVerified = true;
        draft.users.push(adminUser);
      }

      draft.users = draft.users.map((user) => normalizeUser(user));
    });
  }

  async register(
    dto: RegisterDto,
    context: SessionRequestContext = {},
  ): Promise<AuthSessionResponse> {
    const users = await this.databaseService.list('users');
    if (users.some((user) => user.email === dto.email)) {
      throw new ConflictException('An account with that email already exists.');
    }

    const user = buildDefaultUser(dto.email, dto.name, dto.password);
    user.avatar = dto.avatar;

    await this.databaseService.mutate((draft) => {
      draft.users.push(user);
    });

    await this.monitoringService.recordAuditEvent({
      action: 'auth.register',
      actor: dto.email,
      resource: 'user',
      status: 'success',
      detail: 'Enterprise identity account created.',
    });

    return this.createSession(user, {
      ...context,
      rememberDevice: dto.rememberDevice,
      device: dto.device,
    });
  }

  async login(
    dto: LoginDto,
    context: SessionRequestContext = {},
  ): Promise<AuthSessionResponse> {
    const users = (await this.databaseService.list('users')).map(normalizeUser);
    const user = users.find((candidate) => candidate.email === dto.email);
    if (user == null || !verifyPassword(dto.password, user.passwordHash)) {
      await this.monitoringService.recordAuditEvent({
        action: 'auth.login',
        actor: dto.email,
        resource: 'session',
        status: 'failure',
        detail: 'Invalid credentials provided.',
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.monitoringService.recordAuditEvent({
      action: 'auth.login',
      actor: user.email,
      resource: 'session',
      status: 'success',
      detail: 'JWT session issued.',
    });

    return this.createSession(user, {
      ...context,
      rememberDevice: context.rememberDevice,
    });
  }

  async loginWithOAuth(
    dto: OAuthLoginDto,
    context: SessionRequestContext = {},
  ): Promise<AuthSessionResponse> {
    const provider = getOAuthProvider(dto.provider);
    const identity = provider.validateAuthorizationCode({
      code: dto.oauthCode,
      providerAccountId: dto.providerAccountId,
      email: dto.email,
      name: dto.name,
      avatar: dto.avatar,
    });

    let user = (await this.databaseService.list('users'))
      .map(normalizeUser)
      .find((entry) => entry.email === identity.email);

    const oauthAccounts = await this.databaseService.list('oauthAccounts');
    const existingOAuth = oauthAccounts.find(
      (entry) =>
        entry.provider === identity.provider &&
        entry.providerAccountId === identity.providerAccountId,
    );

    if (existingOAuth != null) {
      user = (await this.databaseService.list('users'))
        .map(normalizeUser)
        .find((entry) => entry.id === existingOAuth.userId);
    }

    if (user == null) {
      user = buildDefaultUser(
        identity.email,
        identity.name ?? identity.email,
        randomUUID(),
      );
      user.avatar = identity.avatar;
      user.emailVerified = true;

      await this.databaseService.mutate((draft) => {
        draft.users.push(user!);
      });
    }

    await this.databaseService.mutate((draft) => {
      const now = new Date().toISOString();
      const account = draft.oauthAccounts.find(
        (entry) =>
          entry.provider === identity.provider &&
          entry.providerAccountId === identity.providerAccountId,
      );
      if (account == null) {
        const oauthAccount: StoredOAuthAccount = {
          id: randomUUID(),
          userId: user!.id,
          provider: identity.provider,
          providerAccountId: identity.providerAccountId,
          accessToken: identity.accessToken,
          refreshToken: identity.refreshToken,
          createdAt: now,
          updatedAt: now,
        };
        draft.oauthAccounts.push(oauthAccount);
      } else {
        account.accessToken = identity.accessToken;
        account.refreshToken = identity.refreshToken;
        account.updatedAt = now;
      }
    });

    await this.monitoringService.recordAuditEvent({
      action: 'auth.oauth.login',
      actor: identity.email,
      resource: identity.provider,
      status: 'success',
      detail: 'OAuth identity linked and authenticated.',
    });

    return this.createSession(user, {
      ...context,
      rememberDevice: dto.rememberDevice,
      device: dto.device,
    });
  }

  async refresh(
    refreshToken: string,
    context: SessionRequestContext = {},
  ): Promise<AuthSessionResponse> {
    const payload = await this.jwtService
      .verifyAsync<JwtPayload & { type: 'refresh' }>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      })
      .catch(() => {
        throw new UnauthorizedException('Invalid refresh token.');
      });

    if (payload.type !== 'refresh' || payload.sessionId == null) {
      throw new UnauthorizedException('Invalid refresh token payload.');
    }

    const sessions = await this.databaseService.list('sessions');
    const session = sessions.find((entry) => entry.id === payload.sessionId);
    if (session == null) {
      throw new UnauthorizedException('Session not found.');
    }

    if (session.revokedAt != null || new Date(session.expiresAt).getTime() < Date.now()) {
      throw new UnauthorizedException('Session expired or revoked.');
    }

    if (session.token !== hashToken(refreshToken)) {
      await this.monitoringService.recordAuditEvent({
        action: 'auth.refresh',
        actor: payload.email,
        resource: session.id,
        status: 'failure',
        detail: 'Refresh token mismatch detected.',
      });
      throw new UnauthorizedException('Refresh token mismatch.');
    }

    const users = (await this.databaseService.list('users')).map(normalizeUser);
    const user = users.find((entry) => entry.id === session.userId);
    if (user == null) {
      throw new UnauthorizedException('User not found.');
    }

    const rotated = await this.rotateSessionTokens(user, session, {
      ...context,
      rememberDevice: session.rememberDevice,
    });

    await this.monitoringService.recordAuditEvent({
      action: 'auth.refresh',
      actor: user.email,
      resource: session.id,
      status: 'success',
      detail: 'Session tokens rotated.',
    });

    return rotated;
  }

  async logout(
    payload: JwtPayload,
    csrfToken: string,
    refreshToken?: string,
  ): Promise<{ loggedOut: true }> {
    const sessionId =
      payload.sessionId ??
      (refreshToken != null ? this.decodeSessionIdFromRefreshToken(refreshToken) : undefined);
    if (sessionId == null) {
      throw new BadRequestException('Session context is required to logout.');
    }

    const sessions = await this.databaseService.list('sessions');
    const activeSession = sessions.find((entry) => entry.id === sessionId);
    if (activeSession == null || activeSession.csrfToken !== csrfToken) {
      throw new UnauthorizedException('Invalid CSRF token.');
    }

    await this.databaseService.mutate((draft) => {
      const session = draft.sessions.find((entry) => entry.id === sessionId);
      if (session != null) {
        session.revokedAt = new Date().toISOString();
        session.updatedAt = session.revokedAt;
      }
    });

    await this.monitoringService.recordAuditEvent({
      action: 'auth.logout',
      actor: payload.email,
      resource: sessionId,
      status: 'success',
      detail: 'Session revoked and logged out.',
    });

    return { loggedOut: true };
  }

  async getSession(payload: JwtPayload): Promise<AuthSessionResponse['user']> {
    const users = (await this.databaseService.list('users')).map(normalizeUser);
    const user = users.find((entry) => entry.id === payload.sub);
    if (user == null) {
      throw new UnauthorizedException('Session user no longer exists.');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      roles: user.roles,
      workspaceId: user.workspaceId,
      preferences: user.preferences,
      aiSettings: user.aiSettings,
      notificationSettings: user.notificationSettings,
      securitySettings: user.securitySettings,
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

  listOauthProviders(): string[] {
    return listOAuthProviders();
  }

  private async createSession(
    user: StoredUser,
    context: SessionRequestContext,
  ): Promise<AuthSessionResponse> {
    const sessionId = randomUUID();
    const csrfToken = randomBytes(24).toString('hex');
    const rememberDevice = context.rememberDevice ?? false;
    const refreshExpiresIn = rememberDevice
      ? REFRESH_TOKEN_REMEMBER_TTL_SECONDS
      : REFRESH_TOKEN_TTL_SECONDS;

    const refreshPayload: JwtPayload & { type: 'refresh' } = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      sessionId,
      type: 'refresh',
    };

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: refreshExpiresIn,
    });

    const expiresAt = new Date(Date.now() + refreshExpiresIn * 1_000).toISOString();
    const session: StoredSession = {
      id: sessionId,
      userId: user.id,
      token: hashToken(refreshToken),
      expiresAt,
      device: context.device ?? 'unknown-device',
      ip: context.ip ?? 'unknown-ip',
      csrfToken,
      rememberDevice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.databaseService.mutate((draft) => {
      draft.sessions.unshift(session);
      draft.sessions = draft.sessions.slice(0, 2_000);
    });

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        roles: user.roles,
        sessionId,
      },
      { expiresIn: ACCESS_TOKEN_TTL_SECONDS },
    );

    return {
      accessToken,
      refreshToken,
      csrfToken,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      session: {
        id: sessionId,
        expiresAt,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        roles: user.roles,
        workspaceId: user.workspaceId,
        preferences: user.preferences,
        aiSettings: user.aiSettings,
        notificationSettings: user.notificationSettings,
        securitySettings: user.securitySettings,
      },
    };
  }

  private async rotateSessionTokens(
    user: StoredUser,
    session: StoredSession,
    context: SessionRequestContext,
  ): Promise<AuthSessionResponse> {
    const rememberDevice = context.rememberDevice ?? session.rememberDevice;
    const refreshExpiresIn = rememberDevice
      ? REFRESH_TOKEN_REMEMBER_TTL_SECONDS
      : REFRESH_TOKEN_TTL_SECONDS;

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        roles: user.roles,
        sessionId: session.id,
        type: 'refresh',
      },
      { expiresIn: refreshExpiresIn },
    );
    const expiresAt = new Date(Date.now() + refreshExpiresIn * 1_000).toISOString();
    const csrfToken = randomBytes(24).toString('hex');

    await this.databaseService.mutate((draft) => {
      const mutable = draft.sessions.find((entry) => entry.id === session.id);
      if (mutable == null) {
        throw new UnauthorizedException('Session no longer available.');
      }
      mutable.token = hashToken(refreshToken);
      mutable.expiresAt = expiresAt;
      mutable.csrfToken = csrfToken;
      mutable.rememberDevice = rememberDevice;
      mutable.updatedAt = new Date().toISOString();
      if (context.device != null) {
        mutable.device = context.device;
      }
      if (context.ip != null) {
        mutable.ip = context.ip;
      }
    });

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        roles: user.roles,
        sessionId: session.id,
      },
      { expiresIn: ACCESS_TOKEN_TTL_SECONDS },
    );

    return {
      accessToken,
      refreshToken,
      csrfToken,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      session: { id: session.id, expiresAt },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        roles: user.roles,
        workspaceId: user.workspaceId,
        preferences: user.preferences,
        aiSettings: user.aiSettings,
        notificationSettings: user.notificationSettings,
        securitySettings: user.securitySettings,
      },
    };
  }

  private decodeSessionIdFromRefreshToken(token: string): string | undefined {
    const payload = this.jwtService.decode(token) as
      | (JwtPayload & { sessionId?: string })
      | null;
    return payload?.sessionId;
  }
}
