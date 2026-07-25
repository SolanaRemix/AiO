# Changelog

## v1.0.4 Enterprise

- Added enterprise identity APIs with registration, OAuth provider support (Google/GitHub/Microsoft/Enterprise SSO), refresh token rotation, secure logout, session persistence, and profile-ready JWT claims
- Added profile and preferences APIs for avatar/name/email management, AI settings, notification controls, and security preferences
- Expanded project APIs with enterprise lifecycle states, completion tracking, dashboard data, alerts, timeline activity, and project update operations
- Added integrated Git workspace backend with provider adapter layer (GitHub/GitLab/Bitbucket), connect/init/commit/push/pull/history endpoints, encrypted credentials, and milestone commit automation
- Added notifications and audit endpoints for alert management and security event visibility
- Added frontend enterprise surfaces for Dashboard, Workflows, Git Workspace, Settings, Login/Register, Profile, Notifications, and Security Center
- Updated documentation and package versions for AiO Enterprise v1.0.4

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
