import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';
import { homeContent, aboutContent, contactContent } from '@/data/content';
import { getPublishedArticles } from '@/data/articles';

export const prerender = true;

/**
 * /llms.txt — index lisible par les LLM (spec llmstxt.org).
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site?.href.replace(/\/$/, '') ?? siteConfig.url).replace(/\/$/, '');
  const abs = (p: string) => `${base}${p}`;

  const pages = [
    { title: 'Accueil', href: '/', desc: homeContent.hero.subtitle },
    { title: 'Idées cadeaux', href: '/cadeaux/', desc: siteConfig.siteTagline },
    { title: aboutContent.title, href: '/a-propos/', desc: aboutContent.history[0] },
    { title: contactContent.title, href: '/contact/', desc: contactContent.formSubtitle },
  ];

  const posts = getPublishedArticles();

  const out: string[] = [];
  out.push(`# ${siteConfig.siteName}`);
  out.push('');
  out.push(`> ${siteConfig.defaultDescription}`);
  out.push('');
  out.push(
    `${siteConfig.siteName} est basé à ${siteConfig.city}, ${siteConfig.region}. ` +
      `Pour toute demande : ${siteConfig.contactEmail}.`
  );
  out.push('');

  out.push('## Pages principales');
  out.push('');
  for (const p of pages) out.push(`- [${p.title}](${abs(p.href)}): ${p.desc}`);
  out.push('');

  out.push('## Blogue');
  out.push('');
  if (posts.length > 0) {
    for (const post of posts) {
      out.push(`- [${post.title}](${abs(`/blog/${post.slug}/`)}): ${post.excerpt}`);
    }
  } else {
    out.push(`- [Blogue](${abs('/blog/')}): articles à venir.`);
  }
  out.push('');

  out.push('## Ressources');
  out.push('');
  out.push(`- [Plan du site (HTML)](${abs('/plan-du-site/')})`);
  out.push(`- [Sitemap (XML)](${abs('/sitemap.xml')})`);
  out.push(`- [Contenu complet pour LLM](${abs('/llms-full.txt')})`);
  out.push('');

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
