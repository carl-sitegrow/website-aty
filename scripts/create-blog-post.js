#!/usr/bin/env node
/**
 * Crée un brouillon d'article pour Boutique Atypique.
 * Usage: node scripts/create-blog-post.js <slug>
 * Exemple: node scripts/create-blog-post.js guide-cadeaux-noel-bureau
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

let primaryKeyword = 'cadeaux originaux Québec';
try {
  const configPath = join(projectRoot, 'scripts', 'seo-config.json');
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    primaryKeyword = config.primaryKeyword || primaryKeyword;
  }
} catch {
  // default keyword
}

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.log('Usage: node scripts/create-blog-post.js <slug>');
  console.log('Exemple: node scripts/create-blog-post.js guide-cadeaux-noel-bureau');
  console.log('Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.');
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];
const draftsDir = join(projectRoot, 'drafts');
const imagesDir = join(projectRoot, 'public', 'images', 'blog');
const outPath = join(draftsDir, `${slug}.md`);

mkdirSync(draftsDir, { recursive: true });
mkdirSync(imagesDir, { recursive: true });

if (existsSync(outPath)) {
  console.error(`Erreur: un brouillon avec le slug "${slug}" existe déjà.`);
  process.exit(1);
}

const draft = `---
title: ""
date: "${today}"
category: ""
excerpt: ""
image: "/images/blog/${slug}"
published: false
author: "Boutique Atypique"
---

Contenu de l'article...
`;

writeFileSync(outPath, draft, 'utf-8');

console.log(`Brouillon créé: drafts/${slug}.md`);
console.log('\nProchaines étapes:');
console.log('  1. Rédiger le contenu et compléter le frontmatter');
console.log(`  2. Ajouter l'image: node scripts/optimize-image.js <image> public/images/blog ${slug}`);
console.log('  3. Copier l\'entrée dans src/data/articles.ts pour publication');
