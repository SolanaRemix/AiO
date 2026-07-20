import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Global, Module } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { MonitoringService } from './monitoring.service';
import { RequestLoggingInterceptor } from './request-logging.interceptor';

@Global()
@Module({
  providers: [
    MonitoringService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [MonitoringService],
})
export class MonitoringModule {}
