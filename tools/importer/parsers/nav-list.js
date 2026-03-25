/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards (nav-list) variant.
 * Source: navigation-list-component inside .navlist in special reports section
 * Navigation list of special report links with category and chevron icons.
 * Cards (no images) format: 1 column per card row.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all list items
  // Found: <li class="navigation-list-component_link-item">
  //   <a href="..."><p class="text-grey-70...">Digital & AI</p>
  //   <h4 class="body-bold-m navigation-list-component_title">Look Forward: Data Center Frontiers</h4></a>
  // </li>
  const items = element.querySelectorAll('.navigation-list-component_link-item, li');

  items.forEach((item) => {
    const link = item.querySelector('a.navigation-list-component_link-item-anchor, a[href]');
    const href = link?.getAttribute('href') || '#';
    const category = item.querySelector('p.text-grey-70, p.body-regular-xs');
    const title = item.querySelector('.navigation-list-component_title, h4.body-bold-m');

    const cellContent = [];
    if (category) cellContent.push(category);
    if (title && href && href !== '#') {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = title.textContent.trim();
      cellContent.push(a);
    } else if (title) {
      cellContent.push(title);
    }

    if (cellContent.length) cells.push(cellContent);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'nav-list', cells });
  element.replaceWith(block);
}
