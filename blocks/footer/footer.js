import { getMetadata, decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Decorates the footer block.
 * Content structure (3 sections in authored fragment):
 *
 *   Section 1 — Social bar:
 *     <p><strong>Follow Us</strong> <a href="...">:x-twitter:</a> <a>:facebook:</a> ...</p>
 *     Section Metadata: Style = dark
 *
 *   Section 2 — Link columns:
 *     <h2> + <ul> pairs
 *
 *   Section 3 — Legal:
 *     <p> legal links </p>
 *     <p> copyright </p>
 */

function buildSocialBar(section) {
  const bar = document.createElement('div');
  bar.className = 'footer-social';

  // Apply section-metadata styles (e.g. "dark") to the social bar
  section.classList.forEach((cls) => {
    if (cls !== 'section') bar.classList.add(cls);
  });

  const wrapper = section.querySelector('.default-content-wrapper');
  if (!wrapper) return bar;

  // Content is a single <p>: <strong>Label</strong> <a>:icon:</a> <a>:icon:</a> ...
  const p = wrapper.querySelector('p');
  if (!p) return bar;

  const authoredLabel = p.querySelector('strong');
  if (authoredLabel) {
    const label = document.createElement('span');
    label.className = 'footer-social-label';
    label.textContent = authoredLabel.textContent;
    bar.append(label);
    authoredLabel.remove();
  }

  p.className = 'footer-social-links';
  p.querySelectorAll('a').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');

    // Handle :icon-name: text notation — convert to icon span
    const text = a.textContent.trim();
    const match = text.match(/^:([a-z0-9-]+):$/);
    if (match && !a.querySelector('.icon')) {
      a.textContent = '';
      const icon = document.createElement('span');
      icon.className = `icon icon-${match[1]}`;
      a.append(icon);
    }

    // Set aria-label from icon class
    const iconEl = a.querySelector('.icon');
    if (iconEl) {
      const name = [...iconEl.classList].find((c) => c !== 'icon')?.replace('icon-', '');
      if (name) a.setAttribute('aria-label', name);
    }
  });
  bar.append(p);
  decorateIcons(bar);

  return bar;
}

function buildLinkColumns(section) {
  const container = document.createElement('div');
  container.className = 'footer-links';
  const grid = document.createElement('div');
  grid.className = 'footer-links-grid';

  const wrapper = section.querySelector('.default-content-wrapper');
  if (!wrapper) {
    container.append(grid);
    return container;
  }

  const els = [...wrapper.children];
  let i = 0;
  while (i < els.length) {
    const el = els[i];
    if (el.tagName === 'H2') {
      const col = document.createElement('div');
      col.className = 'footer-links-column';
      el.className = 'footer-links-heading';
      col.append(el);
      const next = els.at(i + 1);
      if (next && next.tagName === 'UL') {
        i += 1;
        col.append(next);
      }
      grid.append(col);
    }
    i += 1;
  }

  container.append(grid);
  return container;
}

function buildLegalSection(section) {
  const container = document.createElement('div');
  container.className = 'footer-legal';

  const wrapper = section.querySelector('.default-content-wrapper');
  if (!wrapper) return container;

  const els = [...wrapper.children];
  const legalLinksP = els.find((el) => el.tagName === 'P' && el.querySelector('a'));
  const copyrightP = els.find((el) => el.tagName === 'P' && !el.querySelector('a'));

  if (legalLinksP) {
    legalLinksP.className = 'footer-legal-links';
    [...legalLinksP.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '|') {
        node.remove();
      }
    });
    container.append(legalLinksP);
  }

  if (copyrightP) {
    copyrightP.className = 'footer-copyright';
    container.append(copyrightP);
  }

  return container;
}

/** @param {Element} block */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';
  const fragment = await loadFragment(footerPath);

  if (!fragment) return;

  block.textContent = '';

  const sections = fragment.querySelectorAll('.section');
  const [socialSection, linksSection, legalSection] = sections;

  const divider = document.createElement('hr');
  divider.className = 'footer-divider';

  if (socialSection) block.append(buildSocialBar(socialSection));
  if (linksSection) block.append(buildLinkColumns(linksSection));
  block.append(divider);
  if (legalSection) block.append(buildLegalSection(legalSection));
}
