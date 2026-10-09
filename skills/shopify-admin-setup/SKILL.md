---
name: shopify-admin-setup
description: Populate a merchant's Shopify store through the Admin API - products, variants, media, collections, metafields, menus, pages and policies - from the intake brief, using a reviewed write plan with human approval tiers. Use when a store's catalog or content needs to be created or changed in Shopify (step 3 of build-storefront), never for storefront code changes.
---

# Shopify Admin setup

This skill writes to a live store, so it never mutates anything before a write plan exists and the approvals required below are recorded.

Input: `docs/merchant-brief.md`, `docs/asset-manifest.md`, `02-products/products.csv`, `05-content/`.

## 1. Access

- An Admin API access token for the store, from the app the team installs. Confirm the current setup method and the minimum scopes with the Shopify AI Toolkit.
- Likely scopes: products, publications, files, inventory, online-store pages, navigation, metaobjects, legal policies. Request only what the plan uses.
- Read the token from the environment (e.g. `SHOPIFY_ADMIN_TOKEN`). Never echo it, write it to a file, or commit it.
- Use the latest stable Admin GraphQL API version (check with the toolkit). Validate every query and mutation against the schema before running it.

## 2. Read current state first

Query what already exists: products by handle, collections, menus, pages, metafield definitions, publications (sales channels), and policies. Anything that exists and wasn't created by this run is **pre-existing** and gets stricter treatment below.

## 3. Write the plan

Create `docs/admin-write-plan.md` with one row per intended write:

`# | resource | handle/id | action (create/update/publish) | source (CSV row, doc) | tier | status`

Assign each row a tier:

| Tier | Meaning | Writes |
|---|---|---|
| **A — auto after plan review** | New, unpublished, easy to undo | Create products as **DRAFT** with variants and media; upload files; create metafield/metaobject definitions; create **unpublished** collections; set metafield values on products created in this run |
| **B — explicit human approval per batch** | Customer-visible, commercial or legal | Publish anything to a sales channel; prices and compare-at prices; inventory quantities; menus; publishing pages; policies; **any update to a pre-existing resource**; markets, currency, shipping or tax settings; discounts |
| **C — never by the agent** | Destructive or account-level | Deleting pre-existing data; payments and checkout settings; staff and permissions; app installs; domains |

Show the user the plan summary (counts per tier, plus every Tier B row), and get approval before **any** write. Tier B rows need their own explicit yes, which you record in the plan's `status` column with the approver's name and the date.

## 4. Execute

- Process Tier A first, then approved Tier B batches. Skip unapproved rows; never upgrade a row's tier to get it done.
- Products: prefer the upsert-style `productSet` mutation keyed by handle, so re-runs are idempotent. Use bulk operations for large catalogs (confirm the threshold with the toolkit).
- Media: upload local images via staged uploads, then attach them in CSV order with alt text (product title + variant if none is given).
- Product details from `metafield:<ns>.<key>` columns: create the definition first, then set the values.
- Publish to the **Hydrogen storefront's sales channel** (Tier B) so the Storefront API can see the products.
- Log every mutation result (id, userErrors) to `docs/admin-write-log.md`. Stop the batch on the first unexpected error and report it.

## 5. Verify

Re-read the store and compare it with the plan: counts, handles, prices, images per product, menu items. Then confirm the products are visible through the **Storefront API** (that's what the site uses). Report any differences.

## Done when

Every plan row is `done`, `skipped (unapproved)` or `blocked (reason)`, the log is complete, and the Storefront API returns the expected catalog.
