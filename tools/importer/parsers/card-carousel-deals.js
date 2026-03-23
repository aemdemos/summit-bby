/* eslint-disable */
/* global WebImporter */

/**
 * Parser: card-carousel-deals
 * Base block: card-carousel
 * Source: https://www.bestbuy.com/
 * Source selector: div.grid:has([data-testid="offer-card"])
 * Generated: 2026-03-19
 *
 * Card-carousel block table:
 *   Row 1: block name
 *   Each subsequent row: [image | content (savings headline, description, link)]
 *
 * Source HTML structure:
 *   div.grid (4-column grid with background image)
 *     > div (card wrapper with box-shadow)
 *       > div[data-testid="offer-card"]
 *         > div[data-testid="offer-card-body-copy-lg"] "Save up to\n50%"
 *         > img[data-testid="Deals-Image-TestID"]
 *         > div[data-testid="offer-card-body-copy"] description text
 *         > a > button "Shop now"
 */
export default function parse(element, { document }) {
  // Find deal card elements
  const cards = Array.from(element.querySelectorAll('[data-testid="offer-card"]'));

  const cells = [];

  cards.forEach((card) => {
    // Extract savings headline (e.g., "Save up to 50%")
    const headline = card.querySelector('[data-testid="offer-card-body-copy-lg"]');

    // Extract product image
    const img = card.querySelector('img[data-testid="Deals-Image-TestID"]')
      || card.querySelector('img:not([src^="data:"])');

    // Extract description text
    const desc = card.querySelector('[data-testid="offer-card-body-copy"]');

    // Extract link
    const link = card.querySelector('a[href]');

    // Build image cell
    const imageCell = [];
    if (img) imageCell.push(img);

    // Build content cell
    const contentCell = [];
    if (headline) {
      const h = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = headline.textContent.trim().replace(/\n/g, ' ');
      h.appendChild(strong);
      contentCell.push(h);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentCell.push(p);
    }
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = 'Shop now';
      contentCell.push(a);
    }

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([
        imageCell.length > 0 ? imageCell : '',
        contentCell.length > 0 ? contentCell : '',
      ]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'card-carousel-deals', cells });
  element.replaceWith(block);
}
