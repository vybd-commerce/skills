# Merchant intake folder (Google Drive)

One folder per merchant. Share it with the agent (connector or local sync). Numbered prefixes keep the order stable.

```
<Merchant name>/
├── 00-brief/
│   └── Merchant brief            ← Google Doc copied from brief-template.md. The one required document.
├── 01-brand-assets/
│   ├── logo/                     ← logo.svg (+ logo-light.svg, logo-mark.svg); PNG only if no SVG exists
│   ├── fonts/                    ← font files or a fonts.txt listing Google Fonts names and licences
│   ├── colours.txt               ← hex values with roles, or omit and let the brand guide define them
│   └── brand-guidelines.pdf      ← optional
├── 02-products/
│   ├── products.csv              ← Shopify product CSV import format (one row per variant)
│   └── images/<product-handle>/  ← 01.jpg, 02.jpg… in display order
├── 03-imagery/                   ← named by placement: hero-home-desktop.jpg, hero-home-mobile.jpg,
│                                   collection-<handle>.jpg, lifestyle-01.jpg …
├── 04-design-system/             ← optional for v1: Figma link, exported tokens (JSON), section references
└── 05-content/
    ├── pages/                    ← one Google Doc per page: about, contact, faq, size-guide …
    ├── policies/                 ← shipping, refund, privacy, terms (final legal text only)
    └── seo.md                    ← provided by the SEO team member: titles, descriptions, OG images, redirects
```

**Why a Shopify product CSV for SKUs:** the team already knows the format, Shopify admin can import it directly, and `shopify-admin-setup` can map it 1:1 to the Admin API. Put extra product details (ingredients, materials, dimensions) in added columns named `metafield:<namespace>.<key>`.

**Never put credentials in Drive.** Share store access and API tokens through the team's password manager.
