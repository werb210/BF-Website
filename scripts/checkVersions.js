import { readFileSync } from 'node:fs';

const p = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const bad = [];

for (const [k, v] of Object.entries(p.dependencies || {})) {
  if (v.startsWith('^') || v.startsWith('~')) bad.push(`${k}:${v}`);
}

if (bad.length) {
  console.error('Non-exact versions:', bad);
  process.exit(1);
}
