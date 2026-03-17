---
name: quality
description: "Run code quality checks: auto-formatting, linting, code smells, and complexity metrics. Use this skill whenever you finish writing or modifying code, before committing, when the user says 'run quality checks', 'check quality', 'check code quality', '/quality', 'run linting', 'check complexity', 'run metrics', or any variation of 'make sure the code is clean'. Also use proactively after completing any feature, bug fix, or refactoring task."
---

# Code Quality Checks

Run all quality gates in order. Each step must pass before moving on. If any step produces violations, fix them before proceeding to the next step.

## Step 1: Auto-format

```bash
qlty fmt
```

This rewrites files to match the project's formatting rules. No output means success.

## Step 2: Lint and auto-fix

```bash
qlty check --fix
```

If issues remain after auto-fix, manually resolve them. The goal is `✔ No issues`.

## Step 3: Code smells

```bash
qlty smells
```

Review any duplication or structural smells reported. Fix significant issues (high mass duplications, identical code blocks). Minor similarities can be noted but don't always need action.

## Step 4: Complexity metrics

Run the helper script to check function complexity against project thresholds. The script only reports functions that **exceed** the limits — if nothing is printed, everything passes.

### Backend (app/)
- Max cyclomatic complexity: **10**
- Max cognitive complexity: **15**

```bash
.claude/skills/quality/scripts/check-metrics.sh app/ 10 15
```

### Frontend (resources/)
- Max cyclomatic complexity: **15**
- Max cognitive complexity: **20**

```bash
.claude/skills/quality/scripts/check-metrics.sh resources/ 15 20
```

### Fixing violations

When the script reports violations, refactor those functions to reduce complexity:
- Extract helper methods/components for distinct logical blocks
- Replace nested conditionals with early returns or guard clauses
- Use lookup objects/maps instead of long switch/if-else chains
- Split large React components into smaller focused components

Only fix functions that you touched or that are directly related to your changes. Pre-existing violations in unrelated code should be reported to the user but not fixed without approval.

## Workflow

1. Run steps 1-4 in order
2. If steps 1-2 produce changes, re-check that tests still pass
3. Report a summary: which steps passed, what was fixed, and any remaining pre-existing violations in unrelated code