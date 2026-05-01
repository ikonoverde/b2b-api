<!-- SEED — re-run $impeccable document once there's code in the new direction to capture the actual tokens and components. -->

---
name: Ikonoverde
description: Storefront and account hub for Ikonoverde body care, serving both wholesale and low-quantity buyers — clinical, precise, editorial.
---

# Design System: Ikonoverde

## 1. Overview

**Creative North Star: "The Specimen Sheet"**

Ikonoverde's interface should read like a single clean sheet from a modern apothecary's reference binder: a serif label at the top, precise sans-serif copy underneath, generous margin, one cold mineral accent used sparingly. The reference image is a herbarium card or a contemporary product spec insert, not a wellness landing page. Editorial restraint, not artisanal warmth. Laboratory precision, not hospital sterility.

The system is **stone-and-glass**: warm-cool stone neutrals form almost the entire surface, and a single cold mineral accent (a deep iodine teal or a precise violet-ink, to be locked in implementation) carries every transactional moment — primary CTAs, validation success, focus rings, the brand wordmark. Green appears in exactly one place: the *Ikonoverde* wordmark itself. Nowhere else. The "verde" lives in the name; the surface lives in stone.

This system explicitly rejects the saturated body-care category default — sage gradients, cream backgrounds, thin scripted serifs, leaf illustrations, kraft textures, "small-batch" tropes. If a new screen could be reskinned for any other wellness brand by swapping the wordmark, it has failed.

**Key Characteristics:**
- Stone neutrals everywhere, single cold mineral accent on ≤10% of any screen.
- Editorial serif for display labels, precise sans for everything else.
- Flat by default; depth comes from typography and whitespace, not from shadows.
- Mono-coded SKU / unit-price / lot-number metadata as a first-class material.
- Reordering UI gets the same typographic care as the hero — no "back-office" downgrade.

## 2. Colors

A near-monochrome stone palette, lifted by a single cold mineral accent. The strategy is **restrained-committed**: most of the screen is neutral, but the one accent is saturated enough to read as deliberate, not decorative. All values to be resolved during the first scan-mode pass; the constraints are normative now.

### Primary
- **Mineral Accent** *[hex/oklch to be resolved during implementation]*: A single cold mineral hue — first-choice direction is a deep iodine teal (somewhere around `oklch(~38% 0.07 200)`); alternate direction is a precise violet-ink (`oklch(~32% 0.09 290)`). Used for primary buttons, focus rings, validation success, the wordmark. **One** of these two; never both.

### Neutral
- **Stone Paper** *[to be resolved]*: The dominant surface. A warm-cool off-white, slightly cooler than cream, slightly warmer than paper-white. Target near `oklch(~96.5% 0.004 230)`. Never `#fff`.
- **Stone Mid** *[to be resolved]*: Hairline borders, dividers, low-contrast labels. Around `oklch(~88% 0.005 230)`.
- **Stone Ink** *[to be resolved]*: Body copy and primary text. A near-black tinted toward the accent's hue family. Around `oklch(~22% 0.01 230)`. Never `#000`.
- **Stone Whisper** *[to be resolved]*: Secondary copy, captions, mono spec-data. Around `oklch(~50% 0.008 230)`.

### Semantic (use sparingly, never as the *only* signal)
- **Caution / Warning**: a desaturated amber, far from the accent hue.
- **Error**: a precise vermillion ink, near `oklch(~50% 0.18 25)` — distinct from any luxury-perfume red.
- **Success**: re-uses the **Mineral Accent**. Stock-in, payment-confirmed, order-placed all carry the brand color, because every successful transaction *is* a brand moment.

### Named Rules

**The Verde-In-Wordmark Rule.** Green appears in the *Ikonoverde* wordmark and nowhere else. Not in hover states, not in icons, not in stock pills, not in success toasts. The "verde" is the name; the surface is stone. This is the single hardest rule of the system and the one most likely to drift.

**The One Voice Rule.** The Mineral Accent occupies ≤10% of any rendered screen. Its rarity is what makes a primary CTA read as primary. If two competing things on the page are both in the accent, one of them is wrong.

**The Tinted Neutral Rule.** Every neutral is tinted toward the accent hue (chroma ~0.005–0.01). Never `#000`, never `#fff`. The system has no true neutral — that flatness is what reads as "stone" and not as "default Tailwind".

## 3. Typography

**Display Font:** *[editorial serif to be chosen at implementation]* — the reference family is **GT Sectra**, **Editorial New**, **Tiempos Headline**, or a comparable contemporary editorial serif with a slight high-contrast modernist edge. Not a wellness serif (no Cormorant, no Playfair Display, no thin-italic Didone). Not a soft humanist serif. Editorial, not romantic.

**Body Font:** *[precise neutral sans to be chosen]* — reference family is **Söhne**, **GT America**, **Inter (Display cut)**, or **Neue Haas Grotesk**. Geometric-leaning, neutral, technical. Not warm. Not rounded.

**Spec Font:** *[neutral mono to be chosen]* — reference family is **JetBrains Mono**, **GT America Mono**, **Berkeley Mono**. Used for SKUs, lot numbers, unit prices, order IDs, dosage formats, case quantities. Treated as a first-class material, not as developer chrome.

**Character:** The pairing is *editorial label · precise body · technical spec*. The serif gives the brand its voice; the sans does the work; the mono carries the truth (the numbers a buyer is acting on).

### Hierarchy

- **Display** (serif, weight 400, ~clamp(2.25rem, 4vw, 3.5rem), line-height 1.05, letter-spacing -0.01em): Page-defining headlines on marketing surfaces and section openers in the app. Used sparingly.
- **Headline** (serif, weight 400, ~1.875rem, line-height 1.15): Section headers within app surfaces (Catalog, Order Detail, Account).
- **Title** (sans, weight 500, ~1.125rem, line-height 1.3): Card titles, table headers, modal titles.
- **Body** (sans, weight 400, ~1rem, line-height 1.55, max line length 65–75ch): All running copy. Spanish-first; component widths must accommodate ~30% expansion for English.
- **Spec** (mono, weight 400, ~0.875rem, letter-spacing 0): SKUs, quantities, prices, lot numbers, order IDs. Right-aligned in tables. Tabular figures (`font-variant-numeric: tabular-nums`) on every numeric column.
- **Label** (sans, weight 500, ~0.75rem, letter-spacing 0.04em, **NOT uppercase**): Form labels, table column headers, metadata captions. Wide-tracked but mixed-case.

### Named Rules

**The Mono-For-Truth Rule.** Every number a buyer transacts on — unit price, case quantity, stock count, SKU, order ID, lot number — renders in the spec mono. Decorative numerals (the "12 productos" in a results count) stay in sans. The mono is reserved for data the buyer can act on or audit.

**The No-Wellness-Italic Rule.** Italic serif at small or medium sizes is forbidden. It is the single fastest way to slide into the IG soft-luxury / Apothékary-imitator look this brand explicitly is not. Italics are permissible only in editorial display contexts (≥1.875rem) and only when content demands it.

**The Spanish-Length Rule.** Headlines, button labels, and form labels are designed against the *longer* of the Spanish copy and a +30% English forecast. If a Spanish headline barely fits, it doesn't fit.

## 4. Elevation

**Flat by default. Depth comes from typography and whitespace, not from shadows.** This system rejects the SaaS-card aesthetic where every surface floats slightly above every other surface. There are no resting shadows.

Hover and focus states use **value shifts and hairline borders**, not glow:
- Hover on an actionable surface: 2–4% darken on the Stone Paper, no shadow.
- Focus-visible: 2px ring in the Mineral Accent at 60% opacity, offset 2px from the element.
- Pressed: subtle inward border-color shift toward Stone Ink.

The only place a shadow is ever permitted is **modal / dialog overlays** — and even there it's a single broad ambient shadow at low opacity, never a "lifted card" stack.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. If a new screen needs depth to be legible, the typographic hierarchy is wrong — fix the hierarchy first, before reaching for a shadow.

**The No-Glassmorphism Rule.** Backdrop-blur and frosted-glass effects are forbidden everywhere except modal scrims. Never decorative.

## 5. Components

*Omitted in seed mode — no components have been built in the new direction yet. Components will be specified during the first surface craft (likely catalog → product detail → reorder → checkout) and formalized into DESIGN.md in the next scan-mode pass via `$impeccable extract` or a re-run of `$impeccable document`.*

The constraints from sections 1–4 (Stone-and-glass palette, Verde-In-Wordmark, One Voice, Mono-For-Truth, Flat-By-Default) are sufficient to drive the first round of component design without a formal spec.

## 6. Do's and Don'ts

### Do:
- **Do** keep the Mineral Accent on ≤10% of any rendered screen — primary CTAs, focus rings, brand wordmark, and successful transactional moments only.
- **Do** render every actionable number (price, qty, SKU, lot, order ID) in the spec mono with tabular figures.
- **Do** tint every neutral toward the accent hue at chroma ~0.005–0.01. Never `#000`, never `#fff`.
- **Do** lead pages with a serif display headline and let it carry the visual weight — no decorative imagery as a substitute.
- **Do** design every component against Spanish copy *plus* a 30% English expansion budget.
- **Do** ensure stock state, order state, and validation state are conveyed through icon + label + position, not color alone (older buyer audience; WCAG 2.1 AA).
- **Do** reach for typography and whitespace before shadows, gradients, or backdrop effects when something needs more presence.
- **Do** treat the reorder flow as the protagonist surface — same typographic care as the hero, not "admin-grade" downgrade.

### Don't:
- **Don't** use sage / eucalyptus green anywhere on the surface. Green lives only inside the *Ikonoverde* wordmark. (*Carries forward PRODUCT.md's "first-order green-and-cream reflex" anti-reference.*)
- **Don't** use sage gradients, soft-radial backgrounds, leaf or droplet illustrations, or any "calm pastel" decoration. (*Generic Shopify wellness — the named anti-reference for this seed pass.*)
- **Don't** use kraft-paper textures, handwritten or hand-drawn scripts, twine, brown-paper aesthetics, mason-jar imagery, or any "small-batch" trope. (*Etsy-rustic anti-reference.*)
- **Don't** use black backgrounds with gold serifs, all-caps wide-tracked logotypes as decoration, or glossy "fragrance counter" affect. (*Luxury-perfume cliché.*)
- **Don't** use clinical-blue, warning-yellow, or medical-device sterility palettes. Clinical means lab spec sheet, not prescription bottle. (*Cold pharmacy anti-reference.*)
- **Don't** use italic serif on cream, oversized lifestyle photography, or testimonial carousels. (*IG soft-luxury anti-reference.*)
- **Don't** use Cormorant Garamond, Playfair Display, or any thin-italic Didone as the display face. They are the wellness-imitator default; they will fight the brand.
- **Don't** add decorative gradients, gradient text, side-stripe borders (`border-left` ≥2px as a colored accent), backdrop-blur outside modal scrims, or ambient shadows on resting surfaces.
- **Don't** ship a screen where two elements are both rendered in the Mineral Accent. One of them is wrong.
- **Don't** ship a screen that could be reskinned for any other wellness brand by swapping the wordmark. If it's not unmistakably Ikonoverde, it's not done.
