# Changelog

## v1.0.3 Stable

- Added unified AI Integration Layer with a Provider Manager supporting registration, CRUD management, enable/disable, priority, health monitoring, latency tracking, cost estimation, usage analytics, automatic retries, fallback, and circuit breaker
- Added Deploy module with build, preview, production deployment, rollback, environment variable management, and secret management via dedicated REST endpoints and `POST /v1/deploy` gateway route
- Expanded Agent SDK with `Learn`, `Summarize`, and `Validate` operations exposed via `/agents/:id/learn`, `/agents/:id/summarize`, and `/agents/validate`
- Added provider management CRUD endpoints (`POST`, `PATCH`, `DELETE` `/model-router/providers/:id`) plus enable/disable actions
- Expanded Integration Hub connectors to include Documentation Platform, Database, Messaging Platform, and Cloud Object Storage alongside the existing Git Repository connector
- Added Connectors REST controller with list, health, sync, and search endpoints
- Added Deploy and Providers pages to the frontend with pipeline status, environment panels, provider registry, integration hub, and router dashboard views
- Updated sidebar navigation to include Deploy and Providers entries

## v1.0.2 Stable

- Added persistent backend storage for projects, memory, knowledge, workflows, files, metrics, audit events, users, and provider registry state
- Replaced mock-only model routing with a configurable provider registry and fallback-aware AI router foundation
- Added authenticated `/v1` API gateway for chat, agents, workflows, projects, search, tasks, files, vector search, and memory
- Added workflow runtime, monitoring, connector interfaces, environment validation, and API key access support
- Added architecture, API, SDK, deployment, and security documentation
- Expanded backend test coverage with routing, workflow, and authenticated gateway integration tests
