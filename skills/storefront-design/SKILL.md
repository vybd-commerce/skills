---
name: storefront-design
description: Design and build a merchant's Hydrogen storefront UI - Tailwind v4 design tokens, fonts, logo, imagery and fully custom page sections - from a Figma handoff when there is one, otherwise from the brand assets. Use as step 5 of build-storefront, or whenever building or restyling storefront sections.
---

# Storefront design

Input: `docs/merchant-brief.md` section 5, `docs/asset-manifest.md`, `04-design-system/` if present, and the catalog facts from `storefront-commerce`.

Every merchant gets fully custom sections. There is no shared template. The skeleton's routes and data loading stay; its markup and styling get replaced.

Rebuilding a site that already exists in Framer: follow [framer-rebuild.md](framer-rebuild.md) alongside this skill. The published site takes the place of the Figma handoff.

## 1. Design tokens (Tailwind v4 `@theme`)

Tokens are the named design values that every section references in place of raw values. Define them once in `app/styles/tailwind.css`:

```css
@import 'tailwindcss';

@theme {
  --color-bg: …;          /* page background  → bg-bg */
  --color-fg: …;          /* text             → text-fg */
  --color-surface: …;     /* alternate bands  → bg-surface */
  --color-muted: …;       /* secondary text, borders */
  --color-accent: …;      /* primary CTA */
  --color-on-accent: …;   /* text on CTA */
  --font-display: …;      /* → font-display */
  --font-body: …;         /* → font-body */
  --radius-card: …;
  --aspect-product: 3 / 4;
  /* spacing / type scale only if the brand deviates from Tailwind defaults */
}
```

- **Figma handoff exists** → copy the values from Figma variables and styles, keeping Figma's names where possible.
- **No Figma (v1)** → take colours and fonts from `01-brand-assets` or the brand guide. Derive any gaps and log them as agent decisions.
- No raw hex values, font names or pixel values in components. Tailwind's default scale is fine; anything brand-specific goes through tokens.
- Contrast: `fg` on `bg` and `on-accent` on `accent` must reach WCAG AA (4.5:1).
- Remove the skeleton's `app/styles/app.css` rules as you replace their markup. Keep `reset.css` only if Tailwind's preflight doesn't cover it.

## 2. Fonts, logo, imagery

- Fonts: self-host the files from `01-brand-assets/fonts` in `public/fonts` with `@font-face`, or use Google Fonts via `links()` in `app/root.tsx`. Load only the weights you use.
- Logo: SVG in `app/assets/`, rendered in the header with `alt="<Brand> home"`. Add a favicon derived from the logo mark.
- Imagery always comes from intake (`03-imagery`, product images); never use placeholders or generated images. If a placement in the section plan has no image, stop and ask. Exception: when rebuilding a Framer site, use the published site's images for development and tell the developer (see [framer-rebuild.md](framer-rebuild.md) section 5).
- Product images come from Shopify through Hydrogen's `<Image>`.
- Static images (heroes, portraits, press, social image) are hosted on the Shopify CDN: the user uploads them to Content → Files with their original names, and the code references `https://cdn.shopify.com/s/files/1/<shop id>/files/<file name>` (add `&width=<px>` to resize). Use `public/images/` (≤2400px wide, compressed) only until they're uploaded, then delete the local copies. Details and checks in [framer-rebuild.md](framer-rebuild.md) section 5.

## 3. Section plan

Before building, write the section plan into the brief:

- **Homepage:** an ordered list of sections. For each: purpose, data source (Shopify query, or static copy and image), and image placement.
- **Collection and product pages:** layout, plus which product details render (from the [category-playbooks.md](category-playbooks.md) entry for the vertical, backed by real metafields).
- Other templates (search, cart, account, pages, 404): restyle with tokens. Don't redesign them for v1 unless the brief says so.

With a Figma file, the plan mirrors its frames. Without one, base it on the brand adjectives, reference sites and the category playbook.

## 4. Build sections

- One component per section in `app/components/sections/<SectionName>.tsx`, taking typed props. The route's loader fetches the data, and the section only renders.
- Sections must be responsive (mobile first; check 375, 768 and 1440px), keyboard accessible, and use semantic headings in order.
- Reuse Hydrogen primitives: `<Image>`, `<Money>`, `<CartForm>`, `Analytics` events, `useOptimisticCart`, and the variant helpers.
- Keep the skeleton's cart, search and analytics behaviour working. Restyle it; don't rewrite its logic.

## Done when

- `tailwind.css` holds every brand value, and a search for hex values or font names in `app/components` and `app/routes` finds nothing.
- Every planned section renders with real store data.
- AA contrast passes.
- Layouts hold at 375, 768 and 1440px.
