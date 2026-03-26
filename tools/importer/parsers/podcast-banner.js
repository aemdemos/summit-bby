/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero (podcast-banner) variant.
 * Source: .full-width-image-banner-component inside experience fragment
 * Podcast promo banner with background image, overlay text, and CTA.
 * Hero format: Row 1 = bg image, Row 2 = heading + description + CTA.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Background image
  // Found: <img src="...MI_0924_AI_Solutions-1..." class="full-width-image-banner-component_banner-image">
  const bgImage = element.querySelector('img.full-width-image-banner-component_banner-image, picture');
  if (bgImage) {
    const pic = bgImage.closest('picture') || bgImage;
    cells.push([pic]);
  }

  // Row 2: Content (overline + heading + description + CTA)
  const contentCell = [];

  // Found: <p class="caps-bold-micro">S&P Global</p>
  const overline = element.querySelector('.caps-bold-micro, p.caps-bold-micro');
  if (overline) contentCell.push(overline);

  // Found: <h4 class="mt-4">Stay Ahead of the Curve with Podcasts</h4>
  const heading = element.querySelector('h4, h2, h3');
  if (heading) contentCell.push(heading);

  // Found: <div class="...card-description...">Our changing world...</div>
  const description = element.querySelector('.full-width-image-banner-component_card-description, .cmp-rte-text');
  if (description) contentCell.push(description);

  // Found: <a href=".../podcasts" class="...">Listen Now</a>
  const cta = element.querySelector('.full-width-image-banner-component_card-button a, a[href]');
  if (cta) contentCell.push(cta);

  if (contentCell.length) cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'podcast-banner', cells });
  element.replaceWith(block);
}
