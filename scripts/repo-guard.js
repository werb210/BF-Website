#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const MAX_BYTES = 2 * 1024 * 1024;
const FORBIDDEN_DIRS = ['node_modules', 'dist', 'build', '.vite', '.next', 'out'];

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function getTrackedFiles() {
  const out = run('git ls-files -z');
  return out ? out.split('\0').filter(Boolean) : [];
}

function fail(message) {
  console.error(`\n❌ repo-guard failed: ${message}\n`);
  process.exit(1);
}

function main() {
  const tracked = getTrackedFiles();

  const forbiddenTracked = tracked.filter((file) =>
    FORBIDDEN_DIRS.some((dir) => file === dir || file.startsWith(`${dir}/`) || file.includes(`/${dir}/`)),
  );

  if (forbiddenTracked.length > 0) {
    fail(
      `forbidden tracked build/dependency paths detected:\n${forbiddenTracked
        .slice(0, 20)
        .map((f) => `  - ${f}`)
        .join('\n')}`,
    );
  }

  const oversized = [];
  for (const file of tracked) {
    const stat = fs.statSync(file);
    if (stat.size > MAX_BYTES) {
      oversized.push(`${file} (${(stat.size / (1024 * 1024)).toFixed(2)} MiB)`);
    }
  }

  if (oversized.length > 0) {
    fail(
      `tracked files exceed 2 MiB limit:\n${oversized
        .slice(0, 20)
        .map((f) => `  - ${f}`)
        .join('\n')}`,
    );
  }

  console.log('✅ repo-guard passed: no tracked dependency/build dirs and no files > 2 MiB.');
}

main();
