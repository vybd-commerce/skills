---
name: storefront-verify
description: Verify a merchant's Hydrogen storefront before deploy or hand-off - codegen, typecheck, lint, build, unit and end-to-end tests, a visual pass across viewports, a leftover-placeholder sweep, and a brief-compliance check. Use as step 8 of build-storefront, or after any storefront change.
---

# Verify

Run everything. Report actual results; if something fails, include the output.

## 1. Static checks and tests

```bash
pnpm codegen
pnpm typecheck
pnpm lint
pnpm build
pnpm test
pnpm test:e2e
```

Fix failures this build caused. Never skip or weaken a test to make it pass. If a test is wrong, fix the test and say so.

## 2. Leftover sweep

```bash
grep -rniE 'hydrogen \||welcome to hydrogen|lorem|todo|placeholder|mock\.shop' app public
grep -rnE '#[0-9a-fA-F]{3,8}\b|font-family' app/components app/routes   # brand values belong in tailwind.css tokens
grep -rnE "Intl.NumberFormat|currencyCode: '" app                       # prices go through <Money>
```

Each hit must be fixed, or be intentional and explained.

## 3. Visual pass

Run `pnpm preview` (or use the Oxygen preview URL) and screenshot home, a collection, a product, the open cart drawer, search and a content page at 375, 768 and 1440px. Compare against the section plan, and against Figma if there is one. Fix layout breaks, overflow, unreadable text and broken images.

## 4. Brief compliance

Walk through `docs/merchant-brief.md`. Confirm that each required item is either implemented or listed as blocked: market and currency, pages, policies, SEO inputs, and admin writes still pending approval.

## Report

A table: check → pass/fail → note. Then list what's blocked on the team, and who owns each item.
