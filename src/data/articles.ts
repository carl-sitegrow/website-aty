export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  dateISO: string;
  readTime: string;
  author: string;
  authorRole?: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  published: boolean;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: 'guide-echange-cadeaux-bureau',
    title: "Guide complet pour l'échange de cadeaux au bureau",
    excerpt:
      "Réussir son « Secret Santa » n'aura jamais été aussi facile avec notre sélection d'idées originales et abordables.",
    category: 'Noël',
    date: '12 novembre 2024',
    dateISO: '2024-11-12',
    readTime: '6 min',
    author: 'Marie-Ève Tremblay',
    authorRole: 'Rédactrice',
    image: '/images/blog/placeholder-article',
    imageAlt: 'Cadeaux emballés sur un bureau',
    featured: true,
    published: true,
    body: [
      "L'échange de cadeaux au bureau est un classique des fêtes… et une source de stress pour bien du monde. Budget flou, collègues qu'on connaît trop peu, peur du cadeau « bateau » : on a tous déjà vécu ça.",
      "Ce guide rassemble des idées concrètes, des fourchettes de prix réalistes et des trouvailles québécoises pour que votre Secret Santa soit mémorable — sans casser la tirelire.",
      "Commencez par fixer un budget clair avec l'équipe, privilégiez l'utile ou l'expérience, et laissez place à une touche d'insolite. Vous trouverez ci-dessous une sélection testée pour différents profils.",
    ],
  },
  {
    slug: 'acheter-local-cadeau-quebecois',
    title: 'Acheter local : pourquoi choisir un cadeau québécois',
    excerpt:
      "Encourager les artisans d'ici tout en offrant un objet unique : le pari gagnant pour vos prochaines fêtes.",
    category: 'Québec',
    date: '3 novembre 2024',
    dateISO: '2024-11-03',
    readTime: '5 min',
    author: 'Sophie Lavoie',
    image: '/images/blog/placeholder-article',
    imageAlt: 'Atelier d’artisan québécois',
    featured: true,
    published: true,
    body: [
      "Offrir local, c'est soutenir une économie de proximité et ramener du sens dans le geste du cadeau.",
      "Des ateliers de design aux micro-torréfacteurs, le Québec regorge de pièces qui racontent une histoire — exactement ce que cherche Boutique Atypique.",
    ],
  },
  {
    slug: 'cadeau-derniere-minute',
    title: 'Que faire à la dernière minute ?',
    excerpt:
      'Pas de panique ! Voici notre guide de survie pour trouver un cadeau incroyable en moins de 24h.',
    category: 'Astuces',
    date: '28 octobre 2024',
    dateISO: '2024-10-28',
    readTime: '4 min',
    author: 'Marie-Ève Tremblay',
    image: '/images/blog/placeholder-article',
    imageAlt: 'Horloge et paquet cadeau',
    published: true,
    body: [
      'Moins de 24 heures ? Priorisez la livraison express, les cartes-cadeaux d’expérience et les objets en stock local.',
      'Une présentation soignée (note manuscrite, emballage simple) sauve souvent le jour.',
    ],
  },
  {
    slug: '50-idees-celui-qui-a-tout',
    title: '50 idées cadeaux pour celui qui a tout',
    excerpt:
      'Des suggestions originales pour trouver le bon présent même pour les plus difficiles à cadrer.',
    category: 'Guides',
    date: '15 octobre 2024',
    dateISO: '2024-10-15',
    readTime: '8 min',
    author: 'Jean-François Bouchard',
    image: '/images/blog/placeholder-article',
    imageAlt: 'Sélection d’objets uniques',
    published: true,
    body: [
      'Quand la personne « a déjà tout », visez l’expérience, l’édition limitée ou l’objet ultra-spécifique à sa passion.',
    ],
  },
  {
    slug: 'emballage-cadeau-original',
    title: 'Emballage cadeau original : nos meilleures idées',
    excerpt:
      'Ajoutez une touche personnelle avec des idées simples, créatives et faciles à réaliser.',
    category: 'DIY',
    date: '8 octobre 2024',
    dateISO: '2024-10-08',
    readTime: '4 min',
    author: 'Sophie Lavoie',
    image: '/images/blog/placeholder-article',
    imageAlt: 'Emballage cadeau créatif',
    published: true,
    body: [
      'Papier kraft, ficelle, un brin de verdure : l’emballage n’a pas besoin d’être cher pour être mémorable.',
    ],
  },
  {
    slug: 'budget-selon-occasion',
    title: "Combien dépenser selon l'occasion ?",
    excerpt:
      'Un guide pratique pour définir un budget réaliste selon la relation et l’événement.',
    category: 'Budget',
    date: '1 octobre 2024',
    dateISO: '2024-10-01',
    readTime: '5 min',
    author: 'Marie-Ève Tremblay',
    image: '/images/blog/placeholder-article',
    imageAlt: 'Portefeuille et petit cadeau',
    published: true,
    body: [
      'Noël, anniversaire, collègue : les attentes changent. Ce guide propose des fourchettes claires pour éviter le malaise.',
    ],
  },
];

export function getPublishedArticles(): Article[] {
  return articles.filter((a) => a.published);
}

export function getFeaturedArticles(): Article[] {
  return getPublishedArticles().filter((a) => a.featured);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getPublishedArticles().find((a) => a.slug === slug);
}

export function getArticleCategories(): string[] {
  return [...new Set(getPublishedArticles().map((a) => a.category))];
}
