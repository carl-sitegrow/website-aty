/**
 * Script pour optimiser une image de slider
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const carouselDir = join(projectRoot, 'public', 'images', 'carousel');

// Créer le dossier si nécessaire
if (!existsSync(carouselDir)) {
  mkdirSync(carouselDir, { recursive: true });
}

async function optimizeSliderImage(inputPath, slideNumber = 1) {
  if (!existsSync(inputPath)) {
    console.error(`❌ Fichier introuvable: ${inputPath}`);
    process.exit(1);
  }

  console.log(`🔄 Optimisation de l'image slide-${slideNumber}...\n`);

  try {
    // Charger l'image
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`📐 Dimensions originales: ${metadata.width}x${metadata.height}`);
    console.log(`📦 Taille originale: ${(metadata.size / 1024).toFixed(2)} KB\n`);

    // Redimensionner pour le slider (largeur max 1920px, hauteur proportionnelle)
    const maxWidth = 1920;
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    // Générer WebP optimisé
    const webpPath = join(carouselDir, `slide-${slideNumber}.webp`);
    await image
      .resize(width, height, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(webpPath);
    const webpStats = await sharp(webpPath).metadata();
    console.log(`✅ WebP créé: ${(webpStats.size / 1024).toFixed(2)} KB (${webpStats.width}x${webpStats.height})`);

    // Générer AVIF optimisé (meilleure compression)
    const avifPath = join(carouselDir, `slide-${slideNumber}.avif`);
    await image
      .resize(width, height, { fit: 'cover', position: 'center' })
      .avif({ quality: 75 })
      .toFile(avifPath);
    const avifStats = await sharp(avifPath).metadata();
    console.log(`✅ AVIF créé: ${(avifStats.size / 1024).toFixed(2)} KB (${avifStats.width}x${avifStats.height})`);

    console.log(`\n✨ Image optimisée avec succès dans: ${carouselDir}`);
    console.log(`\n📋 Fichiers créés:`);
    console.log(`   - slide-${slideNumber}.webp`);
    console.log(`   - slide-${slideNumber}.avif`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error.message);
    process.exit(1);
  }
}

// Récupérer le chemin du fichier d'entrée et le numéro de slide
const inputPath = process.argv[2];
const slideNumber = parseInt(process.argv[3]) || 1;

if (!inputPath) {
  console.log('📝 Script d\'optimisation d\'image slider\n');
  console.log('Usage: node scripts/optimize-slider-image.js [chemin-vers-image] [numéro-slide]');
  console.log('\nExemple: node scripts/optimize-slider-image.js ./image.jpg 1');
  process.exit(0);
}

optimizeSliderImage(inputPath, slideNumber);
