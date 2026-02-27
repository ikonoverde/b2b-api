---
name: update-pages-report
description: Compare customer-facing pages between the mobile and API projects and update the @context/pages.md report.
---

## Process

1. Scan the mobile project at `/home/eric/projects/b2b/mobile/resources/js/pages/` for all customer-facing pages
2. Scan the API project at `/home/eric/projects/b2b/api/resources/js/Pages/` for all customer-facing pages
3. Compare the two lists and identify:
   - Pages that exist in both projects
   - Pages that exist in mobile but are missing in API
   - Pages that exist in API but not in mobile
4. Generate a comprehensive markdown report at `@context/pages.md` including:
   - Summary table with totals
   - Detailed list of mobile pages with implementation status in API
   - Detailed list of API pages
   - Missing pages categorized by priority (High/Medium/Low)
   - Implementation recommendations
   - File structure comparison
   - Backend requirements checklist
5. Save the report to `context/pages.md`
6. Update supermemory with key findings

## Notes

- Exclude admin-only pages from the comparison
- Focus on customer-facing functionality
- Categorize missing pages by priority level
- Include route information for each page
- Note any placeholder implementations (e.g., "Coming Soon")
