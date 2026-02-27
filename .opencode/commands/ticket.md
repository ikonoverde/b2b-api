---
description: Work on a GitHub ticket
---

## Flow:

1. Move the GitHub issue to "In progress"
2. Fetch the GitHub issue details `gh issue view #`
    - If the ticket references Requirements (prefix `REQ`, e.g. "REQ 1.5") or Use Cases (prefix `UC`, e.g. "UC-011"), use the `fetch-requirements` skill to retrieve their full details for additional context before planning
3. Implement
    - Validate that is not implemented yet
        - **If not implemented**:
            - Switch to plan mode and plan the implementation
            - Implement
4. Move the GitHub issue to "In review"

## Moving Issues on the Project Board

Project: `ikonoverde/projects/5` (ID: `PVT_kwDOBhlupc4BQP_u`)

### IDs

- **Status Field ID**: `PVTSSF_lADOBhlupc4BQP_uzg-bK3w`
- **Status Options**:
  | Status        | Option ID    |
  |---------------|--------------|
  | Backlog       | `f75ad846`   |
  | Ready         | `61e4505c`   |
  | In progress   | `47fc9ee4`   |
  | In review     | `df73e18b`   |
  | Done          | `98236657`   |

### Steps

1. **Get the project item ID** for the issue:
   ```bash
   gh project item-list 5 --owner ikonoverde --format json | jq -r '.items[] | select(.content.number == <ISSUE_NUMBER>) | .id'
   ```

2. **Update the status** using the item ID:
   ```bash
   gh project item-edit --project-id PVT_kwDOBhlupc4BQP_u --id <ITEM_ID> --field-id PVTSSF_lADOBhlupc4BQP_uzg-bK3w --single-select-option-id <OPTION_ID>
   ```

### Examples

Move issue #2 to "In progress":
```bash
ITEM_ID=$(gh project item-list 5 --owner ikonoverde --format json | jq -r '.items[] | select(.content.number == 2) | .id')
gh project item-edit --project-id PVT_kwDOBhlupc4BQP_u --id "$ITEM_ID" --field-id PVTSSF_lADOBhlupc4BQP_uzg-bK3w --single-select-option-id 47fc9ee4
```

Move issue #2 to "In review":
```bash
ITEM_ID=$(gh project item-list 5 --owner ikonoverde --format json | jq -r '.items[] | select(.content.number == 2) | .id')
gh project item-edit --project-id PVT_kwDOBhlupc4BQP_u --id "$ITEM_ID" --field-id PVTSSF_lADOBhlupc4BQP_uzg-bK3w --single-select-option-id df73e18b
```
