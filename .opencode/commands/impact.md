---
description: Create an impact analysis report of some given changes
---

## Changes

- If is not mentioned where to get the changes from, then use the currently staged changes
- If a PR is provided use gh to get the changes
- If a commit is given use gh to get the changes
- If a branch name in the form JMB-### is given look for a branch with that name and get the diff to master using gh

## Analysis

- Validate that the changes include changes from the app/ folder
  - If there are not changes inside the app/ folder there is nothing to validate
- Identify which routes will be potentially affected by the changes

## Report

- Generate a detailed report using the playground skill inside the impact/ folder
- Include mermaidjs mmd diagrams in the playground document
  - Add a sequence diagram for each of the potentially affected routes highlighting the areas were the changes are

## Mermaidjs

On the playground html add the mermaidjs library using:
```html 
<script type="module">
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: true });
</script>
```
To render the diagrams themselves use this format
```html
<pre class="mermaid">
    graph TD
    A[Client] --> B[Load Balancer]
    B --> C[Server01]
    B --> D[Server02]
</pre>
```
