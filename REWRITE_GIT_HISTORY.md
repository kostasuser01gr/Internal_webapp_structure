# Rewrite Git History — Remove Copilot Bot from Contributors

## Overview

This guide removes all Copilot / bot accounts from the repository's contributor list by rewriting git history. After completion, **only your GitHub account** will appear as a contributor.

## ⚠️ Risks

- **Destructive operation**: This rewrites ALL commit hashes. Any open PRs, branches, or forks will become incompatible.
- **Force push required**: You must have admin access and force push permissions on the `main` branch.
- **Collaborator impact**: Anyone who has cloned or forked this repo will need to re-clone after the rewrite.
- **Backup recommended**: Create a backup branch or clone before proceeding.

## Prerequisites

- Git 2.x+ installed
- `git-filter-repo` installed (recommended) — install via `pip install git-filter-repo` or `brew install git-filter-repo`
- Admin access to the repository on GitHub

---

## Step-by-Step Instructions

### Step 1: Clone a fresh full copy of the repository

```bash
git clone https://github.com/kostasuser01gr/Internal_webapp_structure.git
cd Internal_webapp_structure
```

### Step 2: Verify current contributors

```bash
git shortlog -sne --all
```

You should see entries like:
```
     N  K1 <75499796+kostasuser01gr@users.noreply.github.com>
     N  copilot-swe-agent[bot] <198982749+Copilot@users.noreply.github.com>
     N  GitHub <noreply@github.com>
```

### Step 3: Create a backup branch

```bash
git checkout -b backup-before-rewrite
git push origin backup-before-rewrite
git checkout main
```

### Step 4: Rewrite history using `git filter-repo` (Recommended)

The repository already contains a `.mailmap` file with all required identity mappings. Use it directly:

```bash
git filter-repo --mailmap .mailmap --force
```

### Step 4 (Alternative): Rewrite history using `git filter-branch` (Fallback)

If `git-filter-repo` is not available, use this fallback:

```bash
git filter-branch --env-filter '
CORRECT_NAME="Konstantinos Foskolakis - Full Stack Web Engineer (Certified by Micro1)"
CORRECT_EMAIL="75499796+kostasuser01gr@users.noreply.github.com"

export GIT_AUTHOR_NAME="$CORRECT_NAME"
export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
export GIT_COMMITTER_NAME="$CORRECT_NAME"
export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
' --tag-name-filter cat -- --branches --tags
```

### Step 5: Verify the rewrite

```bash
git shortlog -sne --all
```

You should now see only:
```
     N  Konstantinos Foskolakis - Full Stack Web Engineer (Certified by Micro1) <75499796+kostasuser01gr@users.noreply.github.com>
```

Also verify with the included verification script:
```bash
./scripts/verify-commit-metadata.sh
```

The script checks all author/committer names and emails across the entire history and reports any non-canonical identities.

### Step 6: Clean up

```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Step 7: Force push to origin

```bash
# If filter-repo removed the remote, re-add it:
git remote add origin https://github.com/kostasuser01gr/Internal_webapp_structure.git

git push --force origin main
```

### Step 8: Verify on GitHub

1. Visit: https://github.com/kostasuser01gr/Internal_webapp_structure
2. Check the **Contributors** section on the repository page
3. Confirm only your account appears

> **Note**: GitHub's contributor cache may take a few minutes to update. If the old contributors still appear, wait and refresh.

### Step 9: Clean up backup (Optional)

Once you've verified everything is correct:

```bash
git push origin --delete backup-before-rewrite
```

---

## Troubleshooting

- **`git filter-repo` not found**: Install with `pip install git-filter-repo`
- **Force push denied**: Check repository settings → Branches → Branch protection rules. Temporarily disable "Restrict force pushes" on `main`.
- **Contributors still showing**: GitHub caches contributor data. Wait 10-15 minutes and refresh. If still showing, push an empty commit: `git commit --allow-empty -m "refresh" && git push`
- **Open PRs broken**: After rewriting history, any open PRs will need to be recreated against the new history.
