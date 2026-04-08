#!/usr/bin/env bash
set -euo pipefail

if ! grep -Eq "['\"]node_modules['\"]" vitest.config.*; then
  echo "Invalid Vitest config: node_modules must be excluded"
  exit 1
fi

echo "Guard passed: node_modules exclusion is configured in Vitest"
