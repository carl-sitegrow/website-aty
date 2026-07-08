# Boutique Atypique

Site statique Astro pour [boutiqueatypique.com](https://boutiqueatypique.com) — idées cadeaux originales et objets insolites au Québec.

## Stack

- Astro 4 (output `static`) + Tailwind
- Vercel
- Données produits : `src/data/products.ts` (adapter prêt pour Neon)
- Schéma Neon : `db/migrations/001_init.sql`

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Env

Voir `.env.example`. `CONTACT_EMAIL` et Formspree à brancher plus tard.
