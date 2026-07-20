import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { type JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      user?: JwtPayload;
    }>();
    const authorization = request.headers.authorization;
    const bearerToken =
      typeof authorization === 'string' && authorization.startsWith('Bearer ')
        ? authorization.slice('Bearer '.length).trim()
        : null;

    if (bearerToken != null && bearerToken.length > 0) {
      request.user = await this.authService.verifyAccessToken(bearerToken);
      return true;
    }

    const apiKeyHeader = request.headers['x-api-key'];
    const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;
    if (typeof apiKey === 'string' && apiKey.length > 0) {
      const payload = this.authService.validateApiKey(apiKey);
      if (payload != null) {
        request.user = payload;
        return true;
      }
    }

    throw new UnauthorizedException(
      'Authentication requires an Authorization bearer header or x-api-key header.',
    );
  }
}
