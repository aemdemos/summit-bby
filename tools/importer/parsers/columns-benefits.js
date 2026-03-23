/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-benefits
 * Base block: columns
 * Source: https://www.bestbuy.com/
 * Source selector: div.signin-create-account-container
 * Generated: 2026-03-19
 *
 * Columns block table (from block library):
 *   Row 1: block name
 *   Each subsequent row: [col1 | col2 | ... colN]
 *   Each cell can contain text, images, or inline elements
 *
 * Source HTML structure (mobile view, line 776):
 *   div.signin-create-account-container.p-200.md__hidden
 *     > div > div > h2 "Sign in for more benefits"
 *     > div.flex.flex-row.mt-100
 *       > div.flex.flex-row.w-1/2 > img (checkmark) + span "Free shipping*"
 *       > div.flex.flex-row.w-1/2 > img (checkmark) + span "Deals picked for you"
 *     > div.flex.flex-row.mt-100
 *       > div.flex.flex-row.w-1/2 > img (checkmark) + span "Easy order tracking"
 *       > div.flex.flex-row.w-1/2 > img (checkmark) + span "Faster checkout"
 *     > div.mt-200 > button "Sign in" + button "Create an account"
 *     > div > span "*Exclusions apply." + a "Learn more."
 *
 * Desktop view (line 833): single-row with icon + long text + buttons
 */
export default function parse(element, { document }) {
  // Extract heading
  const heading = element.querySelector('h2, h1, h3, [class*="title-sm-500"]');

  // Skip instances without a heading (duplicate desktop variant with empty first column)
  if (!heading) {
    element.remove();
    return;
  }

  // Extract benefit items (checkmark icon + text pairs)
  const benefitSpans = Array.from(
    element.querySelectorAll('span[class*="body-sm-400"]:not([class*="subdued"])')
  ).filter((span) => {
    const text = span.textContent.trim();
    return text && !text.includes('Exclusions') && !text.includes('Learn more');
  });

  // Extract CTA buttons
  const buttons = Array.from(element.querySelectorAll('button'));
  const signInBtn = buttons.find((btn) => btn.textContent.trim().toLowerCase().includes('sign in'));
  const createBtn = buttons.find((btn) => btn.textContent.trim().toLowerCase().includes('create'));

  // Extract disclaimer
  const disclaimerSpan = element.querySelector('span[class*="subdued"]');
  const learnMoreLink = element.querySelector('a#learn-more-link, a:has(span[class*="primary"])');

  // Build columns: Col 1 = heading + benefits list, Col 2 = CTAs + disclaimer
  const col1 = [];
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    col1.push(h2);
  }

  // Build benefits as a list
  if (benefitSpans.length > 0) {
    const ul = document.createElement('ul');
    benefitSpans.forEach((span) => {
      const li = document.createElement('li');
      li.textContent = span.textContent.trim();
      ul.append(li);
    });
    col1.push(ul);
  }

  const col2 = [];
  if (signInBtn) {
    const p1 = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = signInBtn.textContent.trim();
    p1.append(strong);
    col2.push(p1);
  }
  if (createBtn) {
    const p2 = document.createElement('p');
    p2.textContent = createBtn.textContent.trim();
    col2.push(p2);
  }
  if (disclaimerSpan) {
    const p3 = document.createElement('p');
    const em = document.createElement('em');
    let disclaimerText = disclaimerSpan.textContent.trim();
    if (learnMoreLink) {
      disclaimerText += ' ' + (learnMoreLink.textContent || '').trim();
    }
    em.textContent = disclaimerText;
    p3.append(em);
    col2.push(p3);
  }

  const cells = [];
  cells.push([col1, col2]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-benefits', cells });
  element.replaceWith(block);
}
