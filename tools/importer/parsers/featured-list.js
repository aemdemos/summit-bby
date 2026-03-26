/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards (featured-list) variant.
 * Source: .article-right-rail-component inside #homepage-left-rail
 * Left rail featured articles list with date, category, and title.
 * Cards (no images) format: 1 column per card row.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract heading
  // Found: <h4 class="mb-4">Featured</h4>
  const heading = element.querySelector('h4.mb-4, h4:first-child');

  // Extract list items
  // Found: <div class="navigation-list-component_link-item">
  //   <p class="text-grey-70 mb-1 body-regular-xs">24 Mar 2026 — Energy</p>
  //   <h4 class="body-bold-m"><button>CERAWEEK: US crude export...</button></h4>
  // </div>
  const items = element.querySelectorAll('.navigation-list-component_link-item');

  items.forEach((item) => {
    const dateLine = item.querySelector('p.text-grey-70, p.body-regular-xs');
    const titleEl = item.querySelector('h4.body-bold-m, h4:last-child');
    const link = item.querySelector('a');

    const cellContent = [];
    if (dateLine) cellContent.push(dateLine);
    if (titleEl) {
      if (link) {
        const a = document.createElement('a');
        a.href = link.href || '#';
        a.textContent = titleEl.textContent.trim();
        cellContent.push(a);
      } else {
        cellContent.push(titleEl);
      }
    }
    if (cellContent.length) cells.push(cellContent);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'featured-list', cells });
  element.replaceWith(block);
}
