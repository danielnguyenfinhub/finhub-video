#!/usr/bin/env node
// Measures finhub-video for the refactor team: repomix token tree, repowise health,
// gitingest tree, and a content-hash scan for duplicated media. Writes only under --out.
// What each output means, and where the tools come from: ../SKILL.md
//
//   node .claude/skills/repo-audit-tools/scripts/audit.mjs [--media-root public] [--out out/refactor/raw]
//        [--only media,repomix,repowise,gitingest] [--min-size 65536] [--self-test]
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { closeSync, existsSync, mkdirSync, mkdtempSync, openSync, readdirSync, readSync, rmdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";

const opt = { "media-root": "public", out: "out/refactor/raw", only: "", "min-size": "65536" };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const key = argv[i].replace(/^--/, "");
  if (key === "self-test") opt[key] = true;
  else opt[key] = argv[++i] ?? "";
}
const OUT = resolve(opt.out);
const ONLY = opt.only ? opt.only.split(",") : ["media", "repomix", "repowise", "gitingest"];
const MIN = Number(opt["min-size"]);

// Tool locations: Daniel's local clones, run without a global install (see ../SKILL.md).
const uv = (clone, bin) => ["uv", "tool", "run", "--system-certs", "--from", clone, bin];
const REPOMIX = ["npx", "-y", "repomix@1.18.0"];
const REPOWISE = uv("C:/Users/Daniel/repowise", "repowise");
const GITINGEST = uv("C:/Users/Daniel/gitingest", "gitingest");

const status = {};

function sh(cmd, outFile) {
  // One command string: Node 24 deprecates an args array with shell:true (DEP0190). Quote only what has spaces.
  const line = cmd.map((a) => (a.includes(" ") ? `"${a}"` : a)).join(" ");
  const r = spawnSync(line, { shell: true, encoding: "utf8", maxBuffer: 1 << 28, timeout: 15 * 60_000 });
  if (outFile) writeFileSync(join(OUT, outFile), (r.stdout ?? "") + (r.status ? `\n[stderr]\n${r.stderr ?? ""}` : ""));
  if (r.status !== 0) {
    const tail = (r.stderr || r.stdout || "").trim().split("\n").slice(-3).join(" | ");
    throw new Error(`${cmd.join(" ")} -> exit ${r.status}: ${tail}`);
  }
  return r.stdout ?? "";
}

// Each tool: retry once, then skip with the error recorded, so one broken tool never blocks the audit.
function step(name, fn) {
  if (!ONLY.includes(name)) return;
  const t0 = Date.now();
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const extra = fn() ?? {};
      status[name] = { ok: true, seconds: Math.round((Date.now() - t0) / 1000), ...extra };
      console.log(`ok       ${name} (${status[name].seconds}s)`);
      return;
    } catch (e) {
      if (attempt === 2) {
        status[name] = { ok: false, error: String(e.message) };
        console.log(`skipped  ${name}: ${e.message}`);
      }
    }
  }
}

function md5(path) {
  const hash = createHash("md5");
  const fd = openSync(path, "r");
  const buf = Buffer.alloc(1 << 22);
  let n;
  while ((n = readSync(fd, buf)) > 0) hash.update(buf.subarray(0, n));
  closeSync(fd);
  return hash.digest("hex");
}

// Every file >= MIN bytes under root, grouped by content hash. Returns the duplicate groups, biggest waste first.
function scanDuplicates(root) {
  const byHash = new Map();
  let scanned = 0;
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) { if (entry.name !== "node_modules") walk(p); continue; }
      if (!entry.isFile()) continue;
      const size = statSync(p).size;
      if (size < MIN) continue;
      scanned++;
      const h = md5(p);
      if (!byHash.has(h)) byHash.set(h, { hash: h, size_mb: +(size / 1048576).toFixed(1), paths: [] });
      byHash.get(h).paths.push(relative(root, p).split("\\").join("/"));
    }
  };
  walk(root);
  const duplicates = [...byHash.values()]
    .filter((d) => d.paths.length > 1)
    .map((d) => ({ ...d, wasted_mb: +(d.size_mb * (d.paths.length - 1)).toFixed(1) }))
    .sort((a, b) => b.wasted_mb - a.wasted_mb);
  const wasted_mb = +duplicates.reduce((s, d) => s + d.wasted_mb, 0).toFixed(1);
  return { scanned, wasted_mb, duplicates };
}

if (opt["self-test"]) {
  // Smallest check that fails if the grouping breaks: two equal files and one different -> one group of two.
  const dir = mkdtempSync(join(tmpdir(), "audit-selftest-"));
  const big = "x".repeat(MIN + 1);
  writeFileSync(join(dir, "a.bin"), big);
  writeFileSync(join(dir, "b.bin"), big);
  writeFileSync(join(dir, "c.bin"), big + "y");
  const r = scanDuplicates(dir);
  if (r.scanned !== 3 || r.duplicates.length !== 1 || r.duplicates[0].paths.length !== 2) throw new Error(`self-test failed: ${JSON.stringify(r)}`);
  console.log("self-test ok");
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
const MEDIA = resolve(opt["media-root"]);

step("repomix", () => {
  const tree = sh([...REPOMIX, "--token-count-tree", "800", "--top-files-len", "40", "--style", "markdown", "-o", join(OUT, "repomix-pack.md")]);
  writeFileSync(join(OUT, "repomix-tree.txt"), tree);
});

step("repowise", () => {
  sh([...REPOWISE, "init", "--no-prose", "--no-claude-md", "--no-agents", "--no-codex", "-y", "."], "repowise-init.log");
  // Even with those flags, init wires repowise into the USER-level Claude Code settings and Claude Desktop
  // config and writes .mcp.json and .vscode/ here (checked on a scratch repo, 2026-09-26). Undo it every run.
  sh([...REPOWISE, "agents", "remove", "--target", "claude-code,vscode", "--scope", "both", "--format", "json", "."], "repowise-unwire.json");
  try { rmdirSync(".vscode"); } catch { /* not empty or already gone */ }
  sh([...REPOWISE, "health", "--format", "md", "--scope", "production", "."], "repowise-health.md");
  sh([...REPOWISE, "health", "--refactoring-targets", "--format", "md", "."], "repowise-targets.md");
  sh([...REPOWISE, "dead-code"], "repowise-dead-code.txt");
  sh([...REPOWISE, "doc-drift"], "repowise-doc-drift.txt");
});

step("gitingest", () => {
  sh([...GITINGEST, ".", "-o", join(OUT, "gitingest-digest.txt")]);
});

step("media", () => {
  if (!existsSync(MEDIA)) throw new Error(`media root not found: ${MEDIA}`);
  const r = scanDuplicates(MEDIA);
  writeFileSync(join(OUT, "media-duplicates.json"), JSON.stringify({ media_root: MEDIA, min_size_bytes: MIN, ...r }, null, 2));
  return { scanned: r.scanned, duplicate_groups: r.duplicates.length, wasted_mb: r.wasted_mb };
});

writeFileSync(join(OUT, "status.json"), JSON.stringify({ ran: new Date().toISOString(), cwd: process.cwd(), media_root: MEDIA, tools: status }, null, 2));
console.log(`wrote ${OUT}`);
