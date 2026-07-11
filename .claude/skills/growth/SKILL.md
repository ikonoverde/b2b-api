---
name: growth
description: Use when the user wants to turn Ikonoverde's latest marketing baseline into concrete actions, or asks "what should we do now", "what's the plan", "give me next steps", "how do we grow", "turn the report into tasks". Reads the newest report in context/report/, runs growth-strategy against it, and writes the resulting actions and tasks to context/actions/. Not for producing the baseline itself — that is the report skill — and not for drafting ad creative, which is paid-acquisition.
---

# Growth

Turns an observed baseline into a written plan. One agent, `growth-strategy`, reads the most recent
report and decides what should be done. This skill records that decision as files on disk.

This is the skill `report` deliberately refuses to be. `report` ends without a recommendation on
purpose; here the recommendation is the entire product. Keep the two apart — the moment a status
report starts proposing actions, nobody can tell which numbers were measured and which were wanted.

## Read the report before you do anything else

`ls context/report/`, take the newest file by its date-stamped name, and read it in full.

**If `context/report/` is empty or missing, stop.** Do not run `growth-strategy`, and do not
substitute your own sense of where the business stands. Tell the user to run `/report` first, and
say why: a growth plan built on a baseline nobody observed is a list of things that sounded good on
the day it was written. The whole value of this skill is that its actions are traceable to a
measurement.

If the newest report is old — weeks, not days — say so before you spend an agent on it, and let the
user choose between planning against stale numbers and refreshing them.

## `growth-strategy` cannot read or write

Its entire toolset is `mcp__marketing` and `SendMessage`. It has no `Read`, no `Glob`, no `Write`.
This has three consequences you must design around, and every one of them has been gotten wrong:

- **It cannot open the report.** Paste the report's full text into the spawn prompt, verbatim.
  Do not summarize it first. A summary is you deciding what matters, which is the agent's job.
- **It cannot create the task files.** You write them, from what it sends back. The agent proposes;
  this skill files.
- **It cannot see `context/actions/`.** It does not know what was planned last time. If prior
  actions exist, put them in the prompt too, or it will cheerfully re-propose them.

## Make it call `mcp__marketing`. Do not tell it what will happen when it does.

`marketing` is a Laravel HTTP MCP server behind `auth:api`, and subagent mounts have historically
401'd. It is tempting to warn the agent about this. **Do not.**

On the 2026-07-09 run the spawn prompt said the calls would probably 401. The agent then reported —
at length, with three confident paragraphs of reasoning — that its marketing tools were absent from
its function set entirely, and built a plan around that constraint. The constraint was invented. The
tools were there the whole time. Both calls succeeded on the first try when it was asked to check.

This is the fabrication failure with its polarity reversed. The usual worry is an agent inventing
data to fill a hole. Here the agent invented the hole, and nothing in its reasoning flagged it,
because the story was coherent and the prompt had primed it. A warning about a failure mode is itself
a suggestion that the failure occurred.

So, in the spawn prompt:

- Hand it the exact loader: `ToolSearch` with query
  `select:mcp__marketing__marketing-product-catalog,mcp__marketing__marketing-sales-summary`.
- Require it to open its reply with the tool calls it made and what each returned.
- Say nothing about 401s, tokens, or what the failure will look like. Ask what happened, do not
  narrate what will happen.
- Tell it plainly: never invent a product list. If a call genuinely fails, say so and plan without
  the catalog. An invented catalog is worse than no catalog, because it reads as a real one.

If it reports the tools missing, **do not believe it.** Send it back to call them once and report the
literal result. If it comes back having invented catalog or sales figures, that run is defective.
Rerun it.

## The sales summary is fixtures. Quarantine it.

`marketing-sales-summary` reads the **local development database**. On 2026-07-09 it returned 2
orders, 2397.29 MXN revenue, and "Exfoliante Corporal" as top seller, over a window in which GA4
OBSERVED `purchase` = 0. Those are seeded rows on a laptop. They are not a contradiction with GA4 —
they are two systems describing two different realities.

No task may depend on them, and no number from them may reach a content brief or a campaign plan.
Record them once, labelled as fixtures, so nobody re-derives them later and mistakes them for a
finding.

The **catalog** is different and is usable with care. Names, SKUs, prices, categories, and description
text are almost certainly the production rows. `featured` flags and stock counts are the fields most
likely to be dev-local artifacts — carry them as unverified, and make confirming them somebody's
task rather than assuming either way.

## Almost everything here is ESTIMATED, and that is correct

`report` is a document that should be almost entirely OBSERVED. This one is the opposite: a plan is
by nature judgement, and nearly every line will be ESTIMATED. Do not treat that as a defect and do
not launder it into false confidence.

What must stay honest is the boundary. Facts carried in from the report keep their original tags —
an OBSERVED session count stays OBSERVED, and the GA4 internal-filter state stays *unknown*, not
"probably fine." Claims about the catalog or sales are OBSERVED only if `mcp__marketing` actually
returned them this run, and they describe the **local development database**, never the live
storefront. Everything else the agent says is ESTIMATED. Preserve the tags in the task files.

## Every number in the baseline is zero, and no task may pretend otherwise

Ikonoverde has not launched. The baseline reports a handful of sessions that are plausibly all
internal, one `add_to_cart`, one `begin_checkout`, zero purchases, one Facebook fan, zero Instagram
followers.

Those zeros support planning. They do not support *analysis*. A task that says "improve the
add-to-cart rate" or "investigate cart abandonment" has read a sample of one as a trend, and it will
send an agent chasing a pattern that does not exist. Reject any proposed task whose justification
requires a number in that report to mean something. Pre-launch work needs no data to justify it —
there is a catalog to write about and an audience that does not exist yet — and that is the work
this skill should be producing.

## The paid gate is the agent's to decide, not yours

`growth-strategy` owns the decision of whether paid acquisition is appropriate at all. Ask for that
verdict explicitly and separately from the action list.

If it says spend nothing yet, **write no `paid-acquisition` tasks**, and record the verdict and its
preconditions where the user will see them. Do not soften it into a small test. Do not create a
paid task because the roster of four agents looks unbalanced without one. Four channels is a menu,
not a quota — an action list that names three agents is a normal outcome, and an action list that
names one is a legitimate one.

If it clears the gate, carry its stated preconditions into the paid tasks themselves.

## Actions and tasks

An **action** is a goal worth pursuing. A **task** is one unit of work under it, assigned to exactly
one agent. An action has at least one task; several is normal.

Assign each task to the agent that would actually do it:

| Agent | Owns |
|---|---|
| `content` | blog posts, editorial planning, storefront copy |
| `keywords` | SEO research, search demand, content clusters |
| `paid-acquisition` | paid media, ad creative, campaign proposals |
| `social-media` | organic Facebook and Instagram, community management |
| `generic` | anything none of the four can do |

Those five strings are the only legal values for `agent`. `generic` is not a failure — it is the
honest label for work that needs a human, a developer, or an agent this team does not have, like
confirming the GA4 filter state in the Admin console. Reaching for the nearest-fitting specialist
instead of `generic` is how a task ends up assigned to an agent that cannot perform it, and it will
be discovered only when someone tries. Prefer `generic` when the fit is arguable.

Never assign to `meta`, `google-analytics`, `conversion`, or `brand`. The first two are read-only
observers, and the last two are gates that run against finished work rather than producing it.

## Where it goes

One file per task:

```
context/actions/<action-name>/<task-name>.md
```

Both slugs are lowercase kebab-case, ASCII, no spaces and no slashes. Derive them from the action
and task titles; keep them short enough to read in a directory listing.

Each file opens with frontmatter:

```markdown
---
name: Publish a product-education post on massage oil selection
agent: content
source_report: 2026-07-09.md
---
```

`name` is the human-readable task title. `agent` is one of the five strings above. `source_report`
names the baseline this task was reasoned from — it is not decoration. `/context` is gitignored
(`.gitignore:40`), so these files are the only copy and will not survive a fresh clone. A task found
a year from now with no idea which numbers produced it is a suggestion from a stranger.

Below the frontmatter, write the task so it can be executed without this conversation: what the work
is, what "done" looks like, and the tagged facts that motivate it. Carry the provenance tags across.
If a task depends on another finishing first, say so by name.

## Before you write

If `context/actions/` already has content, read it before writing anything. Overwriting a previous
plan silently destroys the only copy of it. Ask the user whether this run supersedes the last, and
if the two disagree about what matters, that disagreement is worth more than either plan alone.

## Finally

Show the user what you wrote: the actions, their tasks, the agent on each, and the paid gate
verdict in the agent's own terms. Writing the files is not delivering the plan.

Then stop. This skill plans; it does not execute. Do not spawn `content`, `keywords`,
`paid-acquisition`, or `social-media` to start on their tasks, and do not publish anything. The
files are the deliverable, and a human decides what happens to them.
