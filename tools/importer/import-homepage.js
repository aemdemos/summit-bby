/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPromoParser from './parsers/hero-promo.js';
import carouselCategoryParser from './parsers/carousel-category.js';
import cardCarouselDealsParser from './parsers/card-carousel-deals.js';
import columnsBenefitsParser from './parsers/columns-benefits.js';
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/bestbuy-cleanup.js';
import sectionsTransformer from './transformers/bestbuy-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  urls: [
    'https://www.bestbuy.com/',
    'http://localhost:8888/bestbuy-ssr-page.html',
  ],
  description: 'Best Buy homepage with promotional banners, featured product categories, deals, and brand highlights',
  blocks: [
    {
      name: 'hero-promo',
      instances: ['section.hero-v2-bg-gradient'],
    },
    {
      name: 'carousel-category',
      instances: [
        'div.deals-by-categories',
        'div.flex.items-stretch.flex-col.rounded-border-lv:has(> .p-200)',
      ],
    },
    {
      name: 'card-carousel-deals',
      instances: ['div.grid:has([data-testid="offer-card"])'],
    },
    {
      name: 'columns-benefits',
      instances: ['div.signin-create-account-container'],
    },
    {
      name: 'hero-banner',
      instances: ["div.flex-1.relative.overflow-hidden:has(img[src*='scc-lgtv'])"],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: 'section.hero-v2-bg-gradient',
      style: 'blue-gradient',
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Shop Deals by Category',
      selector: 'div.deals-by-categories',
      style: 'light-grey',
      blocks: ['carousel-category'],
      defaultContent: ['h5.text-style-title-sm-500'],
    },
    {
      id: 'section-3',
      name: 'Product Deals',
      selector: 'div.grid:has([data-testid="offer-card"])',
      style: null,
      blocks: ['card-carousel-deals'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Sign In Benefits',
      selector: 'div.signin-create-account-container',
      style: null,
      blocks: ['columns-benefits'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Featured Promo',
      selector: "div.flex-1.relative.overflow-hidden:has(img[src*='scc-lgtv'])",
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Trending Categories',
      selector: 'div.flex.items-stretch.flex-col.rounded-border-lv:has(> .p-200)',
      style: null,
      blocks: ['carousel-category'],
      defaultContent: ['span.text-style-title-sm-500'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-promo': heroPromoParser,
  'carousel-category': carouselCategoryParser,
  'card-carousel-deals': cardCarouselDealsParser,
  'columns-benefits': columnsBenefitsParser,
  'hero-banner': heroBannerParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} doc - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
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
            section: blockDef.section || null,
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

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    // Map local SSR file URLs back to the canonical /index path
    let rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index';
    if (rawPath.includes('bestbuy-ssr-page')) {
      rawPath = '/index';
    }
    const path = WebImporter.FileUtils.sanitizePath(rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
