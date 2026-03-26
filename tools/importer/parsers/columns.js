/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Source: navigation-list-component elements inside .navlist in bottom section
 * 3-column grid of navigation lists: Market Insights, Podcasts, Featured Products.
 * Columns format: 3 columns in a single row.
 */
export default function parse(element, { document }) {
  // Find all navigation list components in the bottom nav section
  // Found: 3 <navigation-list-component> elements, each with:
  //   <h4 class="mb-4">Market Insights/Podcasts/Featured Products</h4>
  //   <ul><li class="navigation-list-component_link-item">
  //     <a href="..."><h4 class="body-bold-m navigation-list-component_title">Energy & Commodities</h4></a>
  //   </li></ul>
  const navLists = element.querySelectorAll('navigation-list-component, .navigation-list-component');

  // Build one column per navigation list
  const columns = [];

  navLists.forEach((navList) => {
    const colContent = [];

    // List heading
    // Found: <h4 class="mb-4" id="navigation-list-component-:r4:">Market Insights</h4>
    const heading = navList.querySelector('h4.mb-4, h4[id^="navigation-list-component"]');
    if (heading) {
      const h = document.createElement('h4');
      h.textContent = heading.textContent.trim();
      colContent.push(h);
    }

    // List items
    const items = navList.querySelectorAll('.navigation-list-component_link-item, li');
    const ul = document.createElement('ul');

    items.forEach((item) => {
      const link = item.querySelector('a[href]');
      const title = item.querySelector('.navigation-list-component_title, h4.body-bold-m');

      if (title) {
        const li = document.createElement('li');
        if (link) {
          const a = document.createElement('a');
          a.href = link.getAttribute('href') || '#';
          a.textContent = title.textContent.trim();
          li.appendChild(a);
        } else {
          li.textContent = title.textContent.trim();
        }
        ul.appendChild(li);
      }
    });

    if (ul.children.length) colContent.push(ul);
    if (colContent.length) columns.push(colContent);
  });

  // Build cells: single row with all columns
  const cells = columns.length ? [columns] : [];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
