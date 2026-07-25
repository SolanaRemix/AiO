import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { type StoredUser } from '../database/database.types';
import { MonitoringService } from '../monitoring/monitoring.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly monitoringService: MonitoringService,
  ) {}

  async getProfile(userId: string): Promise<StoredUser> {
    const users = await this.databaseService.list('users');
    const user = users.find((entry) => entry.id === userId);
    if (user == null) {
      throw new NotFoundException('User profile was not found.');
    }
    return user;
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<StoredUser> {
    const users = await this.databaseService.list('users');
    const duplicate = users.find(
      (entry) => entry.email === dto.email && entry.id !== userId,
    );
    if (duplicate != null) {
      throw new ConflictException(
        'Email is already assigned to another account.',
      );
    }

    const updated = await this.databaseService.mutate((draft) => {
      const user = draft.users.find((entry) => entry.id === userId);
      if (user == null) {
        throw new NotFoundException('User profile was not found.');
      }

      if (dto.name != null) user.name = dto.name;
      if (dto.email != null) user.email = dto.email;
      if (dto.avatar != null) user.avatar = dto.avatar;
      user.updatedAt = new Date().toISOString();
      return user;
    });

    await this.monitoringService.recordAuditEvent({
      action: 'profile.update',
      actor: updated.email,
      resource: updated.id,
      status: 'success',
      detail: 'Profile metadata updated.',
    });

    return updated;
  }

  async updatePreferences(
    userId: string,
    dto: UpdatePreferencesDto,
  ): Promise<StoredUser> {
    const updated = await this.databaseService.mutate((draft) => {
      const user = draft.users.find((entry) => entry.id === userId);
      if (user == null) {
        throw new NotFoundException('User profile was not found.');
      }

      if (dto.theme != null) user.preferences.theme = dto.theme;
      if (dto.timezone != null) user.preferences.timezone = dto.timezone;
      if (dto.locale != null) user.preferences.locale = dto.locale;

      if (dto.defaultModel != null)
        user.aiSettings.defaultModel = dto.defaultModel;
      if (dto.memoryEnabled != null)
        user.aiSettings.memoryEnabled = dto.memoryEnabled;
      if (dto.autonomyLevel != null)
        user.aiSettings.autonomyLevel = dto.autonomyLevel;

      if (dto.emailAlerts != null)
        user.notificationSettings.emailAlerts = dto.emailAlerts;
      if (dto.pushAlerts != null)
        user.notificationSettings.pushAlerts = dto.pushAlerts;
      if (dto.securityAlerts != null)
        user.notificationSettings.securityAlerts = dto.securityAlerts;

      if (dto.mfaEnabled != null)
        user.securitySettings.mfaEnabled = dto.mfaEnabled;
      if (dto.suspiciousActivityLock != null) {
        user.securitySettings.suspiciousActivityLock =
          dto.suspiciousActivityLock;
      }

      user.updatedAt = new Date().toISOString();
      return user;
    });

    await this.monitoringService.recordAuditEvent({
      action: 'profile.preferences.update',
      actor: updated.email,
      resource: updated.id,
      status: 'success',
      detail: 'User preferences and settings updated.',
    });

    return updated;
  }
}
