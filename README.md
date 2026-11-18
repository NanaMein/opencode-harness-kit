# OpenCode Harness Kit

A portable, fail-closed **AI Harness Engineering** configuration kit for **OpenCode V2**. Instead of treating an LLM coding assistant as an unconstrained code generator, this repository packages deterministic guardrails, progressive context routing, interactive harness scaffolding, and verification loops that can be injected into any project in seconds.

## Architecture Overview (`Agent = Model + Harness`)

```text
├── AGENTS.md                        # Always-loaded root contract & progressive disclosure router
├── opencode.jsonc                   # V2 fail-safe permissions (ask/deny) & secret protection
├── install.ts                       # Cross-platform Bun injector (Windows / macOS / Linux)
├── .opencode/
│   ├── agents/
│   │   ├── sandbox-runner.md        # Offline Docker execution subagent (.py, .ts, .js)
│   │   ├── agent-architect.md       # Edits .opencode/ & docs/; asks before AGENTS.md/opencode.jsonc
│   │   ├── harness-technician.md    # Read-only, iterative diagnosis for agent failures
│   │   └── code-reviewer.md         # Read-only diff reviewer with scoped git inspection
│   ├── commands/
│   │   ├── setup-harness.md         # /setup-harness -> starts discovery interview
│   │   └── verify.md                # /verify -> runs tests, linters & diff audit
│   └── skills/
│       ├── harness-discipline/      # On-demand guardrails for CrewAI, MAF, LangChain & LlamaIndex
│       └── verify-loop/             # Executable verification protocol to stop false-"DONE"
└── docs/
    ├── guides/                      # OpenCode V2 schema spec & Harness Engineering principles
    ├── templates/                   # Copy-ready V2 subagent & SKILL.md blueprints
    └── plans/                       # Externalized requirement manifests for multi-session tasks

```

## Key Harness Engineering Patterns Implemented

1. **Fail-Closed Capability Boundaries (`agent-architect`):**


* Uses OpenCode V2 ordered `{ action, resource, effect }` permission rulesets.


* `agent-architect` (`mode: primary`) can read the repository to detect your stack and write configs inside `.opencode/` and `docs/`, asks approval before touching `AGENTS.md` or `opencode.jsonc`, and is physically blocked from modifying application source code or executing shell commands.




2. **Progressive Disclosure Context Routing:**


* Keeps `AGENTS.md` lean to avoid context dilution while routing the model on demand to `docs/guides/` and `.opencode/skills/<name>/SKILL.md`.




3. **Maker vs. Checker Separation:**


* Separates code generation (`build`) from independent auditing (`@code-reviewer`, with edits denied and only scoped read-only git commands allowed) so fresh context catches bugs and contract drift.




4. **Iterative Agent-Failure Diagnosis (`@harness-technician`):**


* When an agent managed by `agent-architect` fails or behaves unexpectedly, the architect can send the read-only technician a focused packet with the user's intent, expected versus actual behavior, relevant evidence, and prior corrections. The technician returns evidence-backed hypotheses and a proposed minimal fix; the architect remains responsible for decisions and edits.


* Diagnosis is limited to three technician passes per incident. If the issue remains unresolved, the architect pauses for human review; another block requires the user's explicit approval and materially new context or evidence, preventing unattended, repetitive loops.




5. **Framework-Level Agent Discipline (`harness-discipline` skill):**


* Transfers the exact same harness principles—bounded loops, human-in-the-loop approval gates, Pydantic output contracts, and externalized state—into Python agent development with **CrewAI**, **Microsoft Agent Framework**, **LangChain**, and **LlamaIndex**.

6. **Decoupled Sandboxed Execution (`@sandbox-runner`):**
   - Separates LLM reasoning from untrusted script execution by routing `.py`, `.ts`, and `.js` verification into ephemeral, network-disabled (`--network none`), read-only, non-root Docker containers enforced via OpenCode V2 `shell` permission patterns.



## Quick Start

### Inject into Any Existing Project (Windows / macOS / Linux via Bun)

Run this from the root of any target repository:

```bash
bunx github:NanaMein/opencode-harness-kit

```

### Customize Your Project Harness

1. Launch `opencode` (v2.x) in your project root.


2. Press **`Tab`** to switch to **`agent-architect`** (or run `/setup-harness`).


3. Answer its 4 discovery questions so it tailors `AGENTS.md`, subagents, and skills to your repository.
4. If an architect-managed agent fails or behaves unexpectedly, return to `agent-architect` with the expected and actual behavior. It can consult `@harness-technician`; if unresolved after three diagnostic passes, it pauses for your review.
