export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type SitemapLink = {
  label: string;
  href: string;
  section: 'main' | 'legal';
};

const home: BreadcrumbItem = { label: 'Accueil', href: '/' };

export const breadcrumbTrails = {
  blog: (): BreadcrumbItem[] => [home, { label: 'Blogue' }],
  article: (title: string): BreadcrumbItem[] => [
    home,
    { label: 'Blogue', href: '/blog/' },
    { label: title },
  ],
  cadeaux: (label = 'Cadeaux'): BreadcrumbItem[] => [home, { label }],
  about: (): BreadcrumbItem[] => [home, { label: 'À propos' }],
  contact: (): BreadcrumbItem[] => [home, { label: 'Contact' }],
  privacy: (): BreadcrumbItem[] => [home, { label: 'Politique de confidentialité' }],
  affiliation: (): BreadcrumbItem[] => [home, { label: "Divulgation d'affiliation" }],
  notFound: (): BreadcrumbItem[] => [home, { label: 'Page introuvable' }],
  plan: (): BreadcrumbItem[] => [home, { label: 'Plan du site' }],
};

export const frPagesList: SitemapLink[] = [
  { label: 'Accueil', href: '/', section: 'main' },
  { label: 'Idées cadeaux', href: '/cadeaux/', section: 'main' },
  { label: 'Objets insolites', href: '/cadeaux/insolites/', section: 'main' },
  { label: 'Cadeaux pour homme', href: '/cadeaux/homme/', section: 'main' },
  { label: 'Cadeaux pour femme', href: '/cadeaux/femme/', section: 'main' },
  { label: 'Cadeaux pour ado', href: '/cadeaux/ado/', section: 'main' },
  { label: 'Cadeaux pour couple', href: '/cadeaux/couple/', section: 'main' },
  { label: 'Cadeaux pour celui qui a tout', href: '/cadeaux/celui-qui-a-tout/', section: 'main' },
  { label: 'Cadeaux pour collègue', href: '/cadeaux/collegue/', section: 'main' },
  { label: 'Blogue', href: '/blog/', section: 'main' },
  { label: 'À propos', href: '/a-propos/', section: 'main' },
  { label: 'Contact', href: '/contact/', section: 'main' },
  { label: 'Politique de confidentialité', href: '/politique-de-confidentialite/', section: 'legal' },
  { label: "Divulgation d'affiliation", href: '/divulgation-affiliation/', section: 'legal' },
];
