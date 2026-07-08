import { siteConfig, type BusinessType } from '@/config/site';
import { absoluteUrl, OG_IMAGE } from '@/lib/seo';
import type { Article } from '@/data/articles';

/**
 * Générateurs de données structurées JSON-LD (schema.org) — approche @graph.
 * Le BreadcrumbList est émis séparément par Breadcrumb.astro.
 */

const rootUrl = (origin: URL) => new URL('/', origin).href;
const orgId = (origin: URL) => `${rootUrl(origin)}#organization`;
const websiteId = (origin: URL) => `${rootUrl(origin)}#website`;
const logoId = (origin: URL) => `${rootUrl(origin)}#logo`;

function organizationNode(origin: URL) {
  const url = rootUrl(origin);
  const sameAs = Object.values(siteConfig.social).filter(Boolean) as string[];
  const hasAddress =
    siteConfig.address.street || siteConfig.address.city || siteConfig.address.postalCode;

  const type: BusinessType =
    siteConfig.businessType === 'LocalBusiness' && !hasAddress
      ? 'Organization'
      : siteConfig.businessType;

  const logoUrl = absoluteUrl(siteConfig.logo || OG_IMAGE.path, origin);

  return {
    '@type': type,
    '@id': orgId(origin),
    name: siteConfig.siteName,
    url,
    description: siteConfig.defaultDescription,
    email: siteConfig.contactEmail,
    ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
    logo: {
      '@type': 'ImageObject',
      '@id': logoId(origin),
      url: logoUrl,
      contentUrl: logoUrl,
    },
    image: { '@id': logoId(origin) },
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(type === 'LocalBusiness' && hasAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: siteConfig.address.street,
            addressLocality: siteConfig.address.city,
            addressRegion: siteConfig.address.region,
            postalCode: siteConfig.address.postalCode,
            addressCountry: siteConfig.address.country,
          },
        }
      : {}),
    ...(type === 'LocalBusiness' && siteConfig.openingHours.length > 0
      ? { openingHours: siteConfig.openingHours }
      : {}),
    ...(type === 'LocalBusiness' && siteConfig.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: siteConfig.geo.lat,
            longitude: siteConfig.geo.lng,
          },
        }
      : {}),
  };
}

function websiteNode(origin: URL, lang: string) {
  return {
    '@type': 'WebSite',
    '@id': websiteId(origin),
    url: rootUrl(origin),
    name: siteConfig.siteName,
    description: siteConfig.defaultDescription,
    publisher: { '@id': orgId(origin) },
    inLanguage: lang,
  };
}

export function buildHomeGraph(origin: URL, opts: { lang?: string } = {}) {
  const lang = opts.lang ?? 'fr-CA';
  const url = rootUrl(origin);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode(origin),
      websiteNode(origin, lang),
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: `${siteConfig.siteName} | ${siteConfig.city}, ${siteConfig.region}`,
        description: siteConfig.defaultDescription,
        isPartOf: { '@id': websiteId(origin) },
        about: { '@id': orgId(origin) },
        inLanguage: lang,
      },
    ],
  };
}

export function buildArticleGraph(article: Article, origin: URL, opts: { path: string; lang?: string }) {
  const lang = opts.lang ?? 'fr-CA';
  const pageUrl = absoluteUrl(opts.path, origin);
  const images = article.image
    ? [absoluteUrl(`${article.image}.webp`, origin)]
    : [absoluteUrl(OG_IMAGE.path, origin)];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode(origin),
      websiteNode(origin, lang),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: article.title,
        description: article.excerpt,
        isPartOf: { '@id': websiteId(origin) },
        inLanguage: lang,
        datePublished: article.dateISO,
        dateModified: article.dateISO,
      },
      {
        '@type': 'BlogPosting',
        '@id': `${pageUrl}#article`,
        headline: article.title,
        description: article.excerpt,
        image: images,
        inLanguage: lang,
        datePublished: article.dateISO,
        dateModified: article.dateISO,
        author: {
          '@type': 'Person',
          name: article.author,
          ...(article.authorRole ? { jobTitle: article.authorRole } : {}),
        },
        publisher: { '@id': orgId(origin) },
        mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
        isPartOf: { '@id': `${pageUrl}#webpage` },
      },
    ],
  };
}

export function buildFaqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}
