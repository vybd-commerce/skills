---
name: storefront-content
description: Place a merchant's copy and SEO into their Hydrogen storefront - brand constant, section copy, meta titles and descriptions, structured data, Open Graph, sitemap/robots and Shopify page content. Use as step 6 of build-storefront, or when updating storefront copy or SEO.
---

# Content and SEO

Input: `docs/merchant-brief.md` sections 1 and 6, `05-content/pages`, `05-content/seo.md`.

## 1. Brand constant

Create `app/lib/brand.ts` exporting the brand name, tagline and social/support links. Import it everywhere the name appears (meta, header, footer, `aria-label`s). Never repeat the name as a literal.

## 2. Copy

- Use copy from `05-content` verbatim where it's provided.
- Where the section plan needs copy that intake didn't supply, draft it in the brand's voice (positioning and adjectives) and list every drafted line under "Decisions made by agent" for review. Never draft product facts, prices, claims (e.g. "organic", "cruelty-free") or policy text.
- Replace all skeleton placeholder copy (titles like "Hydrogen", demo text).

## 3. Pages

The brief lists the pages this merchant needs; the team confirms that list per merchant. Page content lives in Shopify Pages, rendered by the `pages.$handle` route.
- Page exists in Shopify → link it.
- Missing, with copy in `05-content/pages` → add it to `shopify-admin-setup`'s write plan (publishing a page is Tier B).
- Missing with no copy → mark it blocked and leave it out of navigation.

## 4. SEO

The SEO team member provides the requirements in `05-content/seo.md`. Until then, implement this baseline and mark the build as waiting on their review:
- Every route's `meta` export: unique title (`<page> | <Brand>`), description, canonical URL. Use Hydrogen's SEO helpers (`getSeoMeta`), and confirm usage with the toolkit.
- Product and collection pages: titles and descriptions from Shopify's SEO fields, falling back to the title and a description excerpt.
- Structured data (JSON-LD): `Organization` on the home page, `Product` on product pages (details in section 5), `BreadcrumbList` on collection and product pages.
- Open Graph and Twitter tags: product image on product pages, a brand OG image (from intake) elsewhere.
- Keep the skeleton's `sitemap.xml` and `robots.txt` routes, and make sure they use the production domain.
- Redirects from `seo.md` (e.g. old-site URLs) go in as Shopify URL redirects, through the admin write plan.

## 5. Agentic shopping readiness

AI shopping agents (ChatGPT, Copilot, Shop and browser agents) read the store's data and the product pages' structured data. Whether a store can sell through those channels is decided in Shopify, not in code, so most of this is a checklist for the team.

In code:
- Product JSON-LD lists **one `Offer` per priced variant**, each with name, price, currency, availability and its variant URL (`/products/<handle>?<Option>=<Value>`), plus `sku` when the store has SKUs. Leave out price-on-request (zero-priced) variants rather than publishing a 0 price.
- Include **every product image** in `image`, not only the featured one.
- Map Shopify's category metafields (namespace `shopify`, e.g. `material`, `color-pattern`, and vertical-specific ones such as `painting-medium`) to `additionalProperty` entries, and `material` where it applies. They're list metaobject references: read each referenced metaobject's `label` field. Fields the Storefront API doesn't expose come back null, so the code must cope with that.
- Build the JSON-LD in a pure helper (e.g. `productJsonLd` in `app/lib/seo.ts`) with unit tests, and check a rendered product page's output.
- Don't block AI crawlers in `robots.txt`, and keep products in the sitemap.
- Don't build WebMCP browser tools yet: the standard is experimental and needs a browser flag. Revisit when browsers support it by default.

For the team (list these in the hand-off):
- Shopify admin → **Agentic** page: catalog access, policies and the Shopify Catalog status. A new store is usually "Ineligible" for the Shopify Catalog (ChatGPT, Copilot, Meta) until it has a history of real orders; nothing in code changes that.
- Policies filled in under **Settings → Policies** (refund, shipping, privacy, terms), not only as pages.
- Product data gaps from the export: images without alt text, products with no or very short descriptions, unpriced products, duplicate titles.
- The store password is off at launch.
- To see what agents can reach, call the store's MCP endpoint: `POST https://<shop>.myshopify.com/api/mcp` with `{"jsonrpc":"2.0","id":1,"method":"tools/list"}`. Catalog and cart tools only appear once the store is eligible.

## Done when

- No skeleton or placeholder copy remains.
- Every page has a unique title and description.
- Structured data validates (check with a schema validator or the toolkit).
- Drafted copy and missing SEO inputs are listed for the team.
