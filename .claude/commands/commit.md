---
description: Generate a commit message based on the staged changes and commit the changes to the codebase.
model: claude-sonnet-4-6
---

## Process

1. Find the staged files.
2. Generate a commit message based on the staged changes.
    - List the main changes
3. Commit the changes to the codebase.

## Notes

- Never add watermarking to the commit message. (Generated with [Claude Code])
- Prefix the commit message with the name of the current branch
  - Do this only if the current branch is different from master
