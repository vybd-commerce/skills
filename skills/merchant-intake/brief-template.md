# Merchant brief

**required** = ask the user if missing. **derivable** = the agent may propose a value and log it under "Decisions made by agent".

## 1. Merchant
- Brand name as displayed — **required**
- Slug (repo/branch names) — derivable
- One-line positioning (e.g. "small-batch skincare for sensitive skin") — **required**
- Brand story / about text — from `05-content/pages/about`, else derivable (flag for review)
- Brand adjectives (3–5) — **required**
- Reference sites they like — optional

## 2. What they sell
- Category / vertical — **required**
- Product count and types — derivable from `products.csv`
- Variant options — derivable from `products.csv`
- Product details beyond Shopify defaults (ingredients, materials, specs) — derivable from CSV columns
- Featured products / collections for the homepage — optional, else newest

## 3. Shopify store
- Store domain (`xxx.myshopify.com`) — **required**
- Hydrogen storefront name (for Oxygen link) — **required for deploy**
- Catalog already set up in the store? (yes / partial / no → shopify-admin-setup) — **required**
- Collections and menus wanted — derivable from products and nav needs
- Credentials: never written here; confirm only that they've been shared via the password manager

## 4. Market
- Country (ISO, e.g. `US`) — **required**
- Currency (ISO, e.g. `USD`) — **required**
- Language (ISO, e.g. `EN`) — **required**
- Additional markets — optional; if any, pick a URL strategy (subfolders / domains / subdomains)

## 5. Design
- Figma file / handoff — optional for v1
- Logo — **required** (from `01-brand-assets/logo`)
- Colours — from assets or brand guide, else derivable
- Fonts — from assets, else derivable
- Homepage section plan — derivable (see storefront-design)

## 6. Content
- Pages needed — **required** (the team confirms the list per merchant)
- Copy source per page — from `05-content/pages`; anything drafted by the agent is flagged
- Policies — from `05-content/policies` or already in Shopify; **never invented**
- SEO inputs — from `05-content/seo.md` (SEO team member)
- Social links, support email — optional

## 7. Launch
- Preview deploy approver — **required**
- Production deploy approver — **required**
- Target launch date — optional

## Decisions made by agent
_Every derived value, with a one-line reason._

## Blocked
_Anything waiting on the team, with who owns it._
