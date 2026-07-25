# API

## Authentication

- `POST /auth/login` — legacy JWT login
- `GET /auth/profile` — legacy JWT-protected profile endpoint
- `POST /api/auth/register` — enterprise account registration + workspace initialization
- `POST /api/auth/login` — enterprise email/password login
- `POST /api/auth/oauth/login` — OAuth login for `google`, `github`, `microsoft`, `enterprise-sso`
- `POST /api/auth/refresh` — refresh token rotation
- `POST /api/auth/logout` — secure logout with CSRF token requirement
- `GET /api/auth/session` — active session profile
- `/v1/*` — requires either a bearer JWT in `Authorization` or an `x-api-key`

## Profile

- `GET /api/profile`
- `PUT /api/profile`
- `PUT /api/preferences`

## Projects

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `GET /api/projects/dashboard`

## Git workspace

- `POST /api/git/connect`
- `POST /api/git/init`
- `POST /api/git/commit`
- `POST /api/git/push`
- `POST /api/git/pull`
- `GET /api/git/history`

## Stable `/v1` endpoints

- `POST /v1/chat` — provider-routed chat completion
- `POST /v1/agents/run` — agent runtime execution
- `POST /v1/workflows/run` — workflow execution
- `POST /v1/projects` and `GET /v1/projects` — project persistence
- `POST /v1/search` — knowledge search
- `POST /v1/rag/query` — retrieval-augmented query
- `POST /v1/tasks` — orchestration task creation
- `POST /v1/files` and `GET /v1/files` — file record storage
- `POST /v1/vector/search` — vector-style knowledge lookup
- `POST /v1/memory` and `GET /v1/memory` — memory persistence

## Supporting routes

- `GET /health`
- `GET /model-router/providers`
- `GET /model-router/health`
- `GET /api/notifications`, `POST /api/notifications`, `PATCH /api/notifications/:id/resolve`
- `GET /api/audit`
- legacy project, memory, knowledge, agent, and orchestration routes remain available
