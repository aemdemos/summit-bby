/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards (card-plus-list) variant.
 * Source: card-lists-component inside .card_plus_list
 * Combined card + list: featured solid card alongside navigation list of AI-related articles.
 * Cards format: multiple rows. First row = featured card (image-less), subsequent rows = list items.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Featured card section
  // Found: <div class="card-lists-component_card-section"><solid-card-component>
  //   <a href="...electrotech-age-arrived" class="...solid-card-text-overlay-component bg-grey-5...">
  //   <p class="...solid-card-text-overlay-component_overline...">Special Reports</p>
  //   <p class="...solid-card-text-overlay-component_subtitle...">Mar 19, 2026</p>
  //   <h3 class="...solid-card-text-overlay-component_heading...">Has the electrotech age arrived?</h3>
  //   <div class="...solid-card-text-overlay-component_description...">Nations are racing...</div>
  const cardSection = element.querySelector('.card-lists-component_card-section');
  if (cardSection) {
    const cardLink = cardSection.querySelector('a.solid-card-text-overlay-component, a[href]');
    const href = cardLink?.getAttribute('href') || '#';
    const contentCell = [];

    const overline = cardSection.querySelector('.solid-card-text-overlay-component_overline');
    if (overline) contentCell.push(overline);

    const subtitle = cardSection.querySelector('.solid-card-text-overlay-component_subtitle');
    if (subtitle) contentCell.push(subtitle);

    const heading = cardSection.querySelector('.solid-card-text-overlay-component_heading, h3, h4');
    if (heading) contentCell.push(heading);

    const desc = cardSection.querySelector('.solid-card-text-overlay-component_description');
    if (desc) {
      // Truncate the very long description to first sentence
      const p = document.createElement('p');
      const text = desc.textContent.trim();
      p.textContent = text.length > 200 ? text.substring(0, 200) + '...' : text;
      contentCell.push(p);
    }

    if (href && href !== '#') {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = heading?.textContent?.trim() || 'Read More';
      contentCell.push(a);
    }

    if (contentCell.length) cells.push(contentCell);
  }

  // List section - navigation list items
  // Found: <div class="card-lists-component_list-section"><navigation-list-component>
  //   <li class="navigation-list-component_link-item">
  //     <a href="..."><p class="text-grey-70...">Special Reports - Jan 23, 2026</p>
  //     <h4 class="...navigation-list-component_title">Energy, Compute, and the Quantum Era</h4></a>
  const listSection = element.querySelector('.card-lists-component_list-section, navigation-list-component');
  if (listSection) {
    const items = listSection.querySelectorAll('.navigation-list-component_link-item, li');
    items.forEach((item) => {
      const link = item.querySelector('a[href]');
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
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'card-plus-list', cells });
  element.replaceWith(block);
}
