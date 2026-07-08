/**
 * Script pour optimiser le logo
 * 
 * Usage: node scripts/optimize-logo.js [chemin-vers-logo-original]
 * 
 * Ce script convertit le logo en formats optimisés (AVIF, WebP, PNG)
 * et les place dans public/images/logo/
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const logoDir = join(projectRoot, 'public', 'images', 'logo');
const logoName = 'logo';

// Créer le dossier si nécessaire
if (!existsSync(logoDir)) {
  mkdirSync(logoDir, { recursive: true });
}

async function optimizeLogo(inputPath) {
  if (!existsSync(inputPath)) {
    console.error(`❌ Fichier introuvable: ${inputPath}`);
    console.log('\n📝 Usage: node scripts/optimize-logo.js [chemin-vers-logo-original.png]');
    process.exit(1);
  }

  console.log('🔄 Optimisation du logo...\n');

  try {
    // Charger l'image
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`📐 Dimensions originales: ${metadata.width}x${metadata.height}`);
    console.log(`📦 Taille originale: ${(metadata.size / 1024).toFixed(2)} KB\n`);

    // Générer WebP optimisé
    const webpPath = join(logoDir, `${logoName}.webp`);
    await image
      .webp({ quality: 85 })
      .toFile(webpPath);
    const webpStats = await sharp(webpPath).metadata();
    console.log(`✅ WebP créé: ${(webpStats.size / 1024).toFixed(2)} KB`);

    // Générer AVIF optimisé (meilleure compression)
    const avifPath = join(logoDir, `${logoName}.avif`);
    await image
      .avif({ quality: 75 })
      .toFile(avifPath);
    const avifStats = await sharp(avifPath).metadata();
    console.log(`✅ AVIF créé: ${(avifStats.size / 1024).toFixed(2)} KB`);

    console.log(`\n✨ Logo optimisé avec succès dans: ${logoDir}`);
    console.log(`\n📋 Fichiers créés:`);
    console.log(`   - ${logoName}.webp (optimisé)`);
    console.log(`   - ${logoName}.avif (ultra-optimisé)`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error.message);
    process.exit(1);
  }
}

// Récupérer le chemin du fichier d'entrée
const inputPath = process.argv[2];

if (!inputPath) {
  console.log('📝 Script d\'optimisation du logo\n');
  console.log('Usage: node scripts/optimize-logo.js [chemin-vers-logo-original.png]');
  console.log('\nExemple: node scripts/optimize-logo.js ./logo-original.png');
  process.exit(0);
}

optimizeLogo(inputPath);
