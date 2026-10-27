# Storefront skills

Agent skills for building Shopify Hydrogen storefronts for merchants, from a Google Drive intake folder to a tested deploy on Oxygen. They are generic: nothing in them is tied to a specific merchant.

## Pipeline

`build-storefront` is the entry point. It runs the other skills in order:

| # | Skill | What it does |
|---|---|---|
| 1 | `merchant-intake` | Reads the merchant's Drive folder and writes the brief and asset manifest |
| 2 | `build-storefront` | Scaffolds a fresh Hydrogen skeleton (TypeScript, Tailwind) per merchant |
| 3 | `shopify-admin-setup` | Populates the store through the Admin API, from an approved write plan |
| 4 | `storefront-commerce` | Store connection, market, currency, navigation from Shopify menus |
| 5 | `storefront-design` | Design tokens, fonts, logo and fully custom sections |
| 6 | `storefront-content` | Copy, pages and SEO |
| 7 | `storefront-test` | Playwright end-to-end, accessibility and Vitest unit tests |
| 8 | `storefront-verify` | Full checks, visual pass and brief compliance |
| 9 | `storefront-deploy` | Oxygen preview deploys; production only with human approval |

Human checkpoints: missing brief fields, the admin write plan (Tier B changes), the SEO review and production deploys.

## Rebuilding a Framer site

When the merchant already has a site in Framer, the published site is the design reference. See [`skills/storefront-design/framer-rebuild.md`](skills/storefront-design/framer-rebuild.md) for measuring, matching Framer's motion, hosting images on the Shopify CDN, and verifying against the published site. [`scripts/framer-compare.mjs`](skills/storefront-design/scripts/framer-compare.mjs) diffs every text element's type and position between the two sites.

## Merchant intake

Set up each merchant's Drive folder as described in [`skills/merchant-intake/drive-folder-structure.md`](skills/merchant-intake/drive-folder-structure.md), and fill in the brief from [`skills/merchant-intake/brief-template.md`](skills/merchant-intake/brief-template.md).

## Install

Copy or symlink the skill folders into your agent's skills directory, for example `~/.claude/skills/`:

```bash
git clone https://github.com/vybd-commerce/skills.git
ln -s "$PWD/skills/skills/"* ~/.claude/skills/
```

The skills expect the [Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) to be installed for Shopify API questions.

## Contributing

Update a skill when a build shows a gap. Keep skills generic: merchant-specific details belong in that merchant's brief, not here.
