import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MonitoringService } from './monitoring.service';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<{
      method: string;
      originalUrl?: string;
      url?: string;
      user?: { email?: string; id?: string; sub?: string };
    }>();
    const response = httpContext.getResponse<{ statusCode: number }>();
    const startedAt = Date.now();

    return next.handle().pipe(
      finalize(() => {
        void this.monitoringService.recordApiRequest({
          method: request.method,
          path: request.originalUrl ?? request.url ?? 'unknown',
          statusCode: response.statusCode,
          latencyMs: Date.now() - startedAt,
          actor: request.user?.email ?? request.user?.id ?? request.user?.sub,
        });
      }),
    );
  }
}
