/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards (solid-cards) variant.
 * Source: solid-card-component inside .vertical-card.teaser in Featured Products section
 * 4 light-blue solid background cards with heading, description, and arrow icon.
 * Cards (no images) format: 1 column per card row with heading + description + link.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find the card link
  // Found: <a href="...sp-capital-iq-pro" class="...solid-card-text-overlay-component bg-blue-light...">
  const link = element.querySelector('a.solid-card-text-overlay-component, a[href]');
  const href = link?.getAttribute('href') || '#';

  const contentCell = [];

  // Found: <h4 title="S&P Capital IQ Pro" class="...solid-card-text-overlay-component_heading...">S&P Capital IQ Pro</h4>
  const heading = element.querySelector('.solid-card-text-overlay-component_heading, h4, h3');
  if (heading) contentCell.push(heading);

  // Found: <div class="...solid-card-text-overlay-component_description...">Access S&P Capital IQ Pro...</div>
  const desc = element.querySelector('.solid-card-text-overlay-component_description');
  if (desc) contentCell.push(desc);

  // Add link
  if (href && href !== '#') {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = heading?.textContent?.trim() || 'Learn More';
    contentCell.push(a);
  }

  if (contentCell.length) cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'solid-cards', cells });
  element.replaceWith(block);
}
