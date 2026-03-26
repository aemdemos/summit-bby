/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards (hero-card) variant.
 * Source: box-card-component.vertical inside #hero-article
 * Large hero article card with image, overline, subtitle, heading, description.
 * Cards format: 2 columns [image | text content].
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find the card link wrapper
  // Found: <a href="...energy-futures" class="box-card-component static-box-card...vertical">
  const cardLink = element.querySelector('a.box-card-component, a.static-box-card') || element.querySelector('a[href]');
  const href = cardLink?.getAttribute('href') || '#';

  // Column 1: Image
  // Found: <img class="box-card-component_img" src="...corp_0302_lookforwardenergyfutures...">
  const image = element.querySelector('img.box-card-component_img, picture');
  const pic = image?.closest('picture') || image;

  // Column 2: Text content
  const contentCell = [];

  // Found: <div class="box-card-component_content_overline caps-bold-micro...">Look Forward – Volume 13</div>
  const overline = element.querySelector('.box-card-component_content_overline');
  if (overline) contentCell.push(overline);

  // Found: <div class="box-card-component_content_subtitle...">Future of Energy</div>
  const subtitle = element.querySelector('.box-card-component_content_subtitle');
  if (subtitle) contentCell.push(subtitle);

  // Found: <h2 class="box-card-component_content_title...">Look Forward: Energy Futures</h2>
  const heading = element.querySelector('.box-card-component_content_title');
  if (heading) contentCell.push(heading);

  // Found: <p class="box-card-component_content_desc...">The global energy system...</p>
  const desc = element.querySelector('.box-card-component_content_desc');
  if (desc) contentCell.push(desc);

  // Add link as CTA
  if (href && href !== '#') {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = 'Read More';
    contentCell.push(link);
  }

  if (pic || contentCell.length) {
    cells.push([pic || '', contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-card', cells });
  element.replaceWith(block);
}
