# Product

## Register

brand

## Users

The platform serves Ikonoverde's buyers in Spanish-speaking markets. Anyone can buy: there is no minimum quantity, no application gate, no separate "trade" track. Professionals and individuals walk into the same catalog, at the same prices, and out through the same checkout. The job of the interface is to make that path short and predictable for every visitor.

Buyers tend to share one trait — they have already chosen Ikonoverde, or are one search and one product page away from doing so. Many will return to reorder the same SKUs; others will buy a single unit. Both shapes are first-class. The catalog, product page, cart, and checkout must read as effortless whether the basket is one bottle or twenty.

The interface's job is to remove friction from a decision the buyer has largely already made, not to re-sell it on every screen.

## Product Purpose

This is the storefront and account hub for **Ikonoverde** — a body-care brand whose hero product is a professional massage oil. The app is not the product; it is the channel through which the product is sold. Every surface carries Ikonoverde's identity, but the primary commercial goal is unambiguous: **drive sales**. Purchases must be easy and painless — from landing, to product, to cart, to paid order — with the fewest possible steps, the clearest possible prices, and no artificial gates (no minimum quantities, no account-required browsing, no hidden costs at checkout).

Success looks like: higher conversion from landing to first order, higher add-to-cart rate on product pages, lower cart abandonment, fewer support contacts about "how do I buy this," and repeat orders that happen because reordering is trivial — not because the buyer is locked in. Discovery and retention both matter, but every screen is evaluated against one question first: *does this make buying easier, or harder?*

## Brand Personality

**Clinical · precise · clean.**

Ikonoverde is a professional body-care brand, not a wellness lifestyle brand. The voice is confident, factual, and brief — closer to a laboratory product sheet than to a meditation app. It assumes the reader already values quality and does not need to be persuaded with sensory adjectives or aspirational copy.

Tone is **professional and precise**: dosages, formats, ingredients, lead times, unit prices, stock status. Sensorial and emotional language is allowed sparingly, where it carries information (a note on texture or absorption), never as decoration. Spanish copy is formal where appropriate (*usted* for buyer-facing transactional flows is acceptable; consistency matters more than the specific choice — pick one register and hold it). Nothing in the copy should imply a quantity floor, a tier qualification, or a customer class — every buyer reads the same prices and goes through the same checkout.

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

1. **Buying is the protagonist.** Every surface is evaluated against one question: does it shorten the path from landing to paid order? Catalog, product page, cart, and checkout are the spine of the app — anything that gets in front of them (modals, gates, marketing copy, decorative chrome) must justify itself or be removed. Reordering is a fast-path *of* this same flow, not a separate flow.

2. **No artificial gates.** Prices are visible without an account. The cart accepts a single unit as readily as a case. There is no minimum quantity, no "request a quote," no tier qualification. If a screen looks like it might be asking the buyer to prove they belong, redesign the screen.

3. **Restraint is the brand.** Ikonoverde's identity lives in whitespace, typographic precision, and material honesty — not in ornament. When in doubt, remove. Decoration that does not carry information is not on-brand.

4. **Clinical, not sterile.** Confident, factual, exact. But the surface is for humans, not equipment. Warmth comes from craft (typography, spacing, materials), never from softening the content.

5. **Transactional facts are first-class content.** Unit prices, stock status, lead times, shipping cost, and total-with-tax are designed with the same care as the hero — never hidden behind tabs or surfaced only at the last step of checkout. Surprise at checkout is the single biggest cause of abandonment; the design's job is to remove it.

6. **Spanish first, English-ready.** Copy is written natively in Spanish with i18n-aware components: line-length budgets accommodate ~30% expansion for English, layouts do not break on longer strings, and no copy is baked into images or icons.

## Accessibility & Inclusion

- **WCAG 2.1 AA** is the baseline across all surfaces. Color contrast, focus indication, and keyboard reachability are non-negotiable on transactional flows (catalog → cart → checkout → account → reorder).
- **Color is never the sole carrier of meaning.** Stock status, order state, validation, and pricing tiers must also use icon, label, or position. The buyer audience skews older than typical D2C e-commerce; safelist for this.
- **Forms and tables are tested with keyboard-only and screen-reader flows**, especially the checkout and address book. These are the surfaces where accessibility failures cost real revenue.
- **Reduced-motion is honored.** Any motion added to enhance brand feel must degrade gracefully under `prefers-reduced-motion: reduce` without leaving content stranded.
- **Spanish-only today, bilingual-ready tomorrow.** No copy is hard-coded into images or sprite icons; component layouts tolerate ~30% string expansion for the eventual English locale.
