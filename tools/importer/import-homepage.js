/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import embedParser from './parsers/embed.js';
import featuredListParser from './parsers/featured-list.js';
import podcastBannerParser from './parsers/podcast-banner.js';
import heroCardParser from './parsers/hero-card.js';
import horizontalCardParser from './parsers/horizontal-card.js';
import productCardParser from './parsers/product-card.js';
import imageBannerParser from './parsers/image-banner.js';
import feedCardsParser from './parsers/feed-cards.js';
import reportCardParser from './parsers/report-card.js';
import navListParser from './parsers/nav-list.js';
import splitBannerParser from './parsers/split-banner.js';
import solidCardsParser from './parsers/solid-cards.js';
import cardPlusListParser from './parsers/card-plus-list.js';
import carouselParser from './parsers/carousel.js';
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/spglobal-cleanup.js';
import sectionsTransformer from './transformers/spglobal-sections.js';

// PARSER REGISTRY - Map variant names to parser functions
const parsers = {
  'embed': embedParser,
  'featured-list': featuredListParser,
  'podcast-banner': podcastBannerParser,
  'hero-card': heroCardParser,
  'horizontal-card': horizontalCardParser,
  'product-card': productCardParser,
  'image-banner': imageBannerParser,
  'feed-cards': feedCardsParser,
  'report-card': reportCardParser,
  'nav-list': navListParser,
  'split-banner': splitBannerParser,
  'solid-cards': solidCardsParser,
  'card-plus-list': cardPlusListParser,
  'carousel': carouselParser,
  'columns': columnsParser,
};

// INSTANCE-TO-PARSER MAPPING
// Maps each DOM selector to the specific parser variant that handles it.
// Derived from authoring-analysis.json content sequences.
const INSTANCE_PARSER_MAP = {
  '.ticker indices-ticker-component': 'embed',
  '#homepage-left-rail .article-right-rail-component': 'featured-list',
  '.fullwidthimagesolidbanner .full-width-image-banner-component': 'podcast-banner',
  '#hero-article .horizontal-card.teaser': 'hero-card',
  '#featured-card-list .horizontal-card.teaser': 'horizontal-card',
  '#homepage-right-rail .vertical-card.teaser': 'product-card',
  '.automaticfeedcards card-feed-component': 'feed-cards',
  '.card_plus_list card-lists-component': 'card-plus-list',
  '.vertical-card.teaser solid-card-component': 'solid-cards',
  '.fullwidthsplitbanner .full-width-split-banner-component': 'split-banner',
  '.carousel.panelcontainer .carousel-component': 'carousel',
  '.navlist navigation-list-component': 'columns',
};

// Additional selectors from authoring analysis that are more specific
// than the template instances. These override when found.
const SPECIFIC_INSTANCE_MAP = {
  '.bg-grey-5 .fullwidthimagesolidbanner .full-width-image-banner-component': 'image-banner',
  '#homepage-left-rail .fullwidthimagesolidbanner .full-width-image-banner-component': 'podcast-banner',
  '.horizontal-card.teaser box-card-component.static-box-card.vertical': 'report-card',
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'S&P Global corporate homepage with hero banner, featured content sections, market data, and promotional cards',
  urls: [
    'https://www.spglobal.com/en',
  ],
  blocks: [
    {
      name: 'embed',
      instances: ['.ticker indices-ticker-component'],
    },
    {
      name: 'cards',
      instances: [
        '#homepage-left-rail .article-right-rail-component',
        '#hero-article .horizontal-card.teaser',
        '#featured-card-list .horizontal-card.teaser',
        '#homepage-right-rail .vertical-card.teaser',
        '.automaticfeedcards card-feed-component',
        '.card_plus_list card-lists-component',
        '.vertical-card.teaser solid-card-component',
      ],
    },
    {
      name: 'hero',
      instances: [
        '.fullwidthimagesolidbanner .full-width-image-banner-component',
        '.fullwidthsplitbanner .full-width-split-banner-component',
      ],
    },
    {
      name: 'carousel',
      instances: ['.carousel.panelcontainer .carousel-component'],
    },
    {
      name: 'columns',
      instances: ['.navlist navigation-list-component'],
    },
  ],
  sections: [
    {
      id: 'section-1-ticker',
      name: 'Market Ticker',
      selector: '.ticker',
      style: null,
      blocks: ['embed'],
      defaultContent: [],
    },
    {
      id: 'section-2-hero',
      name: 'Hero Content Area',
      selector: '#homepage-hero-content',
      style: null,
      blocks: ['cards', 'hero'],
      defaultContent: [],
    },
    {
      id: 'section-3-dow-banner',
      name: 'Dow 50,000 Banner',
      selector: '.bg-grey-5 .fullwidthimagesolidbanner',
      style: 'light-grey',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-4-daily-update',
      name: 'S&P Global Daily Update',
      selector: ['.onecolumnblock h2', '.automaticfeedcards'],
      style: null,
      blocks: ['cards'],
      defaultContent: ['.onecolumnblock h2', '.onecolumnblock .cmp-text p'],
    },
    {
      id: 'section-5-special-reports',
      name: 'Special Reports',
      selector: '#onecolumnblock-133101204',
      style: null,
      blocks: ['cards'],
      defaultContent: ['#onecolumnblock-133101204', '.onecolumnblock .cmp-text'],
    },
    {
      id: 'section-6-ceraweek',
      name: 'CERAWeek Banner',
      selector: '.fullwidthsplitbanner',
      style: 'light-grey',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-7-featured-products',
      name: 'Featured Products',
      selector: '#onecolumnblock-1824890746',
      style: null,
      blocks: ['cards'],
      defaultContent: ['#onecolumnblock-1824890746'],
    },
    {
      id: 'section-8-ai-insights',
      name: 'Artificial Intelligence Insights',
      selector: '#onecolumnblock-287831025',
      style: null,
      blocks: ['cards'],
      defaultContent: ['#onecolumnblock-287831025', '.onecolumnblock .cmp-text'],
    },
    {
      id: 'section-9-leaders-podcast',
      name: 'Leaders Podcast',
      selector: '#onecolumnblock-1519007886',
      style: null,
      blocks: ['carousel'],
      defaultContent: ['#onecolumnblock-1519007886', '.onecolumnblock .cmp-text'],
    },
    {
      id: 'section-10-bottom-nav',
      name: 'Bottom Navigation Lists',
      selector: '.navlist',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
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
 * Resolve the parser name for a given block instance selector.
 * Checks specific overrides first, then the general instance map,
 * then falls back to the block name itself.
 */
function resolveParser(blockName, selector) {
  // Check specific overrides first
  for (const [specificSelector, parserName] of Object.entries(SPECIFIC_INSTANCE_MAP)) {
    if (selector.includes(specificSelector) || specificSelector.includes(selector)) {
      return parserName;
    }
  }
  // Check instance-to-parser map
  if (INSTANCE_PARSER_MAP[selector]) {
    return INSTANCE_PARSER_MAP[selector];
  }
  // Fallback to block name
  return blockName;
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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
          element,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

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
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

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
