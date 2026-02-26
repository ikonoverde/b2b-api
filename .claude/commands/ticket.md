---
description: Work on a GitHub ticket
model: opus
---

## Flow:

1. Move the GitHub issue to In progress
2. Fetch the GitHub issue details
    - If the ticket references Requirements (prefix `REQ`, e.g. "REQ 1.5") or Use Cases (prefix `UC`, e.g. "UC-011"), use the `fetch-requirements` skill to retrieve their full details for additional context before planning
3. Implement
    - Validate that is not implemented yet
        - **If not implemented**:
            - Switch to plan mode and plan the implementation
            - Implement
4. Move the GitHub issue to done In review
