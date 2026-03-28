#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const MAX_IMAGE_SIZE = 500 * 1024;
const FORBIDDEN_DIRS = ['node_modules', 'dist', 'build', '.vite', '.next', 'out'];
const allowedRoots = ['src', 'public', 'scripts', '.github', '.githooks', 'client', 'docs', 'server', 'shared', 'tests', 'vendor'];
const LEGACY_SIZE_EXCEPTIONS = new Set([
  'client/public/icons/apple-touch-icon-180x180.png',
  'client/public/icons/icon-144x144.png',
  'client/public/icons/icon-192x192.png',
  'client/public/icons/icon-256x256.png',
  'client/public/icons/icon-512x512.png',
  'client/public/icons/maskable-icon-512x512.png',
  'client/public/images/100_100.png',
  'client/public/images/200_200.png',
  'client/public/images/300_300.png',
  'client/public/images/50_50.png',
  'client/public/images/ChatGPT Image Feb 3, 2026, 12_32_25 PM.png',
  'client/public/images/ChatGPT Image Feb 3, 2026, 12_34_39 PM.png',
  'client/public/images/ChatGPT Image Feb 3, 2026, 12_34_47 PM.png',
  'client/public/images/ChatGPT Image Feb 3, 2026, 12_34_50 PM.png',
  'client/public/images/ChatGPT Image Feb 3, 2026, 12_34_52 PM.png',
  'client/public/images/ChatGPT Image Feb 3, 2026, 12_35_04 PM.png',
  'client/public/images/ChatGPT Image Feb 3, 2026, 12_35_10 PM.png',
  'client/public/images/Favicon.png',
  'client/public/images/favicon.png',
  'client/public/images/header_white_transparent.png',
  'client/public/images/premium_photo-1661962673986-dcffa2a05e07.jpg',
  'client/public/images/tohcyytw4kftsfv6ivr2.jpg',
  'client/public/images/whiteboard-hero.jpg',
]);
const allowedRootFiles = new Set([
  '.dockerignore',
  '.editorconfig',
  '.env',
  '.env.example',
  '.eslintignore',
  '.eslintrc.cjs',
  '.gitattributes',
  '.gitignore',
  '.npmrc',
  '.nvmrc',
  'components.json',
  'Dockerfile',
  'drizzle.config.ts',
  'package-lock.json',
  'package.json',
  'postcss.config.cjs',
  'Procfile',
  'staticwebapp.config.json',
  'tailwind.config.ts',
  'tsconfig.json',
  'vite.config.ts',
]);

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

function hasAllowedRoot(file) {
  return allowedRoots.some((root) => file === root || file.startsWith(`${root}/`));
}

function isRootFile(file) {
  return !file.includes('/');
}

function main() {
  if (fs.existsSync('yarn.lock') && fs.existsSync('package-lock.json')) {
    fail('Multiple lockfiles detected');
  }

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

  for (const file of tracked) {
    if (file.startsWith('dist/')) {
      fail('dist must not be committed');
    }

    if (file.startsWith('node_modules/')) {
      fail('node_modules must not be committed');
    }

    if (!hasAllowedRoot(file) && !(isRootFile(file) && allowedRootFiles.has(file))) {
      fail(`Invalid root file: ${file}`);
    }

    if (file.match(/\.(mp4|mov|avi)$/i)) {
      fail(`Video files not allowed in repo: ${file}`);
    }

    if (file.match(/\.(psd|fig|sketch)$/i)) {
      fail(`Design files not allowed: ${file}`);
    }

    const { size } = fs.statSync(file);

    if ((file.endsWith('.png') || file.endsWith('.jpg')) && size > MAX_IMAGE_SIZE && !LEGACY_SIZE_EXCEPTIONS.has(file)) {
      fail(`Image too large: ${file}`);
    }

    if (size > MAX_FILE_SIZE && !LEGACY_SIZE_EXCEPTIONS.has(file)) {
      fail(`File too large (>1 MiB): ${file}`);
    }
  }

  console.log('✅ repo-guard passed: tracked files satisfy size, type, root-path, and lockfile constraints.');
}

main();
