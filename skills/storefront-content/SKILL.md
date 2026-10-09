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
- Structured data (JSON-LD): `Organization` on the home page, `Product` with `Offer` on product pages, `BreadcrumbList` on collection and product pages.
- Open Graph and Twitter tags: product image on product pages, a brand OG image (from intake) elsewhere.
- Keep the skeleton's `sitemap.xml` and `robots.txt` routes, and make sure they use the production domain.
- Redirects from `seo.md` (e.g. old-site URLs) go in as Shopify URL redirects, through the admin write plan.

## Done when

- No skeleton or placeholder copy remains.
- Every page has a unique title and description.
- Structured data validates (check with a schema validator or the toolkit).
- Drafted copy and missing SEO inputs are listed for the team.
