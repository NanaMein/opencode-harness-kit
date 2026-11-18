# Harness Technician Requirements Manifest

## Scope

Add a read-only, iterative diagnostic specialist for unexpected behavior in
agents managed by `agent-architect`, then document the workflow and routing.

## Checklist

- [x] Add `.opencode/agents/harness-technician.md` with V2 fail-closed
  permissions, evidence-based diagnosis, correction handling, and a structured
  report.
- [x] Update `.opencode/agents/agent-architect.md` to invoke only the
  technician, pass a minimal context packet, review its findings, and enforce a
  three-pass limit with a human checkpoint.
- [x] Update `AGENTS.md` and `README.md` with the new escalation path and role.
- [x] Verify permission boundaries, handoff/loop behavior, documentation
  consistency, and the final diff.
