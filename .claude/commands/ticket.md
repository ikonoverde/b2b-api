---
name: jira-ticket
description: Work on a Jira ticket
model: opus
---

## Flow:

1. Fetch the jira issue details
2. Implement
    - Validate that is not implemented yet
        - **If not implemented**:
            - Switch to plan mode and plan the implementation
            - Implement
3. Move the jira issue to done
