// Checks the WP9 split of AGENTS.md: every sentence (40+ characters) of the pre-split
// AGENTS.md must appear in AGENTS.md or docs/agents/*.md, or be listed with a reason in
// docs/audit/wp9-allowlist.txt; and every relative markdown link in those files must resolve.
// Usage: node scripts/check-agents-split.mjs [git-ref of the pre-split AGENTS.md]
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] ?? 'd269e59'; // origin/main just before the split
const ALLOW = 'docs/audit/wp9-allowlist.txt';
const norm = (s) => s.normalize('NFC').replace(/\s+/g, ' ').trim();

const files = ['AGENTS.md', ...readdirSync('docs/agents').filter((f) => f.endsWith('.md')).map((f) => `docs/agents/${f}`)];
const haystack = norm(files.map((f) => readFileSync(f, 'utf8')).join('\n'));

const old = execFileSync('git', ['show', `${BASE}:AGENTS.md`], {encoding: 'utf8'});
const sentences = old
	.split(/\n+|(?<=[.!?])\s+/)
	.map(norm)
	.filter((s) => s.length >= 40);

const allow = new Map();
if (existsSync(ALLOW)) {
	for (const line of readFileSync(ALLOW, 'utf8').split('\n')) {
		if (!line.trim() || line.startsWith('#')) continue;
		const [sentence, reason] = line.split('\t');
		if (!reason?.trim()) throw new Error(`${ALLOW}: no reason (tab-separated) for: ${sentence}`);
		allow.set(norm(sentence), reason.trim());
	}
}

const missing = sentences.filter((s) => !haystack.includes(s) && !allow.has(s));
const found = sentences.length - sentences.filter((s) => !haystack.includes(s)).length;
console.log(`sentences found verbatim: ${found}/${sentences.length}, allowlisted: ${sentences.length - found - missing.length}`);

const broken = [];
for (const f of files) {
	for (const [, target] of readFileSync(f, 'utf8').matchAll(/\]\(([^)\s]+)\)/g)) {
		if (/^[a-z]+:/i.test(target) || target.startsWith('#')) continue;
		const p = path.join(path.dirname(f), decodeURI(target.split('#')[0]));
		if (!existsSync(p)) broken.push(`${f}: ${target}`);
	}
}

for (const s of missing) console.log(`NOT FOUND: ${s}`);
for (const b of broken) console.log(`BROKEN LINK: ${b}`);
if (missing.length || broken.length) process.exit(1);
console.log('agents split ok');
