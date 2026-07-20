import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, timingSafeEqual } from 'node:crypto';
import { LoginDto } from './dto/login.dto';
import { type JwtPayload } from './interfaces/jwt-payload.interface';

/** Minimal in-memory user store for demo purposes.
 *  Passwords are stored as SHA-256 hashes (hex).
 *  Replace with a real UserService + bcrypt comparison in production. */
const DEMO_USERS: Record<string, { passwordSha256: string; roles: string[] }> =
  {
    'admin@aio.local': {
      passwordSha256:
        '9a4aabf0e5cf71cae2cea646613ce7e2a5919fa758e56819704be25a3a2c1f0b',
      roles: ['admin'],
    },
  };

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  try {
    return timingSafeEqual(bufA, bufB);
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
    const incomingHash = hashPassword(dto.password);
    if (!user || !timingSafeStringEqual(user.passwordSha256, incomingHash)) {
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
