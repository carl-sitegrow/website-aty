/**
 * Configuration éditoriale — Boutique Atypique
 */
export type BusinessType = 'Organization' | 'LocalBusiness' | 'WebSite';

export const siteConfig = {
  siteName: 'Boutique Atypique',
  siteTagline: 'Idées cadeaux originales et objets insolites au Québec',
  city: 'Québec',
  region: 'Québec',
  domain: 'boutiqueatypique.com',
  url: 'https://boutiqueatypique.com',
  locale: 'fr-CA',
  defaultDescription:
    'Découvrez des idées cadeaux originales et des objets insolites sélectionnés pour le Québec — guides, budgets et trouvailles locales.',
  contactEmail: 'contact@boutiqueatypique.com',
  phone: '',
  logo: '',
  twitterHandle: '',
  allowAiCrawlers: true,
  businessType: 'Organization' as BusinessType,
  address: {
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
  },
  openingHours: [] as string[],
  geo: undefined as { lat: number; lng: number } | undefined,
  social: {
    instagram: '',
    facebook: '',
    x: '',
  },
  nav: [
    { label: 'Cadeaux', href: '/cadeaux/' },
    { label: 'Insolites', href: '/cadeaux/insolites/' },
    { label: 'Occasions', href: '/cadeaux/#occasions' },
    { label: 'Budget', href: '/cadeaux/#budget' },
    { label: 'Blogue', href: '/blog/' },
  ] as const,
  footerNav: [
    { label: 'Toutes les idées', href: '/cadeaux/' },
    { label: 'Objets insolites', href: '/cadeaux/insolites/' },
    { label: 'Cadeaux par personne', href: '/cadeaux/' },
    { label: 'Cadeaux par budget', href: '/cadeaux/#budget' },
    { label: 'Le Blogue', href: '/blog/' },
  ] as const,
  footerLegal: [
    { label: 'À propos', href: '/a-propos/' },
    { label: 'Contact', href: '/contact/' },
    { label: "Divulgation d'affiliation", href: '/divulgation-affiliation/' },
    { label: 'Politique de confidentialité', href: '/politique-de-confidentialite/' },
  ] as const,
  ctaPrimary: 'Trouver un cadeau',
  ctaPrimaryHref: '/cadeaux/',
} as const;
