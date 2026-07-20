# AiO Architecture

## Current structure

AiO is a monorepo with a Next.js frontend in `/frontend` and a NestJS backend in `/backend`. Root scripts coordinate lint, build, test, and local development across both applications.

## Frontend architecture

The frontend uses the Next.js 14 App Router with Tailwind UI components. Pages under `/frontend/src/app` render the enterprise workspace, projects, memory, agents, and knowledge views. Most current UI surfaces are static presentation layers intended to consume backend APIs progressively.

## Backend architecture

The backend uses NestJS modules for:

- `auth` — JWT login, API key access, and user identity validation
- `model-router` — provider registry, health state, routing, fallback, retries, and embeddings
- `projects` — persistent project workspaces
- `memory` — persistent user/workspace/project memory records
- `knowledge-engine` — persistent document ingest, search, vector-style search, and RAG-style responses
- `agents` — agent registry, planning, execution, retry, and reporting foundation
- `orchestrator` — prompt-to-plan task orchestration
- `workflows` — sequential, parallel, conditional, approval, and event workflow execution
- `files` — persistent file metadata storage
- `monitoring` — request metrics, audit logs, provider outcomes, and error normalization
- `connectors` — connector interfaces and git repository connector foundation

## API routes

Legacy routes remain available under their existing controllers. Stable authenticated APIs are exposed under `/v1`.

## Database layer

The current persistence layer is a backend-managed JSON document store configured by `AIO_DATA_FILE`. It persists users, providers, projects, memory records, knowledge documents, workflows, workflow executions, file records, agent executions, audit logs, and request metrics.

## Authentication flow

`POST /auth/login` issues a JWT for the seeded admin user. `/v1/*` accepts either a bearer token or an `x-api-key` configured through `AIO_API_KEYS`.

## AI integration points

The model router maintains a provider registry for OpenAI-compatible providers and performs health-aware routing with retries, provider usage tracking, circuit breaking, and fallback behavior.

## Deployment structure

`docker-compose.yml` runs the frontend and backend together with PostgreSQL and Redis service placeholders. The backend itself now persists operational state through its configured data file unless a future database adapter replaces that layer.

## Environment requirements

Minimum backend configuration:

- `JWT_SECRET` in production
- optional `AIO_DATA_FILE`
- optional `AIO_API_KEYS`
- optional provider credentials and base URLs
