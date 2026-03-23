/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-banner
 * Base block: hero
 * Source: https://www.bestbuy.com/
 * Source selector: div.flex-1.relative.overflow-hidden:has(img[src*='scc-lgtv'])
 * Generated: 2026-03-19
 *
 * Hero block table (from block library):
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title + subheading + CTA
 *
 * Source HTML structure (line 881):
 *   div.flex-1.relative.overflow-hidden
 *     > img.w-full.absolute (background image - LG TV)
 *     > div.relative > div > div > div > div
 *       > div > span.text-style-title-md-500 "Save on select LG big-screen TVs"
 *       > span.text-style-body-lg-400 "Big-screen action. Home court advantage."
 *       > div > a[href="/site/promo/save-select-lg-tvs"] > span "Shop all"
 */
export default function parse(element, { document }) {
  // Extract background image (absolute positioned product image)
  const bgImage = element.querySelector(
    'img.absolute, img.w-full.absolute, img[src*="scc-lgtv"], img[src*="bbystatic"]'
  );

  // Extract heading
  const heading = element.querySelector(
    '.text-style-title-md-500, [class*="title-md"], [class*="title-lg"], h1, h2'
  );

  // Extract subheading/description
  const subheading = element.querySelector(
    '.text-style-body-lg-400, [class*="body-lg"], [class*="body-md"]:not([class*="primary"])'
  );

  // Extract CTA link
  const ctaLink = element.querySelector(
    'a[href*="promo"], a[href*="save-select"], a:has(span[class*="primary"])'
  );

  const cells = [];

  // Row 1: background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: content - heading + subheading + CTA
  const contentCell = [];

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentCell.push(h2);
  }

  if (subheading) {
    const p = document.createElement('p');
    p.textContent = subheading.textContent.trim();
    contentCell.push(p);
  }

  if (ctaLink) {
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    contentCell.push(a);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
