# Deployment

## Local development

```bash
npm ci
npm ci --prefix frontend
npm ci --prefix backend
npm run dev
```

## Docker Compose

```bash
export JWT_SECRET=replace-me
npm run docker:up
```

The compose file starts the frontend and backend containers and validates required backend environment variables.

## Validation before merge

```bash
npm run lint
npm run build
npm run test
npm run test:e2e --prefix backend
```

## Runtime notes

- Backend persistence is controlled by `AIO_DATA_FILE`
- Stable authenticated APIs live under `/v1`
- Provider routing activates only when at least one provider is enabled with valid credentials
