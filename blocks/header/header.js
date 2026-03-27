import { getMetadata } from '../../scripts/aem.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Extract the label text from a <li> element.
 * Handles both local dev (bare text node) and AEM pipeline (<p>-wrapped) formats.
 */
function getLiText(li) {
  for (const node of li.childNodes) {
    if (node.nodeType === 3 && node.textContent.trim()) return node.textContent.trim();
    if (node.nodeType === 1) break;
  }
  const p = li.querySelector(':scope > p');
  if (p && !p.querySelector('a, img')) return p.textContent.trim();
  return '';
}

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
 * Build a megamenu panel from a nav <div> section.
 * Structure: <div><h2>Title</h2> <h3>Tab</h3><ul>items</ul> ... <p>bottom bar</p></div>
 * Sequential parsing:
 *   - <h3> starts a content tab; the next <ul> supplies its items
 *   - <p> with 1 <a> = link-only sidebar tab
 *   - <p> with 2+ <a> = bottom bar
 * Content items with <img> render as image tiles; without as text links.
 */
function buildMegamenuPanel(megamenuDiv) {
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

  let tabIndex = 0;
  let firstContentTab = true;
  let currentH3 = null;
  const elems = [...megamenuDiv.children];

  elems.forEach((child) => {
    const tag = child.tagName.toLowerCase();

    // Skip the megamenu title — caller uses it for the button label
    if (tag === 'h2') return;

    // <h3> starts a content tab; items come from the next <ul>
    if (tag === 'h3') {
      currentH3 = child.textContent.trim();
      return;
    }

    // <ul> after an <h3> — build a content tab
    if (tag === 'ul' && currentH3) {
      const tabId = `tab-${tabIndex}`;
      tabIndex += 1;

      const tab = document.createElement('li');
      tab.className = `megamenu-tab${firstContentTab ? ' active' : ''}`;
      tab.setAttribute('data-tab', tabId);
      tab.textContent = currentH3;
      tabList.appendChild(tab);

      const tabContent = document.createElement('div');
      tabContent.className = `megamenu-tab-content${firstContentTab ? ' active' : ''}`;
      tabContent.setAttribute('data-tab-content', tabId);

      const heading = document.createElement('h3');
      heading.textContent = currentH3;
      tabContent.appendChild(heading);

      const items = [...child.querySelectorAll(':scope > li')];
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

      content.appendChild(tabContent);
      firstContentTab = false;
      currentH3 = null;
      return;
    }

    // <p> — either a link-only tab (1 link) or bottom bar (2+ links)
    if (tag === 'p') {
      const links = [...child.querySelectorAll('a')];
      if (links.length === 1) {
        const tabId = `tab-${tabIndex}`;
        tabIndex += 1;
        const tab = document.createElement('li');
        tab.className = 'megamenu-tab nav-link';
        tab.setAttribute('data-tab', tabId);
        const a = document.createElement('a');
        a.href = links[0].href;
        a.textContent = links[0].textContent;
        tab.appendChild(a);
        tabList.appendChild(tab);
      }
      // Bottom bar (2+ links) handled after the loop
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

  // Bottom bar: <p> with 2+ links
  elems.forEach((child) => {
    if (child.tagName.toLowerCase() === 'p') {
      const links = [...child.querySelectorAll('a')];
      if (links.length >= 2) {
        const bottomBar = document.createElement('div');
        bottomBar.className = 'megamenu-bottom-bar';
        links.forEach((a) => {
          bottomBar.appendChild(a.cloneNode(true));
        });
        panel.appendChild(bottomBar);
      }
    }
  });

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
  const text = getLiText(toolLi);
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
      heading.textContent = getLiText(groupLi);
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

function buildExploreButton(megamenuDiv, container, getNav) {
  const h2 = megamenuDiv.querySelector(':scope > h2');
  const label = h2 ? h2.textContent.trim() : 'Explore';

  const exploreBtn = document.createElement('button');
  exploreBtn.className = 'nav-btn nav-btn-explore';
  exploreBtn.setAttribute('type', 'button');
  exploreBtn.append(createIconSpan('icon-grid'), createBtnText(label));

  const panel = buildMegamenuPanel(megamenuDiv);
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

  // Section 2: Explore megamenu
  if (sections[2]) buildExploreButton(sections[2], left, getNav);

  // Section 1: Tools (Search, Language, Support)
  const toolsSection = sections[1];
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

  // Sections 3+: secondary megamenu items (Find Products, Research & Insights, …)
  for (let i = 3; i < sections.length; i += 1) {
    const megamenuDiv = sections[i];
    const h2 = megamenuDiv.querySelector(':scope > h2');
    const triggerText = h2 ? h2.textContent.trim() : '';

    const btn = document.createElement('button');
    btn.className = 'nav-btn nav-btn-section';
    btn.setAttribute('type', 'button');
    const btnText = document.createElement('span');
    btnText.className = 'btn-text';
    btnText.textContent = triggerText;
    const btnChevron = document.createElement('span');
    btnChevron.className = 'chevron-down';
    btn.append(btnText, btnChevron);

    const panel = buildMegamenuPanel(megamenuDiv);
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
  }

  // Section 1: CTA from tools section <p><strong><a>
  const toolsSection = sections[1];
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

/* ===== Mobile Menu ===== */

function buildMobileChildren(megamenuDiv) {
  const children = [];
  let currentH3 = null;

  [...megamenuDiv.children].forEach((child) => {
    const tag = child.tagName.toLowerCase();

    if (tag === 'h2') return; // skip title

    if (tag === 'h3') {
      currentH3 = child.textContent.trim();
      return;
    }

    // <ul> after <h3> — content tab with sub-items
    if (tag === 'ul' && currentH3) {
      const sub = [];
      [...child.querySelectorAll(':scope > li')].forEach((li) => {
        const a = li.querySelector('a');
        if (a) sub.push({ label: a.textContent.trim(), href: a.href });
      });
      children.push({ label: currentH3, children: sub });
      currentH3 = null;
      return;
    }

    // <p> with 1 link — link-only tab
    if (tag === 'p') {
      const links = [...child.querySelectorAll('a')];
      if (links.length === 1) {
        children.push({ label: links[0].textContent.trim(), href: links[0].href });
      }
      // Skip bottom bar (2+ links) in mobile
    }
  });

  return children;
}

function buildMobileMenuData(sections) {
  const items = [];

  // Secondary megamenus (sections 3+): Find Products, Research & Insights, Who We Are
  for (let i = 3; i < sections.length; i += 1) {
    const megamenuDiv = sections[i];
    const h2 = megamenuDiv.querySelector(':scope > h2');
    const label = h2 ? h2.textContent.trim() : '';
    items.push({ label, children: buildMobileChildren(megamenuDiv) });
  }

  // Explore S&P Global (section 2) — add last with isExplore flag
  if (sections[2]) {
    const megamenuDiv = sections[2];
    const h2 = megamenuDiv.querySelector(':scope > h2');
    const label = h2 ? h2.textContent.trim() : 'Explore S&P Global';
    items.push({ label, children: buildMobileChildren(megamenuDiv), isExplore: true });
  }

  return items;
}

function renderMobileLevel(container, items, parentLabel, navStack, openMenu) {
  container.textContent = '';

  // Breadcrumb
  const breadcrumb = document.createElement('div');
  breadcrumb.className = 'mobile-menu-breadcrumb';

  if (parentLabel) {
    const backBtn = document.createElement('button');
    backBtn.className = 'mobile-menu-back';
    backBtn.type = 'button';
    const chevron = document.createElement('span');
    chevron.className = 'back-chevron';
    backBtn.appendChild(chevron);
    backBtn.appendChild(document.createTextNode(' Back'));
    const labelSpan = document.createElement('span');
    labelSpan.className = 'breadcrumb-label';
    labelSpan.textContent = ` / ${parentLabel}`;
    breadcrumb.appendChild(backBtn);
    breadcrumb.appendChild(labelSpan);
    backBtn.addEventListener('click', () => {
      if (navStack.length > 0) {
        const prev = navStack.pop();
        renderMobileLevel(container, prev.items, prev.parentLabel, navStack, openMenu);
      }
    });
  } else {
    const homeLink = document.createElement('a');
    homeLink.href = '/en';
    const homeIcon = document.createElement('span');
    homeIcon.className = 'icon-home';
    homeLink.appendChild(homeIcon);
    homeLink.appendChild(document.createTextNode(' S&P Global'));
    breadcrumb.appendChild(homeLink);
  }
  container.appendChild(breadcrumb);

  // Items
  const itemsDiv = document.createElement('div');
  itemsDiv.className = 'mobile-menu-items';

  items.forEach((item) => {
    if (item.children && item.children.length > 0) {
      const btn = document.createElement('button');
      btn.className = `mobile-menu-item${item.isExplore ? ' explore-item' : ''}`;
      btn.type = 'button';

      if (item.isExplore) {
        const icon = document.createElement('span');
        icon.className = 'icon-grid';
        const text = document.createTextNode(` ${item.label}`);
        btn.appendChild(icon);
        btn.appendChild(text);
      } else {
        btn.appendChild(document.createTextNode(item.label));
      }

      const chevron = document.createElement('span');
      chevron.className = 'chevron-right';
      btn.appendChild(chevron);

      btn.addEventListener('click', () => {
        navStack.push({ items, parentLabel });
        renderMobileLevel(container, item.children, item.label, navStack, openMenu);
      });
      itemsDiv.appendChild(btn);
    } else if (item.href) {
      const a = document.createElement('a');
      a.className = 'mobile-menu-item';
      a.href = item.href;
      a.textContent = item.label;
      itemsDiv.appendChild(a);
    }
  });

  container.appendChild(itemsDiv);
}

function buildMobileMenu(sections) {
  const menu = document.createElement('div');
  menu.className = 'mobile-menu';

  const content = document.createElement('div');
  content.className = 'mobile-menu-content';

  const footer = document.createElement('div');
  footer.className = 'mobile-menu-footer';

  // Support link from section 1 (tools)
  const toolsSection = sections[1];
  if (toolsSection) {
    const toolsUl = toolsSection.querySelector(':scope > ul');
    if (toolsUl) {
      const supportLi = [...toolsUl.querySelectorAll(':scope > li')].find((li) => {
        const a = li.querySelector(':scope > a');
        return a && !li.querySelector(':scope > ul');
      });
      if (supportLi) {
        const a = supportLi.querySelector('a');
        const supportLink = document.createElement('a');
        supportLink.href = a.href;
        supportLink.className = 'mobile-support-link';
        const icon = document.createElement('span');
        icon.className = 'icon-support';
        supportLink.appendChild(icon);
        supportLink.appendChild(document.createTextNode(` ${a.textContent.trim()}`));
        footer.appendChild(supportLink);
      }
    }

    const ctaP = toolsSection.querySelector(':scope > p');
    if (ctaP) {
      const ctaLink = ctaP.querySelector('a');
      if (ctaLink) {
        const cta = document.createElement('a');
        cta.href = ctaLink.href;
        cta.textContent = ctaLink.textContent.trim();
        cta.className = 'mobile-cta';
        footer.appendChild(cta);
      }
    }
  }

  menu.appendChild(content);
  menu.appendChild(footer);

  const topItems = buildMobileMenuData(sections);
  const navStack = [];

  return {
    element: menu,
    open() {
      navStack.length = 0;
      renderMobileLevel(content, topItems, null, navStack);
      menu.classList.add('open');
    },
    close() {
      menu.classList.remove('open');
    },
  };
}

function buildHamburger(mobileMenu) {
  const btn = document.createElement('button');
  btn.className = 'nav-hamburger';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Menu');
  btn.setAttribute('aria-expanded', 'false');

  const icon = document.createElement('span');
  icon.className = 'nav-hamburger-icon';
  for (let i = 0; i < 3; i += 1) {
    icon.appendChild(document.createElement('span'));
  }
  btn.appendChild(icon);

  btn.addEventListener('click', () => {
    const opening = !btn.classList.contains('open');
    btn.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(opening));
    if (opening) {
      mobileMenu.open();
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.close();
      document.body.style.overflow = '';
    }
  });

  return btn;
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

  // Nav: 6 top-level divs (brand, tools, explore, find-products, research, who-we-are)
  const sections = [...navDoc.body.querySelectorAll(':scope > div')];

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  const primaryRow = buildPrimaryRow(sections);
  const secondaryRow = buildSecondaryRow(sections);

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.addEventListener('click', () => closeAllPanels(nav));

  // Mobile menu
  const mobileMenu = buildMobileMenu(sections);
  const hamburger = buildHamburger(mobileMenu);
  primaryRow.querySelector('.nav-row-right').appendChild(hamburger);

  nav.appendChild(primaryRow);
  nav.appendChild(secondaryRow);
  nav.appendChild(mobileMenu.element);
  nav.appendChild(overlay);

  function closeMobileMenu() {
    mobileMenu.close();
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPanels(nav);
      closeMobileMenu();
    }
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAllPanels(nav);
  });

  isDesktop.addEventListener('change', () => {
    closeAllPanels(nav);
    closeMobileMenu();
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
