/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards (feed-cards) variant.
 * Source: card-feed-component inside .automaticfeedcards
 * Auto feed cards showing daily newsletter editions with dark overlay.
 * Cards format: 2 columns per card [image | text content].
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all image cards in the feed
  // Found: <div class="image-card-component"> inside card-feed-component
  const cards = element.querySelectorAll('.image-card-component');
  const cardEls = cards.length ? cards : [element];

  cardEls.forEach((card) => {
    const link = card.querySelector('a.image-card-component_container, a[href]');
    const href = link?.getAttribute('href') || '#';

    // Image
    // Found: <img src="...Corp_0606_DailyUpdateCapitalMarkets..." class="image-card-component_image">
    const image = card.querySelector('img.image-card-component_image, picture');
    const pic = image?.closest('picture') || image;

    // Text content
    const contentCell = [];

    // Found: <p class="caps-bold-micro...">Newsletter - S&P Global</p>
    const overline = card.querySelector('p.caps-bold-micro');
    if (overline) contentCell.push(overline);

    // Found: <h3 class="...image-card-component_heading..."><span>Harmonizing Carbon...</span></h3>
    const heading = card.querySelector('.image-card-component_heading, h3');
    if (heading) contentCell.push(heading);

    // Found: <div class="image-card-component_description..."><span>Tuesday, March 24...</span></div>
    const desc = card.querySelector('.image-card-component_description');
    if (desc) contentCell.push(desc);

    // Add link
    if (href && href !== '#') {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = heading?.textContent?.trim() || 'Read More';
      contentCell.push(a);
    }

    if (pic || contentCell.length) {
      cells.push([pic || '', contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'feed-cards', cells });
  element.replaceWith(block);
}
