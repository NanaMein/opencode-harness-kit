---
description: "Run deterministic verification checks (tests, linters, type checks) and audit recent changes"
---

Do NOT declare the current task done yet. Execute the repository's verification loop in order:
1. Detect and run the project's test suite, linter, and type checker (e.g., `pytest`, `ruff`, `mypy`, `npm test`, or `tsc`).
2. If any check fails, diagnose the root cause from the terminal output, fix it, and re-run until green.
3. Once all checks pass, invoke `@code-reviewer` on the current `git diff` and summarize the verification evidence.
Additional focus: $ARGUMENTS
