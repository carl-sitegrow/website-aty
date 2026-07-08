# Blogue — Boutique Atypique

## Source de vérité

Les articles affichés sur **`/blog/`** sont définis dans **`src/data/articles.ts`** (slug, titre, extrait, image, corps, métadonnées).

## Ajouter un article

1. Ajouter une entrée dans **`src/data/articles.ts`**
2. Placer l’image sous **`public/images/blog/`** avec un slug SEO, puis optimiser :

```bash
node scripts/optimize-image.js ./ma-photo.jpg public/images/blog mon-slug-article
```

3. Référencer le chemin sans extension dans `articles.ts` : `image: '/images/blog/mon-slug-article'`

## Script Markdown (optionnel)

```bash
node scripts/add-blog-post-from-md.js ./drafts/mon-article.md
```

Le script met à jour `articles.ts` et peut optimiser une image locale fournie dans le dossier du brouillon.

## Nouveau squelette

```bash
node scripts/create-blog-post.js mon-slug-article
```

Crée des fichiers Markdown de brouillon ; branchez ensuite le contenu dans `articles.ts` pour publication.
