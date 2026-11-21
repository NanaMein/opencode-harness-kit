# OpenCode Harness Kit

> **"An agent is a model operating inside a harness."**

## Purpose of OpenCode Harness Kit

AI coding assistants have transformed software development, but without proper boundaries, an unconstrained model can also make critical errors — breaking codebases, introducing AI slop, hallucinating file paths, or violating module boundaries.

While Large Language Models provide powerful raw reasoning, the **harness** surrounds that model with runtime rules: specifying what tools it can call, which files it can touch, how context is delivered, when human approval is required, and how code is verified before being marked complete. Without harness engineering, achieving a reliable, ideal coding agent is nearly impossible.

---

## Why Harness Engineering Matters

Recent breakthroughs across the AI industry demonstrate that **changing the harness around a model dramatically improves agent performance without altering the model itself**:

- **LangChain's Benchmark Jump (Feb 2026):** LangChain upgraded the harness layer for its coding agent (`deepagents-cli`) — adding self-verification loops, context discovery middleware, and trace error analysis . Without changing the underlying model (`gpt-5.2-codex`), its benchmark score on **Terminal Bench 2.0 jumped 13.7 points (from 52.8% to 66.5%)**, propelling the agent from the Top 30 into the Top 5.
- **OpenAI's Harness Engineering Research (Feb 2026):** OpenAI published research on its internal Codex harness methodology (_"Harness engineering: leveraging Codex in an agent-first world"_), revealing that a small team of engineers shipped over 1,000,000 lines of production code with zero manually written source code by relying on declarative harness constraints, continuous integration validation, and automated feedback loops.

---

## The Core Philosophy: Turn Evidence Into Better Guardrails

In February 2026, Mitchell Hashimoto articulated the foundational discipline of AI harness engineering:

> _"Anytime you find an agent makes a mistake, you take the time to engineer a solution such that the agent never makes that mistake again."_

When an AI agent slips up, fixing the immediate code is only the first step. Observable evidence can help determine whether a reusable guardrail, automated check, subagent, or workflow change would reduce the chance of recurrence. Not every failure generalizes, and no harness can guarantee that an agent will never repeat a mistake: lasting lessons should be scoped, evidence-backed, reviewed, and verified.

---

## What OpenCode Harness Kit Provides

The **OpenCode Harness Kit** is a portable, fail-closed configuration kit for **OpenCode V2**. It enables you to inject a harness baseline into any repository in seconds, tailor it to the project, and handle workflow friction through bounded, evidence-based correction.
1. **Instant Zero-Copy Setup**

Deploy safe permissions, routing contracts, and baseline agents into any target project using a single command:
```bash
bunx github:NanaMein/opencode-harness-kit
```
2. **Fail-Closed Capability Boundaries**

Enforces ordered `{ action, resource, effect }` permissions:

- Restricts shell commands and web access to explicit human approval by default.
- Denies edits to .env secret files and protects sensitive configuration paths.
- Allows safe, read-only Git inspection commands (`git status`, `git diff`, `git log`) without prompt friction.

3. **Role-Separated Agents**

Divides responsibilities across specialized roles so no agent certifies its own work [4, 5]:

- **`agent-architect`** (Primary Meta-Agent): Interactively tailors subagents and skills strictly around your project scope and stack preferences via /setup-harness.
- **`@code-reviewer`** (Read-Only Checker): Audits diffs with strict `edit: deny` and `shell: deny` permissions to catch contract drift and bugs.
- **`@sandbox-runner`** (Isolated Execution): Runs `.py`, `.ts`, and `.js` verification scripts inside offline (`--network none`), read-only Docker containers.
- **`@harness-technician`** (Read-Only Diagnostician): Gives `agent-architect` evidence-based hypotheses and a proposed minimal fix for failures in architect-managed agents; it does not edit files or run commands.

4. **Evidence-Based Workflow Feedback & Bounded Correction**

Generated primary agents look for observable signs that the coding workflow may be off track:

- Signals include a user correction, repeated blocks on the same goal, tool or provider errors, output that misses the request, or a successful command whose intended result has not been verified. They prompt a curious, focused check—not an assumption that the agent or user is at fault.
- Clear corrections are handled immediately within the current task. If intent or cause is unclear, the agent separates observed facts from hypotheses and asks one focused question or suggests a safe next check. The default signal threshold is three repeated blocks on the same goal; the user can choose another threshold, and a clear correction does not have to wait for it.
- Ordinary application issues stay in the coding workflow. For a persistent issue in an agent created or managed by `agent-architect`, the user can bring the intended outcome, observed behavior, and relevant evidence to the architect. The architect may consult `@harness-technician`, then reviews the findings and remains responsible for decisions and edits.
- Technician diagnosis is limited to three passes per incident. If unresolved, the architect pauses for human review; continuing requires the user's approval and materially new evidence or corrected context.
- The agent may propose a narrow, evidence-backed lesson for future use, but it does not silently change its persistent instructions or permissions. Persistent instruction changes require the user's direction to `agent-architect`; permission changes require an explicit request and approval.

---

## **Prerequisites & Requirements**

Before using the OpenCode Harness Kit, ensure your environment has the following tools installed:

1. Bun (bun & bunx)
 - Harness Injector: Used to execute bunx github:NanaMein/opencode-harness-kit to instantly inject the configuration kit into target repositories without cloning.
 - CLI Installation: Can also be used to install OpenCode CLI globally (bun add -g opencode or bun i -g opencode).

2. Docker
 - Isolated Sandboxing: Required by @sandbox-runner to execute Python (.py), TypeScript (.ts), and JavaScript (.js) verification scripts inside offline (--network none) containers.
 - Protects your host system and prevents unverified agent scripts from polluting your workspace.

3. uv
 - Fast Python Package Manager: Required for ultra-fast Python environment creation and dependency resolution during sandboxed Python script execution and automated test runs.


---
## Quick Start

**Step 1: Inject the Harness**

Run the zero-dependency Bun installer inside any target repository (Windows, macOS, Linux):

```bash
bunx github:NanaMein/opencode-harness-kit
```

**Step 2: Tailor to Your Stack**

Launch OpenCode in your project root and switch to agent-architect (or run /setup-harness:)

```bash
opencode
```

Answer the discovery questions to generate subagents and skills tailored specifically to your project dependencies and conventions.

Step 3: Build, Verify, and Harden

- Use default `build` for implementation work.
- Run `/verify` to execute tests, linters, and trigger an independent `@code-reviewer` audit.
- Handle clear corrections in the current task. If an agent created or managed by `agent-architect` repeatedly behaves unexpectedly, bring the architect the intended outcome, what happened, and relevant evidence. The architect may consult `@harness-technician`; if unresolved after three diagnostic passes, it pauses for your review. Persistent instruction changes require your direction, and permission changes require an explicit request.


**Architecture Overview**

```text
Target Project Root
├── AGENTS.md                        # Always-loaded root contract & progressive disclosure router
├── opencode.jsonc                   # Fail-closed V2 permissions (ask/deny) & secret rules
├── install.ts                       # Cross-platform Bun injector (Windows / macOS / Linux)
├── .opencode/
│   ├── agents/
│   │   ├── agent-architect.md       # Primary meta-agent (scaffolds & prunes harness rules)
│   │   ├── code-reviewer.md         # Read-only diff auditor (edit: deny, shell: deny)
│   │   ├── sandbox-runner.md        # Offline Docker execution subagent and code sandboxing (.py, .ts, .js)
│   │   └── harness-technician.md    # Read-only, iterative diagnosis for agent failures
│   ├── commands/
│   │   ├── setup-harness.md         # /setup-harness -> discovery & scaffolding interview
│   │   ├── verify.md                # /verify -> tests, linters & code-reviewer audit
│   └── skills/
│       ├── agent-feedback/          # Evidence-based workflow-friction signals and correction guidance
│       ├── harness-discipline/      # Bounded execution rules for agentic frameworks
│       └── verify-loop/             # Executable verification protocol to prevent false "DONE"
└── docs/
    ├── guides/                      # OpenCode V2 syntax & harness engineering principles
    ├── templates/                   # Copy-ready V2 subagent & SKILL.md blueprints
    └── plans/                       # Externalized requirement manifests for multi-session tasks
```
