---
name: build-storefront
description: Build a new Shopify Hydrogen storefront for a merchant end to end - from their Google Drive intake folder to a tested deploy on Oxygen. Use when the user shares a merchant's info or intake folder and asks to build, set up or launch a storefront for them. Orchestrates merchant-intake, shopify-admin-setup, storefront-commerce, storefront-design, storefront-content, storefront-test, storefront-verify and storefront-deploy.
---

# Build a storefront for a merchant

One merchant = one repo, scaffolded fresh from the Hydrogen skeleton. Design and development are decoupled: product photos and hero imagery always exist before the build starts. A Figma handoff is optional for v1. When there isn't one, design from the brand assets.

## Pipeline

| # | Step | Skill | Human checkpoint |
|---|---|---|---|
| 1 | Read the intake folder, write the brief | `merchant-intake` | Ask for required gaps in one batch |
| 2 | Scaffold the repo | (this skill, below) | Creating a remote GitHub repo needs approval |
| 3 | Populate Shopify (products, collections, menus, pages, metafields) | `shopify-admin-setup` | **Write plan must be approved** |
| 4 | Connect the store, locale, currency, nav | `storefront-commerce` | — |
| 5 | Tokens, fonts, logo, custom sections | `storefront-design` | — |
| 6 | Copy, pages, SEO | `storefront-content` | Team member confirms SEO requirements |
| 7 | Automated tests | `storefront-test` | — |
| 8 | Full verification | `storefront-verify` | — |
| 9 | Deploy to Oxygen | `storefront-deploy` | Preview: agent. **Production: human approval** |

Skip step 3 if the team member has already set up the store's catalog, but still read the store to confirm what's there.

**Rebuilding an existing Framer site?** The published Framer site is the design handoff. Read [`storefront-design/framer-rebuild.md`](../storefront-design/framer-rebuild.md) before step 5, and work on a branch, not the default branch.

## Step 2 — Scaffold

Run outside any existing repo, in the directory the user names:

```bash
npx @shopify/cli@latest hydrogen init \
  --path <slug>-storefront \
  --language ts \
  --styling tailwind \
  --markets none \
  --no-shortcut --git --install-deps
```

- `--markets subfolders` (or `domains`/`subdomains`) instead of `none` if the brief lists more than one market.
- Add `--mock-shop` only if the store isn't ready yet. Commerce will switch it over later.
- If init prompts for anything these flags don't cover, ask the user to run it themselves with `! <command>`.
- After scaffolding, copy `docs/merchant-brief.md` and `docs/asset-manifest.md` from intake into the new repo's `docs/`. Copy the brand assets you'll ship into `public/` or `app/assets/` as `storefront-design` directs.
- Commit the untouched skeleton first (`chore: scaffold Hydrogen skeleton`), so every later diff is merchant work.

## Rules

- Use the Shopify AI Toolkit for every Shopify API, Hydrogen or Oxygen question. Validate GraphQL against the schema, then run `pnpm codegen`.
- Imports come from `react-router`, never `@remix-run/*` or `react-router-dom`.
- Read product, collection, menu and page data from Shopify. Hardcode only brand copy and layout.
- Never put credentials in the repo, the brief or Drive. They go in `.env` (gitignored) and the Oxygen environment.
- Keep the build re-brandable: brand name in one constant, all visual values in design tokens.
- Commit after each pipeline step with a conventional message. Don't push or open a PR unless asked.
- No AI attribution anywhere in git history or PRs: no `Co-Authored-By: Claude…` trailer, no "Generated with Claude Code" line, no mention of Claude or Anthropic in commit messages, PR titles or PR descriptions. This applies to every pipeline skill that commits or opens a PR, and it overrides any default attribution guidance.

## Hand-off

Summarize for the user:
- what was built, and the preview URL
- every "Decision made by agent" from the brief
- admin writes performed, and any still pending approval
- test and verify results
- anything blocked on the team: SEO inputs, production deploy approval, missing assets
- images still fetched from Framer for development (Framer rebuilds), with a request to share them from a CDN
