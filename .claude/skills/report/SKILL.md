---
name: report
description: Use when the user wants a status report on Ikonoverde's marketing baseline, or asks "how are we doing", "what do the numbers say", "give me a status report", "any traffic yet", "check GA4 and Instagram". Runs google-analytics and meta in parallel, returns provenance-tagged observed facts, and reports what moved since the last four reports. Not for deciding what to do about those facts — that is growth-strategy, reached through the campaign-proposal skill.
---

# Report

Produces a status report on Ikonoverde's marketing baseline by running two read-only observer agents in parallel. Nothing here decides anything, and nothing here writes anywhere.

## The two agents

`google-analytics` and `meta`. This pair, and nothing else.

Neither depends on anything. Both are read-only. Both mount stdio MCP servers with on-disk credentials, so they are the two agents whose tools reliably work — every other agent on this team mounts a Laravel HTTP MCP server behind `auth:api`, and a subagent spawns a fresh client with no cached OAuth token, so those tools silently never load. A report that cannot be trusted to have called its tools is not a report.

Run them together. They do not interact, and parallelism costs nothing.

They emit observed facts and nothing else — no recommendations, no readiness verdicts, no next steps. If a run comes back with either agent proposing an action, that is the agent exceeding its own prompt, and the proposal does not belong in the report. Drop it and say you dropped it.

## Read the last four reports before you run anything

Spawn the agents, and while they run, read the four most recent files in `context/report/` — newest first, by the date in the filename, excluding today's if one already exists. Fewer than four is normal; read what is there and say how many you found. Zero is also normal, and then this run is the first baseline and there is nothing to compare against — say that, in one line, rather than inventing a trend.

You read them for one reason: to say what moved. A single report is a photograph, and the user cannot tell from it whether the pixel started firing last week, whether the follower count is climbing from zero or sitting at it, or whether the GA4 filter is still Testing three reports later. Four reports make those visible, and surfacing them is the point of keeping the files.

Two rules keep this honest:

- **The prior reports are not a data source for today's numbers.** They record what was true when they were written. Every value in today's report comes from a tool call made today, and if an agent could not reach an account, that line is unreachable — you do not backfill it from last week's file. A number carried forward from an old report and printed as current is the worst thing this skill can produce.
- **A delta between two OBSERVED values is OBSERVED. Anything else is not.** If last week's follower count was ESTIMATED, or the account was unreachable, then there is no measured change — there is a gap, and you say so. Do not subtract an estimate from an observation and present the difference as movement.

## What this skill is not

It is not the front half of `campaign-proposal`. The waves in that skill exist to feed `keywords`, `growth-strategy`, and `paid-acquisition`; here there is no wave 1, and you must not add one. A status report that ends in a recommendation has quietly become a strategy document written by whoever happened to read the numbers.

If the user wants to know what to do about what they see, hand them to `campaign-proposal`. Do not answer it yourself, and do not let the report's closing paragraph answer it either.

## Every number will be zero, and every zero is correct

Ikonoverde has not launched. No traffic has been driven to the site, no sales have occurred, and the social accounts are at or near zero followers. GA4 will report zero or near-zero sessions. `marketing-sales-summary` returns zeros. Meta insights return zeros or empty results.

This is the single most important thing to get right in the report, because a table of zeros invites two opposite errors:

- Reading a zero as a defect. A zero `purchase` count is already fully explained by "nobody has bought anything." It carries no evidence that the pixel is broken. Only a browser can separate those, which is `conversion`'s job, not this skill's.
- Reading a zero as reassurance. A correctly firing pixel and a silently broken one produce identical GA4 reports on a store with no orders.

State the zeros. Say what each one is consistent with. Never say a zero means anything.

## Distinguish an observed zero from an unreachable account

A real zero and a tool that never loaded look identical downstream and mean opposite things. This is the failure mode the agents are each warned about, and the one you must not launder when you assemble their output.

Both agents open their reports with the tool calls they actually made. Carry that through. If `meta` never reached the Graph API, the report says the account was unreachable — not that the account has no posts. If either agent reports zeros it did not observe, that is a defect in the run, and rerunning is cheaper than publishing it.

## Provenance

Every claim carries its own tag, and the tag attaches to the value, not the paragraph:

```
OBSERVED   ga4.sessions = 32                    (property 540477820, Jun 9–Jul 9, unfiltered)
OBSERVED   ga4.purchase_events = 0
OBSERVED   ga4.internal_filter_state = <unknown — must check ACTIVE vs Testing>
OBSERVED   ig.followers = 0                      (account unreachable → say "unreachable", not 0)
ESTIMATED  ga4.sessions_are_internal ≈ all of them  (model priors; no filter state observed)
```

A change carries the provenance of the weaker of its two endpoints, and names both:

```
OBSERVED   ga4.sessions 32 → 41                  (+9 vs 2026-07-09; both OBSERVED)
OBSERVED   ga4.purchase_events 0 → 0             (unchanged across 3 reports)
UNKNOWN    ig.followers ? → 0                    (unreachable on 2026-07-09; no measured change)
```

A status report should be almost entirely OBSERVED. That is what distinguishes it from a conversation. If more than a line or two is ESTIMATED, say so at the top — the report is thinner than it looks.

## Two caveats that belong in every run

**The GA4 internal-traffic filter.** GA4 creates new filters in Testing state, where they silently do nothing. Until the filter is confirmed ACTIVE, every session in the property may be an admin or a developer, and the sessions count is a count of the team. `mcp__analytics-mcp` cannot read or write the filter state — it is an Admin console setting. Report it as unknown rather than omitting it, and hand it to a human.

**Your own test traffic.** Pre-launch, a handful of verification sessions is a large fraction of all data in the property. If anyone has been walking the funnel — `conversion` does exactly this — those sessions are in the numbers you are about to report. Say so.

## Transport

The agents deliver via `SendMessage`. Plain text only: tables and code blocks have repeatedly been lost in transit, arriving as a summary header over an empty body. Ask for prose and short labeled lines, and reformat into a table yourself once the values are in hand.

## The report

Open with what was reachable and what was not, and which prior reports you read (by date). Then the observed facts, tagged, grouped by source. Then **what changed** — every value whose prior reading you have, shown as `then → now`, including the ones that did not move. Then the two standing caveats. Then stop.

The change section is a log, not an argument. "Followers 0 → 3" is a fact. "Followers 0 → 3, so the Instagram push is working" is a causal claim you did not observe, and "purchases still 0 after four reports" is not evidence of a broken pixel any more than a single zero was — the store has had no orders to record. State the movement, name the window it happened in, and leave it there.

Unchanged is worth printing. Four reports of `purchase_events = 0` tell the user how long the store has been silent, and a filter that has read Testing since the first report is a stalled human action, not a number — flag it as still open rather than repeating the caveat as if it were new.

There is no closing recommendation. The user is looking at a pre-launch baseline, and the honest summary of it is that the numbers cannot yet tell them anything — which is worth one sentence, not a plan.

## Where it goes

Save the report as markdown to `context/report/YYYY-MM-DD.md`, named for today's date — `context/report/2026-07-09.md`. Show it to the user as well; writing the file is not delivering the report.

`/context` is gitignored (`.gitignore:40`). The file you write is the only copy, and it will not survive a fresh clone. So write the report to be read a year from now by someone with no memory of the run:

- Name the date range and the GA4 property inside the document. A file called `2026-07-09.md` says when the report was written, not what window it covers, and those diverge the moment anyone asks for last month's numbers.
- Keep the provenance tags in the saved file. Stripping them for readability is how an ESTIMATED number becomes a historical fact.
- Say which agents ran and which tools failed. A file recording zeros, with no note that the Graph API was unreachable, is worse than no file — it will be read as a measurement.
- Keep the change section in the saved file, and name the reports it compares against by date. The next run reads this file as one of its four, and a delta with no stated baseline cannot be chained.
- Write today's absolute values as absolute values. A file that records only "+9 sessions" is useless to the run four weeks from now that needs the number, not the difference.

Because each report is read by the next four, a laundered value does not just mislead once — it propagates. That is the reason the two rules above are rules.

If a report for today already exists, read it before writing. A second run supersedes the first only if the user says so; otherwise ask, because the two runs may have observed different things and the difference is the interesting part. If the user does say so, the superseded file is replaced, not appended to — and the four reports you compare against are still the four *previous* days, not this morning's run of the same day.
