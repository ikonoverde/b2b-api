---
name: growth
description: Use when the user wants to turn Ikonoverde's latest marketing baseline into concrete actions, or asks "what should we do now", "what's the plan", "give me next steps", "how do we grow", "turn the report into tasks", "update the plan". Reads the newest report in context/report/ and the existing plan in context/actions/, runs growth-strategy against both, then closes finished tasks, updates stale ones, and adds what is missing. Not for producing the baseline itself — that is the report skill — and not for drafting ad creative, which is paid-acquisition.
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

## Then read the existing plan, and find out what is actually done

Read every file under `context/actions/` in full, including the closed ones. This is not a courtesy
check for overwrites — it is half the input to the run. A growth plan that ignores the plan already
on disk is not a plan, it is the same four ideas re-derived every time somebody asks.

You cannot infer completion. Nothing in this repository executes these tasks, no agent writes back,
and a task file looks identical the day it is written and the day after the work ships. Silence is
not evidence of anything. There are exactly two things that can close a task:

- **The new report observed it.** If the baseline now OBSERVES `ig.display_name` = the brand name,
  then that half of `fix-the-profile-fundamentals.md` is done, and you can say so with a citation.
  This only works for the handful of tasks whose completion is visible in GA4 or the Graph API.
- **The user says so.** Everything else. Before you write anything, show the user the open tasks —
  one line each, grouped by action — and ask which are done, which are dead, and which have changed.
  Ask once, in a single message, not task by task.

If the user does not answer, the tasks stay open. Do not close a task because it feels stale, and do
not close one because the agent proposed something better. An open task nobody has done is an honest
record of work outstanding; a closed task nobody did is a lie the next run will act on.

## Close, update, add — do not overwrite

Three verbs, and a run usually needs all three.

**Close** a task by editing its frontmatter, never by deleting the file. Set `status: done` or
`status: dropped`, add `closed: YYYY-MM-DD`, and append a short `## Closed` section saying what
closed it — the report line that observed it, or the user's words. The file stays where it is.

Two reasons it stays. Tasks reference each other by filename (`Blocks
six-weeks-of-organic-content.md`), so a moved or deleted file silently breaks its neighbours. And
`/context` is gitignored, so the file is the only copy: a deleted task is a decision nobody can
reconstruct, and it will be re-proposed as a fresh idea on the next run because nothing remembers it
was killed. Delete a file only if the user explicitly asks, and say what you deleted.

**Update** a task in place when the work still stands but its reasoning has moved: refresh the
`source_report`, re-tag the facts in its `## Why` against the new baseline, sharpen the `## Done`
condition. Keep the filename and keep the task's identity. If the new thing is a different piece of
work, it is a new task with a new file, not the old one wearing its name — a task that changes what
it means while keeping its slug is how a plan quietly stops matching the files on disk.

**Add** what the new baseline and the agent's proposals justify, and nothing more. Before you write
a new file, check it is not an open task you have failed to recognise. Dedupe by intent, not by
title: "write a formats explainer" and "publish a page comparing professional formats" are one task,
and the one already on disk wins.

## `growth-strategy` cannot read or write

Its entire toolset is `mcp__marketing` and `SendMessage`. It has no `Read`, no `Glob`, no `Write`.
This has three consequences you must design around, and every one of them has been gotten wrong:

- **It cannot open the report.** Paste the report's full text into the spawn prompt, verbatim.
  Do not summarize it first. A summary is you deciding what matters, which is the agent's job.
- **It cannot create the task files.** You write them, from what it sends back. The agent proposes;
  this skill files.
- **It cannot see `context/actions/`.** It does not know what was planned last time. Paste the
  existing tasks into the prompt — name, agent, status, and enough of the body to be recognisable —
  or it will cheerfully re-propose every one of them as a fresh idea. Then ask it three questions
  explicitly: which open tasks the new baseline has made pointless, which need their reasoning
  updated, and what is genuinely missing. It will otherwise answer only the third, because "what
  should we do" reads as a request for new ideas, and you will get a plan that only ever grows.

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

The verdict lives in `context/actions/paid-gate.md`, and every run re-asks it rather than inheriting
it. Read the old verdict, pass it to the agent, and ask whether the new baseline changes it. Then
rewrite the file with today's verdict and keep the previous one underneath, dated — a gate that
opened is only meaningful next to the reason it was shut, and the preconditions it named are the
checklist somebody just satisfied. If the gate closes again after having been open, say so loudly
and mark any open `paid-acquisition` tasks `dropped`; leaving them open contradicts the verdict
sitting one directory above them.

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
| `generic` | an AI agent can do it, but none of the four above is the right one |
| `human` | it cannot be done by an AI agent at all |

Those six strings are the only legal values for `agent`.

The `generic`/`human` split is the one that carries information, so make it deliberately. `generic`
means the work is agent-shaped — reading, writing, querying, checking — and simply falls outside the
four specialists: mining conversation notes for phrasing, drafting a target list from a catalog.
Point it at a general-purpose agent and it will finish. `human` means no agent can do it, however
capable: photographing a real 5 L bottle, flipping the GA4 internal-traffic filter from Testing to
Active in the Admin console, renaming an Instagram account, signing off on a product claim,
telephoning a spa. The blocker is physical, or it is an account credential, or it is judgement and
liability that a person must own.

The distinction is not about difficulty and it is not about importance. Ask one question: if I spawn
an agent with the right tools and walk away, does this get done? If yes, `generic`. If it stalls
waiting on a body, a login, or a signature, `human`.

Getting this wrong is expensive in one direction and merely wasteful in the other. A `human` task
mislabelled `generic` will be handed to an agent that cannot do it, and the agent will not fail
cleanly — it will produce something adjacent and plausible, an AI-generated image standing in for a
product photograph, and that reaches a buyer as a claim about a physical object. A `generic` task
mislabelled `human` just sits in the queue waiting for a person who did not need to be involved.

Reaching for the nearest-fitting specialist instead of `generic` is how a task ends up assigned to an
agent that cannot perform it, and it will be discovered only when someone tries. Prefer `generic`
when the fit among the four is arguable, and prefer `human` when it is arguable whether any agent can
do it at all.

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
status: open
source_report: 2026-07-09.md
---
```

`name` is the human-readable task title. `agent` is one of the six strings above. `status` is
`open`, `done`, or `dropped`, and a closed task also carries `closed: YYYY-MM-DD`. `source_report`
names the baseline this task was reasoned from, and it is rewritten when the task is updated against
a newer one — it is not decoration. `/context` is gitignored (`.gitignore:40`), so these files are
the only copy and will not survive a fresh clone. A task found a year from now with no idea which
numbers produced it is a suggestion from a stranger.

Tasks written before `status` existed have none; treat a missing `status` as `open` and add the
field the first time you touch the file.

Tasks written before `human` existed used `generic` for both meanings. A legacy `generic` task is
therefore unclassified, not classified — re-ask the walk-away question against it rather than
trusting the label, and rewrite the field. The body usually gives it away: these files tend to open
by explaining, in prose, that the work needs a person, which is the label the frontmatter did not
have a word for.

Below the frontmatter, write the task so it can be executed without this conversation: what the work
is, what "done" looks like, and the tagged facts that motivate it. Carry the provenance tags across.
If a task depends on another finishing first, say so by name.

## When the two plans disagree

The agent will sometimes propose something that contradicts a task already on disk — a different
angle on the same product, a channel the last run rejected. That disagreement is worth more than
either plan alone, and it is not yours to settle by picking the newer one. Show the user both, say
which baseline each was reasoned from, and let them choose. Silently replacing last month's task
with this month's is how a plan loses the argument it was having with itself.

## Finally

Show the user the diff, not the plan: what you closed and on whose evidence, what you updated and
why, what is new, and what was left untouched. A run that changed nothing is a real outcome and
should be reported as one — it means the baseline moved less than the work outstanding.

Then the standing items: the actions, their tasks, the agent on each, and the paid gate verdict in
the agent's own terms. Writing the files is not delivering the plan.

Then stop. This skill plans; it does not execute. Do not spawn `content`, `keywords`,
`paid-acquisition`, or `social-media` to start on their tasks, and do not publish anything. The
files are the deliverable, and a human decides what happens to them.
