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
- The default branch → production, so merging becomes the approval gate. Protect the branch and require PR review. The user merges into the default branch, not the agent.
- Creating the GitHub repo, adding secrets and changing branch protection all need the user's approval.

Connecting (the team member does this in the Hydrogen channel → Create storefront → Connect to GitHub):
- Shopify asks to link the Shopify login to a GitHub account ("Confirm account link"). If the team is using the merchant's Shopify login, this links the merchant's account to the developer's GitHub. Point that out, and have them install the Shopify GitHub app with **Only select repositories** → this repo. The link can be revoked later in GitHub → Settings → Applications.
- Shopify then pushes `.github/workflows/oxygen-deployment-<id>.yml` on a new `shopify-setup-oxygen-workflow-*` branch cut from the default branch, and opens a PR. Check for it with `git fetch` and `gh run list`.
- If the storefront code isn't on the default branch yet, that first run fails with "Looks like you're trying to run a Hydrogen command outside of a Hydrogen project". Cherry-pick Shopify's workflow commit onto the working branch and push it: that branch gets a preview deploy. Merging the working branch into the default branch then deploys production, and Shopify's setup PR becomes redundant (close it unmerged).

After connecting:
- The preview URL isn't printed in the GitHub Actions log. It's under Hydrogen → [storefront] → Deployments.
- Preview deployments are private (Shopify login required). The Preview environment itself can't be made public: switch URL privacy to Public on each deployment's details page. For one stable shareable URL, add a custom environment tied to the working branch.
- Variables Shopify doesn't inject (e.g. email or third-party API keys) must be added per environment under Storefront settings → Environments and variables, and only apply from the next deploy.
- Commits, PR titles/descriptions and `--metadata-description` carry no AI attribution (no `Co-Authored-By: Claude…`, no "Generated with Claude Code", no mention of Claude or Anthropic). See the rule in `build-storefront`.

## Done when

The preview URL is live, e2e tests pass against it, and production is either deployed with the approval recorded, or explicitly pending approval.
