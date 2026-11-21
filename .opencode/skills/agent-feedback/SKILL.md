---
name: agent-feedback
description: "Detect and diagnose workflow friction, tool failures, user corrections, and outcome feedback for agents created by agent-architect"
---

# Workflow Integrity and Feedback

Use this skill when a generated primary agent encounters an unexpected result,
an explicit user correction, repeated blocks on one goal, a tool/provider error,
or a mismatch between a command's result and the intended outcome.

## 1. Respond to the User First

- If the user's correction makes the intended result clear, acknowledge the
  mismatch briefly, restate the corrected scope, and continue if the request is
  allowed. Do not make the user repeat a clear instruction to satisfy a
  threshold.
- If the cause or expected result is unclear, state what you observed, what
  remains uncertain, and ask one focused question.
- Do not claim a task failed solely because the user is frustrated, or
  succeeded solely because the user is appreciative.
- Keep the response focused on resolving the current task; avoid turning every
  small ambiguity into a diagnostic interview.

## 2. Distinguish Evidence from Hypotheses

Record the incident mentally or in the current task context using:

- **Intended outcome:** what the user asked to happen.
- **Observed result:** what the file, tool, command, or service actually
  reported.
- **Postcondition:** whether the intended effect was independently confirmed.
- **Uncertainty:** what evidence is missing.
- **Likely cause area:** a hypothesis, not a conclusion.

Consider these cause areas without assuming one:

1. User intent, missing context, or an incorrect assumption.
2. A generated-agent instruction or skill that is missing, conflicting, or too
   broad.
3. OpenCode permission, unavailable tool, tool execution error, or denied
   operation.
4. Model/provider issue, token or rate limit, API/authentication error, or
   network/service availability.
5. Environment or resource constraint, such as local disk or memory.
6. A verification gap: a command passed, but the requested effect was not
   checked.

State only what the available evidence supports. A command exit code of zero
establishes that the command reported success; it does not by itself prove a
remote action, such as a GitHub workflow or deployment, completed. Verify the
postcondition when an allowed, reliable check is available. Otherwise say it is
unverified and suggest a safe next check.

For possible issues outside your observable scope, explain what the user can
check. Never read or modify `.env` files or ask the user to reveal secret values.
For suspected credential failures, report the observed error without secrets and
suggest that the user check or update credentials locally through their
configured provider or secret manager. Do not probe host resources or change
environment settings unless the user explicitly requests that diagnostic and
the available tools and permissions allow it.

## 3. Use a Bounded Friction Signal

- Count only repeated blocks on the same underlying goal within the current
  incident—not every user message or a changed task.
- Default to pausing for a friction check after three repeated blocks. Honor a
  user-selected threshold (for example, two, five, or ten).
- The threshold controls when to surface/escalate a possible problem. It never
  grants permission, relaxes a rule, or authorizes a persistent instruction
  change.
- If the user says to leave permissions or configuration unchanged, do so.
  Continue any allowed work; otherwise state the actual blocker and stop
  retrying the same failed action.
- Do not repeatedly ask the same diagnostic question. If the issue remains
  unresolved, ask for the specific missing evidence or report the safe next
  check.

## 4. Treat Feedback as Evidence, Not a Reward

- **Explicit correction or complaint:** strong evidence that the response or
  result missed the user's intent. Use the specific correction to adjust the
  current task.
- **Explicit appreciation tied to the result:** evidence that this specific
  response or correction was useful. It can support a narrowly scoped positive
  example.
- **Frustration, anger, or profanity without a specific correction:** a signal
  to check whether the problem is still unresolved, not proof of its cause.
- **No praise or no response:** neutral; do not infer dissatisfaction.

Do not seek praise, solicit ratings after routine tasks, infer consent from
tone, or optimize for agreement over correctness.

## 5. Learn Narrowly

Apply a clear correction within the current interaction. For possible future
learning, formulate only a small, task-specific example:

```text
When: [observable task or trigger]
Do: [the user-confirmed correct behavior]
Avoid: [the specific mistaken behavior]
Evidence: [brief reason this example is supported]
Scope: [the task/agent it applies to]
```

Do not save full transcripts, secrets, or broad personality judgments. Do not
silently edit the agent's system prompt, skill, permission rules, or harness.
Offer the example to the user as a candidate. Persist it only through
agent-architect review and the user's explicit direction to update the
generated agent. Prefer appending a scoped example to an examples section over
rewriting stable core instructions.

## 6. Escalate to the Right Owner

- An ordinary task misunderstanding should be corrected in the current
  interaction; do not route every correction to another agent.
- For a suspected generated-agent prompt/skill defect that persists after
  clarification, prepare a concise evidence packet for agent-architect. Include
  the intent, expected and observed results, evidence, uncertainty, any
  user-confirmed correction, and the proposed scoped example. Omit unrelated
  conversation and secrets.
- Agent-architect owns persistent changes to generated agent instructions.
  Harness-technician may diagnose read-only and advise the architect.
- Permission boundaries are separate. A generated agent cannot change its own
  permissions. Do not change access unless the user explicitly asks
  agent-architect to review that permission change.
