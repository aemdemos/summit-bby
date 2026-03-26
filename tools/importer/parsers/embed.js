/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed block.
 * Source: indices-ticker-component in .ticker
 * Extracts market ticker as an embed block with placeholder URL.
 */
export default function parse(element, { document }) {
  // The ticker is a dynamic web component - embed as a URL reference
  // Found: <indices-ticker-component> inside .ticker
  const cells = [
    ['https://www.spglobal.com/en#market-ticker'],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed', cells });
  element.replaceWith(block);
}
