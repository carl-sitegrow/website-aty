import type { ProductTag } from '@/data/products';

export const audienceConfig = {
  homme: { tag: 'homme' as ProductTag, title: 'Cadeaux pour homme' },
  femme: { tag: 'femme' as ProductTag, title: 'Cadeaux pour femme' },
  ado: { tag: 'ado' as ProductTag, title: 'Cadeaux pour ado' },
  couple: { tag: 'couple' as ProductTag, title: 'Cadeaux pour couple' },
  'celui-qui-a-tout': {
    tag: 'celui-qui-a-tout' as ProductTag,
    title: 'Cadeaux pour celui qui a tout',
  },
  collegue: { tag: 'collegue' as ProductTag, title: 'Cadeaux pour collègue' },
  insolites: { tag: 'insolite' as ProductTag, title: 'Objets insolites' },
} as const;

export type AudienceSlug = keyof typeof audienceConfig;

export function getAudienceSlugs(): AudienceSlug[] {
  return Object.keys(audienceConfig) as AudienceSlug[];
}
