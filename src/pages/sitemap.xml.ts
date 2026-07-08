import type { APIRoute } from 'astro';
import { getPublishedArticles } from '@/data/articles';
import { homeContent } from '@/data/content';
import { siteConfig } from '@/config/site';
import { gitLastmod } from '@/lib/git-lastmod';

export const prerender = true;

const PAGE_SOURCES: Record<string, string[]> = {
  '/': ['src/pages/index.astro', 'src/data/content.ts'],
  '/cadeaux/': ['src/pages/cadeaux/index.astro', 'src/data/products.ts'],
  '/cadeaux/insolites/': ['src/pages/cadeaux/[audience]/index.astro', 'src/data/audiences.ts'],
  '/blog/': ['src/pages/blog/index.astro', 'src/data/articles.ts'],
  '/a-propos/': ['src/pages/a-propos/index.astro', 'src/data/content.ts'],
  '/contact/': ['src/pages/contact/index.astro', 'src/data/content.ts'],
  '/politique-de-confidentialite/': ['src/pages/politique-de-confidentialite/index.astro', 'src/data/content.ts'],
  '/divulgation-affiliation/': ['src/pages/divulgation-affiliation/index.astro', 'src/data/content.ts'],
  '/plan-du-site/': ['src/pages/plan-du-site/index.astro', 'src/lib/breadcrumb.ts'],
};

const STATIC_PAGES = [
  '/',
  '/cadeaux/',
  '/blog/',
  '/a-propos/',
  '/contact/',
  '/politique-de-confidentialite/',
  '/divulgation-affiliation/',
  '/plan-du-site/',
];

const AUDIENCE_PAGES = homeContent.audiences.map((a) => a.href);
const STYLE_PAGES = ['/cadeaux/insolites/'];

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href.replace(/\/$/, '') ?? siteConfig.url).replace(/\/$/, '');

  type Entry = { loc: string; lastmod?: string };
  const entries: Entry[] = [];

  for (const p of [...new Set([...STATIC_PAGES, ...AUDIENCE_PAGES, ...STYLE_PAGES])]) {
    entries.push({
      loc: `${base}${p}`,
      lastmod: gitLastmod(PAGE_SOURCES[p] ?? []),
    });
  }

  for (const article of getPublishedArticles()) {
    const path = `/blog/${article.slug}/`;
    entries.push({
      loc: `${base}${path}`,
      lastmod: article.dateISO || gitLastmod(['src/data/articles.ts']),
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(
    (e) =>
      `  <url>
    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}
      <xhtml:link rel="alternate" hreflang="fr-CA" href="${e.loc}"/>
      <xhtml:link rel="alternate" hreflang="x-default" href="${e.loc}"/>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
