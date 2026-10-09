---
name: storefront-commerce
description: Wire a freshly scaffolded Hydrogen storefront to a merchant's Shopify store - environment variables, country/currency/language, markets, navigation from Shopify menus, collection and page URLs, policies. Use as step 4 of build-storefront, or whenever changing a storefront's store connection, market or currency.
---

# Commerce wiring

Input: `docs/merchant-brief.md` sections 3–4. The store should already contain the catalog (see `shopify-admin-setup`).

## 1. Store connection

- Locally: `.env` gets `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`, `PUBLIC_STOREFRONT_ID` and `SESSION_SECRET`. `.env` is never committed.
- Once the repo is linked to Oxygen (`storefront-deploy`), prefer `shopify hydrogen env pull` so local and Oxygen variables match.
- If the project was scaffolded with `--mock-shop`, switch it to the real store here, and remove any Mock.shop-only workarounds you or a previous step added.

## 2. Discover the catalog

Query the Storefront API (validate with the Shopify AI Toolkit) and record the results in the brief:
- collections (handle, title)
- menus (`main-menu`, `footer`, or the handles the team uses)
- pages (handle)
- product option names (these drive the variant UI in `storefront-design`)
- `shop` policies: note any missing ones as blocked

## 3. Market, currency, locale

- Set `i18n: {language, country}` in `app/lib/context.ts` from the brief.
- Multiple markets: follow the skeleton's markets setup for the URL strategy chosen at scaffold time, and confirm details with the toolkit.
- Format prices with Hydrogen's `<Money>` component and never hardcode a currency symbol or code.

## 4. Navigation

- Render header and footer navigation from the Shopify menus (the skeleton loads them in the root loader). Don't hardcode nav arrays.
- Every link must resolve. If a menu item points to a missing collection or page, report it, and don't route around it in code.
- Footer policy links: show only the policies that exist.

## Done when

- `pnpm codegen` and `pnpm typecheck` pass.
- Prices render in the brief's currency on the home, collection, product and cart pages.
- No nav or footer link 404s.
