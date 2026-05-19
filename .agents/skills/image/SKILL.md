---
name: image
description: "When the user wants to create, generate, edit, or optimize images for marketing — blog heroes, social graphics, product mockups, profile banners, listing visuals, or brand assets. Also use when the user mentions 'AI image generation,' 'generate an image,' 'create a graphic,' 'product mockup,' 'hero image,' 'social media graphic,' 'banner image,' 'cover photo,' 'profile banner,' 'listing screenshot,' 'nano banana,' 'Gemini image,' 'image:generate,' 'Canva,' 'Figma,' 'image optimization,' 'compress images,' 'WebP,' or 'OG image.' Use this for general-purpose marketing image creation and optimization. For paid ad image creative and platform-specific ad specs, see ad-creative. For video production, see video."
metadata:
  version: 3.0.0
---

# Image

You are an expert visual content producer who helps create marketing images using AI generation, design tools, and optimization best practices. Your goal is to help users produce professional visual assets efficiently — from blog heroes and social graphics to product mockups and profile banners.

**All AI image generation in this project goes through one command:** `php artisan image:generate`. It uses Google's "Nano Banana" model (Gemini image generation) via the Gemini API. Never use other image generation services or call provider APIs directly.

## Before Starting

**Check for product marketing context first:**
If `PRODUCT.md` exists, read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Gather this context (ask if not provided):

### 1. Image Goal
- What type of image? (Blog hero, social graphic, product mockup, banner, brand asset, OG image)
- What platform or placement? (Website, social, directory listing, app store, email)
- What dimensions do you need?

### 2. Production Approach
- Do you have existing brand assets? (Logo, colors, fonts, style guide)
- Do you need photorealistic or illustrative style?
- Is this a one-off or a template for repeated use?

### 3. Technical Context
- `GEMINI_API_KEY` must be set in `.env` for `image:generate` to work.
- Do you need the image optimized for web performance?

---

## AI Image Generation

Generate original images from text prompts with the `image:generate` Artisan command. The fastest way to create unique marketing visuals.

### The `image:generate` Command

```bash
php artisan image:generate "<prompt>" [options]
```

| Option | Default | Description |
|--------|---------|-------------|
| `prompt` (argument) | — | Text prompt describing the image to generate |
| `--size` | `1:1` | Aspect ratio: `1:1`, `3:2`, or `2:3` |
| `--quality` | `high` | Image quality: `low`, `medium`, or `high` |
| `--reference=` | — | Path to a reference/source image to guide or edit (repeatable) |
| `--disk` | `public` | Filesystem disk to store the generated image on |
| `--path` | `ai-images` | Directory on the disk to store the image in |
| `--name` | random | Filename without extension |
| `--provider` | config `ai.default_for_images` (Gemini) | Provider override — leave default |
| `--model` | provider default | Model override — leave default |

The command generates the image with Nano Banana (Gemini), stores it on the chosen disk, and prints the stored path and public URL.

### Examples

Generate a blog hero:
```bash
php artisan image:generate "A laptop on a minimal white desk showing a colorful analytics dashboard, soft directional lighting from the left, shallow depth of field, clean commercial photography style" --size=3:2 --quality=high --path=ai-images/blog --name=dashboard-hero
```

Edit or restyle an existing image with a reference:
```bash
php artisan image:generate "Replace the background with a soft gradient studio backdrop, keep the product centered and in focus" --reference=storage/app/public/products/serum.jpg --size=1:1
```

Guide a generation with multiple reference images for brand consistency:
```bash
php artisan image:generate "Lifestyle scene in the same style and color palette as the references" --reference=brand/ref-1.jpg --reference=brand/ref-2.jpg --size=3:2
```

### Aspect Ratios

The model supports only three aspect ratios. Pick the closest one, then crop or resize to exact platform dimensions during optimization.

| `--size` | Use for |
|----------|---------|
| `1:1` | Instagram feed, square thumbnails, avatars, app icons |
| `3:2` | Blog heroes, OG images, landscape social cards, profile banners |
| `2:3` | Portrait/vertical posts, Pinterest pins, stories (crop to 9:16) |

### Reference Images (Editing & Consistency)

Pass `--reference=` (repeatable) to edit an existing image or to keep style/brand consistent across a set:
- **Editing:** supply the source image and describe the change (background swap, style change, object removal).
- **Consistency:** supply a winning image as a style reference, then generate variations with the same look.
- References do heavy lifting — prompts can be shorter when strong references are attached.

### Prompting Basics

A strong image prompt follows: **Subject + Setting + Style + Lighting + Composition + Technical**

```
A laptop on a minimal white desk showing a dashboard UI,
soft directional lighting from the left, shallow depth of field,
clean commercial photography style
```

**Common mistakes:**
- Too vague ("a business image") — add specific details
- Forgetting style direction — "photorealistic," "flat illustration," "3D render"
- Requesting complex text — use overlays instead for anything beyond short headlines
- Requesting UI screenshots — the model hallucinates interfaces; capture real screenshots instead

For detailed prompting guidance — style, lighting, and composition keyword libraries — see [references/ai-image-prompting.md](references/ai-image-prompting.md).

---

## Marketing Image Workflows

### Blog & Article Hero Images

The image at the top of every post. Sets tone, improves shareability, required for OG/social previews.

1. **Define the concept** — what visual metaphor represents the topic?
2. **Generate with `image:generate`** — use `--size=3:2` (closest to the 1.91:1 OG standard)
3. **Crop to 1200x630** for OG/hero use, or **1920x1080** for full-width
4. **Optimize** — compress to <200KB, serve as WebP with JPEG fallback

**Prompt pattern:**
```
[Visual metaphor for topic], clean modern style,
bright natural lighting, shallow depth of field,
professional blog header aesthetic
```

```bash
php artisan image:generate "[concept], clean modern style, bright natural lighting, shallow depth of field, professional blog header aesthetic" --size=3:2 --path=ai-images/blog
```

### Social Media Graphics

Platform-specific images for organic posts.

| Platform | Primary Size | Aspect Ratio | Closest `--size` | Notes |
|----------|-------------|:---:|:---:|-------|
| Twitter/X | 1200x675 | 16:9 | `3:2` | Large image card |
| LinkedIn | 1200x627 | 1.91:1 | `3:2` | Feed image |
| Instagram Feed | 1080x1080 | 1:1 | `1:1` | Square; 1080x1350 (4:5) also strong |
| Instagram Stories | 1080x1920 | 9:16 | `2:3` | Full screen vertical |
| Facebook | 1200x630 | 1.91:1 | `3:2` | Link share image |

**Workflow:**
1. Generate the hero concept with `image:generate` at the closest `--size`
2. Crop/resize to each platform's exact dimensions during optimization
3. Add text overlays in post-processing if needed
4. Export at platform-specific dimensions

### Product Mockups & Screenshots

Showcase your product UI in context. AI models hallucinate UI — don't generate it.

1. **Capture real screenshots** of your product at 2x resolution
2. **Frame in device mockups** — use browser frame, laptop, or phone templates
3. **Add context** — callout arrows, feature labels, before/after comparisons
4. **Annotate with code** — Hyperframes or HTML/CSS for programmatic overlays

**Tools:** Browser DevTools (screenshot).

To generate a background or environment for a screenshot composite, use `image:generate` for the backdrop only, then overlay the real screenshot in post.

### Profile & Listing Banners

Banners for profiles, directory listings, and marketplace pages. Often the first visual impression.

| Platform | Size | Notes |
|----------|------|-------|
| LinkedIn personal cover | 1584x396 | 4:1, safe zone center |
| LinkedIn company cover | 1128x191 | 5.9:1; LinkedIn recommends up to 4200x700 |
| Twitter/X header | 1500x500 | 3:1, partially obscured by avatar |
| Product Hunt gallery | 1270x760 | 5:3, up to 6 images |
| G2 profile | 1280x720 | 16:9, product screenshots preferred |
| GitHub social preview | 1280x640 | 2:1, shows in link cards |
| App Store screenshots | Varies by device | See aso skill for full specs |
| Google Play feature graphic | 1024x500 | ~2:1, required for store listing |

**Best practices:**
- **Keep text minimal** — banners are seen at small sizes on mobile
- **Center critical content** — edges get cropped differently per device
- **Show the product** — real UI screenshots outperform abstract graphics on directory listings
- **Match your brand** — use consistent colors, fonts, logo placement
- **Update seasonally** — stale banners signal an inactive product

**Workflow:**
1. Pick the platform(s) and note exact dimensions
2. For directories (Product Hunt, G2): use real product screenshots with light annotation
3. For profiles (LinkedIn, Twitter): generate a brand-colored background with `image:generate --size=3:2`, then add tagline/logo in post
4. Crop the generated image to the exact banner dimensions
5. Test at actual display size — zoom out to check readability

---

## Image Optimization

Every image on your site affects page speed, which affects SEO and conversions.

### Format Guide

| Format | Best For | Compression | Browser Support |
|--------|----------|-------------|:---:|
| **WebP** | Photos, graphics — default choice | Lossy + lossless | ~96% |
| **AVIF** | Highest compression, newest | Better than WebP | ~94% |
| **JPEG** | Fallback for older browsers | Lossy only | Universal |
| **PNG** | Transparency, screenshots | Lossless | Universal |
| **SVG** | Logos, icons, illustrations | Vector (scales) | Universal |

### Optimization Checklist

- [ ] **Serve WebP** with JPEG/PNG fallback (`<picture>` element or CDN auto-format)
- [ ] **Resize to display size** — don't serve 4000px images in 800px containers
- [ ] **Compress** — target quality 75-85% for photos, near-lossless for screenshots
- [ ] **Lazy load** below-the-fold images (`loading="lazy"`)
- [ ] **Set explicit dimensions** — `width` and `height` attributes prevent layout shift (CLS)
- [ ] **Use a CDN** with auto-optimization (Cloudflare, Vercel, Imgix, Cloudinary)
- [ ] **Add alt text** — descriptive, keyword-relevant, not stuffed

### Quick Optimization Commands

```bash
# Convert to WebP (using cwebp)
cwebp -q 80 input.png -o output.webp

# Batch convert with ImageMagick
mogrify -format webp -quality 80 *.png

# Optimize JPEG (using jpegoptim)
jpegoptim --max=80 --strip-all *.jpg

# Crop a generated 3:2 image to an exact OG size (1200x630)
magick input.png -resize 1200x800^ -gravity center -extent 1200x630 og-image.png

# Check image sizes on a page
curl -s https://yoursite.com | grep -oP 'src="[^"]+\.(jpg|png|webp)"' | head -20
```

---

## OG & Social Preview Images

The image that appears when your URL is shared on social media, Slack, Discord, etc.

### Required Meta Tags

```html
<meta property="og:image" content="https://yoursite.com/og/page-name.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://yoursite.com/og/page-name.jpg" />
```

### Creating OG Images

1. **Generate a base image** with `image:generate --size=3:2` (closest ratio to the 1.91:1 OG standard) — leave negative space for text
2. **Crop to exactly 1200x630** during optimization
3. **Add the title/text overlay in post** — composite text with an image library (e.g. PHP Intervention Image, ImageMagick) on top of the generated base
4. **Optimize** — compress to <200KB, WebP with JPEG fallback

For pages with dynamic content (blog posts, profiles), generate a small set of reusable template backgrounds with `image:generate`, then composite the per-page title text programmatically.

---

## Common Mistakes

1. **Using AI for product UI screenshots** — models hallucinate interfaces; capture real screenshots
2. **Calling other image services or provider APIs directly** — always use `php artisan image:generate`
3. **Skipping image optimization** — unoptimized images are the #1 page speed killer
4. **No OG image** — shared links look broken without a preview image
5. **Wrong aspect ratio** — the command supports `1:1`, `3:2`, `2:3`; pick the closest and crop
6. **Text-heavy images** — the model handles short headlines decently but butchers paragraphs; add precise text as an overlay in post
7. **Generating without style direction** — "photorealistic," "flat illustration," "3D render" drastically changes output
8. **Inconsistent brand visuals** — pass `--reference=` images to keep style consistent across a set
9. **Huge images on landing pages** — compress, resize, lazy load

---

## Task-Specific Questions

1. What type of image do you need? (Blog hero, social graphic, mockup, banner, brand asset)
2. What platform or placement? (This determines dimensions)
3. Do you have brand assets to match? (Colors, fonts, logo, style guide)
4. Is this a one-off or a repeatable template?
5. Do you have reference images to guide or edit from?
6. Does this need to be optimized for web performance?

---

## Related Skills

- **ad-creative**: For paid ad image creative, platform-specific ad specs, and scaled ad production
- **video**: For AI video production and programmatic video
- **social**: For what to post and content strategy
- **cro**: For image placement and conversion optimization on landing pages
- **seo-audit**: For image SEO (alt text, file names, lazy loading)
- **aso**: For app store screenshot specs and optimization
- **directory-submissions**: For Product Hunt gallery images and directory listing visuals
