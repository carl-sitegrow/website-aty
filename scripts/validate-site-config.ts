/**
 * Exécuté avant `astro build` — valide src/config/site.ts (Zod).
 */
import { siteConfig } from '../src/config/site.ts';
import { siteConfigSchema } from '../src/config/siteConfigZod.ts';

siteConfigSchema.parse(siteConfig);
console.log('✓ siteConfig OK (Zod)');
