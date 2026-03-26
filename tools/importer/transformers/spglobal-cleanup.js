/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: S&P Global cleanup.
 * Removes non-authorable content from https://www.spglobal.com/en
 * Selectors from captured DOM.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove modals and overlays that block parsing
    // Found: <div class="static-modal-component hidden flex-col justify-center bg-black-background">
    // Found: <div class="modal-component-web"> inside indices-ticker-component
    WebImporter.DOMUtils.remove(element, [
      '.static-modal-component',
      '.modal-component-web',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'noscript',
      'iframe',
    ]);

    // Remove visual dividers (not authorable content)
    // Found: <div class="dividerline"> with <div class="divider-line-component">
    WebImporter.DOMUtils.remove(element, [
      '.dividerline',
    ]);

    // Remove stray title elements from experience fragments
    // Found: <title>ef_ENT_525_A_Podcast</title>
    element.querySelectorAll('title').forEach((el) => el.remove());

    // Remove empty link elements
    element.querySelectorAll('link').forEach((el) => el.remove());

    // Remove empty source elements without srcset in pictures
    element.querySelectorAll('source:not([srcset])').forEach((el) => el.remove());
  }
}
