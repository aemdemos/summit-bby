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

  // tools/importer/parsers/embed.js
  function parse(element, { document }) {
    const cells = [
      ["https://www.spglobal.com/en#market-ticker"]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/featured-list.js
  function parse2(element, { document }) {
    const cells = [];
    const heading = element.querySelector("h4.mb-4, h4:first-child");
    const items = element.querySelectorAll(".navigation-list-component_link-item");
    items.forEach((item) => {
      const dateLine = item.querySelector("p.text-grey-70, p.body-regular-xs");
      const titleEl = item.querySelector("h4.body-bold-m, h4:last-child");
      const link = item.querySelector("a");
      const cellContent = [];
      if (dateLine) cellContent.push(dateLine);
      if (titleEl) {
        if (link) {
          const a = document.createElement("a");
          a.href = link.href || "#";
          a.textContent = titleEl.textContent.trim();
          cellContent.push(a);
        } else {
          cellContent.push(titleEl);
        }
      }
      if (cellContent.length) cells.push(cellContent);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "featured-list", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/podcast-banner.js
  function parse3(element, { document }) {
    const cells = [];
    const bgImage = element.querySelector("img.full-width-image-banner-component_banner-image, picture");
    if (bgImage) {
      const pic = bgImage.closest("picture") || bgImage;
      cells.push([pic]);
    }
    const contentCell = [];
    const overline = element.querySelector(".caps-bold-micro, p.caps-bold-micro");
    if (overline) contentCell.push(overline);
    const heading = element.querySelector("h4, h2, h3");
    if (heading) contentCell.push(heading);
    const description = element.querySelector(".full-width-image-banner-component_card-description, .cmp-rte-text");
    if (description) contentCell.push(description);
    const cta = element.querySelector(".full-width-image-banner-component_card-button a, a[href]");
    if (cta) contentCell.push(cta);
    if (contentCell.length) cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "podcast-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-card.js
  function parse4(element, { document }) {
    const cells = [];
    const cardLink = element.querySelector("a.box-card-component, a.static-box-card") || element.querySelector("a[href]");
    const href = (cardLink == null ? void 0 : cardLink.getAttribute("href")) || "#";
    const image = element.querySelector("img.box-card-component_img, picture");
    const pic = (image == null ? void 0 : image.closest("picture")) || image;
    const contentCell = [];
    const overline = element.querySelector(".box-card-component_content_overline");
    if (overline) contentCell.push(overline);
    const subtitle = element.querySelector(".box-card-component_content_subtitle");
    if (subtitle) contentCell.push(subtitle);
    const heading = element.querySelector(".box-card-component_content_title");
    if (heading) contentCell.push(heading);
    const desc = element.querySelector(".box-card-component_content_desc");
    if (desc) contentCell.push(desc);
    if (href && href !== "#") {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = "Read More";
      contentCell.push(link);
    }
    if (pic || contentCell.length) {
      cells.push([pic || "", contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/horizontal-card.js
  function parse5(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll("box-card-component, a.box-card-component");
    const cardEls = cards.length ? cards : [element];
    cardEls.forEach((card) => {
      var _a, _b;
      const link = card.querySelector("a[href]") || card;
      const href = ((_a = link.getAttribute) == null ? void 0 : _a.call(link, "href")) || "#";
      const image = card.querySelector("img.box-card-component_img, picture");
      const pic = (image == null ? void 0 : image.closest("picture")) || image;
      const contentCell = [];
      const overline = card.querySelector(".box-card-component_content_overline");
      if (overline) contentCell.push(overline);
      const subtitle = card.querySelector(".box-card-component_content_subtitle");
      if (subtitle) contentCell.push(subtitle);
      const heading = card.querySelector(".box-card-component_content_title");
      if (heading) contentCell.push(heading);
      const desc = card.querySelector(".box-card-component_content_desc");
      if (desc) contentCell.push(desc);
      if (href && href !== "#") {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = ((_b = heading == null ? void 0 : heading.textContent) == null ? void 0 : _b.trim()) || "Read More";
        contentCell.push(a);
      }
      if (pic || contentCell.length) {
        cells.push([pic || "", contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "horizontal-card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/product-card.js
  function parse6(element, { document }) {
    var _a;
    const cells = [];
    const link = element.querySelector("a.image-card-component_container, a[href]");
    const href = (link == null ? void 0 : link.getAttribute("href")) || "#";
    const image = element.querySelector("img.image-card-component_image, picture");
    const pic = (image == null ? void 0 : image.closest("picture")) || image;
    const contentCell = [];
    const heading = element.querySelector(".image-card-component_heading, h3");
    if (heading) contentCell.push(heading);
    const desc = element.querySelector(".image-card-component_description");
    if (desc) contentCell.push(desc);
    if (href && href !== "#") {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = ((_a = heading == null ? void 0 : heading.textContent) == null ? void 0 : _a.trim()) || "Learn More";
      contentCell.push(a);
    }
    if (pic || contentCell.length) {
      cells.push([pic || "", contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "product-card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/image-banner.js
  function parse7(element, { document }) {
    const cells = [];
    const bgImage = element.querySelector("img.full-width-image-banner-component_banner-image, picture");
    if (bgImage) {
      const pic = bgImage.closest("picture") || bgImage;
      cells.push([pic]);
    }
    const contentCell = [];
    const overline = element.querySelector(".caps-bold-micro");
    if (overline && overline.textContent.trim()) contentCell.push(overline);
    const heading = element.querySelector("h2, h3, h4");
    if (heading) contentCell.push(heading);
    const description = element.querySelector(".full-width-image-banner-component_card-description, .cmp-rte-text");
    if (description) contentCell.push(description);
    const cta = element.querySelector(".full-width-image-banner-component_card-button a, a[href]");
    if (cta) contentCell.push(cta);
    if (contentCell.length) cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "image-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/feed-cards.js
  function parse8(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".image-card-component");
    const cardEls = cards.length ? cards : [element];
    cardEls.forEach((card) => {
      var _a;
      const link = card.querySelector("a.image-card-component_container, a[href]");
      const href = (link == null ? void 0 : link.getAttribute("href")) || "#";
      const image = card.querySelector("img.image-card-component_image, picture");
      const pic = (image == null ? void 0 : image.closest("picture")) || image;
      const contentCell = [];
      const overline = card.querySelector("p.caps-bold-micro");
      if (overline) contentCell.push(overline);
      const heading = card.querySelector(".image-card-component_heading, h3");
      if (heading) contentCell.push(heading);
      const desc = card.querySelector(".image-card-component_description");
      if (desc) contentCell.push(desc);
      if (href && href !== "#") {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = ((_a = heading == null ? void 0 : heading.textContent) == null ? void 0 : _a.trim()) || "Read More";
        contentCell.push(a);
      }
      if (pic || contentCell.length) {
        cells.push([pic || "", contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "feed-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/report-card.js
  function parse9(element, { document }) {
    const cells = [];
    const cardLink = element.querySelector("a.box-card-component, a.static-box-card") || element.querySelector("a[href]");
    const href = (cardLink == null ? void 0 : cardLink.getAttribute("href")) || "#";
    const image = element.querySelector("img.box-card-component_img, picture");
    const pic = (image == null ? void 0 : image.closest("picture")) || image;
    const contentCell = [];
    const subtitle = element.querySelector(".box-card-component_content_subtitle");
    if (subtitle) contentCell.push(subtitle);
    const heading = element.querySelector(".box-card-component_content_title");
    if (heading) contentCell.push(heading);
    const desc = element.querySelector(".box-card-component_content_desc");
    if (desc) contentCell.push(desc);
    if (href && href !== "#") {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = "Read More";
      contentCell.push(a);
    }
    if (pic || contentCell.length) {
      cells.push([pic || "", contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "report-card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/nav-list.js
  function parse10(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".navigation-list-component_link-item, li");
    items.forEach((item) => {
      const link = item.querySelector("a.navigation-list-component_link-item-anchor, a[href]");
      const href = (link == null ? void 0 : link.getAttribute("href")) || "#";
      const category = item.querySelector("p.text-grey-70, p.body-regular-xs");
      const title = item.querySelector(".navigation-list-component_title, h4.body-bold-m");
      const cellContent = [];
      if (category) cellContent.push(category);
      if (title && href && href !== "#") {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = title.textContent.trim();
        cellContent.push(a);
      } else if (title) {
        cellContent.push(title);
      }
      if (cellContent.length) cells.push(cellContent);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "nav-list", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/split-banner.js
  function parse11(element, { document }) {
    const cells = [];
    const image = element.querySelector("img.full-width-split-banner-component__split-banner-image, picture");
    if (image) {
      const pic = image.closest("picture") || image;
      cells.push([pic]);
    }
    const contentCell = [];
    const overline = element.querySelector(".full-width-split-banner-component__overline-text");
    if (overline) contentCell.push(overline);
    const subtitle = element.querySelector(".full-width-split-banner-component__subtitle-text");
    if (subtitle) contentCell.push(subtitle);
    const heading = element.querySelector(".full-width-split-banner-component__heading, h2, h3");
    if (heading) contentCell.push(heading);
    const description = element.querySelector(".full-width-split-banner-component__description");
    if (description) contentCell.push(description);
    const cta = element.querySelector(".full-width-split-banner-component__cta-container a, .full-width-split-banner-component__secondary-cta a");
    if (cta) contentCell.push(cta);
    if (contentCell.length) cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "split-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/solid-cards.js
  function parse12(element, { document }) {
    var _a;
    const cells = [];
    const link = element.querySelector("a.solid-card-text-overlay-component, a[href]");
    const href = (link == null ? void 0 : link.getAttribute("href")) || "#";
    const contentCell = [];
    const heading = element.querySelector(".solid-card-text-overlay-component_heading, h4, h3");
    if (heading) contentCell.push(heading);
    const desc = element.querySelector(".solid-card-text-overlay-component_description");
    if (desc) contentCell.push(desc);
    if (href && href !== "#") {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = ((_a = heading == null ? void 0 : heading.textContent) == null ? void 0 : _a.trim()) || "Learn More";
      contentCell.push(a);
    }
    if (contentCell.length) cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "solid-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/card-plus-list.js
  function parse13(element, { document }) {
    var _a;
    const cells = [];
    const cardSection = element.querySelector(".card-lists-component_card-section");
    if (cardSection) {
      const cardLink = cardSection.querySelector("a.solid-card-text-overlay-component, a[href]");
      const href = (cardLink == null ? void 0 : cardLink.getAttribute("href")) || "#";
      const contentCell = [];
      const overline = cardSection.querySelector(".solid-card-text-overlay-component_overline");
      if (overline) contentCell.push(overline);
      const subtitle = cardSection.querySelector(".solid-card-text-overlay-component_subtitle");
      if (subtitle) contentCell.push(subtitle);
      const heading = cardSection.querySelector(".solid-card-text-overlay-component_heading, h3, h4");
      if (heading) contentCell.push(heading);
      const desc = cardSection.querySelector(".solid-card-text-overlay-component_description");
      if (desc) {
        const p = document.createElement("p");
        const text = desc.textContent.trim();
        p.textContent = text.length > 200 ? text.substring(0, 200) + "..." : text;
        contentCell.push(p);
      }
      if (href && href !== "#") {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = ((_a = heading == null ? void 0 : heading.textContent) == null ? void 0 : _a.trim()) || "Read More";
        contentCell.push(a);
      }
      if (contentCell.length) cells.push(contentCell);
    }
    const listSection = element.querySelector(".card-lists-component_list-section, navigation-list-component");
    if (listSection) {
      const items = listSection.querySelectorAll(".navigation-list-component_link-item, li");
      items.forEach((item) => {
        const link = item.querySelector("a[href]");
        const href = (link == null ? void 0 : link.getAttribute("href")) || "#";
        const category = item.querySelector("p.text-grey-70, p.body-regular-xs");
        const title = item.querySelector(".navigation-list-component_title, h4.body-bold-m");
        const cellContent = [];
        if (category) cellContent.push(category);
        if (title && href && href !== "#") {
          const a = document.createElement("a");
          a.href = href;
          a.textContent = title.textContent.trim();
          cellContent.push(a);
        } else if (title) {
          cellContent.push(title);
        }
        if (cellContent.length) cells.push(cellContent);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "card-plus-list", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel.js
  function parse14(element, { document }) {
    const cells = [];
    const slides = element.querySelectorAll(".swiper-slide");
    const slideEls = slides.length ? slides : [element];
    slideEls.forEach((slide) => {
      var _a;
      const card = slide.querySelector("box-card-component, a.box-card-component") || slide;
      const link = card.querySelector("a[href]") || card;
      const href = ((_a = link.getAttribute) == null ? void 0 : _a.call(link, "href")) || "#";
      const image = slide.querySelector("img.box-card-component_img, picture");
      const pic = (image == null ? void 0 : image.closest("picture")) || image;
      const contentCell = [];
      const date = slide.querySelector(".box-card-component_content_subtitle");
      if (date) contentCell.push(date);
      const heading = slide.querySelector(".box-card-component_content_title, h4, h3");
      if (heading) contentCell.push(heading);
      const desc = slide.querySelector(".box-card-component_content_desc");
      if (desc) contentCell.push(desc);
      if (href && href !== "#") {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = "Listen Now";
        contentCell.push(a);
      }
      if (pic || contentCell.length) {
        cells.push([pic || "", contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse15(element, { document }) {
    const navLists = element.querySelectorAll("navigation-list-component, .navigation-list-component");
    const columns = [];
    navLists.forEach((navList) => {
      const colContent = [];
      const heading = navList.querySelector('h4.mb-4, h4[id^="navigation-list-component"]');
      if (heading) {
        const h = document.createElement("h4");
        h.textContent = heading.textContent.trim();
        colContent.push(h);
      }
      const items = navList.querySelectorAll(".navigation-list-component_link-item, li");
      const ul = document.createElement("ul");
      items.forEach((item) => {
        const link = item.querySelector("a[href]");
        const title = item.querySelector(".navigation-list-component_title, h4.body-bold-m");
        if (title) {
          const li = document.createElement("li");
          if (link) {
            const a = document.createElement("a");
            a.href = link.getAttribute("href") || "#";
            a.textContent = title.textContent.trim();
            li.appendChild(a);
          } else {
            li.textContent = title.textContent.trim();
          }
          ul.appendChild(li);
        }
      });
      if (ul.children.length) colContent.push(ul);
      if (colContent.length) columns.push(colContent);
    });
    const cells = columns.length ? [columns] : [];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/spglobal-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".static-modal-component",
        ".modal-component-web"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "noscript",
        "iframe"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".dividerline"
      ]);
      element.querySelectorAll("title").forEach((el) => el.remove());
      element.querySelectorAll("link").forEach((el) => el.remove());
      element.querySelectorAll("source:not([srcset])").forEach((el) => el.remove());
    }
  }

  // tools/importer/transformers/spglobal-sections.js
  function transform2(hookName, element, payload) {
    var _a;
    if (hookName === "afterTransform") {
      let findContentGrid = function() {
        var _a2;
        const main = element.querySelector("main") || element;
        const containers = main.querySelectorAll(".cmp-container");
        for (const c of containers) {
          if (c.parentElement === main || ((_a2 = c.parentElement) == null ? void 0 : _a2.parentElement) === main) {
            const grid2 = c.querySelector(".aem-Grid");
            if (grid2) return grid2;
          }
        }
        return main;
      }, findGridChild = function(el) {
        for (const child of gridChildren) {
          if (child === el || child.contains(el)) return child;
        }
        return null;
      };
      const { document } = payload;
      const sections = (_a = payload.template) == null ? void 0 : _a.sections;
      if (!sections || sections.length < 2) return;
      const grid = findContentGrid();
      const gridChildren = Array.from(grid.children);
      let lastFoundEl = null;
      const found = [];
      for (const section of sections) {
        const sels = Array.isArray(section.selector) ? section.selector : [section.selector];
        let match = null;
        for (const sel of sels) {
          try {
            const candidates = element.querySelectorAll(sel);
            for (const c of candidates) {
              if (!lastFoundEl || lastFoundEl.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING) {
                match = c;
                break;
              }
            }
          } catch (e) {
          }
          if (match) break;
        }
        if (match) {
          lastFoundEl = match;
          found.push({ section, el: match });
        }
      }
      if (found.length < 2) return;
      for (let i = 0; i < found.length - 1; i++) {
        const current = found[i];
        const next = found[i + 1];
        const nextContainer = findGridChild(next.el) || next.el;
        const insertParent = nextContainer.parentElement || grid;
        if (current.section.style) {
          const meta = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: current.section.style }
          });
          insertParent.insertBefore(meta, nextContainer);
        }
        const hr = document.createElement("hr");
        insertParent.insertBefore(hr, nextContainer);
      }
      const last = found[found.length - 1];
      if (last.section.style) {
        const meta = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: last.section.style }
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

  // tools/importer/import-homepage.js
  var parsers = {
    "embed": parse,
    "featured-list": parse2,
    "podcast-banner": parse3,
    "hero-card": parse4,
    "horizontal-card": parse5,
    "product-card": parse6,
    "image-banner": parse7,
    "feed-cards": parse8,
    "report-card": parse9,
    "nav-list": parse10,
    "split-banner": parse11,
    "solid-cards": parse12,
    "card-plus-list": parse13,
    "carousel": parse14,
    "columns": parse15
  };
  var INSTANCE_PARSER_MAP = {
    ".ticker indices-ticker-component": "embed",
    "#homepage-left-rail .article-right-rail-component": "featured-list",
    ".fullwidthimagesolidbanner .full-width-image-banner-component": "podcast-banner",
    "#hero-article .horizontal-card.teaser": "hero-card",
    "#featured-card-list .horizontal-card.teaser": "horizontal-card",
    "#homepage-right-rail .vertical-card.teaser": "product-card",
    ".automaticfeedcards card-feed-component": "feed-cards",
    ".card_plus_list card-lists-component": "card-plus-list",
    ".vertical-card.teaser solid-card-component": "solid-cards",
    ".fullwidthsplitbanner .full-width-split-banner-component": "split-banner",
    ".carousel.panelcontainer .carousel-component": "carousel",
    ".navlist navigation-list-component": "columns"
  };
  var SPECIFIC_INSTANCE_MAP = {
    ".bg-grey-5 .fullwidthimagesolidbanner .full-width-image-banner-component": "image-banner",
    "#homepage-left-rail .fullwidthimagesolidbanner .full-width-image-banner-component": "podcast-banner",
    ".horizontal-card.teaser box-card-component.static-box-card.vertical": "report-card"
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "S&P Global corporate homepage with hero banner, featured content sections, market data, and promotional cards",
    urls: [
      "https://www.spglobal.com/en"
    ],
    blocks: [
      {
        name: "embed",
        instances: [".ticker indices-ticker-component"]
      },
      {
        name: "cards",
        instances: [
          "#homepage-left-rail .article-right-rail-component",
          "#hero-article .horizontal-card.teaser",
          "#featured-card-list .horizontal-card.teaser",
          "#homepage-right-rail .vertical-card.teaser",
          ".automaticfeedcards card-feed-component",
          ".card_plus_list card-lists-component",
          ".vertical-card.teaser solid-card-component"
        ]
      },
      {
        name: "hero",
        instances: [
          ".fullwidthimagesolidbanner .full-width-image-banner-component",
          ".fullwidthsplitbanner .full-width-split-banner-component"
        ]
      },
      {
        name: "carousel",
        instances: [".carousel.panelcontainer .carousel-component"]
      },
      {
        name: "columns",
        instances: [".navlist navigation-list-component"]
      }
    ],
    sections: [
      {
        id: "section-1-ticker",
        name: "Market Ticker",
        selector: ".ticker",
        style: null,
        blocks: ["embed"],
        defaultContent: []
      },
      {
        id: "section-2-hero",
        name: "Hero Content Area",
        selector: "#homepage-hero-content",
        style: null,
        blocks: ["cards", "hero"],
        defaultContent: []
      },
      {
        id: "section-3-dow-banner",
        name: "Dow 50,000 Banner",
        selector: ".bg-grey-5 .fullwidthimagesolidbanner",
        style: "light-grey",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-4-daily-update",
        name: "S&P Global Daily Update",
        selector: [".onecolumnblock h2", ".automaticfeedcards"],
        style: null,
        blocks: ["cards"],
        defaultContent: [".onecolumnblock h2", ".onecolumnblock .cmp-text p"]
      },
      {
        id: "section-5-special-reports",
        name: "Special Reports",
        selector: "#onecolumnblock-133101204",
        style: null,
        blocks: ["cards"],
        defaultContent: ["#onecolumnblock-133101204", ".onecolumnblock .cmp-text"]
      },
      {
        id: "section-6-ceraweek",
        name: "CERAWeek Banner",
        selector: ".fullwidthsplitbanner",
        style: "light-grey",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-7-featured-products",
        name: "Featured Products",
        selector: "#onecolumnblock-1824890746",
        style: null,
        blocks: ["cards"],
        defaultContent: ["#onecolumnblock-1824890746"]
      },
      {
        id: "section-8-ai-insights",
        name: "Artificial Intelligence Insights",
        selector: "#onecolumnblock-287831025",
        style: null,
        blocks: ["cards"],
        defaultContent: ["#onecolumnblock-287831025", ".onecolumnblock .cmp-text"]
      },
      {
        id: "section-9-leaders-podcast",
        name: "Leaders Podcast",
        selector: "#onecolumnblock-1519007886",
        style: null,
        blocks: ["carousel"],
        defaultContent: ["#onecolumnblock-1519007886", ".onecolumnblock .cmp-text"]
      },
      {
        id: "section-10-bottom-nav",
        name: "Bottom Navigation Lists",
        selector: ".navlist",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      }
    ]
  };
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
  function resolveParser(blockName, selector) {
    for (const [specificSelector, parserName] of Object.entries(SPECIFIC_INSTANCE_MAP)) {
      if (selector.includes(specificSelector) || specificSelector.includes(selector)) {
        return parserName;
      }
    }
    if (INSTANCE_PARSER_MAP[selector]) {
      return INSTANCE_PARSER_MAP[selector];
    }
    return blockName;
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          const parserName = resolveParser(blockDef.name, selector);
          pageBlocks.push({
            name: parserName,
            blockName: blockDef.name,
            selector,
            element
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
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
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
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
