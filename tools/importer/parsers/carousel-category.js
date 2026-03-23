/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-category
 * Base block: carousel
 * Source: https://www.bestbuy.com/
 * Source selectors:
 *   Section 2: div.deals-by-categories div.pl-flex-carousel-container
 *   Section 6: div.flex.items-stretch.flex-col.rounded-border-lv:has(> .p-200)
 * Generated: 2026-03-19
 *
 * Carousel block table (from block library):
 *   Row 1: block name
 *   Each subsequent row: [image | text content (title, description, CTA)]
 *
 * Source HTML structure (section 2 - deals by categories):
 *   ul.c-carousel-list > li.c-carousel-item
 *     > div.carousel-item > a
 *       > div.carousel-item-image-wrapper > img
 *       > p.carousel-item-cta (label text)
 *
 * Source HTML structure (section 6 - trending):
 *   ul > li > div > a
 *     > div > div > img (circular thumbnail)
 *     > span (label text below)
 */
export default function parse(element, { document }) {
  // Try section 2 pattern: li.c-carousel-item items
  let items = Array.from(element.querySelectorAll('li.c-carousel-item'));

  // Fallback: section 6 pattern - list items with links and images
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('li:has(a img)'));
  }

  // Fallback: direct link+image containers
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('a:has(img)'));
  }

  const cells = [];

  items.forEach((item) => {
    // Extract image
    const img = item.querySelector('img:not([src^="data:image/svg"])');
    const svgImg = !img ? item.querySelector('img') : null;
    const image = img || svgImg;

    // Extract link
    const link = item.querySelector('a[href]') || item.closest('a[href]');

    // Extract label text
    const label = item.querySelector('p.carousel-item-cta, p, span:not(.sr-only)');

    // Build image cell
    const imageCell = [];
    if (image) imageCell.push(image);

    // Build content cell with linked label
    const contentCell = [];
    if (label && link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = label.textContent.trim();
      contentCell.push(a);
    } else if (label) {
      contentCell.push(label);
    }

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([
        imageCell.length > 0 ? imageCell : '',
        contentCell.length > 0 ? contentCell : '',
      ]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-category', cells });
  element.replaceWith(block);
}
