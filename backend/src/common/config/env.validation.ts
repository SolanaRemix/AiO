import { join } from 'node:path';

const DEFAULT_JWT_SECRET = 'aio-development-secret';

function parsePositiveNumber(
  value: unknown,
  fallback: number,
  fieldName: string,
): number {
  if (value == null || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} must be a positive number.`);
  }

  return parsed;
}

export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const nodeEnv =
    typeof config.NODE_ENV === 'string' ? config.NODE_ENV : 'development';
  const jwtSecret =
    typeof config.JWT_SECRET === 'string' && config.JWT_SECRET.trim().length > 0
      ? config.JWT_SECRET.trim()
      : nodeEnv === 'production'
        ? null
        : DEFAULT_JWT_SECRET;

  if (jwtSecret == null) {
    throw new Error('JWT_SECRET is required when NODE_ENV=production.');
  }

  return {
    ...config,
    NODE_ENV: nodeEnv,
    JWT_SECRET: jwtSecret,
    PORT: parsePositiveNumber(config.PORT, 3001, 'PORT'),
    PROVIDER_TIMEOUT_MS: parsePositiveNumber(
      config.PROVIDER_TIMEOUT_MS,
      15_000,
      'PROVIDER_TIMEOUT_MS',
    ),
    PROVIDER_CIRCUIT_BREAKER_THRESHOLD: parsePositiveNumber(
      config.PROVIDER_CIRCUIT_BREAKER_THRESHOLD,
      3,
      'PROVIDER_CIRCUIT_BREAKER_THRESHOLD',
    ),
    PROVIDER_CIRCUIT_BREAKER_COOLDOWN_MS: parsePositiveNumber(
      config.PROVIDER_CIRCUIT_BREAKER_COOLDOWN_MS,
      30_000,
      'PROVIDER_CIRCUIT_BREAKER_COOLDOWN_MS',
    ),
    AIO_DATA_FILE:
      typeof config.AIO_DATA_FILE === 'string' &&
      config.AIO_DATA_FILE.trim().length > 0
        ? config.AIO_DATA_FILE.trim()
        : join(process.cwd(), 'data', 'aio-enterprise.json'),
    AIO_API_KEYS:
      typeof config.AIO_API_KEYS === 'string' ? config.AIO_API_KEYS : '',
  };
}
