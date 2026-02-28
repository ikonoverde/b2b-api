---
description: Work on a GitHub ticket
---

## Flow:

1. The user will provide an url in this forma `https://github.com/ikonoverde/b2b-api/issues/14` the last section is the ISSUE_NUMBER, in this example would be 14
2. Obtain the ITEM_ID with `gh project item-list 5 --owner ikonoverde --format json | jq -r '.items[] | select(.content.number == <ISSUE_NUMBER>) | .id'`
3. Move the GitHub issue to "In progress" using `gh project item-edit --project-id PVT_kwDOBhlupc4BQP_u --id <ITEM_ID> --field-id PVTSSF_lADOBhlupc4BQP_uzg-bK3w --single-select-option-id 47fc9ee4`
4. Fetch the GitHub issue details `gh issue view <ISSUE_NUMBER>`
    - If the ticket references Requirements (prefix `REQ`, e.g. "REQ 1.5") or Use Cases (prefix `UC`, e.g. "UC-011"), use the `fetch-requirements` skill to retrieve their full details for additional context before planning
5. Implement
    - Validate that is not implemented yet
        - **If not implemented**:
            - Switch to plan mode and plan the implementation
            - Implement
6. Move the GitHub issue to "In review" using `gh project item-edit --project-id PVT_kwDOBhlupc4BQP_u --id <ITEM_ID> --field-id PVTSSF_lADOBhlupc4BQP_uzg-bK3w --single-select-option-id df73e18b`

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
