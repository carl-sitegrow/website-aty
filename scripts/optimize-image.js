/**
 * Script générique pour optimiser une image en WebP et AVIF
 * 
 * Usage: node scripts/optimize-image.js [chemin-vers-image] [dossier-sortie] [nom-sortie]
 * 
 * Exemples:
 *   node scripts/optimize-image.js ./image.jpg public/images/contact
 *   node scripts/optimize-image.js ./image.jpg public/images/blog mon-article-slug
 *
 * Si [nom-sortie] est fourni, les fichiers seront nommés nom-sortie.avif et nom-sortie.webp
 * (utile pour le SEO : slug + mot-clé principal du contenu)
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join, basename, extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function optimizeImage(inputPath, outputDir = null, outputName = null) {
  if (!existsSync(inputPath)) {
    console.error(`❌ Fichier introuvable: ${inputPath}`);
    process.exit(1);
  }

  // Déterminer le dossier de sortie
  let finalOutputDir;
  if (outputDir) {
    finalOutputDir = outputDir.startsWith('/') ? outputDir : join(projectRoot, outputDir);
  } else {
    // Utiliser le même dossier que l'image source
    finalOutputDir = dirname(inputPath);
  }

  // Créer le dossier si nécessaire
  if (!existsSync(finalOutputDir)) {
    mkdirSync(finalOutputDir, { recursive: true });
  }

  const baseName = outputName || basename(inputPath, extname(inputPath));
  const ext = extname(inputPath).toLowerCase();

  // Vérifier si les versions optimisées existent déjà
  const webpPath = join(finalOutputDir, `${baseName}.webp`);
  const avifPath = join(finalOutputDir, `${baseName}.avif`);

  if (existsSync(webpPath) && existsSync(avifPath)) {
    console.log(`ℹ️  Les versions optimisées existent déjà pour ${baseName}`);
    return;
  }

  console.log(`🔄 Optimisation de ${basename(inputPath)}...\n`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`📐 Dimensions: ${metadata.width}x${metadata.height}`);
    console.log(`📦 Taille originale: ${(metadata.size / 1024).toFixed(2)} KB\n`);

    // Générer WebP optimisé
    if (!existsSync(webpPath)) {
      await image
        .clone()
        .webp({ quality: 85 })
        .toFile(webpPath);
      const webpStats = await sharp(webpPath).metadata();
      console.log(`✅ WebP créé: ${(webpStats.size / 1024).toFixed(2)} KB`);
    } else {
      console.log(`ℹ️  WebP existe déjà`);
    }

    // Générer AVIF optimisé
    if (!existsSync(avifPath)) {
      await image
        .clone()
        .avif({ quality: 75 })
        .toFile(avifPath);
      const avifStats = await sharp(avifPath).metadata();
      console.log(`✅ AVIF créé: ${(avifStats.size / 1024).toFixed(2)} KB`);
    } else {
      console.log(`ℹ️  AVIF existe déjà`);
    }

    console.log(`\n✨ Image optimisée avec succès dans: ${finalOutputDir}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error.message);
    process.exit(1);
  }
}

// Récupérer les arguments
const inputPath = process.argv[2];
const outputDir = process.argv[3];
const outputName = process.argv[4];

if (!inputPath) {
  console.log('📝 Script d\'optimisation d\'image générique\n');
  console.log('Usage: node scripts/optimize-image.js [chemin-vers-image] [dossier-sortie-optionnel]');
  console.log('\nExemples:');
  console.log('  node scripts/optimize-image.js ./image.jpg');
  console.log('  node scripts/optimize-image.js ./image.jpg public/images/contact');
  console.log('  node scripts/optimize-image.js ./image.jpg public/images/blog mon-slug-motcle');
  process.exit(0);
}

const fullInputPath = inputPath.startsWith('/') ? inputPath : join(process.cwd(), inputPath);
optimizeImage(fullInputPath, outputDir, outputName);
