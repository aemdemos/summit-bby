/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards (horizontal-card) variant.
 * Source: box-card-component.horizontal inside #featured-card-list
 * Horizontal feature cards with thumbnail, overline, subtitle, heading, description.
 * Cards format: 2 columns per row [image | text content].
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all horizontal cards in the container
  // Found: <box-card-component> with class "horizontal" inside #featured-card-list
  const cards = element.querySelectorAll('box-card-component, a.box-card-component');
  const cardEls = cards.length ? cards : [element];

  cardEls.forEach((card) => {
    const link = card.querySelector('a[href]') || card;
    const href = link.getAttribute?.('href') || '#';

    // Image
    // Found: <img class="box-card-component_img" src="...">
    const image = card.querySelector('img.box-card-component_img, picture');
    const pic = image?.closest('picture') || image;

    // Text content
    const contentCell = [];

    // Found: <div class="box-card-component_content_overline...">Look Forward: Energy Futures</div>
    const overline = card.querySelector('.box-card-component_content_overline');
    if (overline) contentCell.push(overline);

    // Found: <div class="box-card-component_content_subtitle...">Featured Article</div>
    const subtitle = card.querySelector('.box-card-component_content_subtitle');
    if (subtitle) contentCell.push(subtitle);

    // Found: <h4 class="box-card-component_content_title...">The multidimensional energy future</h4>
    const heading = card.querySelector('.box-card-component_content_title');
    if (heading) contentCell.push(heading);

    // Found: <p class="box-card-component_content_desc...">Explore the insights...</p>
    const desc = card.querySelector('.box-card-component_content_desc');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'horizontal-card', cells });
  element.replaceWith(block);
}
