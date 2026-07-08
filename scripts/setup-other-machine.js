#!/usr/bin/env node
/**
 * Configuration rapide du projet sur une autre machine (après clone).
 * - npm install
 * - Crée .env à partir de .env.example si absent, et demande la clé Unsplash
 * - Vérifie que scripts/seo-config.json existe
 *
 * Usage: npm run setup
 */

import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const rl = createInterface({ input: process.stdin, output: process.stdout });
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

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
    const key = await ask('   Clé Unsplash (UNSPLASH_ACCESS_KEY) — optionnel, Entrée pour passer : ');
    if (key.trim()) {
      const envContent = readFileSync(envPath, 'utf-8');
      const withKey = envContent.includes('UNSPLASH_ACCESS_KEY=')
        ? envContent.replace(/UNSPLASH_ACCESS_KEY=.*/, `UNSPLASH_ACCESS_KEY=${key.trim()}`)
        : envContent.trimEnd() + '\nUNSPLASH_ACCESS_KEY=' + key.trim() + '\n';
      writeFileSync(envPath, withKey, 'utf-8');
      console.log('   UNSPLASH_ACCESS_KEY enregistrée.');
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
  console.log('\nPour publier un article :');
  console.log('  npm run add-post -- ./drafts/mon-article.md');
  console.log('  (commit + push déclenchent le build Vercel)\n');
  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
