# Category playbooks

What a storefront should emphasize per vertical. "Card" = the product card used on homepage and collection grids. "Product page" = `app/routes/products.$handle.tsx` and its sections. Use these as the starting point for section design, not a template.

## Apparel / fashion
- Card: colour swatches that swap the card image, quick-add, 3:4 portrait images.
- Product page: size and colour options, size guide link (`/pages/size-guide`), Shipping & Returns accordion.
- Homepage: editorial hero, featured products, full grid, brand statement.

## Streetwear / drop-based apparel
Use when the brand sells in limited drops (the brief names drop-model references, or the catalog has a "new" collection, style codes and frequent sell-outs).
- Catalog model: each colourway may be its own product, grouped by a style code (a metafield or tag), with Size as the only option. Check how the store models this before building; don't force colour swatches onto it. Group colourways of one style on the product page and link between them.
- Card: square images, minimal text (title, colour, price), dense grid. Show sold-out products with a clear "sold out" state instead of hiding them.
- Collection page: category tabs by product type (jackets, tops, pants, hats, bags…), plus "new" and "sale".
- Product page: size picker with sold-out sizes disabled, size guide link, colourway switcher across the style.
- Drop mechanics, only if the brief asks for them: per-customer order limits (enforced in Shopify, never only in the UI), an alert bar for drop announcements, and a "store closed" state between drops with mailing-list signup.
- Navigation can lead with editorial content (previews, lookbook, news) over product categories.

## Beauty / skincare
- Card: swatches only if shade is an option. Show size/volume (e.g. "50 ml") under the title.
- Product page: shade/size options. Ingredients, How to use and Benefits accordions sourced from product metafields (ask which namespace/key the merchant uses; don't hardcode text).
- Homepage: routine- or concern-led sections ("Cleanse", "Treat").

## Food & beverage
- Card: weight/pack size, quick-add, no swatches.
- Product page: size/flavour/pack options. Ingredients, Nutrition and Allergens accordions (metafields). If the store sells subscriptions, check selling plans via the toolkit before building UI.
- Homepage: Bestsellers and Bundles sections, appetite-led imagery.

## Home & furniture
- Card: 4:3 or 1:1 images. Material/finish swatches if that option exists.
- Product page: Dimensions, Materials & care and Delivery accordions. Larger gallery.
- Homepage: room- or collection-led sections.

## Jewelry / accessories
- Card: 1:1 images, metal/finish swatches.
- Product page: Materials, Sizing (ring size guide) and Care accordions. Zoomable gallery.

## Electronics / gadgets
- Card: 1:1 images, one key spec line under the title, swatches only if colour is an option.
- Product page: Specs table (metafields), What's in the box, Warranty. Keep compare-at pricing prominent.
- Homepage: product-forward with a shorter hero and category tiles.

## Other / mixed
- Start from a neutral grid (no swatches), and add product-page accordions only where real metafields back them. Ask the user which product details matter most.

## General rules
- Drive swatches off option names with one regex (e.g. `/colou?r|shade|finish|metal/i`). Don't duplicate the component per vertical.
- Build accordions with `<details>/<summary>`, reusing any existing accordion component in the repo.
- Never hardcode product facts (ingredients, specs, dimensions). They come from Shopify fields or metafields.
- Image aspect ratio is a design token (e.g. `--aspect-product`). Set it once, not per image.
