# AI Harness Engineering Principles (Reference Notes)

## Core Equation: `Agent = Model + Harness`
Models provide raw reasoning capability, while the **harness** provides the operating environment: tool boundaries, context routing, state persistence, and verification sensors.

## 1. Feedforward Guides vs. Feedback Sensors
- **Guides (Feedforward):** Rules and constraints injected *before* the model acts (`AGENTS.md`, `SKILL.md`, strict type schemas, fail-closed `permissions`).
- **Sensors (Feedback):** Deterministic checks executed *after* the model acts (`pytest`, linters, LSP compiler diagnostics, and read-only `@code-reviewer` audits) to eliminate unverified "DONE" claims.

## 2. Progressive Disclosure (Context Hygiene)
- Keep `AGENTS.md` lean because it is injected into every session.
- Store deep domain rules and framework standards inside `.opencode/skills/<name>/SKILL.md` and `docs/` so OpenCode loads them only when relevant to the active task.

## 3. Maker vs. Checker Separation
- Separate the agent that writes code (`build`) from the agent that audits code (`@code-reviewer` with `edit: deny` and `shell: deny`) so fresh context catches blind spots.

## 4. Runtime State vs. Repository State
- Rely on OpenCode's native runtime for single-session history, context compaction, and `/undo` snapshots.
- Persist explicit state files on disk (`docs/plans/reqs-manifest.md`) only for complex, multi-session builds—because *"the agent forgets; the repository does not"*.
