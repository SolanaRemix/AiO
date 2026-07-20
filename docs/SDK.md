# SDK Foundation

AiO v1.0.2 establishes backend service boundaries that can be exported into future SDK packages without replacing the current monorepo architecture.

## Current foundation areas

- auth
- model routing
- projects
- memory
- knowledge
- workflows
- orchestration
- monitoring
- connectors

## Packaging direction

If SDK packages are extracted later, they should mirror the existing service boundaries instead of creating duplicate systems:

- `@aio/core`
- `@aio/router`
- `@aio/agents`
- `@aio/workflows`
- `@aio/memory`
- `@aio/search`
- `@aio/storage`
- `@aio/auth`
- `@aio/monitoring`

The current code keeps these foundations inside the NestJS backend so the runtime remains cohesive and backward-compatible.
