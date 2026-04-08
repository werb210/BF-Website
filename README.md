# BF Website

## IMPORTANT

Dependencies must be installed locally:

npm ci --no-audit --no-fund

CI environments without registry access will skip build safely.

## Dependency Upgrade Policy

NEVER upgrade dependencies without all of the following:

1. Running `npm outdated`.
2. Running `npm audit`.
3. Opening a controlled upgrade pull request that documents the results and planned version changes.

## Git Rules

- NEVER push to main
- ALWAYS use feature branches
- ALL changes go through PR
- CI must pass before merge
- Force push is prohibited
