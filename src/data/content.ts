export const homeContent = {
  hero: {
    title: 'Les meilleures idées cadeaux originales au Québec',
    subtitle:
      'Une sélection exclusive d’objets insolites et de trouvailles locales pour surprendre vraiment.',
    primaryCta: 'Explorer la boutique',
    primaryHref: '/cadeaux/',
    secondaryCta: 'Découvrir le blogue',
    secondaryHref: '/blog/',
    image: '/images/home/hero-accueil-cadeaux-quebec',
    imageAlt:
      'Atelier artisanal québécois : bols et vases en bois au premier plan, vue sur un paysage enneigé',
  },
  audiences: [
    { label: 'Homme', href: '/cadeaux/homme/', icon: 'user' },
    { label: 'Femme', href: '/cadeaux/femme/', icon: 'user' },
    { label: 'Ado', href: '/cadeaux/ado/', icon: 'spark' },
    { label: 'Couple', href: '/cadeaux/couple/', icon: 'users' },
    { label: 'Celui qui a tout', href: '/cadeaux/celui-qui-a-tout/', icon: 'package' },
    { label: 'Collègue', href: '/cadeaux/collegue/', icon: 'coffee' },
  ],
  styles: [
    {
      label: 'Objets insolites',
      tag: 'UNIQUE',
      href: '/cadeaux/insolites/',
      image: '/images/home/style-objets-insolites',
      imageAlt: 'Vase céramique coloré exposé dans une galerie',
    },
    {
      label: 'Gadgets utiles',
      tag: 'PRATIQUE',
      href: '/cadeaux/',
      image: '/images/home/style-gadgets-utiles',
      imageAlt: 'Ustensile de cuisine en bois sur un comptoir',
    },
    {
      label: 'Déco insolite',
      tag: 'MAISON',
      href: '/cadeaux/',
      image: '/images/home/style-deco-insolite',
      imageAlt: 'Salon chaleureux avec lampe sculpturale en bois',
    },
    {
      label: 'Cadeaux drôles',
      tag: 'HUMOUR',
      href: '/cadeaux/insolites/',
      image: '/images/home/style-cadeaux-droles',
      imageAlt: 'Personnages illustrés amusants pour cadeaux humoristiques',
    },
    {
      label: 'Cadeaux québécois',
      tag: 'LOCAL',
      href: '/cadeaux/',
      image: '/images/home/style-cadeaux-quebecois',
      imageAlt: 'Artisanat québécois : cuillères en bois et figurines sculptées',
    },
  ],
  occasions: [
    { label: 'Noël', href: '/cadeaux/#occasions' },
    { label: 'Anniversaire', href: '/cadeaux/#occasions' },
    { label: 'Saint-Valentin', href: '/cadeaux/#occasions' },
    { label: 'Fête des mères', href: '/cadeaux/#occasions' },
    { label: 'Fête des pères', href: '/cadeaux/#occasions' },
  ],
  budgets: [
    {
      label: 'Moins de 25 $',
      description: 'Petites attentions et découvertes surprenantes pour les petits budgets.',
      href: '/cadeaux/#budget',
      max: 25,
    },
    {
      label: 'Moins de 50 $',
      description: 'Le compromis idéal pour un cadeau de qualité qui marque les esprits.',
      href: '/cadeaux/#budget',
      max: 50,
    },
    {
      label: 'Moins de 100 $',
      description: "Des pièces d'exception et des objets de créateurs québécois.",
      href: '/cadeaux/#budget',
      max: 100,
    },
  ],
  trust: [
    'Sélection indépendante',
    'Liens affiliés divulgués',
    'Fait avec ♥ au Québec',
  ],
  blogIntro:
    'Découvrez nos articles, conseils et idées cadeaux pour trouver le bon présent au bon moment — sans stress et avec du style.',
} as const;

export const aboutContent = {
  title: 'À propos',
  historyTitle: 'Notre histoire',
  history: [
    "L'idée de Boutique Atypique est née d'une frustration bien connue : trouver un cadeau original et significatif, idéalement local, sans passer des heures à chercher.",
    "Notre équipe de passionnés du Québec a créé ce guide pour mettre en valeur l'incroyable richesse artisanale et commerciale de notre province.",
    'Nous sélectionnons avec soin les objets, les expériences et les boutiques qui méritent d’être découverts, pour que vous puissiez offrir un cadeau qui raconte une histoire.',
  ],
  valuesTitle: 'Nos valeurs',
  values: [
    {
      title: 'Produits locaux',
      text: 'Nous valorisons les créateurs et commerçants québécois.',
    },
    {
      title: 'Cadeaux originaux',
      text: 'Des idées uniques que vous ne trouverez pas partout.',
    },
    {
      title: 'Communauté',
      text: 'Nous construisons ensemble une culture du cadeau réfléchi.',
    },
  ],
  teamTitle: 'Une équipe passionnée du Québec',
  team: [
    {
      name: 'Marie-Claude Tremblay',
      role: 'Fondatrice & Rédactrice en chef',
      bio: 'Elle sélectionne les meilleures trouvailles québécoises et écrit les guides qui vous aident à trouver le bon cadeau au bon moment.',
    },
    {
      name: 'Jean-François Bouchard',
      role: 'Directeur des partenariats',
      bio: 'Il accompagne les boutiques et artisans pour mettre en valeur leurs créations et les partager avec notre communauté.',
    },
    {
      name: 'Sophie Lavoie',
      role: 'Responsable contenu & SEO',
      bio: 'Elle veille à ce que chaque article soit utile, clair et facile à trouver.',
    },
  ],
  partnersTitle: 'Partenaires & Boutiques',
  partnersText:
    'Vous êtes une boutique ou un artisan québécois ? Faites découvrir vos produits à notre communauté.',
  partnersCta: 'Soumettre un produit',
  partnersHref: '/contact/',
} as const;

export const contactContent = {
  title: 'Contact',
  formTitle: 'Envoyez-nous un message',
  formSubtitle: 'Nous répondons généralement sous 48 heures ouvrables.',
  fields: {
    name: 'Nom complet',
    namePlaceholder: 'Votre nom',
    email: 'Adresse courriel',
    emailPlaceholder: 'vous@exemple.ca',
    subject: 'Sujet',
    subjectPlaceholder: 'Sélectionner un sujet',
    message: 'Votre message',
    messagePlaceholder: 'Décrivez votre demande...',
    submit: 'Envoyer le message',
  },
  subjects: [
    { value: 'general', label: 'Question générale' },
    { value: 'produit', label: 'Soumettre un produit' },
    { value: 'erreur', label: 'Signaler une erreur' },
    { value: 'partenariat', label: 'Partenariat / publicité' },
  ],
  info: [
    {
      title: 'Par courriel',
      primary: 'À venir',
      secondary: 'Nous répondons sous 48h',
    },
    {
      title: 'Notre région',
      primary: 'Québec, Canada',
      secondary: 'Nous couvrons toute la province',
    },
    {
      title: 'Heures de disponibilité',
      primary: 'Lundi - Vendredi: 9h à 17h',
      secondary: 'Samedi - Dimanche: Fermé',
    },
  ],
  faqTitle: 'Questions fréquentes',
  faq: [
    {
      q: 'Comment soumettre une boutique ou un produit?',
      a: 'Utilisez le formulaire ci-dessus (sujet Soumettre un produit) ou écrivez-nous dès que notre adresse courriel sera en ligne.',
    },
    {
      q: 'Est-ce que le référencement est gratuit?',
      a: 'Oui, le référencement de base est entièrement gratuit pour les artisans et boutiques québécoises.',
    },
    {
      q: 'Comment corriger une information erronée?',
      a: 'Sélectionnez Signaler une erreur dans le formulaire et décrivez la correction nécessaire.',
    },
    {
      q: 'Offrez-vous des partenariats publicitaires?',
      a: 'Oui, nous offrons diverses opportunités de visibilité. Contactez-nous pour en savoir plus.',
    },
  ],
  bannerTitle: 'Vous êtes une boutique québécoise?',
  bannerText: 'Rejoignez notre communauté et faites découvrir vos produits uniques.',
  bannerCta: 'En savoir plus',
  bannerHref: '/a-propos/',
} as const;

export const privacyContent = {
  title: 'Politique de confidentialité',
  updated: '8 juillet 2026',
  sections: [
    {
      heading: 'Collecte des renseignements',
      body: 'Boutique Atypique collecte uniquement les informations que vous nous transmettez via le formulaire de contact (nom, courriel, message).',
    },
    {
      heading: 'Utilisation',
      body: 'Ces renseignements servent uniquement à répondre à vos demandes. Nous ne vendons pas vos données.',
    },
    {
      heading: 'Liens affiliés',
      body: 'Certaines pages contiennent des liens affiliés. Voir notre page Divulgation d’affiliation pour plus de détails.',
    },
  ],
} as const;

export const affiliationContent = {
  title: "Divulgation d'affiliation",
  body: [
    'Boutique Atypique peut recevoir une commission lorsque vous achetez via certains liens externes.',
    'Cela n’affecte pas le prix que vous payez et n’influence pas notre sélection éditoriale : nous recommandons seulement des produits que nous jugeons pertinents.',
    'Merci de soutenir le travail de découverte de cadeaux originaux au Québec.',
  ],
} as const;
