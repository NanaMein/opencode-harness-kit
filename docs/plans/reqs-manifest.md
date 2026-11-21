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

## Agent Feedback and Workflow-Friction Requirements

### Scope

Add proactive, evidence-based workflow-friction handling to primary agents
created by `agent-architect`, while preserving least-privilege boundaries and
keeping persistent instruction changes under architect and user control.

### Checklist

- [x] Add an always-loaded friction/feedback contract to agent-architect's
  primary-agent creation workflow.
- [x] Add an on-demand `agent-feedback` skill for user-facing triage, evidence
  categories, bounded thresholds, feedback interpretation, and scoped examples.
- [x] Extend harness-technician's read-only diagnosis to distinguish agent,
  permission/tool, provider/service, environment, verification, and intent
  issues.
- [x] Preserve permission boundaries; require explicit user direction to
  agent-architect for permission changes or persistent example updates.
- [x] Verify prompt consistency, threshold semantics, evidence handling, and
  documentation without changing unrelated files.
