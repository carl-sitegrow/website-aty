#!/usr/bin/env node
/**
 * Configuration rapide du projet sur une autre machine (après clone).
 * - npm install
 * - Crée .env à partir de .env.example si absent
 * - Vérifie que scripts/seo-config.json existe
 *
 * Usage: npm run setup
 */

import { existsSync, writeFileSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

async function main() {
  console.log('\n🔧 Setup projet (autre machine)\n');

  // 1. npm install
  console.log('1. Installation des dépendances...');
  execSync('npm install', { cwd: projectRoot, stdio: 'inherit' });
  console.log('   OK.\n');

  // 2. .env
  const envPath = join(projectRoot, '.env');
  const examplePath = join(projectRoot, '.env.example');
  if (!existsSync(envPath)) {
    if (existsSync(examplePath)) {
      copyFileSync(examplePath, envPath);
      console.log('2. Fichier .env créé à partir de .env.example.');
    } else {
      writeFileSync(envPath, '# Ajoutez SITE_URL, CONTACT_EMAIL, etc.\n', 'utf-8');
      console.log('2. Fichier .env créé (vide).');
    }
  } else {
    console.log('2. .env existe déjà (rien à faire).');
  }
  console.log('');

  // 3. seo-config.json
  const seoPath = join(projectRoot, 'scripts', 'seo-config.json');
  if (!existsSync(seoPath)) {
    console.log('3. scripts/seo-config.json absent.');
    console.log('   Créez-le pour le nommage SEO des images (ex. primaryKeyword).');
    console.log('   Exemple: { "primaryKeyword": "votre mot-clé", "secondaryKeywords": [] }');
  } else {
    console.log('3. scripts/seo-config.json présent.');
  }
  console.log('');

  console.log('✅ Setup terminé.');
  console.log('\nPour lancer le site : npm run dev\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
