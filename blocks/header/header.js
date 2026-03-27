import { getMetadata } from '../../scripts/aem.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeAllPanels(nav) {
  nav.querySelectorAll('.megamenu-panel.open, .search-panel.open, .language-dropdown.open').forEach((p) => {
    p.classList.remove('open');
  });
  nav.querySelectorAll('.nav-trigger-active').forEach((t) => {
    t.classList.remove('nav-trigger-active');
  });
  nav.classList.remove('panel-open');
  const wrapper = nav.closest('.nav-wrapper');
  if (wrapper) wrapper.classList.remove('panel-open');
  const overlay = nav.querySelector('.nav-overlay');
  if (overlay) overlay.classList.remove('visible');
}

function togglePanel(nav, trigger, panel) {
  const isOpen = panel.classList.contains('open');
  closeAllPanels(nav);
  if (!isOpen) {
    panel.classList.add('open');
    trigger.classList.add('nav-trigger-active');
    nav.classList.add('panel-open');
    const wrapper = nav.closest('.nav-wrapper');
    if (wrapper) wrapper.classList.add('panel-open');
    const overlay = nav.querySelector('.nav-overlay');
    if (overlay) overlay.classList.add('visible');
  }
}

/**
 * Build a megamenu panel from a nav <li> that has nested content.
 * Structure: <li>Label <ul>(tabs)</ul> <p>(bottom bar)</p></li>
 * Each tab <li> is either:
 *   - link-only: <li><a href>Label</a></li>
 *   - content tab: <li>Label <ul>(items)</ul></li>
 * Content items with <img> render as image tiles; without as text links.
 */
function buildMegamenuPanel(triggerLi) {
  const tabsUl = triggerLi.querySelector(':scope > ul');
  if (!tabsUl) return null;

  const panel = document.createElement('div');
  panel.className = 'megamenu-panel';

  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'megamenu-sidebar';
  const tabList = document.createElement('ul');
  tabList.className = 'megamenu-tabs';

  // Content area
  const content = document.createElement('div');
  content.className = 'megamenu-content';

  const tabItems = [...tabsUl.querySelectorAll(':scope > li')];
  let firstContentTab = true;

  tabItems.forEach((tabLi, idx) => {
    const tabId = `tab-${idx}`;
    const link = tabLi.querySelector(':scope > a');
    const subUl = tabLi.querySelector(':scope > ul');

    if (link && !subUl) {
      // Link-only tab: just a link in the sidebar
      const tab = document.createElement('li');
      tab.className = 'megamenu-tab nav-link';
      tab.setAttribute('data-tab', tabId);
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent;
      tab.appendChild(a);
      tabList.appendChild(tab);
    } else {
      // Content tab: label + nested items
      const label = tabLi.childNodes[0]?.textContent?.trim() || '';
      const tab = document.createElement('li');
      tab.className = `megamenu-tab${firstContentTab ? ' active' : ''}`;
      tab.setAttribute('data-tab', tabId);
      tab.textContent = label;
      tabList.appendChild(tab);

      // Build tab content
      const tabContent = document.createElement('div');
      tabContent.className = `megamenu-tab-content${firstContentTab ? ' active' : ''}`;
      tabContent.setAttribute('data-tab-content', tabId);

      const heading = document.createElement('h3');
      heading.textContent = label;
      tabContent.appendChild(heading);

      if (subUl) {
        const items = [...subUl.querySelectorAll(':scope > li')];
        const hasImages = items.some((li) => li.querySelector('img'));

        if (hasImages) {
          const tiles = document.createElement('div');
          tiles.className = 'megamenu-tiles';
          items.forEach((li) => {
            const a = li.querySelector('a');
            if (a) tiles.appendChild(a.cloneNode(true));
          });
          tabContent.appendChild(tiles);
        } else {
          const linkList = document.createElement('ul');
          linkList.className = 'megamenu-links';
          items.forEach((li) => {
            const a = li.querySelector('a');
            if (a) {
              const newLi = document.createElement('li');
              newLi.appendChild(a.cloneNode(true));
              linkList.appendChild(newLi);
            }
          });
          tabContent.appendChild(linkList);
        }
      }

      content.appendChild(tabContent);
      firstContentTab = false;
    }
  });

  // Tab switching
  tabList.querySelectorAll('.megamenu-tab:not(.nav-link)').forEach((tab) => {
    tab.addEventListener('click', () => {
      const tid = tab.getAttribute('data-tab');
      tabList.querySelectorAll('.megamenu-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      content.querySelectorAll('.megamenu-tab-content').forEach((c) => {
        if (c.getAttribute('data-tab-content') === tid) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });
    });
  });

  sidebar.appendChild(tabList);
  panel.appendChild(sidebar);
  panel.appendChild(content);

  // Bottom bar from <p> after the <ul>
  const bottomP = triggerLi.querySelector(':scope > p');
  if (bottomP) {
    const bottomBar = document.createElement('div');
    bottomBar.className = 'megamenu-bottom-bar';
    bottomP.querySelectorAll('a').forEach((a) => {
      bottomBar.appendChild(a.cloneNode(true));
    });
    panel.appendChild(bottomBar);
  }

  return panel;
}

function createIconSpan(cls) {
  const span = document.createElement('span');
  span.className = cls;
  return span;
}

function createBtnText(text) {
  const span = document.createElement('span');
  span.className = 'btn-text';
  span.textContent = text;
  return span;
}

function buildToolItem(toolLi, container, getNav) {
  const text = toolLi.childNodes[0]?.textContent?.trim() || '';
  const subUl = toolLi.querySelector(':scope > ul');
  const directLink = toolLi.querySelector(':scope > a');

  if (text.toLowerCase().includes('search') && subUl) {
    const searchBtn = document.createElement('button');
    searchBtn.className = 'nav-btn nav-btn-search';
    searchBtn.setAttribute('type', 'button');
    searchBtn.append(createIconSpan('icon-search'), createBtnText('Search'));

    const searchPanel = document.createElement('div');
    searchPanel.className = 'search-panel';

    const searchBar = document.createElement('div');
    searchBar.className = 'search-bar';
    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Search...';
    searchBar.appendChild(input);
    searchPanel.appendChild(searchBar);

    const searchContent = document.createElement('div');
    searchContent.className = 'search-content';
    [...subUl.querySelectorAll(':scope > li')].forEach((groupLi) => {
      const groupDiv = document.createElement('div');
      const heading = document.createElement('h4');
      heading.textContent = groupLi.childNodes[0]?.textContent?.trim() || '';
      groupDiv.appendChild(heading);
      const innerUl = groupLi.querySelector(':scope > ul');
      if (innerUl) groupDiv.appendChild(innerUl.cloneNode(true));
      searchContent.appendChild(groupDiv);
    });
    searchPanel.appendChild(searchContent);

    const wrapper = document.createElement('div');
    wrapper.className = 'nav-search-wrapper';
    wrapper.appendChild(searchBtn);
    wrapper.appendChild(searchPanel);
    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel(getNav(), searchBtn, searchPanel);
      setTimeout(() => input.focus(), 100);
    });
    container.appendChild(wrapper);
  } else if (subUl && !directLink) {
    const langBtn = document.createElement('button');
    langBtn.className = 'nav-btn nav-btn-language';
    langBtn.setAttribute('type', 'button');
    langBtn.append(createIconSpan('icon-globe'), createBtnText(text));

    const dropdown = document.createElement('div');
    dropdown.className = 'language-dropdown';
    subUl.querySelectorAll('a').forEach((a) => {
      dropdown.appendChild(a.cloneNode(true));
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'nav-language-wrapper';
    wrapper.appendChild(langBtn);
    wrapper.appendChild(dropdown);
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      closeAllPanels(getNav());
      if (!isOpen) dropdown.classList.add('open');
    });
    container.appendChild(wrapper);
  } else if (directLink) {
    const supportLink = document.createElement('a');
    supportLink.className = 'nav-btn nav-btn-support';
    supportLink.href = directLink.href;
    supportLink.append(createIconSpan('icon-support'), createBtnText(directLink.textContent.trim()));
    container.appendChild(supportLink);
  }
}

function buildExploreButton(navSection, container, getNav) {
  const primaryUl = navSection.querySelector(':scope > ul');
  if (!primaryUl) return;
  const exploreLi = primaryUl.querySelector(':scope > li');
  if (!exploreLi) return;

  const exploreBtn = document.createElement('button');
  exploreBtn.className = 'nav-btn nav-btn-explore';
  exploreBtn.setAttribute('type', 'button');
  exploreBtn.append(createIconSpan('icon-grid'), createBtnText(exploreLi.childNodes[0]?.textContent?.trim() || 'Explore'));

  const panel = buildMegamenuPanel(exploreLi);
  if (!panel) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-explore-wrapper';
  wrapper.appendChild(exploreBtn);
  wrapper.appendChild(panel);
  exploreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel(getNav(), exploreBtn, panel);
  });
  container.appendChild(wrapper);
}

function buildPrimaryRow(sections) {
  const row = document.createElement('div');
  row.className = 'nav-row nav-row-primary';

  const left = document.createElement('div');
  left.className = 'nav-row-left';

  const right = document.createElement('div');
  right.className = 'nav-row-right';

  const getNav = () => row.closest('nav');

  // Section 0: Brand
  const brandSection = sections[0];
  if (brandSection) {
    const brandEl = document.createElement('div');
    brandEl.className = 'nav-brand';
    const link = brandSection.querySelector('a');
    if (link) brandEl.appendChild(link.cloneNode(true));
    left.appendChild(brandEl);
  }

  // Section 1: First <ul> is primary nav (Explore)
  if (sections[1]) buildExploreButton(sections[1], left, getNav);

  // Section 2: Tools (Search, Language, Support)
  const toolsSection = sections[2];
  if (toolsSection) {
    const toolsUl = toolsSection.querySelector(':scope > ul');
    if (toolsUl) {
      [...toolsUl.querySelectorAll(':scope > li')].forEach((toolLi) => {
        buildToolItem(toolLi, right, getNav);
      });
    }
  }

  row.appendChild(left);
  row.appendChild(right);
  return row;
}

function buildSecondaryRow(sections) {
  const row = document.createElement('div');
  row.className = 'nav-row nav-row-secondary';

  const left = document.createElement('div');
  left.className = 'nav-row-left';

  const right = document.createElement('div');
  right.className = 'nav-row-right';

  // Section 1: Second <ul> is secondary nav items
  const navSection = sections[1];
  if (navSection) {
    const allUls = [...navSection.querySelectorAll(':scope > ul')];
    const secondaryUl = allUls[1];
    if (secondaryUl) {
      [...secondaryUl.querySelectorAll(':scope > li')].forEach((sectionLi) => {
        const triggerText = sectionLi.childNodes[0]?.textContent?.trim() || '';
        const btn = document.createElement('button');
        btn.className = 'nav-btn nav-btn-section';
        btn.setAttribute('type', 'button');
        const btnText = document.createElement('span');
        btnText.className = 'btn-text';
        btnText.textContent = triggerText;
        const btnChevron = document.createElement('span');
        btnChevron.className = 'chevron-down';
        btn.append(btnText, btnChevron);

        const panel = buildMegamenuPanel(sectionLi);
        if (panel) {
          const wrapper = document.createElement('div');
          wrapper.className = 'nav-section-wrapper';
          wrapper.appendChild(btn);
          wrapper.appendChild(panel);
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePanel(row.closest('nav'), btn, panel);
          });
          left.appendChild(wrapper);
        }
      });
    }
  }

  // Section 2: CTA from <p><strong><a>
  const toolsSection = sections[2];
  if (toolsSection) {
    const ctaP = toolsSection.querySelector(':scope > p');
    if (ctaP) {
      const ctaLink = ctaP.querySelector('a');
      if (ctaLink) {
        const cta = document.createElement('a');
        cta.className = 'nav-cta-button';
        cta.href = ctaLink.href;
        cta.textContent = ctaLink.textContent.trim();
        right.appendChild(cta);
      }
    }
  }

  row.appendChild(left);
  row.appendChild(right);
  return row;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

  const resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  // eslint-disable-next-line secure-coding/no-xxe-injection -- DOMParser is safe in browser (no XXE)
  const parser = new DOMParser();
  const navDoc = parser.parseFromString(html, 'text/html');

  // Standard EDS nav: 3 top-level divs (brand, sections, tools)
  const sections = [...navDoc.body.querySelectorAll(':scope > div')];

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  const primaryRow = buildPrimaryRow(sections);
  const secondaryRow = buildSecondaryRow(sections);

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.addEventListener('click', () => closeAllPanels(nav));

  nav.appendChild(primaryRow);
  nav.appendChild(secondaryRow);
  nav.appendChild(overlay);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllPanels(nav);
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAllPanels(nav);
  });

  isDesktop.addEventListener('change', () => {
    closeAllPanels(nav);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.appendChild(nav);
  block.appendChild(navWrapper);

  const handleScroll = () => {
    if (window.scrollY > 10) {
      navWrapper.classList.add('scrolled');
    } else {
      navWrapper.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}
