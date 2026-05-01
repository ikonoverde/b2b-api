# Product

## Register

brand

## Users

The platform serves Ikonoverde's buyers in Spanish-speaking markets. Products are sold **both at wholesale volumes and in low (single-unit / small-quantity) orders** through the same storefront — the catalog and checkout must accommodate both shapes without forcing one audience through the other's flow. There are two distinct contexts:

**Primary — professional buyers (B2B).** Owners and purchasing managers at boutique hotels, spas, and massage parlors. They are repeat purchasers, not browsers. The defining job is *reordering known SKUs reliably* — the hero product is Ikonoverde's massage oil, ordered in volume on a recurring cadence. Their context is operational: between treatments, mid-shift, or at end-of-day inventory checks. Speed, predictability, and trust matter more than discovery.

**Secondary — individual buyers.** People who care about body-care quality and want professional-grade products at home. They purchase the same SKUs in low quantities (often a single unit) and tolerate slightly more browsing, but their session shape still resembles intent rather than entertainment. Pricing, minimums, and quantity selectors must support single-unit purchases cleanly alongside case/wholesale quantities.

Both audiences share one trait: they have already chosen Ikonoverde. The interface's job is to remove friction from that choice, not to re-sell it on every screen.

## Product Purpose

This is the storefront and account hub for **Ikonoverde** — a body-care brand whose hero product is a professional massage oil. It serves **both wholesale (B2B, case/volume) and low-quantity (individual, single-unit) orders** through a single catalog and checkout. The app is not the product; it is the channel through which the product is sold and reordered. Every surface carries Ikonoverde's identity, but the primary commercial goal is unambiguous: **drive recurring orders**, while keeping the low-quantity path frictionless for individual buyers.

Success looks like: shorter reorder cycles, higher first-to-second-order conversion, larger baskets per recurring buyer, and a self-service account experience that reduces manual support load. Discovery and acquisition matter, but they are downstream of retention.

## Brand Personality

**Clinical · precise · clean.**

Ikonoverde is a professional body-care brand, not a wellness lifestyle brand. The voice is confident, factual, and brief — closer to a laboratory product sheet than to a meditation app. It assumes the reader already values quality and does not need to be persuaded with sensory adjectives or aspirational copy.

Tone is **professional B2B**: dosages, formats, ingredients, lead times, case quantities, recurring-order terms. Sensorial and emotional language is allowed sparingly, where it carries information (a note on texture or absorption), never as decoration. Spanish copy is formal where appropriate (*usted* for buyer-facing transactional flows is acceptable; consistency matters more than the specific choice — pick one register and hold it).

Reference family: **Apothékary**, **Necessaire** — editorial restraint, generous whitespace, typographic confidence, botanical-clinical rather than spa-soft.

## Anti-references

Ikonoverde must explicitly NOT look like:

- **Etsy-rustic / artisanal-apothecary.** No kraft-paper textures, handwritten or hand-drawn scripts, twine, brown-paper aesthetics, mason jars, or "small-batch" visual tropes.
- **Generic Shopify wellness.** No sage-green gradients, no stock illustrations of leaves or droplets, no soft-radial backgrounds, no "calm pastel" palettes drifting toward mint and lavender.
- **Luxury-perfume cliché.** No black backgrounds with gold serifs, no all-caps wide-tracked logotypes used as decoration, no glossy "fragrance counter" affect.
- **Cold pharmacy.** Clinical does NOT mean hospital. No flat clinical-blue, no warning-yellow, no medical-device sterility. The clinical reference is a modern lab product sheet, not a prescription bottle.
- **Wellness-influencer / IG-aesthetic.** No serif-italic-on-cream "soft luxury" pastiche, no oversized lifestyle photography crowding out commerce, no testimonial carousels.
- **First-order green-and-cream reflex.** "Body care → cream background + sage green + thin serif" is the saturated category default. Ikonoverde's identity should hold even when those crutches are removed.

## Design Principles

1. **Reordering is the protagonist.** The interface's primary job is to make a known buyer's next order trivially fast. Surfaces, navigation, and component priority are evaluated against this. A beautiful catalog that buries reorder is a failure of design, not a stylistic choice.

2. **Restraint is the brand.** Ikonoverde's identity lives in whitespace, typographic precision, and material honesty — not in ornament. When in doubt, remove. Decoration that does not carry information is not on-brand.

3. **Clinical, not sterile.** Confident, factual, exact. But the surface is for human professionals, not equipment. Warmth comes from craft (typography, spacing, materials), never from softening the content.

4. **B2B utility outranks marketing polish.** Case quantities, unit prices, stock status, lead times, and account terms are first-class content. They are designed with the same care as the hero — not hidden behind tabs or accordions because they are "unsexy".

5. **Spanish first, English-ready.** Copy is written natively in Spanish with i18n-aware components: line-length budgets accommodate ~30% expansion for English, layouts do not break on longer strings, and no copy is baked into images or icons.

## Accessibility & Inclusion

- **WCAG 2.1 AA** is the baseline across all surfaces. Color contrast, focus indication, and keyboard reachability are non-negotiable on transactional flows (catalog → cart → checkout → account → reorder).
- **Color is never the sole carrier of meaning.** Stock status, order state, validation, and pricing tiers must also use icon, label, or position. The buyer audience skews older than typical D2C e-commerce; safelist for this.
- **Forms and tables are tested with keyboard-only and screen-reader flows**, especially the checkout and address book. These are the surfaces where accessibility failures cost real revenue.
- **Reduced-motion is honored.** Any motion added to enhance brand feel must degrade gracefully under `prefers-reduced-motion: reduce` without leaving content stranded.
- **Spanish-only today, bilingual-ready tomorrow.** No copy is hard-coded into images or sprite icons; component layouts tolerate ~30% string expansion for the eventual English locale.
