import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scryptSync, timingSafeEqual } from 'node:crypto';
import { LoginDto } from './dto/login.dto';
import { type JwtPayload } from './interfaces/jwt-payload.interface';

const SCRYPT_KEYLEN = 64;

/** Minimal in-memory user store for demo purposes.
 *  Passwords are stored as scrypt hashes (N=16384, r=8, p=1, keylen=64).
 *  Each entry uses the format "<hex-salt>:<hex-hash>" with a unique salt per user.
 *  Replace with a real UserService backed by a persistent store in production. */
const DEMO_USERS: Record<string, { passwordEntry: string; roles: string[] }> = {
  'admin@aio.local': {
    passwordEntry:
      '597e66ccc8679cb575a8a85e31631004:70cfb5ee0639d275b550c9ce4d5966c743cff064e9407911e49be86e52bf3892def8f91b7471219e5562f3dacf57eb025f77870ea7c9d24dd17a6282cb1c0563',
    roles: ['admin'],
  },
};

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
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<{
    accessToken: string;
    user: { id: string; email: string; roles: string[] };
  }> {
    const user = DEMO_USERS[dto.email];
    if (!user || !verifyPassword(dto.password, user.passwordEntry)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: dto.email,
      email: dto.email,
      roles: user.roles,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
      },
    };
  }
}
