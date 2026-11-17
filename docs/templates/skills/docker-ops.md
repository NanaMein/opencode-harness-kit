---
name: docker-ops
description: "Load when building, testing, or deploying multi-service applications with Docker and Docker Compose to enforce isolated container execution, health checks, and clean teardown"
---

# Docker Operations, Service Testing & Deployment Guardrails

> **Scope Boundary:** For running or testing standalone `.py`, `.ts`, or `.js` scripts in isolation, delegate to `@sandbox-runner` (offline `--network none`, read-only mount). Load this `docker-ops` skill only when managing multi-service `docker compose` stacks, databases, or deployment image builds.

Apply these rules whenever managing containers, `Dockerfile`s, or `docker-compose.yml` stacks:

## 1. Isolated Testing & Service Orchestration
- **Prefer Containerized Test Runs:** Run integration tests against ephemeral `docker compose` services (`docker compose -f docker-compose.test.yml up --build --abort-on-container-exit`) rather than polluting the host machine.
- **Mandatory Health Checks:** Never run test suites immediately after `docker compose up -d`. Wait for explicit `healthcheck` readiness or poll service ports before executing tests.
- **Clean Teardown:** Always tear down temporary test stacks and anonymous volumes (`docker compose down -v --remove-orphans`) once verification finishes so stale state never leaks across runs.

## 2. Safe Image & Deployment Practices
- **Least-Privilege Containers:** Production `Dockerfile`s MUST use pinned base image tags (never `:latest`), multi-stage builds, and a non-root `USER` directive.
- **Zero Secret Baking:** Never `COPY .env` or hardcode API keys inside a `Dockerfile` or `ARG`/`ENV` layer. Inject secrets strictly at runtime via environment files excluded in `.dockerignore`.
- **Human Gate on Production Pushes:** Never run `docker push`, `docker system prune -af`, or remote deployment commands without explicit human approval.

## 3. Verification Checklist
- [ ] `.dockerignore` excludes `.git`, `.env*`, `__pycache__`, `node_modules`, and `.opencode`
- [ ] Container builds cleanly with zero warnings (`docker build --no-cache`)
- [ ] Integration tests pass inside the container network and volumes are cleaned up afterward