import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { AuditService } from './audit.service';

@ApiTags('audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'List enterprise audit logs' })
  list(
    @Req() request: Request & { user: JwtPayload },
    @Query('limit') limit?: string,
  ) {
    if (!request.user.roles.includes('admin')) {
      throw new ForbiddenException('Audit logs are restricted to admin users.');
    }
    return this.auditService.list(limit == null ? 200 : Number(limit));
  }
}
