/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero (split-banner) variant.
 * Source: .full-width-split-banner-component inside .fullwidthsplitbanner
 * Split banner: left half image, right half dark bg with overline, subtitle, heading, description, CTA.
 * Hero format: Row 1 = image, Row 2 = heading + text content + CTA.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Image (left half of split banner)
  // Found: <img class="full-width-split-banner-component__split-banner-image" src="...corp_0904_ceraweek2025_2...">
  const image = element.querySelector('img.full-width-split-banner-component__split-banner-image, picture');
  if (image) {
    const pic = image.closest('picture') || image;
    cells.push([pic]);
  }

  // Row 2: Text content (right half)
  const contentCell = [];

  // Found: <div class="full-width-split-banner-component__overline-text...">March 23-27, 2026</div>
  const overline = element.querySelector('.full-width-split-banner-component__overline-text');
  if (overline) contentCell.push(overline);

  // Found: <div class="full-width-split-banner-component__subtitle-text...">Houston, Texas</div>
  const subtitle = element.querySelector('.full-width-split-banner-component__subtitle-text');
  if (subtitle) contentCell.push(subtitle);

  // Found: <h2 class="full-width-split-banner-component__heading...">CERAWeek</h2>
  const heading = element.querySelector('.full-width-split-banner-component__heading, h2, h3');
  if (heading) contentCell.push(heading);

  // Found: <div class="full-width-split-banner-component__description..."><p>Registration is now open...</p></div>
  const description = element.querySelector('.full-width-split-banner-component__description');
  if (description) contentCell.push(description);

  // Found: <a href="https://www.ceraweek.com/en" class="...">Register Now</a>
  const cta = element.querySelector('.full-width-split-banner-component__cta-container a, .full-width-split-banner-component__secondary-cta a');
  if (cta) contentCell.push(cta);

  if (contentCell.length) cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'split-banner', cells });
  element.replaceWith(block);
}
