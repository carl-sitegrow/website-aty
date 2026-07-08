# Blog / nouvelles

## Contenu actuel

Les articles affichés sur **`/blogue/`** et **`/en/blog/`** sont définis dans **`src/data/blog.ts`** (titres, extraits, blocs de contenu, paires FR ↔ EN par `slug` / `enSlug`).

## Ajouter un article (données structurées)

1. Ouvrir **`src/data/blog.ts`**
2. Ajouter une entrée à **`blogPostsFr`** et **`blogPostsEn`** (ou suivre le motif des articles existants)
3. Ajouter les images sous **`public/images/`** si besoin, puis déployer

## Fichiers Markdown (optionnel)

Le script **`npm run new-post -- <slug>`** crée des squelettes dans :

- `src/content/blogFr/<slug>.md`
- `src/content/blogEn/<slug>.md`

Si vous basculiez le blog entièrement sur le Markdown, il faudrait brancher les pages Astro sur ces fichiers ; aujourd’hui la source de vérité pour les articles en ligne est **`blog.ts`**.

## API de publication (`/api/publish-blog`)

Une route API permet de pousser du contenu via GitHub (voir le fichier **`src/pages/api/publish-blog.ts`** et les variables **`GITHUB_*`** dans `.env.example`). Réservé aux usages automatisés avec secret et dépôt configurés.
