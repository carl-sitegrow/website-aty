#!/usr/bin/env node
/**
 * Ajoute un article de blog à partir d'un fichier Markdown (brouillon local).
 * - Optimise une image locale si présente dans le dossier du brouillon
 * - Enregistre l'article dans src/content/blog/ (brouillon Markdown)
 *
 * Usage: node scripts/add-blog-post-from-md.js <fichier.md> [options]
 *
 * Options:
 *   --slug <slug>         Forcer le slug (sinon déduit du nom du fichier)
 *   --no-image            Ne pas traiter d'image
 *   --draft               published: false
 *   --no-push             Ne pas faire git push (commit uniquement)
 *   --build               Lancer npm run build après le commit
 *   --overwrite           Écraser si l'article existe déjà
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, basename, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// ─── Charger .env ─────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(projectRoot, '.env');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
}
loadEnv();

// ─── Parse args ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const mdPath = args.find((a) => !a.startsWith('--') && a.endsWith('.md'));
const getOpt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
};
const hasFlag = (name) => args.includes(`--${name}`);

const slugArg = getOpt('slug');
const noImage = hasFlag('no-image') || !hasFlag('fetch-image');
const draft = hasFlag('draft');
const noPush = hasFlag('no-push');
const doBuild = hasFlag('build');
const overwrite = hasFlag('overwrite');

if (!mdPath) {
  console.error('Usage: node scripts/add-blog-post-from-md.js <fichier.md> [--slug <slug>] [--no-image] [--draft] [--no-push] [--build] [--overwrite]');
  process.exit(1);
}

const absoluteMdPath = resolve(process.cwd(), mdPath);
if (!existsSync(absoluteMdPath)) {
  console.error(`Fichier introuvable: ${absoluteMdPath}`);
  process.exit(1);
}

const slug = slugArg || basename(mdPath, '.md');
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error('Le slug doit contenir uniquement lettres minuscules, chiffres et tirets.');
  process.exit(1);
}

const blogDir = join(projectRoot, 'src', 'content', 'blog');
const imagesDir = join(projectRoot, 'public', 'images', 'blog');
const outPath = join(blogDir, `${slug}.md`);

if (existsSync(outPath) && !overwrite) {
  console.error(`L'article existe déjà: src/content/blog/${slug}.md (utilisez --overwrite pour écraser).`);
  process.exit(1);
}

mkdirSync(blogDir, { recursive: true });
mkdirSync(imagesDir, { recursive: true });

// ─── Parser frontmatter + body ─────────────────────────────────────────────
function parseMd(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  let frontmatter = {};
  let body = content;
  if (match) {
    body = match[2];
    const raw = match[1];
    for (const line of raw.split('\n')) {
      const m = line.match(/^(\w+):\s*(.*)$/);
          if (m) {
            let val = m[2].trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
              val = val.slice(1, -1).replace(/\\"/g, '"');
            else if (val === 'true') val = true;
            else if (val === 'false') val = false;
            frontmatter[m[1]] = val;
          }
        }
  }
  return { frontmatter, body };
}

function stringifyFrontmatter(obj) {
  const lines = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) lines.push(`${k}: ${JSON.stringify(v)}`);
    else if (typeof v === 'string') lines.push(`${k}: ${JSON.stringify(v)}`);
    else lines.push(`${k}: ${v}`);
  }
  return lines.join('\n');
}

// ─── Nom SEO (slug + primaryKeyword) ──────────────────────────────────────
function getSeoName() {
  let primaryKeyword = '';
  const configPath = join(projectRoot, 'scripts', 'seo-config.json');
  if (existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      primaryKeyword = (config.primaryKeyword || '').toString();
    } catch (_) {}
  }
  const kebab = primaryKeyword
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return kebab ? `${slug}-${kebab}` : slug;
}

// ─── Image locale (jpg/png/webp à côté du .md) ────────────────────────────
function findLocalImage(mdFile) {
  const dir = dirname(mdFile);
  const base = basename(mdFile, '.md');
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
    const candidate = join(dir, base + ext);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

// ─── Main ────────────────────────────────────────────────────────────────
async function main() {
  const raw = readFileSync(absoluteMdPath, 'utf-8');
  const { frontmatter, body } = parseMd(raw);

  const today = new Date().toISOString().split('T')[0];
  const merged = {
    ...frontmatter,
    datePublication: frontmatter.datePublication || today,
    published: draft ? false : (frontmatter.published !== false),
  };

  let imagePath = null; // chemin pour le frontmatter, ex. /images/blog/xxx.avif
  const nomSeo = getSeoName();

  if (!noImage) {
    const localImage = findLocalImage(absoluteMdPath);
    if (localImage) {
      console.log(`Optimisation image locale: ${basename(localImage)}`);
      execSync(
        `node scripts/optimize-image.js "${localImage}" public/images/blog "${nomSeo}"`,
        { cwd: projectRoot, stdio: 'inherit' },
      );
      imagePath = `/images/blog/${nomSeo}`;
      merged.image = imagePath;
    } else if (frontmatter.image) {
      merged.image = frontmatter.image;
    } else {
      console.log('Aucune image locale trouvée (placez <slug>.jpg à côté du .md ou utilisez --no-image).');
    }
  } else if (frontmatter.image) {
    merged.image = frontmatter.image;
  }

  const finalContent = `---\n${stringifyFrontmatter(merged)}\n---\n\n${body}`;
  writeFileSync(outPath, finalContent, 'utf-8');
  console.log(`Article écrit: src/content/blog/${slug}.md`);

  // Git add + commit (chemins relatifs au repo)
  const toAdd = [`src/content/blog/${slug}.md`];
  if (!noImage) {
    if (existsSync(join(imagesDir, `${nomSeo}.avif`))) toAdd.push(`public/images/blog/${nomSeo}.avif`);
    if (existsSync(join(imagesDir, `${nomSeo}.webp`))) toAdd.push(`public/images/blog/${nomSeo}.webp`);
  }
  execSync(`git add ${toAdd.join(' ')}`, { cwd: projectRoot, stdio: 'inherit' });
  execSync(`git commit -m "Add blog post: ${slug}"`, { cwd: projectRoot, stdio: 'inherit' });

  if (!noPush) {
    console.log('Push vers le remote (déclenche le build Vercel)...');
    execSync('git push', { cwd: projectRoot, stdio: 'inherit' });
  }

  if (doBuild) {
    console.log('Build local...');
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
  }

  console.log('Terminé.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
