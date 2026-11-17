---
name: harness-discipline
description: "Load when building, modifying, or reviewing AI agent systems in Python (CrewAI, Microsoft Agent Framework, LangChain, LlamaIndex) to enforce production Harness Engineering guardrails"
---

# AI Harness Engineering Discipline (Python Agent Frameworks)

Apply these architectural guardrails whenever writing or auditing agentic workflows in **CrewAI**, **Microsoft Agent Framework (MAF)**, **LangChain**, or **LlamaIndex**:

## 1. Bounded Execution & Loop Control
- **No Infinite Loops:** Every agent, crew, or graph execution MUST define explicit `max_iter` / `max_steps` / recursion limits and timeout thresholds.
- **Doom-Loop Prevention:** Track repeated identical tool calls or consecutive validation failures and fail gracefully with structured error telemetry rather than retrying endlessly.

## 2. Fail-Closed Tooling & Human-in-the-Loop (HITL)
- **Least-Privilege Tool Scopes:** Grant each agent only the minimum tools required for its specific role. Separate read-only researcher/planner agents from mutating executor agents.
- **Approval Gates:** Any tool that mutates external state (database writes, emails, shell execution, cloud resource changes, financial actions) MUST require an explicit human approval interrupt/callback before execution.
- **No Hardcoded Secrets:** Load all model keys, endpoints, and connection strings from environment variables or secret managers—never hardcode credentials or commit `.env` files.

## 3. Typed Contracts & Deterministic Sensors
- **Structured Outputs:** Enforce Pydantic schemas (`output_pydantic` / `response_format`) on critical agent handoffs so downstream steps never parse brittle free-form text.
- **Independent Verification (Maker vs. Checker):** Never let the same agent instance self-certify high-stakes output without either a deterministic validator (schema check, unit test, compiler/linter) or an independent critic/evaluator agent.
- **Externalized State:** For multi-step workflows, persist checkpoint state and execution traces outside the LLM's context window so runs are auditable and resumable.
