---
name: verify-loop
description: "Load before completing any code modification to enforce executable verification sensors and prevent false-DONE claims"
---

# Deterministic Verification Loop

Never report a coding task as complete based solely on writing or editing files.

1. **Identify the Oracle:** Locate the fastest deterministic check for the modified code (`pytest`, `unittest`, `ruff check`, `mypy`, `bun test`, `npm test`, or a targeted reproduction script).
2. **Execute & Observe:** Run the check and inspect the full exit code and stderr/stdout.
3. **Iterate on Failure:** If a check fails, fix the underlying bug rather than weakening or deleting tests, then re-run until green.
4. **Evidence Hand-Off:** Report the exact verification command run and its passing result in your final response.
