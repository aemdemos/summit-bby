/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards (report-card) variant.
 * Source: box-card-component.vertical in special reports section
 * Large vertical card for Bitcoin Volatility report with image, subtitle, heading, description.
 * Cards format: 2 columns [image | text content].
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find the card link
  // Found: <a href="...bitcoin-volatility-trends-deep-dive" class="box-card-component static-box-card...vertical">
  const cardLink = element.querySelector('a.box-card-component, a.static-box-card') || element.querySelector('a[href]');
  const href = cardLink?.getAttribute('href') || '#';

  // Column 1: Image
  // Found: <img class="box-card-component_img" src="...corp_0301_BitcoinVolatilityTrends...">
  const image = element.querySelector('img.box-card-component_img, picture');
  const pic = image?.closest('picture') || image;

  // Column 2: Text content
  const contentCell = [];

  // Found: <div class="box-card-component_content_subtitle...">Future of Capital Markets</div>
  const subtitle = element.querySelector('.box-card-component_content_subtitle');
  if (subtitle) contentCell.push(subtitle);

  // Found: <h3 class="box-card-component_content_title...">Bitcoin Volatility Trends...</h3>
  const heading = element.querySelector('.box-card-component_content_title');
  if (heading) contentCell.push(heading);

  // Found: <p class="box-card-component_content_desc...">Bitcoin's volatility is easing...</p>
  const desc = element.querySelector('.box-card-component_content_desc');
  if (desc) contentCell.push(desc);

  // Add link
  if (href && href !== '#') {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = 'Read More';
    contentCell.push(a);
  }

  if (pic || contentCell.length) {
    cells.push([pic || '', contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'report-card', cells });
  element.replaceWith(block);
}
