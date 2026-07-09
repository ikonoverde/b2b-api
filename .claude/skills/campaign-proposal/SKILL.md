---
name: campaign-proposal
description: Use when the user wants to produce Meta or Google ad proposals for Ikonoverde, audit the marketing baseline, run the marketing agent swarm, or asks for "a campaign", "ad proposals", "marketing ideas", "what should we advertise", "run the marketing agents", or "should we start spending". Orchestrates google-analytics, meta, keywords, growth-strategy, and paid-acquisition in dependency order, carrying a provenance-tagged brief between them. Not for editing existing live campaigns — nothing here publishes to an ad platform.
---

# Campaign proposal

Produces reviewed, internal draft ad proposals for Ikonoverde by running five specialist agents in dependency order. Nothing in this skill publishes to Meta or Google Ads. The output is rows in `ad_proposals`, viewable at `/admin/ad-proposals`, for a human to approve.

## Why order matters

Four of the five agents declare upstream dependencies in their own prompts. `keywords` is told to validate against GA4. `growth-strategy` is told to delegate SEO to `keywords` and paid to `paid-acquisition`. `paid-acquisition` is told to gather campaign goal, tracking state, offer, and audience — nearly every item of which is another agent's output. `meta` is told to harvest audience language, which is the raw material for ad creative.

Run them in parallel and each one starts by guessing at inputs a sibling is computing at that same moment. A parallel run on 2026-07-09 produced Meta ad creative written without ever seeing the Instagram account, and a keyword list generated from model priors that landed in a proposal's `keywords` array looking like measured data.

## The waves

**Wave 0 — observe, in parallel.** `google-analytics` and `meta`.

Neither depends on anything. Both are read-only. Both mount stdio MCP servers with on-disk credentials, so they are the two agents whose tools reliably work. They emit observed facts and nothing else — no recommendations, no readiness verdicts.

Run these two together. They do not interact, and parallelism costs nothing.

**Wave 1 — `keywords`, serial.**

Receives the GA4 read. Now it can do what its prompt asks: validate landing pages and Search Console queries instead of producing volumes from priors. Emits keyword clusters, each tagged OBSERVED or ESTIMATED.

**Wave 2 — `growth-strategy`, serial.**

Receives everything so far. Does the one thing only it can do: decide whether paid is the right channel this quarter, and name the preconditions for spend. This is a gate on whether wave 3 runs at all.

**Wave 3 — `paid-acquisition`, serial, conditional.**

Runs only if wave 2 says paid is warranted. Receives the channel decision, the tracking state, the keyword clusters with provenance intact, and the audience language from `meta`. Drafts and saves proposals.

## What stays parallel, and why

Do not serialize wave 0. And understand what serializing costs you elsewhere.

On the 2026-07-09 run, three agents independently concluded "do not spend before conversion tracking works." That convergence was evidence — it meant the conclusion was robust rather than an artifact of one agent's framing. Chain them and the downstream agent inherits the upstream conclusion and restates it; you get the same sentence back and learn nothing.

You lose independent corroboration the moment one agent's reasoning enters another's context. So: **parallel where agents observe, serial where agents decide.** If a conclusion matters enough to want corroboration, ask two agents for it without letting them see each other.

## The brief

Sequencing is not the main safeguard. Provenance is.

Maintain one append-only brief that each wave reads and extends. Do not relay findings by hand between agents — hand-relaying is where caveats fall off, and the SendMessage transport has repeatedly delivered summary headers with empty bodies.

Every claim carries its own tag:

```
OBSERVED   ga4.sessions = 32                    (property 540477820, Jun 9–Jul 9, unfiltered)
OBSERVED   ga4.purchase_events = 0
OBSERVED   ga4.internal_filter_state = <unknown — must check ACTIVE vs Testing>
ESTIMATED  kw."aceite para masaje 5 litros".volume = low-med   (model priors; SEO tools 401)
ASSUMED    catalog.hero = 1 L, 5 L              (from brand context, unverified in production)
```

The tag attaches to the value, not the paragraph. An agent receiving this cannot launder ESTIMATED into OBSERVED, because the label travels with the number.

Watch the boundary where a tagged value enters an untagged structured field. When `paid-acquisition` copies an ESTIMATED keyword into a proposal's `keywords` array, the array cannot carry the tag — so the provenance must be restated in `assumptions`, naming the field it applies to. Otherwise a reviewer opening `/admin/ad-proposals` sees a keyword list, not a caveat.

## Before you start: check the tools are alive

Three of five agents mount Laravel HTTP MCP servers behind `auth:api` with `Mcp::oauthRoutes()` (see `routes/ai.php`). A subagent declaring `mcpServers:` in frontmatter spawns a fresh client with **no cached OAuth token** and its tools silently never load. The agent does not reliably notice.

Check each before running:

```bash
for p in ads marketing google-search images; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:8000/mcp/$p" \
    -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
    -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}')
  echo "mcp/$p -> $code"
done
```

401 means dead. Fix by running `/mcp` in the main session and authenticating that server. `meta` and `google-analytics` use stdio servers with credentials on disk and are unaffected.

If a server cannot be authenticated, run the wave anyway but record its outputs as ESTIMATED throughout. Do not skip the disclosure because the numbers look plausible.

## Verify what the agents claim

`paid-acquisition` reports `proposal_id`s from tool responses. Confirm the rows exist and honor the constraints the schema does not enforce:

```sql
SELECT id, platform, name, budget_amount, budget_period, currency, created_at
FROM ad_proposals ORDER BY id DESC LIMIT 5;

SELECT id, platform,
       keywords IS NULL AS kw_null,
       JSON_EXTRACT(creatives, '$[0].image_url') AS img0,
       JSON_LENGTH(assumptions) AS n_assumptions,
       tracking_plan IS NOT NULL AS has_tracking
FROM ad_proposals WHERE id > <baseline>;
```

Snapshot `MAX(id)` **before** wave 3. A poll issued before the writes land will show no rows and look like a failure; it is not. Do not ask the agent to retry on that evidence — a returned `proposal_id` is evidence *for* the write, and a reflexive retry produces duplicate drafts.

## Known schema traps

- **Schema bleed.** `AdProposalTool::schema()` returns one shared `AdProposalSchema::fields()` for both platforms, so `create-meta-ad-proposal` accepts `keywords` and `negative_keywords`. Nothing enforces platform separation. Instruct the agent explicitly and verify with SQL.
- **`objective` caps at 255 characters**, undocumented in the field description. A long objective fails validation and writes no row.
- **No image tool reaches `paid-acquisition` reliably**, and Meta creatives for a tactile product are usually video anyway — an image server produces stills. Expect `image_url: null` with a shot list in `image_notes`.

## Standing gates on spend

These outlive any single run. Carry them into every proposal's `assumptions`:

1. **`purchase` must have fired.** A firing `begin_checkout` does not prove `purchase` fires. Until a real test order reconciles across GA4, the ad platform, and the storefront database, the recommendation is zero pesos — not a smaller test.
2. **The GA4 internal-traffic filter must be ACTIVE, not Testing.** GA4 defaults new filters to Testing, where they do nothing. Admin and login sessions otherwise contaminate the denominator for the first and most valuable paid cohort.
3. **Keyword volumes must be measured before launch.** If the highest-confidence ad group turns out to have negligible volume, it cannot spend and the campaign structure needs rework.

## Ikonoverde constraints for creative

No wholesale gates, no minimums. Copy reframes `mayoreo` intent to *sin pedido mínimo*, *mismo precio para todos*, *compra desde una unidad* rather than promising tiered pricing. Precise Mexican Spanish. No hype, no miracle claims, no fake urgency.

Every creative claim must be physically true of the product — *sin residuo graso*, *deslizamiento prolongado*. If the oil does not do that on camera, the concept fails and the copy should not run anywhere. Shoot honestly; do not stage the towel test.
