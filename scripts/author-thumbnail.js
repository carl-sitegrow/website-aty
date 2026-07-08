/**
 * Convertit la photo auteur en AVIF et enlève le fond clair (transparent).
 * Usage: node scripts/author-thumbnail.js [chemin-image.png]
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const outputPath = join(projectRoot, 'public', 'images', 'author.avif');

// Seuil : pixels plus clairs que ça deviennent transparents (0–255)
const BG_THRESHOLD = 235;

async function removeBackgroundAndSaveAvif(inputPath) {
  if (!existsSync(inputPath)) {
    console.error('Fichier introuvable:', inputPath);
    process.exit(1);
  }

  const image = sharp(inputPath);
  const { width, height, channels } = await image.metadata();
  const raw = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const data = raw.data;
  const w = raw.info.width;
  const h = raw.info.height;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= BG_THRESHOLD && g >= BG_THRESHOLD && b >= BG_THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  const outDir = dirname(outputPath);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .avif({ quality: 80 })
    .toFile(outputPath);

  console.log('OK:', outputPath);
}

const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/author-thumbnail.js <chemin-image.png>');
  process.exit(1);
}
removeBackgroundAndSaveAvif(input).catch((err) => {
  console.error(err);
  process.exit(1);
});
