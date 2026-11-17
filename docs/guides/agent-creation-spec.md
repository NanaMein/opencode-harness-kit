# OpenCode V2 Agent, Skill & Command Specification

> Authoritative syntax reference for `@agent-architect`. Always read this file before generating or editing anything inside `.opencode/`.

## 1. Custom Agents (`.opencode/agents/<agent-id>.md`)
- File path determines the agent ID (e.g., `.opencode/agents/code-reviewer.md` -> `@code-reviewer`).
- **CRITICAL V2 PARSER RULE:** Only use valid OpenCode V2 frontmatter keys: `description`, `mode`, `model`, `permissions`, `steps`, `hidden`, `color`, `disabled`, `request`.
- **NEVER** include deprecated V1 keys (`name`, `tools`, `permission`, `maxSteps`, `disable`) or arbitrary custom keys in agent Markdown frontmatter—unknown keys cause OpenCode V2 to ignore the `permissions` block.
- `permissions` MUST be an ordered YAML list of `{ action, resource, effect }` objects where **the last matching rule wins**.
- Valid `action` values: `"*"`, `"shell"`, `"edit"`, `"subagent"`, `"read"`, `"glob"`, `"grep"`, `"webfetch"`, `"websearch"`, `"skill"`, `"external_directory"`.
- Valid `effect` values: `"allow"`, `"ask"`, `"deny"`.

## 2. Agent Skills (`.opencode/skills/<skill-name>/SKILL.md`)
- Folder name must use lowercase alphanumeric characters and single hyphens (e.g., `.opencode/skills/my-skill/SKILL.md`).
- The filename MUST be uppercase `SKILL.md`.
- Frontmatter requires `name` (matching the directory name) and `description` (used by OpenCode for automatic on-demand discovery).

## 3. Custom Commands (`.opencode/commands/<command-name>.md`)
- Invoked in the OpenCode TUI via `/<command-name>`.
- Supports `$ARGUMENTS` placeholder and optional `agent:` frontmatter targeting a specific agent.
