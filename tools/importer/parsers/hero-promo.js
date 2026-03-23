/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-promo
 * Base block: hero
 * Source: https://www.bestbuy.com/
 * Source selector: section.hero-v2-bg-gradient
 * Generated: 2026-03-19
 *
 * Hero block table (from block library):
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title + subheading + CTA
 *
 * Source HTML structure:
 *   section.hero-v2-bg-gradient
 *     > div > div > h2 > img (logo/promo image)
 *     > div.ml-800 > p.heading-2 (heading) + p.heading-5 (subheading)
 *     > div.ml-1200 > p.disclaimer (disclaimer) + a.btn (CTA)
 */
export default function parse(element, { document }) {
  // Extract promo/logo image from h2 > img
  const promoImg = element.querySelector('h2 img, h2 picture, img[alt*="Tech Fest"], img[alt*="Sale"]');

  // Extract heading text
  const heading = element.querySelector('.heading-2, [class*="heading-2"], h2:not(:has(img)), h1');

  // Extract subheading
  const subheading = element.querySelector('.heading-5, [class*="heading-5"], .heading-3');

  // Extract disclaimer
  const disclaimer = element.querySelector('.disclaimer, [class*="disclaimer"]');

  // Extract CTA link
  const cta = element.querySelector('a.btn, a[class*="btn"], a[href*="sale-page"]');

  const cells = [];

  // Row 1: promo image (as background image row per hero block structure)
  if (promoImg) {
    cells.push([promoImg]);
  }

  // Row 2: content cell - heading, subheading, disclaimer, CTA
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (disclaimer) contentCell.push(disclaimer);
  if (cta) contentCell.push(cta);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
