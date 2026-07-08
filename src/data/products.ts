export type ProductStatus = 'draft' | 'validated';

export type ProductTag =
  | 'homme'
  | 'femme'
  | 'ado'
  | 'couple'
  | 'celui-qui-a-tout'
  | 'collegue'
  | 'insolite'
  | 'local'
  | 'tech'
  | 'gastronomie';

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCad: number;
  priceLabel?: string;
  image: string;
  imageAlt: string;
  externalUrl: string;
  tags: ProductTag[];
  audience?: string;
  rating?: number;
  status: ProductStatus;
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: '1',
    slug: 'livre-cocktails-quebecois',
    title: 'Livre de cocktails québécois',
    description: 'Recettes locales et spiritueux d’ici pour animer le Secret Santa.',
    priceCad: 34,
    image: '/images/products/livre-cocktails-quebecois',
    imageAlt: 'Livre de cocktails québécois ouvert sur une table',
    externalUrl: 'https://example.com/livre-cocktails',
    tags: ['homme', 'gastronomie', 'local'],
    audience: 'Amateur de mixologie',
    rating: 5,
    status: 'validated',
    featured: true,
  },
  {
    id: '2',
    slug: 'kit-bbq-personnalise',
    title: 'Kit BBQ personnalisé',
    description: 'Accessoires et épices pour le roi du grill.',
    priceCad: 59,
    image: '/images/products/kit-bbq-personnalise',
    imageAlt: 'Kit BBQ personnalisé',
    externalUrl: 'https://example.com/kit-bbq',
    tags: ['homme', 'gastronomie'],
    audience: 'Le gars du BBQ',
    rating: 4,
    status: 'validated',
    featured: true,
  },
  {
    id: '3',
    slug: 'abonnement-cafe-artisan',
    title: 'Abonnement café artisan',
    description: 'Torréfaction québécoise livrée chaque mois.',
    priceCad: 45,
    priceLabel: '45 $/mois',
    image: '/images/products/abonnement-cafe-artisan',
    imageAlt: 'Sac de café artisan',
    externalUrl: 'https://example.com/cafe',
    tags: ['collegue', 'gastronomie', 'local'],
    audience: 'Amateur de café',
    rating: 5,
    status: 'validated',
    featured: true,
  },
  {
    id: '4',
    slug: 'jeu-societe-strategie',
    title: 'Jeu de société stratégie',
    description: 'Une soirée compétitive sans faire de compromis.',
    priceCad: 48,
    image: '/images/products/jeu-societe-strategie',
    imageAlt: 'Jeu de société sur une table',
    externalUrl: 'https://example.com/jeu',
    tags: ['couple', 'ado'],
    audience: 'Le compétiteur',
    rating: 4,
    status: 'validated',
    featured: true,
  },
  {
    id: '5',
    slug: 'gadget-tech-multifonction',
    title: 'Gadget tech multifonction',
    description: 'Un objet du quotidien qui surprend vraiment.',
    priceCad: 67,
    image: '/images/products/gadget-tech-multifonction',
    imageAlt: 'Gadget tech multifonction',
    externalUrl: 'https://example.com/gadget',
    tags: ['homme', 'tech', 'celui-qui-a-tout'],
    audience: 'Le geek',
    rating: 5,
    status: 'validated',
    featured: true,
  },
  {
    id: '6',
    slug: 'objet-insolite-local',
    title: 'Objet insolite local',
    description: 'Une pièce artisanale qui ne ressemble à rien d’autre.',
    priceCad: 42,
    image: '/images/products/objet-insolite-local',
    imageAlt: 'Objet insolite artisanal',
    externalUrl: 'https://example.com/insolite',
    tags: ['insolite', 'local', 'femme'],
    audience: 'Pour surprendre',
    rating: 5,
    status: 'validated',
    featured: true,
  },
];
