#!/usr/bin/env bash
# verify-commit-metadata.sh
# Verifies that all commits in the repository use the canonical author identity.
# Run after executing the history rewrite steps in REWRITE_GIT_HISTORY.md.
#
# Usage: ./scripts/verify-commit-metadata.sh

set -euo pipefail

CANONICAL_NAME="Konstantinos Foskolakis - Full Stack Web Engineer (Certified by Micro1)"
CANONICAL_EMAIL="75499796+kostasuser01gr@users.noreply.github.com"

echo "=== Commit Metadata Verification ==="
echo ""
echo "Expected identity:"
echo "  Name:  $CANONICAL_NAME"
echo "  Email: $CANONICAL_EMAIL"
echo ""

errors=0

echo "--- Checking author names ---"
non_canonical_authors=$(git log --all --format='%an' | sort -u | grep -v "^${CANONICAL_NAME}$" || true)
if [ -n "$non_canonical_authors" ]; then
  echo "FAIL: Found non-canonical author names:"
  echo "$non_canonical_authors" | sed 's/^/  - /'
  errors=$((errors + 1))
else
  echo "PASS: All author names match canonical identity."
fi
echo ""

echo "--- Checking author emails ---"
non_canonical_author_emails=$(git log --all --format='%ae' | sort -u | grep -v "^${CANONICAL_EMAIL}$" || true)
if [ -n "$non_canonical_author_emails" ]; then
  echo "FAIL: Found non-canonical author emails:"
  echo "$non_canonical_author_emails" | sed 's/^/  - /'
  errors=$((errors + 1))
else
  echo "PASS: All author emails match canonical identity."
fi
echo ""

echo "--- Checking committer names ---"
non_canonical_committers=$(git log --all --format='%cn' | sort -u | grep -v "^${CANONICAL_NAME}$" || true)
if [ -n "$non_canonical_committers" ]; then
  echo "FAIL: Found non-canonical committer names:"
  echo "$non_canonical_committers" | sed 's/^/  - /'
  errors=$((errors + 1))
else
  echo "PASS: All committer names match canonical identity."
fi
echo ""

echo "--- Checking committer emails ---"
non_canonical_committer_emails=$(git log --all --format='%ce' | sort -u | grep -v "^${CANONICAL_EMAIL}$" || true)
if [ -n "$non_canonical_committer_emails" ]; then
  echo "FAIL: Found non-canonical committer emails:"
  echo "$non_canonical_committer_emails" | sed 's/^/  - /'
  errors=$((errors + 1))
else
  echo "PASS: All committer emails match canonical identity."
fi
echo ""

echo "--- Summary (git shortlog -sne) ---"
git shortlog -sne --all
echo ""

if [ "$errors" -gt 0 ]; then
  echo "RESULT: $errors check(s) failed. History rewrite may be needed."
  echo "See REWRITE_GIT_HISTORY.md for instructions."
  exit 1
else
  echo "RESULT: All checks passed. Commit metadata is fully normalized."
  exit 0
fi
