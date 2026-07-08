import { z } from 'zod';

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  region: z.string(),
  postalCode: z.string(),
  country: z.string(),
});

export const siteConfigSchema = z.object({
  siteName: z.string().min(1),
  siteTagline: z.string().min(1),
  city: z.string().min(1),
  region: z.string().min(1),
  domain: z.string().min(1),
  url: z
    .string()
    .url()
    .refine((u) => !u.endsWith('/'), 'url ne doit pas se terminer par un slash'),
  locale: z.string().min(1),
  defaultDescription: z
    .string()
    .min(50, 'defaultDescription : vise au moins 50 caractères')
    .max(160, 'defaultDescription : ≤ 160 caractères'),
  contactEmail: z.string().email(),
  phone: z.string(),
  logo: z.string(),
  twitterHandle: z
    .string()
    .refine((h) => h === '' || h.startsWith('@'), 'twitterHandle doit commencer par @'),
  allowAiCrawlers: z.boolean(),
  businessType: z.enum(['Organization', 'LocalBusiness', 'WebSite']),
  address: addressSchema,
  openingHours: z.array(z.string()),
  geo: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
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
