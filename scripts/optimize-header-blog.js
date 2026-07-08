/**
 * Génère blog-hero.avif et blog-hero.webp à partir d’une image source (optionnel si l’OG du blogue pointe ailleurs).
 * Sortie : public/images/ (plus de dossier headers).
 * Usage: node scripts/optimize-header-blog.js <chemin-image-source.jpg>
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const imagesDir = join(projectRoot, 'public', 'images');
const name = 'blog-hero';
const maxWidth = 2560;
const avifQuality = 92;
const webpQuality = 95;

if (!existsSync(imagesDir)) {
  mkdirSync(imagesDir, { recursive: true });
}

const inputPath = process.argv[2];
if (!inputPath || !existsSync(inputPath)) {
  console.error('Usage: node scripts/optimize-header-blog.js <chemin-image.jpg>');
  process.exit(1);
}

async function run() {
  const meta = await sharp(inputPath).metadata();
  const outW = meta.width > maxWidth ? maxWidth : meta.width;
  console.log(`Source: ${meta.width}×${meta.height} → sortie ${outW}px de large (sans agrandissement)`);

  const pipeline = sharp(inputPath)
    .rotate()
    .resize(maxWidth, null, { withoutEnlargement: true, kernel: sharp.kernel.lanczos3 });

  await Promise.all([
    pipeline.clone().avif({ quality: avifQuality, effort: 4 }).toFile(join(imagesDir, `${name}.avif`)),
    pipeline.clone().webp({ quality: webpQuality, effort: 4 }).toFile(join(imagesDir, `${name}.webp`)),
  ]);

  console.log(`✓ ${name}.avif et ${name}.webp créés dans public/images/`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
