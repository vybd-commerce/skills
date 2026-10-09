---
name: storefront-test
description: Add automated tests to a merchant's Hydrogen storefront - Playwright end-to-end tests for the shopping journey, axe accessibility checks, and Vitest unit tests for app logic - runnable locally and against Oxygen preview deployments. Use as step 7 of build-storefront, or when adding or fixing storefront tests.
---

# Storefront tests

The skeleton ships without tests. Add them once per repo, and keep them independent of specific products, because the catalog changes.

## 1. Setup

```bash
pnpm add -D @playwright/test @axe-core/playwright vitest
pnpm exec playwright install --with-deps chromium
```

Add these scripts to `package.json`: `"test": "vitest run"`, `"test:e2e": "playwright test"`.

`playwright.config.ts`:
- `baseURL` from `process.env.BASE_URL`, defaulting to the local preview server.
- `webServer` that runs `pnpm build && pnpm preview` when `BASE_URL` isn't set.
- Projects: Desktop Chrome and a mobile viewport (e.g. Pixel 7).
- When testing an Oxygen preview, send the `oxygen-auth-bypass-token` header from `process.env.OXYGEN_AUTH_BYPASS_TOKEN` (created by `shopify hydrogen deploy --auth-bypass-token`).

## 2. End-to-end tests (`tests/e2e/`)

Find test data at runtime: load `/collections/all`, take the first product link, and read its handle. Never hardcode product names, handles or prices.

| Spec | Asserts |
|---|---|
| `home.spec.ts` | 200 status, brand logo visible, every homepage section renders, no console errors |
| `navigation.spec.ts` | every header and footer link returns < 400 |
| `collection.spec.ts` | grid shows products, prices formatted in the brief's currency |
| `product.spec.ts` | title, price and images render; changing an option updates the URL and price/availability |
| `cart.spec.ts` | add to cart → cart count increments → line item shown → checkout link points to the store's checkout |
| `search.spec.ts` | a word from a real product title returns results |
| `seo.spec.ts` | unique `<title>` and meta description per page type; product JSON-LD present |
| `a11y.spec.ts` | axe finds no serious or critical violations on home, collection, product and cart |
| `not-found.spec.ts` | unknown URL returns 404 with the branded page |

## 3. Unit tests (`app/**/*.test.ts`)

Cover custom logic only: helpers in `app/lib` (formatting, metafield parsing, variant/swatch selection) and any non-trivial section prop mapping. Don't unit-test Hydrogen itself.

## 4. CI

If the repo uses the Oxygen GitHub workflow (see `storefront-deploy`), add a job that runs `pnpm test` and `pnpm test:e2e` against the preview deployment URL with the auth bypass token. Ask before adding repository secrets.

## Done when

`pnpm test` and `pnpm test:e2e` pass locally against the real store, on both viewports.
