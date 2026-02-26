---
name: jira-ticket
description: Work on a Jira ticket
model: opus
---

## Flow:

1. Fetch the jira issue details
    - If the ticket references Requirements (prefix `REQ`, e.g. "REQ 1.5") or Use Cases (prefix `UC`, e.g. "UC-011"), use the `fetch-requirements` skill to retrieve their full details for additional context before planning
2. Implement
    - Validate that is not implemented yet
        - **If not implemented**:
            - Switch to plan mode and plan the implementation
            - Implement
3. Move the jira issue to done
