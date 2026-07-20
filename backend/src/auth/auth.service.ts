import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual } from 'node:crypto';
import { LoginDto } from './dto/login.dto';
import { type JwtPayload } from './interfaces/jwt-payload.interface';

/** Minimal in-memory user store for demo purposes.
 *  Replace with a real UserService + bcrypt comparison in production. */
const DEMO_USERS: Record<string, { password: string; roles: string[] }> = {
  'admin@aio.local': { password: 'ChangeMe123!', roles: ['admin'] },
};

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<{
    accessToken: string;
    user: { id: string; email: string; roles: string[] };
  }> {
    const user = DEMO_USERS[dto.email];
    if (!user || !timingSafeStringEqual(user.password, dto.password)) {
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
