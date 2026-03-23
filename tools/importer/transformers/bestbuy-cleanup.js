/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Best Buy homepage cleanup.
 * All selectors from captured DOM (migration-work/cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove elements that block parsing (from captured DOM)
    // Smart banner: <div class="brix smart-banner">
    // Display ads: <div class="atwb-display-ad"> and marquee ads
    // Skeleton shimmer placeholders: <div class="animate-skeleton-shimmer-3s">
    // Hidden elements that add noise
    WebImporter.DOMUtils.remove(element, [
      '.brix.smart-banner',
      '.atwb-display-ad',
      '.atwb-marquee-ad',
      '.marquee-lv.media-network-ad',
      '[class*="animate-skeleton-shimmer"]',
      '.hidden',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '.shop-header',
      '.header-hamburger',
      '#headerFooterIncludes-beforeFirstPaintSet',
      '#headerFooterIncludes-afterFirstPaintSet',
      '.leaderboard-footer',
      '.gift-finder-root',
      '.grecaptcha-badge',
      'next-route-announcer',
      '.atwa-ninja',
      'iframe',
      'noscript',
      'link',
      'textarea',
      '[class*="visibility-hidden"]',
    ]);

    // Remove footer content that leaks through dynamic rendering
    // Best Buy footer renders via JS and may exist outside standard containers
    const { document } = element.ownerDocument
      ? { document: element.ownerDocument }
      : { document: element.getRootNode() };

    // Remove all content after the last recognized block section
    // Footer typically contains: support links, payment options, partnerships, social media, legal text
    const footerSelectors = [
      'footer',
      '[class*="footer"]',
      '[id*="footer"]',
      '[class*="bottom-nav"]',
      '[class*="customer-help"]',
    ];
    footerSelectors.forEach((sel) => {
      try {
        const els = element.querySelectorAll(sel);
        els.forEach((el) => el.remove());
      } catch (e) { /* skip invalid selectors */ }
    });

    // Remove orphaned footer content by pattern:
    // h3 elements that are footer section headers followed by ul lists
    const footerHeadings = [
      'Order & Purchases', 'Payment Options', 'Support & Services',
      'Rewards & Membership', 'Partnerships', 'About Best Buy',
      'Get the latest deals and more.',
    ];
    const allH3s = element.querySelectorAll('h3');
    allH3s.forEach((h3) => {
      const text = h3.textContent.trim();
      if (footerHeadings.some((fh) => text.includes(fh) || fh.includes(text))) {
        // Remove h3 and its following sibling ul
        let next = h3.nextElementSibling;
        while (next && (next.tagName === 'UL' || next.tagName === 'P')) {
          const toRemove = next;
          next = next.nextElementSibling;
          toRemove.remove();
        }
        h3.remove();
      }
    });

    // Remove orphaned footer link lists (support center, order status, etc.)
    const allUls = element.querySelectorAll('ul');
    allUls.forEach((ul) => {
      const links = ul.querySelectorAll('a');
      const footerLinkTexts = ['Support Center', 'Order Status', 'Price Match', 'Returns'];
      let footerLinkCount = 0;
      links.forEach((a) => {
        if (footerLinkTexts.some((ft) => a.textContent.includes(ft))) {
          footerLinkCount += 1;
        }
      });
      if (footerLinkCount >= 2) {
        ul.remove();
      }
    });

    // Remove social media icon links and legal text at bottom
    const allPs = element.querySelectorAll('p');
    allPs.forEach((p) => {
      const text = p.textContent.trim();
      // Social media row, legal copyright, sign-in prompts, email signup
      if (text.includes('© 2026 Best Buy') || text.includes('© 2025 Best Buy')
        || text.includes('BEST BUY, the BEST BUY logo')
        || text.includes('Mobile Site')
        || text.includes('Email AddressEnter')
        || text === 'Sign Up') {
        p.remove();
      }
      // Remove paragraphs that are purely social media icon links
      const imgs = p.querySelectorAll('img[alt*="Share on"]');
      if (imgs.length >= 3) {
        p.remove();
      }
      // Remove sign-in/account links outside blocks
      if (text === 'Sign in or Create Account') {
        const parent = p.parentElement;
        if (!parent || !parent.className.includes('columns') && !parent.closest('[class*="columns"]')) {
          p.remove();
        }
      }
    });

    // Remove footer link section (Accessibility, Terms, Privacy, etc.)
    allPs.forEach((p) => {
      const anchors = p.querySelectorAll('a');
      if (anchors.length >= 5) {
        let footerTermCount = 0;
        anchors.forEach((a) => {
          const t = a.textContent;
          if (t.includes('Accessibility') || t.includes('Terms') || t.includes('Privacy')
            || t.includes('Do Not Sell') || t.includes('Supply Chain')) {
            footerTermCount += 1;
          }
        });
        if (footerTermCount >= 3) {
          p.remove();
        }
      }
    });

    // Remove Best Buy Canada and Best Buy app references
    allPs.forEach((p) => {
      const text = p.textContent.trim();
      if (text.startsWith('Best Buy app') || text === 'Best Buy Canada') {
        p.remove();
      }
    });

    // Collect orphaned deal card content into card-carousel-deals block
    // Deal items load dynamically and appear as loose elements after the empty block table
    // Block name format: "Card Carousel (deals)" in th header
    const allTables = element.querySelectorAll('table');
    let cardCarouselTable = null;
    allTables.forEach((table) => {
      const th = table.querySelector('tr:first-child th');
      if (th) {
        const text = th.textContent.trim().toLowerCase();
        if (text.includes('card-carousel') || text.includes('card carousel')) {
          cardCarouselTable = table;
        }
      }
    });

    if (cardCarouselTable) {
      // Find orphaned deal patterns following the block table
      let sibling = cardCarouselTable.nextElementSibling;
      const dealItems = [];

      while (sibling) {
        const text = sibling.textContent.trim();
        // Pattern: "Save up to\n50%" or similar savings text
        if (text.match(/Save up to\s*\n?\s*\$?\d+%?/)) {
          const savingsEl = sibling;
          const imgEl = sibling.nextElementSibling;
          const descEl = imgEl ? imgEl.nextElementSibling : null;

          if (imgEl && imgEl.querySelector && imgEl.querySelector('img')) {
            const img = imgEl.querySelector('img');
            const desc = descEl ? descEl.textContent.trim() : '';

            dealItems.push({ savings: savingsEl, img, desc, descEl, imgEl });
            sibling = descEl ? descEl.nextElementSibling : null;
            continue;
          }
        }
        // Stop when we hit another block table or non-deal content
        if (sibling.tagName === 'TABLE') break;
        sibling = sibling.nextElementSibling;
      }

      if (dealItems.length > 0) {
        const tbody = cardCarouselTable.querySelector('tbody') || cardCarouselTable;
        dealItems.forEach((deal) => {
          const row = document.createElement('tr');
          const imgCell = document.createElement('td');
          const contentCell = document.createElement('td');
          imgCell.appendChild(deal.img.cloneNode(true));
          const p = document.createElement('p');
          p.textContent = deal.desc;
          contentCell.appendChild(p);
          row.appendChild(imgCell);
          row.appendChild(contentCell);
          tbody.appendChild(row);
          // Remove orphaned elements
          deal.savings.remove();
          deal.imgEl.remove();
          if (deal.descEl) deal.descEl.remove();
        });
      }
    }
  }
}
