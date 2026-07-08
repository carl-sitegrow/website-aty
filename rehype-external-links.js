/**
 * Rehype plugin: adds target="_blank" rel="nofollow noopener" to all external links in markdown.
 * Links pointing to the site's own domain are left unchanged.
 *
 * To allow "follow" on specific domains, add them to the FOLLOW_DOMAINS list below.
 */
import { visit } from 'unist-util-visit';

function getSiteDomains() {
  const domain = process.env.SITE_DOMAIN || 'exemple.com';
  const bare = domain.replace(/^www\./, '');
  return [bare, `www.${bare}`];
}
const SITE_DOMAINS = getSiteDomains();

/** External domains that should be follow (no nofollow). Add trusted partners here. */
const FOLLOW_DOMAINS = [];

function isExternalUrl(href) {
  if (!href) return false;
  try {
    const url = new URL(href, 'https://placeholder.local');
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) return false;
    const hostname = url.hostname.replace(/^www\./, '');
    return !SITE_DOMAINS.some(d => d.replace(/^www\./, '') === hostname);
  } catch {
    return false;
  }
}

function shouldNofollow(href) {
  try {
    const url = new URL(href);
    const hostname = url.hostname.replace(/^www\./, '');
    return !FOLLOW_DOMAINS.some(d => d.replace(/^www\./, '') === hostname);
  } catch {
    return true;
  }
}

export default function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (!isExternalUrl(href)) return;

      node.properties.target = '_blank';
      const relParts = ['noopener'];
      if (shouldNofollow(href)) relParts.push('nofollow');
      node.properties.rel = relParts.join(' ');
    });
  };
}
