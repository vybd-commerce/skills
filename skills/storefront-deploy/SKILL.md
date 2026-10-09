---
name: storefront-deploy
description: Deploy a merchant's Hydrogen storefront to Shopify Oxygen - link the storefront, sync environment variables, deploy previews, run tests against them, and promote to production only with human approval. Use as step 9 of build-storefront, or whenever deploying a storefront.
---

# Deploy to Oxygen

## 1. Prerequisites (team member, one-time per store)

- The Hydrogen sales channel is installed on the store, and a Hydrogen storefront has been created for this merchant (its name is in the brief).
- The Shopify CLI is logged in with an account that has access to the store.

## 2. Link and environment

Login and link are interactive, so ask the user to run:

```
! npx shopify hydrogen link --storefront "<storefront name>"
```

Then:
- `npx shopify hydrogen env list` shows the environments (Production, Preview, plus any custom ones).
- Oxygen environment variables are the source of truth. Use `env pull` to fetch them into the local `.env`. Only use `env push` to send local changes up, and show the user exactly which keys will change first: pushing overwrites the shared environment.

## 3. Preview deploy (agent may do this)

```bash
npx shopify hydrogen deploy --preview --auth-bypass-token \
  --metadata-description "<what changed>"
```

- The working tree must be clean and committed (don't use `--force` to get around this).
- Record the preview URL in the hand-off.
- Run `pnpm test:e2e` against it with `BASE_URL=<preview url>` and `OXYGEN_AUTH_BYPASS_TOKEN=<token from the deploy output>` (see `storefront-test`).

## 4. Production deploy (human approval required)

Only after **all** of these are true:
1. `storefront-verify` passes, and the e2e tests pass against the preview.
2. The production approver named in the brief has reviewed the preview and explicitly said to deploy.

Then run `npx shopify hydrogen deploy` (Production is the default target, or pass `--env <handle>`). Record who approved it and the deployment URL.

## 5. Continuous deployment (optional)

If the team connects the GitHub repo through the Hydrogen channel, Shopify adds an Oxygen workflow that deploys on every push. In that case:
- Pushes to non-default branches → preview deployments.
- The default branch → production, so merging becomes the approval gate. Protect the branch and require PR review.
- Creating the GitHub repo, adding secrets and changing branch protection all need the user's approval.

## Done when

The preview URL is live, e2e tests pass against it, and production is either deployed with the approval recorded, or explicitly pending approval.
