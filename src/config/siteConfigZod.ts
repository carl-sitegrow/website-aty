import { z } from 'zod';

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const siteConfigSchema = z.object({
  siteName: z.string().min(1),
  siteTagline: z.string().min(1),
  city: z.string().min(1),
  region: z.string().min(1),
  locale: z.string().min(1),
  defaultDescription: z.string().min(1),
  social: z.object({
    instagram: z.string(),
    facebook: z.string(),
    x: z.string(),
  }),
  nav: z.array(linkSchema).min(1),
  footerNav: z.array(linkSchema).min(1),
  footerLegal: z.array(linkSchema).min(1),
  ctaPrimary: z.string().min(1),
  ctaPrimaryHref: z.string().min(1),
});
