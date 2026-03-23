/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Best Buy section breaks and section-metadata.
 * Runs in afterTransform only. Uses payload.template.sections.
 * All selectors from captured DOM (migration-work/cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { sections } = template;
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };

    // Process sections in reverse order to preserve DOM positions
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section, reverseIdx) => {
      const idx = sections.length - 1 - reverseIdx;

      // Find section element using selector
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add section break (<hr>) before each section except the first
      if (idx > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
