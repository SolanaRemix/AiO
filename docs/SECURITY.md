# Security

## Implemented baseline

- Helmet and compression middleware
- Global validation pipe with whitelist and non-whitelisted field rejection
- Throttler-based rate limiting
- JWT authentication and optional API key access for `/v1`
- Persistent audit log capture for login, workflow, and provider activity
- Request metric logging and normalized error responses
- Environment validation with production enforcement for `JWT_SECRET`

## Operational guidance

- Set a unique `JWT_SECRET` in production
- Rotate `AIO_API_KEYS` regularly if API key access is enabled
- Enable only trusted providers in the provider registry
- Store `AIO_DATA_FILE` on encrypted persistent storage
- Keep provider API keys outside source control and inject them via environment variables
