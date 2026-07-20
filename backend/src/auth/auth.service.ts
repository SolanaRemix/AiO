import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scryptSync, timingSafeEqual } from 'node:crypto';
import { LoginDto } from './dto/login.dto';
import { type JwtPayload } from './interfaces/jwt-payload.interface';

/** Minimal in-memory user store for demo purposes.
 *  Passwords are stored as scrypt hashes (N=16384, r=8, p=1, keylen=64).
 *  Replace with a real UserService backed by a persistent store in production.
 *  Each entry uses the format "<hex-salt>:<hex-hash>". */
const DEMO_USERS: Record<string, { passwordEntry: string; roles: string[] }> = {
  'admin@aio.local': {
    passwordEntry:
      'aio-demo-salt:d0c0588f9ebf7d316f51fab49b9dfad5b48b1b06a2a7f489722a691a7ab822a992822ce98d7516ea970eefdcd86aaebb2fd3bccc9639df5537ef68a98d27b6f4',
    roles: ['admin'],
  },
};

function verifyPassword(password: string, entry: string): boolean {
  const separatorIdx = entry.indexOf(':');
  if (separatorIdx === -1) return false;
  const salt = entry.slice(0, separatorIdx);
  const storedHash = Buffer.from(entry.slice(separatorIdx + 1), 'hex');
  const incoming = scryptSync(password, salt, storedHash.length);
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
