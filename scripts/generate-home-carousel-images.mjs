/**
 * PNG → webp + avif dans public/images pour le carrousel d’accueil.
 * Configurer CAROUSEL_ASSETS et la liste PAIRS (fichiers sources → base de nom public).
 * Exemple : CAROUSEL_ASSETS=./mes-photos node scripts/generate-home-carousel-images.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ASSETS = process.env.CAROUSEL_ASSETS || path.join(ROOT, 'carousel-source');
const DEST = path.join(ROOT, 'public/images');

/** [sourceFilename, publicBaseName sans extension] — ordre = ordre du carrousel */
const PAIRS = [
  // Exemple après ajout de vos PNG dans CAROUSEL_ASSETS :
  // ['photo-projet-01.png', 'carousel-projet-01'],
];

async function main() {
  if (PAIRS.length === 0) {
    console.log('Aucune paire configurée. Éditez PAIRS dans scripts/generate-home-carousel-images.mjs');
    console.log(`Dossier source par défaut : ${ASSETS}`);
    process.exit(0);
  }

  if (!fs.existsSync(ASSETS)) {
    console.error('Assets folder not found:', ASSETS);
    process.exit(1);
  }
  fs.mkdirSync(DEST, { recursive: true });

  const metaOut = [];

  for (const [filename, base] of PAIRS) {
    const input = path.join(ASSETS, filename);
    if (!fs.existsSync(input)) {
      console.error('Missing:', input);
      process.exit(1);
    }
    const buf = fs.readFileSync(input);
    const meta = await sharp(buf).metadata();
    const w = meta.width || 1000;
    const h = meta.height || 1000;

    await sharp(buf).webp({ quality: 85 }).toFile(path.join(DEST, `${base}.webp`));
    await sharp(buf).avif({ quality: 65 }).toFile(path.join(DEST, `${base}.avif`));

    metaOut.push({ base: `/images/${base}`, width: w, height: h });
    console.log('OK', base, w, '×', h);
  }

  console.log('\nCopy this into SiteHome.astro (projectSlides):');
  console.log(JSON.stringify(metaOut, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
