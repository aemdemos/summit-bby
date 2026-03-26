/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer for S&P Global homepage.
 * Adds section breaks (<hr>) and section-metadata blocks based on template sections.
 * Runs in afterTransform only.
 * Selectors from page-templates.json sections array.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const { document } = payload;
    const sections = payload.template?.sections;
    if (!sections || sections.length < 2) return;

    // Find the content grid (top-level aem-Grid under main > .cmp-container)
    function findContentGrid() {
      const main = element.querySelector('main') || element;
      const containers = main.querySelectorAll('.cmp-container');
      for (const c of containers) {
        if (c.parentElement === main || c.parentElement?.parentElement === main) {
          const grid = c.querySelector('.aem-Grid');
          if (grid) return grid;
        }
      }
      return main;
    }

    const grid = findContentGrid();
    const gridChildren = Array.from(grid.children);

    // Find which grid child contains a given element
    function findGridChild(el) {
      for (const child of gridChildren) {
        if (child === el || child.contains(el)) return child;
      }
      return null;
    }

    // Find section elements in DOM order using cursor approach
    // Each section's element must come AFTER the previous section's element
    let lastFoundEl = null;
    const found = [];

    for (const section of sections) {
      const sels = Array.isArray(section.selector) ? section.selector : [section.selector];
      let match = null;

      for (const sel of sels) {
        try {
          const candidates = element.querySelectorAll(sel);
          for (const c of candidates) {
            if (!lastFoundEl || (lastFoundEl.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING)) {
              match = c;
              break;
            }
          }
        } catch (e) { /* invalid selector, skip */ }
        if (match) break;
      }

      if (match) {
        lastFoundEl = match;
        found.push({ section, el: match });
      }
    }

    if (found.length < 2) return;

    // Forward pass: process boundaries between consecutive sections
    for (let i = 0; i < found.length - 1; i++) {
      const current = found[i];
      const next = found[i + 1];
      const nextContainer = findGridChild(next.el) || next.el;
      const insertParent = nextContainer.parentElement || grid;

      // Insert section-metadata for current section if it has a style
      if (current.section.style) {
        const meta = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: current.section.style },
        });
        insertParent.insertBefore(meta, nextContainer);
      }

      // Insert <hr> section break between sections
      const hr = document.createElement('hr');
      insertParent.insertBefore(hr, nextContainer);
    }

    // Handle last section's metadata if it has a style
    const last = found[found.length - 1];
    if (last.section.style) {
      const meta = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: last.section.style },
      });
      const lastContainer = findGridChild(last.el) || last.el;
      const lastParent = lastContainer.parentElement || grid;
      if (lastContainer.nextSibling) {
        lastParent.insertBefore(meta, lastContainer.nextSibling);
      } else {
        lastParent.appendChild(meta);
      }
    }
  }
}
