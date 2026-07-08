/**
 * Astro integration: processes all generated HTML at build time
 * to add target="_blank" rel="nofollow noopener" to external links.
 *
 * Runs on astro:build:done — modifies static HTML files in place.
 * Works alongside the rehype plugin (markdown) for full coverage.
 */
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { join } from 'path';

function getSiteDomains() {
  const domain = process.env.SITE_DOMAIN || 'exemple.com';
  const bare = domain.replace(/^www\./, '');
  return [bare, `www.${bare}`];
}
const SITE_DOMAINS = getSiteDomains();

/** External domains that should keep "follow" (no nofollow). */
const FOLLOW_DOMAINS = [];

function isOwnDomain(hostname) {
  const h = hostname.replace(/^www\./, '');
  return SITE_DOMAINS.some(d => d.replace(/^www\./, '') === h);
}

function isFollowDomain(hostname) {
  const h = hostname.replace(/^www\./, '');
  return FOLLOW_DOMAINS.some(d => d.replace(/^www\./, '') === h);
}

/**
 * Process a single HTML string: find all <a href="http..."> and add attributes.
 */
function processHtml(html) {
  return html.replace(
    /<a\s([^>]*?)href\s*=\s*"(https?:\/\/[^"]+)"([^>]*?)>/gi,
    (match, before, href, after) => {
      try {
        const url = new URL(href);
        if (isOwnDomain(url.hostname)) return match;

        const full = before + after;
        let newTag = match;

        if (!/target\s*=/i.test(full)) {
          newTag = newTag.replace(/>$/, ' target="_blank">');
        }

        if (!/rel\s*=/i.test(full)) {
          const relValue = isFollowDomain(url.hostname) ? 'noopener' : 'nofollow noopener';
          newTag = newTag.replace(/>$/, ` rel="${relValue}">`);
        }

        return newTag;
      } catch {
        return match;
      }
    }
  );
}

export default function externalLinksIntegration() {
  return {
    name: 'external-links',
    hooks: {
      'astro:build:done': async ({ dir, routes }) => {
        const outDir = fileURLToPath(dir);
        let processed = 0;

        for (const route of routes) {
          if (route.type !== 'page') continue;
          const distURL = route.distURL;
          if (!distURL) continue;

          const filePath = fileURLToPath(distURL);
          if (!filePath.endsWith('.html')) continue;

          try {
            const html = await readFile(filePath, 'utf-8');
            const result = processHtml(html);
            if (result !== html) {
              await writeFile(filePath, result, 'utf-8');
              processed++;
            }
          } catch {
            // File might not exist for SSR routes — skip silently
          }
        }

        if (processed > 0) {
          console.log(`[external-links] Processed ${processed} HTML file(s)`);
        }
      },
    },
  };
}
