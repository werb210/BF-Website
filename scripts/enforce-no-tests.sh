#!/usr/bin/env bash
set -euo pipefail

echo "Checking for test files..."

# Block actual test files
if find src -type f \( -name "*.test.ts" -o -name "*.test.tsx" \) | grep -q .; then
  echo "Test files detected. This repo is build-only."
  exit 1
fi

echo "Checking for Vitest usage in source..."

# Only scan real source files (exclude noise)
if grep -R "vitest" src \
  --exclude-dir=node_modules \
  --exclude="*.lock" \
  --exclude="package-lock.json" \
  --exclude="pnpm-lock.yaml" \
  --exclude="yarn.lock" \
  | grep -q .; then
  echo "Vitest usage detected in source. Not allowed."
  exit 1
fi

echo "No test surface detected"
