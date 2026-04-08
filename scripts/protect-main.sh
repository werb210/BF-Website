#!/bin/bash

REPO="werb210/BF-Website"

gh api \
  -X PUT \
  repos/$REPO/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks.strict=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f enforce_admins=true \
  -f restrictions=null \
  -f allow_force_pushes=false \
  -f allow_deletions=false
