# AI Image Prompting Guide

How to write effective prompts for the `php artisan image:generate` command, which uses Google's Nano Banana model (Gemini image generation).

---

## Prompt Structure

A strong image prompt follows this formula:

```
[Subject] + [Setting/context] + [Visual style] + [Lighting] + [Composition] + [Technical specs]
```

### Example Prompts by Use Case

**Blog hero — SaaS product:**
```
A clean workspace with a laptop displaying a colorful analytics dashboard,
minimalist desk with a coffee cup and notebook,
bright natural window lighting from the right,
shallow depth of field, commercial photography style,
high resolution
```

**Social media graphic — announcement:**
```
Abstract flowing gradient in deep purple and electric blue,
geometric shapes forming a network pattern,
dramatic rim lighting on edges,
modern tech aesthetic, clean and minimal,
vibrant colors
```

**Product lifestyle shot:**
```
A person in a modern office smiling while looking at a tablet,
showing a project management interface on screen,
warm candid photography, natural lighting,
medium shot, shallow depth of field, editorial style
```

**Profile banner — professional:**
```
Wide panoramic abstract background in navy blue and teal,
subtle geometric grid pattern with soft gradient,
clean corporate aesthetic, muted lighting,
no text, space for logo overlay on left third
```

**Directory listing — Product Hunt:**
```
Product screenshot on a clean gradient background,
soft shadow underneath, slight 3D perspective tilt,
modern SaaS product presentation style,
bright and professional
```

Specify the aspect ratio with the `--size` option (`1:1`, `3:2`, or `2:3`) rather than in the prompt text.

---

## Style Keywords

### Photorealistic
- "commercial photography"
- "shot on Canon EOS R5"
- "editorial style"
- "natural lighting"
- "shallow depth of field"

### Clean/Corporate
- "clean modern aesthetic"
- "minimal design"
- "professional corporate style"
- "bright and airy"
- "white background"

### Illustrative
- "flat vector illustration"
- "isometric 3D render"
- "hand-drawn sketch style"
- "watercolor illustration"
- "line art"

### Abstract/Brand
- "flowing gradient"
- "geometric pattern"
- "abstract data visualization"
- "particle effects"
- "holographic iridescent"

### Tech/SaaS
- "dark mode UI aesthetic"
- "neon accent lighting"
- "glassmorphism"
- "futuristic minimal"
- "developer-focused"

---

## Lighting Keywords

| Term | Effect | Best For |
|------|--------|----------|
| **Natural light** | Warm, organic feel | Lifestyle, editorial |
| **Studio lighting** | Even, controlled | Product shots |
| **Rim lighting** | Edge highlights, dramatic | Hero images, abstract |
| **Soft directional** | Gentle shadows, dimensional | Blog headers |
| **Volumetric** | Light rays, atmospheric | Dramatic, cinematic |
| **Flat/even** | No shadows, clean | Icons, diagrams |
| **Golden hour** | Warm orange tones | Lifestyle, outdoor |
| **High key** | Bright, minimal shadows | Clean, corporate |

---

## Composition Keywords

| Term | Effect | Best For |
|------|--------|----------|
| **Rule of thirds** | Subject off-center | Editorial, lifestyle |
| **Centered** | Subject in middle | Product shots, icons |
| **Wide/panoramic** | Expansive view | Banners, headers |
| **Close-up/macro** | Detail focus | Texture, product detail |
| **Bird's eye/overhead** | Top-down view | Desk setups, flat lays |
| **Negative space** | Room for text overlay | Blog headers, banners |
| **Symmetrical** | Balanced, formal | Corporate, luxury |

---

## Working With Nano Banana (Gemini)

- Best all-around for marketing images — good quality, reasonable cost
- Supports **image editing** — pass `--reference=` with an existing image and describe the changes
- Supports **multiple references** — repeat `--reference=` to keep style/brand consistent across a set
- Decent text rendering — can handle short headlines, but add precise text as an overlay in post
- Specify "high resolution" in the prompt and use `--quality=high` for best output
- Works well with detailed, descriptive prompts
- Set the aspect ratio with `--size` (`1:1`, `3:2`, `2:3`) — not in the prompt

---

## Common Prompt Mistakes

| Mistake | Why It Fails | Fix |
|---------|-------------|-----|
| "A professional image" | No visual detail | Describe subject, setting, style, lighting |
| Long paragraph of text in image | Models can't render paragraphs | 3-5 words max; add text in post |
| "Make it look good" | Not actionable | Specify style: "commercial photography, bright" |
| 200+ word prompts | Models lose focus | 40-80 words, specific over comprehensive |
| Aspect ratio in the prompt text | Ignored or unreliable | Use the `--size` option |
| "Logo in bottom right" | Unreliable placement | Add logos in post-processing |
| "Make it viral" | Not a visual instruction | Describe the aesthetic you want |
| Requesting UI screenshots | AI hallucinates interfaces | Capture real screenshots instead |

---

## Batch Generation Workflow

When you need multiple images with consistent style (e.g., a blog series or social campaign):

1. **Generate 3-4 test images** with different style prompts at `--quality=low` for fast drafts
2. **Pick the winning style** based on brand fit
3. **Save the exact prompt** as your template
4. **Use `--reference=`** — pass the winning image as a style reference for the rest
5. **Batch generate** variations with the same style, different subjects, at `--quality=high`
6. **Post-process** — add text overlays, logos, crop to platform sizes

---

## Aspect Ratios Quick Reference

The `image:generate` command supports three aspect ratios. Pick the closest, then crop to exact pixels in post.

| Use Case | Target Pixels | Closest `--size` |
|----------|---------------|:---:|
| Blog hero / OG image | 1200x630 | `3:2` |
| Full-width hero | 1920x1080 | `3:2` |
| Instagram Feed | 1080x1080 | `1:1` |
| Instagram Feed (tall) | 1080x1350 | `2:3` |
| Stories / Reels | 1080x1920 | `2:3` |
| LinkedIn cover | 1584x396 | `3:2` |
| Twitter/X header | 1500x500 | `3:2` |
| Product Hunt gallery | 1270x760 | `3:2` |
| GitHub social preview | 1280x640 | `3:2` |
| App icon / avatar | 1024x1024 | `1:1` |

---

## Cost Optimization

- **Iterate at `--quality=low` first** — use low quality for drafts, upgrade to `high` for finals
- **Use references over long prompts** — `--reference=` produces more consistent results with fewer retries
- **Batch similar requests** — generate all blog headers in one session with the same style
- **Cache and reuse** — abstract backgrounds, patterns, and textures can be reused across multiple images
- **Post-process instead of re-generate** — crop, overlay text, and adjust color in code rather than generating new images
