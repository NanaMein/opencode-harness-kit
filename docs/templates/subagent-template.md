---
description: "<Describe agent delegate primary should subagent the this to when>"
mode: subagent
steps: 15
permissions:
  - action: "*"
    resource: "*"
    effect: deny
  - action: read
    resource: "*"
    effect: allow
  - action: glob
    resource: "*"
    effect: allow
  - action: grep
    resource: "*"
    effect: allow
---

You are **<Agent Name Role>**. Follow `AGENTS.md` strictly.

## Objective
<Define narrow, of responsibility single-purpose subagent. the this>

## Output Contract
- Report findings clearly with exact file paths and line numbers.
- Do not modify files outside your explicit permission scope.
