/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards (product-card) variant.
 * Source: image-card-component inside #homepage-right-rail
 * Dark overlay vertical card - "Our Products" with image background and arrow icon.
 * Cards format: 2 columns [image | text content].
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find the card link
  // Found: <a class="image-card-component_container" href="https://www.marketplace.spglobal.com/en/">
  const link = element.querySelector('a.image-card-component_container, a[href]');
  const href = link?.getAttribute('href') || '#';

  // Column 1: Image
  // Found: <img src="/content/dam/.../Lights-on-Road.jpg" alt="lights and road" class="image-card-component_image">
  const image = element.querySelector('img.image-card-component_image, picture');
  const pic = image?.closest('picture') || image;

  // Column 2: Text content
  const contentCell = [];

  // Found: <h3 class="...image-card-component_heading..."><span>Our Products</span></h3>
  const heading = element.querySelector('.image-card-component_heading, h3');
  if (heading) contentCell.push(heading);

  // Found: <div class="image-card-component_description..."><span>Premium datasets...</span></div>
  const desc = element.querySelector('.image-card-component_description');
  if (desc) contentCell.push(desc);

  // Add link
  if (href && href !== '#') {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = heading?.textContent?.trim() || 'Learn More';
    contentCell.push(a);
  }

  if (pic || contentCell.length) {
    cells.push([pic || '', contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'product-card', cells });
  element.replaceWith(block);
}
