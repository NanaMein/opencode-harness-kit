# AGENTS.md — Repository Harness Contract

## 1. Core Operating Invariants
- **Clarify Before Guessing:** When requirements, architecture choices, or target files are ambiguous, stop and ask 2–4 concise clarifying questions before writing code.
- **No Unverified "DONE":** Never declare a task complete until relevant tests, type checks, or linters have been executed and verified.
- **Fail-Closed Discipline:** Never hardcode API keys or secrets (always use environment variables). Never bypass permission gates or modify `.env` files.
- **Minimal Blast Radius:** Touch only the files required for the current objective. Do not refactor unrelated modules unless explicitly asked.

## 2. Progressive Disclosure & Context Routing
- **Creating, Updating, or Removing Harness Files:** You MUST read `docs/guides/agent-creation-spec.md` BEFORE creating, modifying, or deleting any file in `.opencode/`, `AGENTS.md`, or `opencode.jsonc`.
- **Harness-Agent Failure Routing:** For failures or unexpected behavior in an agent managed by `agent-architect`, switch to `agent-architect` for diagnosis. It may consult the read-only `@harness-technician`; keep ordinary application bugs in the normal coding workflow.
- **Active Project Skills (`.opencode/skills/`):** Before writing or reviewing domain-specific code, inspect `.opencode/skills/` and load any `SKILL.md` relevant to the current task. Never assume a stack skill is permanent—skills can be added, updated, or removed as project needs evolve.
- **Optional Skill Blueprints (`docs/templates/skills/`):** When tailoring a repository harness (e.g., Python agent frameworks like CrewAI, Microsoft Agent Framework, LangChain, LlamaIndex, or web backends), promote matching blueprints from `docs/templates/skills/` into `.opencode/skills/<name>/SKILL.md` only when requested or detected.
- **Verification Loops:** Load the `verify-loop` skill (`.opencode/skills/verify-loop/SKILL.md`) before finishing non-trivial code edits.
- **Complex Multi-Session Tasks:** For features spanning multiple modules or sessions, persist a requirement checklist in `docs/plans/reqs-manifest.md` and update status after each verified step.

## 3. Maker vs. Checker Workflow
- Keep heavy codebase searches in read-only exploration (`@explore`) so the main reasoning context stays clean.
- After non-trivial code changes, delegate a final diff audit to `@code-reviewer` before finishing.
- Delegate standalone Python/TypeScript/JavaScript script creation and sandboxed test execution to `@sandbox-runner` so scripts are verified inside Docker without touching host `shell`.