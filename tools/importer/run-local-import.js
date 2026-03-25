#!/usr/bin/env node

/**
 * Local Import Runner
 * Runs the import script against pre-captured HTML (for bot-protected sites).
 * Uses Playwright route interception to serve local HTML when the URL is requested.
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const parsed = {};
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    parsed[args[i]] = args[i + 1];
    i++;
  }
}

const importScript = resolve(parsed['--import-script']);
const localHtml = resolve(parsed['--html']);
const originalUrl = parsed['--url'];
const outputDir = resolve(process.cwd(), 'content');

if (!existsSync(importScript)) {
  console.error(`Import script not found: ${importScript}`);
  process.exit(1);
}
if (!existsSync(localHtml)) {
  console.error(`Local HTML not found: ${localHtml}`);
  process.exit(1);
}

const helixImporterPath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..', 'skills', 'excat-content-import', 'scripts', 'static', 'inject', 'helix-importer.js');
// Try multiple paths
const helixPaths = [
  helixImporterPath,
  '/home/node/.claude/plugins/cache/excat-marketplace/excat/2.1.1/skills/excat-content-import/scripts/static/inject/helix-importer.js',
];
let helixImporterScript;
for (const p of helixPaths) {
  if (existsSync(p)) {
    helixImporterScript = readFileSync(p, 'utf-8');
    break;
  }
}
if (!helixImporterScript) {
  console.error('helix-importer.js not found');
  process.exit(1);
}

const importScriptContent = readFileSync(importScript, 'utf-8');
const htmlContent = readFileSync(localHtml, 'utf-8');

function ensureDir(pathname) {
  mkdirSync(pathname, { recursive: true });
}

async function main() {
  console.log('[Local Import] Starting with:');
  console.log(`  Import script: ${importScript}`);
  console.log(`  Local HTML:    ${localHtml}`);
  console.log(`  Original URL:  ${originalUrl}`);
  console.log(`  Output dir:    ${outputDir}`);
  console.log('');

  ensureDir(outputDir);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  // Intercept the original URL and serve local HTML instead
  await context.route(originalUrl + '**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: htmlContent,
    });
  });

  const page = await context.newPage();

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.error(`[Browser] ${text}`);
    } else if (type === 'warning') {
      console.warn(`[Browser] ${text}`);
    } else {
      console.log(`[Browser] ${text}`);
    }
  });

  try {
    // Navigate to the original URL (will be intercepted and serve local HTML)
    await page.goto(originalUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Inject helix-importer
    await page.evaluate(script => {
      const originalDefine = window.define;
      if (typeof window.define !== 'undefined') {
        delete window.define;
      }
      const scriptEl = document.createElement('script');
      scriptEl.textContent = script;
      document.head.appendChild(scriptEl);
      if (originalDefine) {
        window.define = originalDefine;
      }
    }, helixImporterScript);

    // Inject import script bundle
    await page.evaluate(script => {
      const scriptEl = document.createElement('script');
      scriptEl.textContent = script;
      document.head.appendChild(scriptEl);
    }, importScriptContent);

    // Wait for CustomImportScript
    await page.waitForFunction(
      () => typeof window.CustomImportScript !== 'undefined' && window.CustomImportScript?.default,
      { timeout: 10000 }
    );

    // Run the transform
    const result = await page.evaluate(async (pageUrl) => {
      const customImportConfig = window.CustomImportScript.default;
      const importResult = await window.WebImporter.html2md(pageUrl, document, customImportConfig, {
        toDocx: false,
        toMd: true,
        originalURL: pageUrl,
      });
      importResult.html = window.WebImporter.md2da(importResult.md);
      return importResult;
    }, originalUrl);

    if (!result.path || !result.html) {
      throw new Error(`Transform did not return valid result. path=${typeof result.path}, html=${typeof result.html}`);
    }

    // Sanitize path
    let relPath = result.path.replace(/\\/g, '/');
    if (relPath.startsWith('/')) relPath = relPath.slice(1);
    if (relPath.endsWith('/')) relPath = relPath.slice(0, -1);
    if (relPath === '') relPath = 'index';

    const plainHtmlPath = join(outputDir, `${relPath}.plain.html`);
    ensureDir(dirname(plainHtmlPath));
    writeFileSync(plainHtmlPath, result.html, 'utf-8');

    // Write report
    const reportsDir = 'tools/importer/reports';
    const reportPath = join(reportsDir, `${relPath}.report.json`);
    ensureDir(dirname(reportPath));
    writeFileSync(reportPath, JSON.stringify({
      status: 'success',
      url: originalUrl,
      path: relPath,
      timestamp: new Date().toISOString(),
      ...(result.report || {}),
    }, null, 2), 'utf-8');

    console.log(`\n✅ Content saved to content/${relPath}.plain.html`);
    console.log(`   Report saved to ${reportPath}`);

  } catch (error) {
    console.error(`\n❌ Import failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await page.close().catch(() => {});
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

main().catch(err => {
  console.error('[Local Import] Unexpected error:', err);
  process.exit(1);
});
