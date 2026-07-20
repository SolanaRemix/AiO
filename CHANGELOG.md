# Changelog

## v1.0.2 Stable

- Added persistent backend storage for projects, memory, knowledge, workflows, files, metrics, audit events, users, and provider registry state
- Replaced mock-only model routing with a configurable provider registry and fallback-aware AI router foundation
- Added authenticated `/v1` API gateway for chat, agents, workflows, projects, search, tasks, files, vector search, and memory
- Added workflow runtime, monitoring, connector interfaces, environment validation, and API key access support
- Added architecture, API, SDK, deployment, and security documentation
- Expanded backend test coverage with routing, workflow, and authenticated gateway integration tests
