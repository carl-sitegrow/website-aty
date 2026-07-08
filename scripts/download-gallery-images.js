/**
 * Script pour télécharger et optimiser les images de la galerie
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import https from 'https';
import { createWriteStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const galerieDir = join(projectRoot, 'public', 'images', 'galerie');

// Créer le dossier si nécessaire
if (!existsSync(galerieDir)) {
  mkdirSync(galerieDir, { recursive: true });
}

function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(outputPath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        file.close();
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      reject(err);
    });
  });
}

async function optimizeGalleryImage(inputPath, outputName) {
  if (!existsSync(inputPath)) {
    console.error(`❌ Fichier introuvable: ${inputPath}`);
    return;
  }

  console.log(`🔄 Optimisation de l'image ${outputName}...\n`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`📐 Dimensions originales: ${metadata.width}x${metadata.height}`);

    // Redimensionner pour la galerie (largeur max 1920px)
    const maxWidth = 1920;
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    // Générer WebP optimisé
    const webpPath = join(galerieDir, `${outputName}.webp`);
    await image
      .resize(width, height, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(webpPath);
    const webpStats = await sharp(webpPath).metadata();
    console.log(`✅ WebP créé: ${(webpStats.size / 1024).toFixed(2)} KB (${webpStats.width}x${webpStats.height})`);

    // Générer AVIF optimisé
    const avifPath = join(galerieDir, `${outputName}.avif`);
    await image
      .resize(width, height, { fit: 'cover', position: 'center' })
      .avif({ quality: 75 })
      .toFile(avifPath);
    const avifStats = await sharp(avifPath).metadata();
    console.log(`✅ AVIF créé: ${(avifStats.size / 1024).toFixed(2)} KB (${avifStats.width}x${avifStats.height})\n`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error.message);
  }
}

async function processImages() {
  // TODO: Ajouter les URLs des images de votre galerie
  const images = [
    // { url: 'https://…', name: 'galerie-1' },
  ];

  console.log('📥 Téléchargement et optimisation des images de la galerie...\n');

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const tempPath = join(galerieDir, `${img.name}-temp.jpg`);
    
    try {
      console.log(`📥 Téléchargement ${i + 1}/${images.length}: ${img.name}...`);
      await downloadImage(img.url, tempPath);
      await optimizeGalleryImage(tempPath, img.name);
      // Supprimer le fichier temporaire
      const { unlinkSync } = await import('fs');
      unlinkSync(tempPath);
    } catch (error) {
      console.error(`❌ Erreur pour ${img.name}:`, error.message);
    }
  }

  console.log('\n✨ Toutes les images ont été traitées!');
}

processImages();
