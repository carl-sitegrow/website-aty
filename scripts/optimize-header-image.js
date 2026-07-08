/**
 * Script pour optimiser une image de header de page
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const imagesDir = join(projectRoot, 'public', 'images');

// Créer le dossier si nécessaire
if (!existsSync(imagesDir)) {
  mkdirSync(imagesDir, { recursive: true });
}

async function optimizeHeaderImage(inputPath, outputName) {
  if (!existsSync(inputPath)) {
    console.error(`❌ Fichier introuvable: ${inputPath}`);
    process.exit(1);
  }

  console.log(`🔄 Optimisation de l'image header ${outputName}...\n`);

  try {
    // Charger l'image
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`📐 Dimensions originales: ${metadata.width}x${metadata.height}`);
    console.log(`📦 Taille originale: ${(metadata.size / 1024).toFixed(2)} KB\n`);

    // Redimensionner pour le header (largeur max 1920px, hauteur proportionnelle)
    const maxWidth = 1920;
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    // Générer WebP optimisé
    const webpPath = join(imagesDir, `${outputName}.webp`);
    await image
      .resize(width, height, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(webpPath);
    const webpStats = await sharp(webpPath).metadata();
    console.log(`✅ WebP créé: ${(webpStats.size / 1024).toFixed(2)} KB (${webpStats.width}x${webpStats.height})`);

    // Générer AVIF optimisé (meilleure compression)
    const avifPath = join(imagesDir, `${outputName}.avif`);
    await image
      .resize(width, height, { fit: 'cover', position: 'center' })
      .avif({ quality: 75 })
      .toFile(avifPath);
    const avifStats = await sharp(avifPath).metadata();
    console.log(`✅ AVIF créé: ${(avifStats.size / 1024).toFixed(2)} KB (${avifStats.width}x${avifStats.height})`);

    console.log(`\n✨ Image optimisée avec succès dans: ${imagesDir}`);
    console.log(`\n📋 Fichiers créés:`);
    console.log(`   - ${outputName}.webp`);
    console.log(`   - ${outputName}.avif`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error.message);
    process.exit(1);
  }
}

// Récupérer le chemin du fichier d'entrée et le nom de sortie
const inputPath = process.argv[2];
const outputName = process.argv[3] || 'header';

if (!inputPath) {
  console.log('📝 Script d\'optimisation d\'image header\n');
  console.log('Usage: node scripts/optimize-header-image.js [chemin-vers-image] [nom-sortie]');
  console.log('\nExemple: node scripts/optimize-header-image.js ./image.jpg contact');
  process.exit(0);
}

optimizeHeaderImage(inputPath, outputName);
