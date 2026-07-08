import type { APIRoute } from 'astro';
import { getPublishedArticles } from '@/data/articles';
import { homeContent } from '@/data/content';

export const prerender = true;

const STATIC_PAGES = [
  '/',
  '/cadeaux/',
  '/blog/',
  '/a-propos/',
  '/contact/',
  '/politique-de-confidentialite/',
  '/divulgation-affiliation/',
];

const AUDIENCE_PAGES = homeContent.audiences.map((a) => a.href);
const STYLE_PAGES = ['/cadeaux/insolites/'];
const BLOG_POSTS = getPublishedArticles().map((a) => `/blog/${a.slug}/`);

export const GET: APIRoute = ({ site }) => {
  const base = site?.href.replace(/\/$/, '') ?? '';
  const urls = [...new Set([...STATIC_PAGES, ...AUDIENCE_PAGES, ...STYLE_PAGES, ...BLOG_POSTS])];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
