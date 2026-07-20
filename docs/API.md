# API

## Authentication

- `POST /auth/login` — returns `{ accessToken, user }`
- `GET /auth/profile` — JWT-protected profile endpoint
- `/v1/*` — requires either a bearer JWT in `Authorization` or an `x-api-key`

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
- legacy project, memory, knowledge, agent, and orchestration routes remain available
