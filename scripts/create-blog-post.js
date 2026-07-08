#!/usr/bin/env node
/**
 * Script pour créer un nouvel article de blog FR et EN
 * Usage: node scripts/create-blog-post.js <slug>
 * Exemple: node scripts/create-blog-post.js nouvelle-realisation-inox
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Lire le config SEO si disponible (scripts/seo-config.json)
let primaryKeyword = 'mot-clé principal (placeholder)';
try {
  const configPath = join(projectRoot, 'scripts', 'seo-config.json');
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    primaryKeyword = config.primaryKeyword || primaryKeyword;
  }
} catch {
  // Utiliser les valeurs par défaut
}

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.log('Usage: node scripts/create-blog-post.js <slug>');
  console.log('Exemple: node scripts/create-blog-post.js nouvelle-realisation-inox');
  console.log('Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.');
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];
const keywordSlug = primaryKeyword.toLowerCase().replace(/\s+/g, '-').replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a');

const frFrontmatter = `---
title: ""
datePublication: "${today}"
description: ""
metaTitre: ""
metaDescription: ""
image: "/images/blog/${slug}-${keywordSlug}.avif"
published: false
author: "Nom du site"
---

Contenu de l'article en français...
`;

const enFrontmatter = `---
title: ""
datePublication: "${today}"
description: ""
metaTitre: ""
metaDescription: ""
image: "/images/blog/${slug}-${keywordSlug}.avif"
published: false
author: "Nom du site"
---

Article content in English...
`;

const blogFrDir = join(projectRoot, 'src', 'content', 'blogFr');
const blogEnDir = join(projectRoot, 'src', 'content', 'blogEn');
const blogDir = join(projectRoot, 'public', 'images', 'blog');

mkdirSync(blogFrDir, { recursive: true });
mkdirSync(blogEnDir, { recursive: true });
mkdirSync(blogDir, { recursive: true });

const fileFr = join(blogFrDir, `${slug}.md`);
const fileEn = join(blogEnDir, `${slug}.md`);

if (existsSync(fileFr) || existsSync(fileEn)) {
  console.error(`Erreur: un article avec le slug "${slug}" existe déjà.`);
  process.exit(1);
}

writeFileSync(fileFr, frFrontmatter, 'utf-8');
writeFileSync(fileEn, enFrontmatter, 'utf-8');

console.log(`Articles créés:`);
console.log(`  - src/content/blogFr/${slug}.md`);
console.log(`  - src/content/blogEn/${slug}.md`);
console.log(`\nProchaines étapes:`);
console.log(`  1. Remplir le contenu FR et EN`);
console.log(`  2. Ajouter l'image dans public/images/blog/ (puis lancer: node scripts/optimize-image.js <image> public/images/blog)`);
console.log(`  3. Mettre published: true quand prêt`);
