/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero (image-banner) variant.
 * Source: .full-width-image-banner-component inside .bg-grey-5
 * Full-width image banner with overlay text "The Dow Hits 50,000!" and CTA.
 * Hero format: Row 1 = bg image, Row 2 = heading + description + CTA.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Background image
  // Found: <img src="...spg-balloons-sky-blue-white-floating..." class="full-width-image-banner-component_banner-image">
  const bgImage = element.querySelector('img.full-width-image-banner-component_banner-image, picture');
  if (bgImage) {
    const pic = bgImage.closest('picture') || bgImage;
    cells.push([pic]);
  }

  // Row 2: Content
  const contentCell = [];

  // Found: <p class="caps-bold-micro">...</p> (optional overline)
  const overline = element.querySelector('.caps-bold-micro');
  if (overline && overline.textContent.trim()) contentCell.push(overline);

  // Found: <h2 class="mt-4">The Dow® Hits 50,000!</h2>
  const heading = element.querySelector('h2, h3, h4');
  if (heading) contentCell.push(heading);

  // Found: <div class="...card-description...">As we celebrate...</div>
  const description = element.querySelector('.full-width-image-banner-component_card-description, .cmp-rte-text');
  if (description) contentCell.push(description);

  // Found: <a href="https://www.indexologyblog.com/...">Learn More</a>
  const cta = element.querySelector('.full-width-image-banner-component_card-button a, a[href]');
  if (cta) contentCell.push(cta);

  if (contentCell.length) cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'image-banner', cells });
  element.replaceWith(block);
}
