#!/usr/bin/env bun
/**
 * Cross-platform OpenCode V2 Harness Kit Injector (Windows / macOS / Linux)
 * Usage:
 *   bun run https://raw.githubusercontent.com/NanaMein/OpenCode-Agent-Harness-Repo/main/install.ts
 *   bun run install.ts --target ../my-app --force
 */

import { existsSync } from "node:fs";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const DEFAULT_REPO = "NanaMein/OpenCode-Agent-Harness-Repo";
const DEFAULT_BRANCH = "main";
const HARNESS_MARKER = "## 2. Progressive Disclosure & Context Routing";

interface Options {
  repo: string;
  branch: string;
  target: string;
  force: boolean;
}

function parseArgs(args: string[]): Options {
  const opts: Options = {
    repo: process.env.OPENCODE_HARNESS_REPO || DEFAULT_REPO,
    branch: process.env.OPENCODE_HARNESS_BRANCH || DEFAULT_BRANCH,
    target: process.cwd(),
    force: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--repo" && args[i + 1]) opts.repo = args[++i];
    else if (arg === "--branch" && args[i + 1]) opts.branch = args[++i];
    else if (arg === "--target" && args[i + 1]) opts.target = resolve(args[++i]);
    else if (arg === "--force" || arg === "-f") opts.force = true;
  }
  return opts;
}

async function main() {
  const opts = parseArgs(Bun.argv.slice(2));
  const archiveUrl = `https://github.com/${opts.repo}/archive/refs/heads/${opts.branch}.tar.gz`;
  const tempRoot = join(tmpdir(), `opencode-harness-${crypto.randomUUID()}`);

  console.log(`\n🔧 Installing OpenCode V2 Harness Kit from ${opts.repo} (${opts.branch})...`);
  console.log(`📂 Target directory: ${opts.target}\n`);

  try {
    const response = await fetch(archiveUrl);
    if (!response.ok) {
      throw new Error(`Failed to download archive (${response.status} ${response.statusText}) from ${archiveUrl}`);
    }

    await mkdir(tempRoot, { recursive: true });
    const bytes = await response.arrayBuffer();

    // Bun.Archive natively extracts .tar.gz cross-platform (Windows, macOS, Linux)
    const archive = new Bun.Archive(bytes);
    await archive.extract(tempRoot);

    // GitHub tarballs extract into a single top-level folder like "<repo>-<branch>"
    const entries = await Array.fromAsync(new Bun.Glob("*").scan({ cwd: tempRoot, onlyFiles: false }));
    if (entries.length === 0) {
      throw new Error("Downloaded archive was empty.");
    }
    const extractedDir = join(tempRoot, entries[0]);

    // 1. Inject .opencode/ runtime payload (agents, commands, universal skills)
    const targetOpenCode = join(opts.target, ".opencode");
    await mkdir(targetOpenCode, { recursive: true });
    await cp(join(extractedDir, ".opencode"), targetOpenCode, {
      recursive: true,
      force: true,
    });
    console.log("✅ Synced .opencode/ (agents, commands, universal skills)");

    // 2. Inject docs/guides, docs/templates (including optional skill catalog), and docs/plans
    for (const sub of ["guides", "templates"]) {
      const srcSub = join(extractedDir, "docs", sub);
      if (existsSync(srcSub)) {
        const dstSub = join(opts.target, "docs", sub);
        await mkdir(dstSub, { recursive: true });
        await cp(srcSub, dstSub, { recursive: true, force: true });
      }
    }
    await mkdir(join(opts.target, "docs", "plans"), { recursive: true });
    console.log("✅ Synced docs/guides/, docs/templates/ (skill catalog), and docs/plans/");

    // 3. Create opencode.jsonc ONLY if no root OpenCode config exists
    const dstJsonc = join(opts.target, "opencode.jsonc");
    const dstJson = join(opts.target, "opencode.json");
    if (!existsSync(dstJsonc) && !existsSync(dstJson)) {
      await cp(join(extractedDir, "opencode.jsonc"), dstJsonc);
      console.log("✅ Created root opencode.jsonc (fail-closed V2 permissions)");
    } else {
      console.log("⏭️  Existing opencode.json(c) detected — left untouched.");
    }

    // 4. Create or safely append routing contract to AGENTS.md
    const srcAgents = join(extractedDir, "AGENTS.md");
    const dstAgents = join(opts.target, "AGENTS.md");
    if (!existsSync(dstAgents)) {
      await cp(srcAgents, dstAgents);
      console.log("✅ Created root AGENTS.md");
    } else {
      const existingContent = await readFile(dstAgents, "utf8");
      if (!existingContent.includes(HARNESS_MARKER)) {
        const harnessRules = await readFile(srcAgents, "utf8");
        await writeFile(dstAgents, `${existingContent.trimEnd()}\n\n---\n\n${harnessRules}`, "utf8");
        console.log("✅ Appended harness routing rules to existing AGENTS.md");
      } else {
        console.log("⏭️  AGENTS.md already contains harness routing rules — left untouched.");
      }
    }

    console.log("\n🚀 Harness ready! Next steps:");
    console.log("   1. Run `opencode` in your project root");
    console.log("   2. Press `Tab` to switch to `agent-architect` (or run `/setup-harness`)");
    console.log("   3. Answer its questions to activate only the skills & subagents your stack needs.\n");
  } finally {
    await rm(tempRoot, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((err) => {
  console.error(`\n❌ Install failed: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});