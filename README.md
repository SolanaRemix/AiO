# AiO Enterprise v1.0.2 Stable

AiO is a monorepo AI operating system foundation with a Next.js enterprise workspace frontend and a NestJS backend that provides authentication, provider routing, orchestration, workflows, knowledge retrieval, memory, and project APIs.

## Monorepo layout

- `/frontend` — Next.js 14 App Router UI
- `/backend` — NestJS 11 API and runtime foundation
- `/docs` — architecture, API, SDK, deployment, and security docs

## Installation

```bash
npm ci
npm ci --prefix frontend
npm ci --prefix backend
```

## Environment setup

Backend runtime uses these core variables:

- `JWT_SECRET` — required in production
- `AIO_DATA_FILE` — optional JSON persistence file path
- `AIO_API_KEYS` — optional comma-separated `key:role1|role2` pairs
- `OPENAI_BASE_URL`, `OPENAI_API_KEY`
- `ANTHROPIC_BASE_URL`, `ANTHROPIC_API_KEY`
- `GOOGLE_BASE_URL`, `GOOGLE_API_KEY`

Example local backend values:

```bash
export JWT_SECRET=local-development-secret
export AIO_API_KEYS=local-key:admin|operator
export AIO_DATA_FILE=/absolute/path/to/backend/data/aio-enterprise.json
```

## Development workflow

```bash
npm run dev
```

This runs the Next.js frontend and NestJS backend together.

## Quality gates

```bash
npm run lint
npm run build
npm run test
npm run test --prefix backend
npm run test:e2e --prefix backend
```

## Architecture overview

- Auth: JWT login plus optional API key access for `/v1/*`
- Provider routing: persistent provider registry with fallback-aware AI routing
- Runtime: orchestration, workflow execution, agent planning, project and memory persistence
- Knowledge: document ingest, lexical/vector-style search, and RAG-style query composition
- Monitoring: request metrics, audit logs, provider health, and latency capture

## API overview

Primary stable API entrypoints live under `/v1`:

- `POST /v1/chat`
- `POST /v1/agents/run`
- `POST /v1/workflows/run`
- `POST /v1/projects`
- `POST /v1/search`
- `POST /v1/rag/query`
- `POST /v1/tasks`
- `POST /v1/files`
- `POST /v1/vector/search`
- `POST /v1/memory`

See `/docs/API.md` and `/docs/ARCHITECTURE.md` for details.
