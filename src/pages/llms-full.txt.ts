import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';
import { homeContent, aboutContent, contactContent } from '@/data/content';
import { getPublishedArticles } from '@/data/articles';

export const prerender = true;

/**
 * /llms-full.txt — contenu complet du site en Markdown (spec llmstxt.org).
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site?.href.replace(/\/$/, '') ?? siteConfig.url).replace(/\/$/, '');

  const out: string[] = [];

  out.push(`# ${siteConfig.siteName}`);
  out.push('');
  out.push(`> ${siteConfig.defaultDescription}`);
  out.push('');
  out.push(
    `Site : ${base}/ · Lieu : ${siteConfig.city}, ${siteConfig.region} · Contact : ${siteConfig.contactEmail}`
  );
  out.push('');

  out.push('## Accueil');
  out.push('');
  out.push(homeContent.hero.title);
  out.push('');
  out.push(homeContent.hero.subtitle);
  out.push('');
  out.push('### Catégories');
  out.push('');
  for (const a of homeContent.audiences) {
    out.push(`- **${a.label}** — ${base}${a.href}`);
  }
  out.push('');

  out.push('## Idées cadeaux');
  out.push('');
  out.push(siteConfig.siteTagline);
  out.push('');

  out.push(`## ${aboutContent.title}`);
  out.push('');
  for (const p of aboutContent.history) {
    out.push(p);
    out.push('');
  }
  out.push(`### ${aboutContent.valuesTitle}`);
  out.push('');
  for (const v of aboutContent.values) {
    out.push(`- **${v.title}** — ${v.text}`);
  }
  out.push('');

  out.push(`## ${contactContent.title}`);
  out.push('');
  out.push(contactContent.formSubtitle);
  out.push('');
  for (const item of contactContent.faq) {
    out.push(`### ${item.q}`);
    out.push('');
    out.push(item.a);
    out.push('');
  }

  const posts = getPublishedArticles();
  if (posts.length > 0) {
    out.push('## Blogue');
    out.push('');
    for (const post of posts) {
      out.push(`### ${post.title}`);
      out.push('');
      out.push(`URL : ${base}/blog/${post.slug}/ · Publié : ${post.date}`);
      out.push('');
      out.push(post.excerpt);
      out.push('');
      for (const para of post.body) {
        out.push(para);
        out.push('');
      }
    }
  }

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
