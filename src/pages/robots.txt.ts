import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';
import { AI_CRAWLERS } from '@/lib/ai-crawlers';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href.replace(/\/$/, '') ?? siteConfig.url).replace(/\/$/, '');

  const aiRule = siteConfig.allowAiCrawlers ? 'Allow: /' : 'Disallow: /';
  const aiBlock = [
    `# Crawlers IA / moteurs génératifs — ${
      siteConfig.allowAiCrawlers ? 'autorisés (GEO)' : 'bloqués'
    }`,
    ...AI_CRAWLERS.map((c) => `User-agent: ${c.agent}`),
    aiRule,
  ].join('\n');

  const body = `# robots.txt — ${siteConfig.siteName}

User-agent: *
Allow: /

${aiBlock}

# Découverte
Sitemap: ${base}/sitemap.xml
# Résumé du site pour les LLM : ${base}/llms.txt
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
