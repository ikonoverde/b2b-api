---
name: Fetch Requirements
description: >-
  This skill should be used when the user mentions requirement codes like
  "REQ 1.5", "REQ 2.5", "UC-001", "UC-011", or asks to "look up a requirement",
  "fetch the requirement", "show the use case", "get the spec for",
  or references SRS or use-case documentation by code. Also activates when
  working on Jira tickets that reference requirement codes, or when the user
  asks what a specific requirement or use case says.
---

# Fetch Requirements Documentation

Retrieve specific requirement or use-case sections from the project's specification documents by their codes.

## Document Locations

| Prefix | Document | Path |
|--------|----------|------|
| `REQ`  | Software Requirements Specification | `requirements/SRS.md` |
| `UC`   | Use Case Specification | `requirements/use-cases.md` |

## How to Fetch Requirements

### REQ Codes (e.g., REQ 2.5, REQ 1.8)

Search `requirements/SRS.md` for the section heading matching the code. Sections follow the pattern:

```
#### REQ {number} — {Title}
```

Use Grep to find the heading, then Read the section from that line through the next `---` or `####` delimiter.

**Example:** For `REQ 2.5`, search for `^#### REQ 2.5` in `requirements/SRS.md`.

### UC Codes (e.g., UC-001, UC-011)

Search `requirements/use-cases.md` for the section heading matching the code. Sections follow the pattern:

```
#### UC-{number}: {Title}
```

Use Grep to find the heading, then Read the section from that line through the next `---` or `####` delimiter.

**Example:** For `UC-011`, search for `^#### UC-011` in `requirements/use-cases.md`.

## Procedure

1. Parse the provided codes, identifying each as REQ or UC type.
2. For each code, use Grep with the appropriate pattern to find the line number:
   - REQ: `pattern="^#### REQ {number}"` in `requirements/SRS.md`
   - UC: `pattern="^#### UC-{number}"` in `requirements/use-cases.md`
3. Read from the matched line number to capture the full section (typically 20-30 lines for REQ, 30-50 lines for UC).
4. Present all requested sections to the user.

When multiple codes are requested, fetch them in parallel using multiple Grep/Read calls.

## Section Structure

**REQ sections** contain a markdown table with fields: ID, Name, Type, Priority, Description, Rationale, Acceptance Criteria, and optionally Satisfies/Refines/Derived From/Traces To.

**UC sections** contain: a metadata table (ID, Name, Actors, Priority), followed by Preconditions, Main Flow, Alternate Flows, Postconditions, optionally Business Rules, and Requirement Traceability.
