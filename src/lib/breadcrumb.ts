export type BreadcrumbItem = {
  label: string;
  href?: string;
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
};
