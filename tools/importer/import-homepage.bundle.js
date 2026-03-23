var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-promo.js
  function parse(element, { document }) {
    const promoImg = element.querySelector('h2 img, h2 picture, img[alt*="Tech Fest"], img[alt*="Sale"]');
    const heading = element.querySelector('.heading-2, [class*="heading-2"], h2:not(:has(img)), h1');
    const subheading = element.querySelector('.heading-5, [class*="heading-5"], .heading-3');
    const disclaimer = element.querySelector('.disclaimer, [class*="disclaimer"]');
    const cta = element.querySelector('a.btn, a[class*="btn"], a[href*="sale-page"]');
    const cells = [];
    if (promoImg) {
      cells.push([promoImg]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    if (disclaimer) contentCell.push(disclaimer);
    if (cta) contentCell.push(cta);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-category.js
  function parse2(element, { document }) {
    let items = Array.from(element.querySelectorAll("li.c-carousel-item"));
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll("li:has(a img)"));
    }
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll("a:has(img)"));
    }
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector('img:not([src^="data:image/svg"])');
      const svgImg = !img ? item.querySelector("img") : null;
      const image = img || svgImg;
      const link = item.querySelector("a[href]") || item.closest("a[href]");
      const label = item.querySelector("p.carousel-item-cta, p, span:not(.sr-only)");
      const imageCell = [];
      if (image) imageCell.push(image);
      const contentCell = [];
      if (label && link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = label.textContent.trim();
        contentCell.push(a);
      } else if (label) {
        contentCell.push(label);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([
          imageCell.length > 0 ? imageCell : "",
          contentCell.length > 0 ? contentCell : ""
        ]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/card-carousel-deals.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll('[data-testid="offer-card"]'));
    const cells = [];
    cards.forEach((card) => {
      const headline = card.querySelector('[data-testid="offer-card-body-copy-lg"]');
      const img = card.querySelector('img[data-testid="Deals-Image-TestID"]') || card.querySelector('img:not([src^="data:"])');
      const desc = card.querySelector('[data-testid="offer-card-body-copy"]');
      const link = card.querySelector("a[href]");
      const imageCell = [];
      if (img) imageCell.push(img);
      const contentCell = [];
      if (headline) {
        const h = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = headline.textContent.trim().replace(/\n/g, " ");
        h.appendChild(strong);
        contentCell.push(h);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        contentCell.push(p);
      }
      if (link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = "Shop now";
        contentCell.push(a);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([
          imageCell.length > 0 ? imageCell : "",
          contentCell.length > 0 ? contentCell : ""
        ]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "card-carousel-deals", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-benefits.js
  function parse4(element, { document }) {
    const heading = element.querySelector('h2, h1, h3, [class*="title-sm-500"]');
    if (!heading) {
      element.remove();
      return;
    }
    const benefitSpans = Array.from(
      element.querySelectorAll('span[class*="body-sm-400"]:not([class*="subdued"])')
    ).filter((span) => {
      const text = span.textContent.trim();
      return text && !text.includes("Exclusions") && !text.includes("Learn more");
    });
    const buttons = Array.from(element.querySelectorAll("button"));
    const signInBtn = buttons.find((btn) => btn.textContent.trim().toLowerCase().includes("sign in"));
    const createBtn = buttons.find((btn) => btn.textContent.trim().toLowerCase().includes("create"));
    const disclaimerSpan = element.querySelector('span[class*="subdued"]');
    const learnMoreLink = element.querySelector('a#learn-more-link, a:has(span[class*="primary"])');
    const col1 = [];
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      col1.push(h2);
    }
    if (benefitSpans.length > 0) {
      const ul = document.createElement("ul");
      benefitSpans.forEach((span) => {
        const li = document.createElement("li");
        li.textContent = span.textContent.trim();
        ul.append(li);
      });
      col1.push(ul);
    }
    const col2 = [];
    if (signInBtn) {
      const p1 = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = signInBtn.textContent.trim();
      p1.append(strong);
      col2.push(p1);
    }
    if (createBtn) {
      const p2 = document.createElement("p");
      p2.textContent = createBtn.textContent.trim();
      col2.push(p2);
    }
    if (disclaimerSpan) {
      const p3 = document.createElement("p");
      const em = document.createElement("em");
      let disclaimerText = disclaimerSpan.textContent.trim();
      if (learnMoreLink) {
        disclaimerText += " " + (learnMoreLink.textContent || "").trim();
      }
      em.textContent = disclaimerText;
      p3.append(em);
      col2.push(p3);
    }
    const cells = [];
    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-benefits", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse5(element, { document }) {
    const bgImage = element.querySelector(
      'img.absolute, img.w-full.absolute, img[src*="scc-lgtv"], img[src*="bbystatic"]'
    );
    const heading = element.querySelector(
      '.text-style-title-md-500, [class*="title-md"], [class*="title-lg"], h1, h2'
    );
    const subheading = element.querySelector(
      '.text-style-body-lg-400, [class*="body-lg"], [class*="body-md"]:not([class*="primary"])'
    );
    const ctaLink = element.querySelector(
      'a[href*="promo"], a[href*="save-select"], a:has(span[class*="primary"])'
    );
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      contentCell.push(h2);
    }
    if (subheading) {
      const p = document.createElement("p");
      p.textContent = subheading.textContent.trim();
      contentCell.push(p);
    }
    if (ctaLink) {
      const a = document.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      contentCell.push(a);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/bestbuy-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".brix.smart-banner",
        ".atwb-display-ad",
        ".atwb-marquee-ad",
        ".marquee-lv.media-network-ad",
        '[class*="animate-skeleton-shimmer"]',
        ".hidden"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".shop-header",
        ".header-hamburger",
        "#headerFooterIncludes-beforeFirstPaintSet",
        "#headerFooterIncludes-afterFirstPaintSet",
        ".leaderboard-footer",
        ".gift-finder-root",
        ".grecaptcha-badge",
        "next-route-announcer",
        ".atwa-ninja",
        "iframe",
        "noscript",
        "link",
        "textarea",
        '[class*="visibility-hidden"]'
      ]);
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const footerSelectors = [
        "footer",
        '[class*="footer"]',
        '[id*="footer"]',
        '[class*="bottom-nav"]',
        '[class*="customer-help"]'
      ];
      footerSelectors.forEach((sel) => {
        try {
          const els = element.querySelectorAll(sel);
          els.forEach((el) => el.remove());
        } catch (e) {
        }
      });
      const footerHeadings = [
        "Order & Purchases",
        "Payment Options",
        "Support & Services",
        "Rewards & Membership",
        "Partnerships",
        "About Best Buy",
        "Get the latest deals and more."
      ];
      const allH3s = element.querySelectorAll("h3");
      allH3s.forEach((h3) => {
        const text = h3.textContent.trim();
        if (footerHeadings.some((fh) => text.includes(fh) || fh.includes(text))) {
          let next = h3.nextElementSibling;
          while (next && (next.tagName === "UL" || next.tagName === "P")) {
            const toRemove = next;
            next = next.nextElementSibling;
            toRemove.remove();
          }
          h3.remove();
        }
      });
      const allUls = element.querySelectorAll("ul");
      allUls.forEach((ul) => {
        const links = ul.querySelectorAll("a");
        const footerLinkTexts = ["Support Center", "Order Status", "Price Match", "Returns"];
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
      const allPs = element.querySelectorAll("p");
      allPs.forEach((p) => {
        const text = p.textContent.trim();
        if (text.includes("\xA9 2026 Best Buy") || text.includes("\xA9 2025 Best Buy") || text.includes("BEST BUY, the BEST BUY logo") || text.includes("Mobile Site") || text.includes("Email AddressEnter") || text === "Sign Up") {
          p.remove();
        }
        const imgs = p.querySelectorAll('img[alt*="Share on"]');
        if (imgs.length >= 3) {
          p.remove();
        }
        if (text === "Sign in or Create Account") {
          const parent = p.parentElement;
          if (!parent || !parent.className.includes("columns") && !parent.closest('[class*="columns"]')) {
            p.remove();
          }
        }
      });
      allPs.forEach((p) => {
        const anchors = p.querySelectorAll("a");
        if (anchors.length >= 5) {
          let footerTermCount = 0;
          anchors.forEach((a) => {
            const t = a.textContent;
            if (t.includes("Accessibility") || t.includes("Terms") || t.includes("Privacy") || t.includes("Do Not Sell") || t.includes("Supply Chain")) {
              footerTermCount += 1;
            }
          });
          if (footerTermCount >= 3) {
            p.remove();
          }
        }
      });
      allPs.forEach((p) => {
        const text = p.textContent.trim();
        if (text.startsWith("Best Buy app") || text === "Best Buy Canada") {
          p.remove();
        }
      });
      const allTables = element.querySelectorAll("table");
      let cardCarouselTable = null;
      allTables.forEach((table) => {
        const th = table.querySelector("tr:first-child th");
        if (th) {
          const text = th.textContent.trim().toLowerCase();
          if (text.includes("card-carousel") || text.includes("card carousel")) {
            cardCarouselTable = table;
          }
        }
      });
      if (cardCarouselTable) {
        let sibling = cardCarouselTable.nextElementSibling;
        const dealItems = [];
        while (sibling) {
          const text = sibling.textContent.trim();
          if (text.match(/Save up to\s*\n?\s*\$?\d+%?/)) {
            const savingsEl = sibling;
            const imgEl = sibling.nextElementSibling;
            const descEl = imgEl ? imgEl.nextElementSibling : null;
            if (imgEl && imgEl.querySelector && imgEl.querySelector("img")) {
              const img = imgEl.querySelector("img");
              const desc = descEl ? descEl.textContent.trim() : "";
              dealItems.push({ savings: savingsEl, img, desc, descEl, imgEl });
              sibling = descEl ? descEl.nextElementSibling : null;
              continue;
            }
          }
          if (sibling.tagName === "TABLE") break;
          sibling = sibling.nextElementSibling;
        }
        if (dealItems.length > 0) {
          const tbody = cardCarouselTable.querySelector("tbody") || cardCarouselTable;
          dealItems.forEach((deal) => {
            const row = document.createElement("tr");
            const imgCell = document.createElement("td");
            const contentCell = document.createElement("td");
            imgCell.appendChild(deal.img.cloneNode(true));
            const p = document.createElement("p");
            p.textContent = deal.desc;
            contentCell.appendChild(p);
            row.appendChild(imgCell);
            row.appendChild(contentCell);
            tbody.appendChild(row);
            deal.savings.remove();
            deal.imgEl.remove();
            if (deal.descEl) deal.descEl.remove();
          });
        }
      }
    }
  }

  // tools/importer/transformers/bestbuy-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { sections } = template;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section, reverseIdx) => {
        const idx = sections.length - 1 - reverseIdx;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (idx > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    urls: [
      "https://www.bestbuy.com/",
      "http://localhost:8888/bestbuy-ssr-page.html"
    ],
    description: "Best Buy homepage with promotional banners, featured product categories, deals, and brand highlights",
    blocks: [
      {
        name: "hero-promo",
        instances: ["section.hero-v2-bg-gradient"]
      },
      {
        name: "carousel-category",
        instances: [
          "div.deals-by-categories",
          "div.flex.items-stretch.flex-col.rounded-border-lv:has(> .p-200)"
        ]
      },
      {
        name: "card-carousel-deals",
        instances: ['div.grid:has([data-testid="offer-card"])']
      },
      {
        name: "columns-benefits",
        instances: ["div.signin-create-account-container"]
      },
      {
        name: "hero-banner",
        instances: ["div.flex-1.relative.overflow-hidden:has(img[src*='scc-lgtv'])"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: "section.hero-v2-bg-gradient",
        style: "blue-gradient",
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Shop Deals by Category",
        selector: "div.deals-by-categories",
        style: "light-grey",
        blocks: ["carousel-category"],
        defaultContent: ["h5.text-style-title-sm-500"]
      },
      {
        id: "section-3",
        name: "Product Deals",
        selector: 'div.grid:has([data-testid="offer-card"])',
        style: null,
        blocks: ["card-carousel-deals"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Sign In Benefits",
        selector: "div.signin-create-account-container",
        style: null,
        blocks: ["columns-benefits"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Featured Promo",
        selector: "div.flex-1.relative.overflow-hidden:has(img[src*='scc-lgtv'])",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Trending Categories",
        selector: "div.flex.items-stretch.flex-col.rounded-border-lv:has(> .p-200)",
        style: null,
        blocks: ["carousel-category"],
        defaultContent: ["span.text-style-title-sm-500"]
      }
    ]
  };
  var parsers = {
    "hero-promo": parse,
    "carousel-category": parse2,
    "card-carousel-deals": parse3,
    "columns-benefits": parse4,
    "hero-banner": parse5
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(doc, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        try {
          const elements = doc.querySelectorAll(selector);
          elements.forEach((el) => {
            pageBlocks.push({
              name: blockDef.name,
              selector,
              element: el,
              section: blockDef.section || null
            });
          });
        } catch (e) {
          console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`, e);
        }
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index";
      if (rawPath.includes("bestbuy-ssr-page")) {
        rawPath = "/index";
      }
      const path = WebImporter.FileUtils.sanitizePath(rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
