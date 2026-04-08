#!/usr/bin/env bash
set -euo pipefail

if find src -type f \( -name "*.test.ts" -o -name "*.test.tsx" \) | grep -q .; then
  echo "Test files detected. CI is build-only."
  exit 1
fi

if [ -f "vitest.config.ts" ]; then
  echo "Vitest config should not exist in this repo."
  exit 1
fi
