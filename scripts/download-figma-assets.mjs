/**
 * Download, deduplicate, classify and optimize images extracted from Figma MCP.
 * Run after download_assets calls — URLs expire quickly.
 */

import sharp from 'sharp';
import { createHash } from 'crypto';
import { createWriteStream, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const tmpDir = join(projectRoot, 'scripts', '.figma-tmp');
const manifestPath = join(projectRoot, 'scripts', 'figma-assets-manifest.json');

const RAW_URLS = [
  // accueil 2:4
  'https://www.figma.com/api/mcp/asset/80272d90-4dfb-402b-93c8-174b55087612',
  'https://www.figma.com/api/mcp/asset/cc06e42f-06a6-4d16-9120-a0c07ee1e197',
  'https://www.figma.com/api/mcp/asset/f932a1db-20c4-464c-b09b-721553bdc149',
  'https://www.figma.com/api/mcp/asset/b625db8b-cbfb-46c2-8a7d-c77fdb52e15a',
  'https://www.figma.com/api/mcp/asset/430ea49e-59c5-4e5e-8c2b-0b26547eff6d',
  'https://www.figma.com/api/mcp/asset/ff084a67-dd6a-4bcb-9757-999344f32057',
  'https://www.figma.com/api/mcp/asset/a20f83bc-771b-4afa-afad-0c8a8e490feb',
  'https://www.figma.com/api/mcp/asset/680629d1-d8fc-4ebb-80e1-8825da5d5392',
  'https://www.figma.com/api/mcp/asset/518f6814-9793-4813-bc56-1268c5c0163c',
  'https://www.figma.com/api/mcp/asset/f9f43ddb-418e-4d7f-af36-ff014564a9d7',
  'https://www.figma.com/api/mcp/asset/702d422a-51b7-4fed-be1a-be0ab778c28d',
  'https://www.figma.com/api/mcp/asset/ea9e1b80-5ae0-410e-a0d0-0fdc0a5aff78',
  'https://www.figma.com/api/mcp/asset/08638675-34e1-42f6-af53-34e0f4d52804',
  'https://www.figma.com/api/mcp/asset/b8fb8b47-2acc-468f-8434-3aeee94a8f01',
  'https://www.figma.com/api/mcp/asset/857a960a-ceb0-4ca9-ba77-9baee446b6ec',
  'https://www.figma.com/api/mcp/asset/9a65bdc7-b1b7-4592-b95b-e61242afcef7',
  'https://www.figma.com/api/mcp/asset/46c5c285-8a8c-4eb7-8664-5effcc45a096',
  'https://www.figma.com/api/mcp/asset/b6a6f735-fc77-4bd3-9763-caa12c9d4d5c',
  // hero 2:20
  'https://www.figma.com/api/mcp/asset/99c256c8-4a90-43b6-aaa5-b715a1c03bf3',
  'https://www.figma.com/api/mcp/asset/8eabc52d-0ac4-4ade-9e41-2d91c840b348',
  // home blog 3:23
  'https://www.figma.com/api/mcp/asset/43a28f05-ad2a-4568-bfd0-33661e94aca6',
  'https://www.figma.com/api/mcp/asset/d5026ce4-32a2-4fb2-ae05-9fa49d3ed808',
  'https://www.figma.com/api/mcp/asset/0f6c2cde-3ab5-4a7f-a2c8-fac4663f84b3',
  'https://www.figma.com/api/mcp/asset/f4a65419-944a-4cae-92ed-2409c3302bb7',
  'https://www.figma.com/api/mcp/asset/ee3bb45d-1dfe-4cd2-a0c9-6bc9dc264d82',
  'https://www.figma.com/api/mcp/asset/5afe36a0-cb9b-460b-b12b-9720fbdd27da',
  'https://www.figma.com/api/mcp/asset/fa79204f-9c0a-45da-8e58-39ff725fd8fb',
  'https://www.figma.com/api/mcp/asset/96d52886-09d5-47d8-ad26-96b31bdb1de7',
  // style cards 2:70
  'https://www.figma.com/api/mcp/asset/086b3b26-a62c-4e8c-88e5-a5d3fb14ac2c',
  'https://www.figma.com/api/mcp/asset/0df93ef9-6114-47b0-9cbf-cf4cce64c63d',
  'https://www.figma.com/api/mcp/asset/07f6ac9e-688a-4eaa-a6b6-e253e5466dca',
  'https://www.figma.com/api/mcp/asset/2c273a16-1e62-4e6b-a7f8-bc8bdbb3637c',
  'https://www.figma.com/api/mcp/asset/5a3ce3e4-e824-4458-9e9b-f4a56e61f404',
  'https://www.figma.com/api/mcp/asset/58130356-3e21-4e10-ac97-68bc0a87b896',
  'https://www.figma.com/api/mcp/asset/37063b19-7069-4da7-bf0c-944b2f0218d5',
  'https://www.figma.com/api/mcp/asset/cc85da22-5bcd-43bd-b78e-c6a4181ecb12',
  'https://www.figma.com/api/mcp/asset/9b2e73ba-68a8-44f7-9a78-bbf9097029a4',
  'https://www.figma.com/api/mcp/asset/909f33c4-3323-4a9c-8232-367223ccc855',
  // article page 6:4
  'https://www.figma.com/api/mcp/asset/3e3a4cfd-6beb-4f8b-b507-a852d7df5ca1',
  'https://www.figma.com/api/mcp/asset/81c64bd0-bbd6-4f7d-977f-f59ca0b94ec2',
  'https://www.figma.com/api/mcp/asset/f8ca14fd-4d22-46a5-a33c-672e3ec1e277',
  'https://www.figma.com/api/mcp/asset/0fc88e85-16c2-44dd-a1da-86f70798316e',
  'https://www.figma.com/api/mcp/asset/1c4b87b8-d451-45e6-8d3e-921fc7899592',
  'https://www.figma.com/api/mcp/asset/e5662621-d4aa-4123-9fc5-e913f6f7763e',
  'https://www.figma.com/api/mcp/asset/a3282932-5e09-47ae-a7c0-591b38c1b209',
  'https://www.figma.com/api/mcp/asset/0f89c999-4724-46bc-bc62-d52b7607bfbd',
  'https://www.figma.com/api/mcp/asset/d2650659-d860-476c-8ba7-ee90d4b5c1e1',
  'https://www.figma.com/api/mcp/asset/21e6c4b6-9d85-43d5-8e54-fe09aff8692f',
  'https://www.figma.com/api/mcp/asset/082544cd-1b72-45aa-950a-37c57d7572a2',
  'https://www.figma.com/api/mcp/asset/c3700cf7-1eee-4347-a5d8-1be34697000a',
  'https://www.figma.com/api/mcp/asset/70a05390-a1ca-4b04-a1e7-b19a40a61648',
  'https://www.figma.com/api/mcp/asset/b24aab3f-e92b-4685-93cb-7b31742e578c',
  'https://www.figma.com/api/mcp/asset/d6e7a8a7-5478-476a-9173-b842fb45457b',
  'https://www.figma.com/api/mcp/asset/06d72cc8-526b-48dc-8dde-007c15ce7fa4',
  'https://www.figma.com/api/mcp/asset/049dd371-f979-4722-9320-eae0068e1aca',
  'https://www.figma.com/api/mcp/asset/76ce68ba-a115-4999-8eef-a6ab18ff3885',
  'https://www.figma.com/api/mcp/asset/e9840afe-4dcf-4064-9477-22fe62ac68fc',
  'https://www.figma.com/api/mcp/asset/ee37db22-723d-4fb1-9b1f-b32660a059c7',
  // article body 6:44
  'https://www.figma.com/api/mcp/asset/e049fec9-6af6-4f81-840f-7990630f564f',
  'https://www.figma.com/api/mcp/asset/1a828ae7-ac90-41d8-927b-1a2c2b7c58a4',
  'https://www.figma.com/api/mcp/asset/7ef091fb-2e50-46b6-825d-63b46422289b',
  'https://www.figma.com/api/mcp/asset/3d20613e-b842-4d95-95ad-bfc5e8bedfea',
  'https://www.figma.com/api/mcp/asset/87404536-85dd-4f05-ab08-1c4bdf2c1473',
  'https://www.figma.com/api/mcp/asset/bdca3723-2899-4db5-979e-b1fc666bac44',
  'https://www.figma.com/api/mcp/asset/4fbfd4f8-bce8-42c4-97dd-4df755594452',
  'https://www.figma.com/api/mcp/asset/3f87c261-5884-4442-a318-4e89b5cc7259',
  'https://www.figma.com/api/mcp/asset/c70e472f-4b09-455b-8a55-242b1e3212ec',
  'https://www.figma.com/api/mcp/asset/452762ef-ceab-48ca-b281-bb1733a222a3',
  'https://www.figma.com/api/mcp/asset/a4782f34-9ac0-46cc-822e-090f5641b7fa',
  'https://www.figma.com/api/mcp/asset/91e44d30-9086-45f7-b599-e35774dfc0df',
  'https://www.figma.com/api/mcp/asset/ff051f48-6027-484a-b60d-01f8f758474b',
  'https://www.figma.com/api/mcp/asset/030931d3-a52e-4356-b781-84ba136b0095',
  'https://www.figma.com/api/mcp/asset/191a7fab-a5da-46f8-b795-37b963aae351',
  'https://www.figma.com/api/mcp/asset/e94be663-779d-4879-8432-b5cd34171215',
  // article hero 6:41
  'https://www.figma.com/api/mcp/asset/8ed9a66a-14f2-4a3d-9dbd-6868aaa61996',
  'https://www.figma.com/api/mcp/asset/5291b7cd-635c-47d8-b55f-0e5b4ecb4daa',
  // blog listing 8:26
  'https://www.figma.com/api/mcp/asset/2cb8e2ca-9487-4e02-8059-3e171b4d5f13',
  'https://www.figma.com/api/mcp/asset/c7d703f0-478a-42ec-b2ec-847232482bfd',
  'https://www.figma.com/api/mcp/asset/987ef6c7-884f-4859-acb1-4ab592c67dd1',
  'https://www.figma.com/api/mcp/asset/18fc896a-a673-4864-9b11-f121e4d1b779',
  'https://www.figma.com/api/mcp/asset/e56da6a9-5801-46fe-9988-4e2835082442',
  'https://www.figma.com/api/mcp/asset/9c7e9730-7863-44dc-98ea-b73359d45e13',
  'https://www.figma.com/api/mcp/asset/517dd2a7-daff-4e1d-80ea-b36b49ad7a59',
  'https://www.figma.com/api/mcp/asset/2544b58d-f7ba-4a92-b81c-818080b7ab49',
  'https://www.figma.com/api/mcp/asset/3a893ae8-dab1-4a00-a281-6fc4b3c41f07',
  'https://www.figma.com/api/mcp/asset/b8cf604f-7336-4824-917a-55204d503498',
  'https://www.figma.com/api/mcp/asset/51ef7638-7bae-4b76-8494-061eb7a4e794',
  'https://www.figma.com/api/mcp/asset/a69b4e2a-e813-431c-a2f3-7ffde74d5961',
  'https://www.figma.com/api/mcp/asset/fc02acc8-81c2-4000-b539-d9119b407cf3',
  'https://www.figma.com/api/mcp/asset/b3c866a9-0e28-46aa-97da-8c8e09236e80',
  'https://www.figma.com/api/mcp/asset/247c5211-5bfe-44e5-a8e2-7aca70ca2b1e',
  'https://www.figma.com/api/mcp/asset/d81b8c30-0ec9-491c-873f-7c34f337236f',
  'https://www.figma.com/api/mcp/asset/5ce5cde8-284f-48c0-adf2-ebedc640e933',
  'https://www.figma.com/api/mcp/asset/50c96632-fb80-47e8-ac70-8034ac375b10',
  'https://www.figma.com/api/mcp/asset/aa1b3c57-5842-434a-9f08-b8b7e3a2920a',
  'https://www.figma.com/api/mcp/asset/3b79ce0c-cb31-43a6-91d7-5a4da237fd82',
  // blog grid 8:400
  'https://www.figma.com/api/mcp/asset/8e64306e-64e9-4487-a352-924ac351e126',
  'https://www.figma.com/api/mcp/asset/1b424622-3357-445b-8d1b-b332b4a9c89f',
  'https://www.figma.com/api/mcp/asset/dcced8f4-b191-44de-b7a8-ceb2a0841133',
  'https://www.figma.com/api/mcp/asset/cfc691b1-1538-4554-9a29-180e6960ccb6',
  'https://www.figma.com/api/mcp/asset/a063362b-cfc3-438e-9804-6d15290e1212',
  'https://www.figma.com/api/mcp/asset/76c5fd24-edc0-4144-9962-05f9f343c660',
  'https://www.figma.com/api/mcp/asset/78dc11b5-152a-418e-9112-e01c7e40d968',
  'https://www.figma.com/api/mcp/asset/7967c7e7-8612-455a-85af-c6747e518bbc',
  'https://www.figma.com/api/mcp/asset/19a8756f-45be-4c48-9f8a-b5c0fa7745db',
  'https://www.figma.com/api/mcp/asset/84431f16-67b1-444f-b5fa-9181b78a0dc2',
  'https://www.figma.com/api/mcp/asset/082dade4-93b5-4f28-8983-57e03b72a594',
  'https://www.figma.com/api/mcp/asset/69864fc1-6508-48ce-9b90-7b9d8d06bd5e',
  'https://www.figma.com/api/mcp/asset/54c8ce28-f3aa-42e2-9641-2d37ae2ff28f',
  'https://www.figma.com/api/mcp/asset/688d93a4-81b6-44bf-8234-9ea721988b47',
  'https://www.figma.com/api/mcp/asset/ff56b9c3-eee9-4d19-ab5f-220db2c35230',
  'https://www.figma.com/api/mcp/asset/23b4f512-5084-413a-9ac6-dceec225308a',
  'https://www.figma.com/api/mcp/asset/fd22bce9-3ef4-4745-b4da-1cf09a269f39',
  'https://www.figma.com/api/mcp/asset/65165ffc-72ee-4d72-ba65-058ac655007e',
  'https://www.figma.com/api/mcp/asset/22f6df75-9aa0-4efa-b287-77e11bc39452',
  'https://www.figma.com/api/mcp/asset/ac8f682c-433a-4f5b-b368-377fb7d7c068',
  // products page 8:317
  'https://www.figma.com/api/mcp/asset/ba551821-3eb5-452e-a91d-38c011bf3cf5',
  'https://www.figma.com/api/mcp/asset/a3a87621-43ca-4ef6-b0fa-cdadeb7847c9',
  'https://www.figma.com/api/mcp/asset/665e3360-089d-4bd7-9afe-1ed1252c6866',
  'https://www.figma.com/api/mcp/asset/0d615d37-79ce-4d5d-9ec6-9c4f0dcd7011',
  'https://www.figma.com/api/mcp/asset/8b7de437-7a22-4a30-817a-78ea91c617b4',
  'https://www.figma.com/api/mcp/asset/8c27c8e7-9f33-4b85-9377-9a7909086fce',
  'https://www.figma.com/api/mcp/asset/00e5ba52-d8ca-4804-abce-095b638b9a7e',
  'https://www.figma.com/api/mcp/asset/e029e35d-248f-48a8-9857-ad4b5ef5a840',
  'https://www.figma.com/api/mcp/asset/bd2e81ad-2d51-4a0d-bc20-8f9ba2c9fed5',
  'https://www.figma.com/api/mcp/asset/cd9eddca-fff7-4a88-8e8d-28faaf96ba33',
  'https://www.figma.com/api/mcp/asset/b0150e62-d6d1-45db-af45-e6c3a5b8846a',
  'https://www.figma.com/api/mcp/asset/0336be13-4781-47b9-93d1-cf792ae983a5',
  'https://www.figma.com/api/mcp/asset/ebf80c1f-290d-4c19-aee0-413bf4493972',
  'https://www.figma.com/api/mcp/asset/c52e1c32-7796-40f9-91e7-5063f432147a',
  'https://www.figma.com/api/mcp/asset/c788be93-5993-47c1-a90f-4b1b059b9356',
  'https://www.figma.com/api/mcp/asset/48eac3d1-43d3-4ffa-b99c-138785c1d79c',
  'https://www.figma.com/api/mcp/asset/7e1f8fc3-cc3b-46bd-b621-d08696f0e1c6',
  'https://www.figma.com/api/mcp/asset/83dde30d-e7e8-4eb4-b092-aa105868aea4',
  'https://www.figma.com/api/mcp/asset/0e4c1e80-0f56-45a0-8dc7-8feb361dc6b1',
  'https://www.figma.com/api/mcp/asset/7c493f06-5aa0-4746-b4c5-6e8a5203cb39',
  // product rows
  'https://www.figma.com/api/mcp/asset/3a880d17-ca40-4cd7-a099-8e063c50e558',
  'https://www.figma.com/api/mcp/asset/21489c21-d8c7-4ef0-9831-a5687aaeb76a',
  'https://www.figma.com/api/mcp/asset/fea1a654-02df-4cdd-a3b7-144c00a6991a',
  'https://www.figma.com/api/mcp/asset/e6537d94-daf7-4d39-974f-82a479ab8a9c',
  'https://www.figma.com/api/mcp/asset/307777f2-502b-4517-b3e2-185893788c12',
  'https://www.figma.com/api/mcp/asset/9783b3b9-de1e-463b-b82d-7a76f02c2f2c',
  'https://www.figma.com/api/mcp/asset/dc3a4cd4-64ea-42ee-8f86-f7f0f76f0a7d',
  'https://www.figma.com/api/mcp/asset/c30ace0c-b092-48fa-b54d-1f42c9a5da73',
  'https://www.figma.com/api/mcp/asset/86a364c1-d77b-4b68-8d77-52e400aa10a4',
  'https://www.figma.com/api/mcp/asset/17da3723-ad8c-4c34-a3d3-53a39076652c',
  'https://www.figma.com/api/mcp/asset/55202b0d-f2b7-4752-b368-f5ab8d1b5ab7',
  'https://www.figma.com/api/mcp/asset/f05fd287-bf66-4add-89c2-89e1c41b0c32',
  // about 10:4
  'https://www.figma.com/api/mcp/asset/f342cc9d-8887-4add-ae10-8dc141d52426',
  'https://www.figma.com/api/mcp/asset/5cf6422d-2416-4c55-88f3-14f04da553e5',
  'https://www.figma.com/api/mcp/asset/fbecd2f4-4e18-48ab-a9bd-e43efb44b43d',
  'https://www.figma.com/api/mcp/asset/f850ab9a-02b7-41a1-a2a7-4459a9317604',
  'https://www.figma.com/api/mcp/asset/3ac36e38-5427-4df0-a328-54badfee6842',
  'https://www.figma.com/api/mcp/asset/0161fb2a-156e-4068-838c-a7d9c65cd101',
  'https://www.figma.com/api/mcp/asset/d2d735b7-0d64-4191-a957-380212d103fe',
  'https://www.figma.com/api/mcp/asset/6424c22f-3a7b-4d99-97c4-e3815cdd1e52',
  'https://www.figma.com/api/mcp/asset/cd345b90-3b7b-4d7a-bb77-ab6d5156585e',
  'https://www.figma.com/api/mcp/asset/4499fbc3-687b-4c43-8333-a903d40b5565',
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', reject);
  });
}

function hashFile(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

async function optimizeTo(inputPath, outputDir, slug) {
  const webpPath = join(outputDir, `${slug}.webp`);
  const avifPath = join(outputDir, `${slug}.avif`);
  const image = sharp(inputPath);
  const meta = await image.metadata();
  let width = meta.width;
  let height = meta.height;
  const maxWidth = 1920;
  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }
  await image.clone().resize(width, height, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toFile(webpPath);
  await image.clone().resize(width, height, { fit: 'inside', withoutEnlargement: true }).avif({ quality: 75 }).toFile(avifPath);
  return { width: meta.width, height: meta.height, slug, outputDir };
}

function classify(w, h) {
  const max = Math.max(w, h);
  const min = Math.min(w, h);
  const ratio = w / h;
  if (max < 80) return 'icon';
  if (w >= 900 && ratio >= 1.2) return 'hero';
  if (ratio >= 0.85 && ratio <= 1.15 && min >= 180) return 'product';
  if (ratio >= 1.2 && min >= 200) return 'blog';
  if (min >= 120 && max <= 500) return 'portrait';
  return 'misc';
}

async function main() {
  mkdirSync(tmpDir, { recursive: true });
  const uniqueUrls = [...new Set(RAW_URLS)];
  console.log(`Downloading ${uniqueUrls.length} Figma assets…`);

  let ok = 0;
  let fail = 0;
  for (const url of uniqueUrls) {
    const id = url.split('/').pop();
    const dest = join(tmpDir, `${id}.png`);
    try {
      await download(url, dest);
      ok++;
    } catch (e) {
      console.warn(`  skip ${id}: ${e.message}`);
      fail++;
    }
  }
  console.log(`Downloaded ${ok}, failed ${fail}`);

  const byHash = new Map();
  for (const file of uniqueUrls.map((u) => join(tmpDir, `${u.split('/').pop()}.png`)).filter(existsSync)) {
    const h = hashFile(file);
    if (!byHash.has(h)) byHash.set(h, file);
  }
  console.log(`Unique images after dedup: ${byHash.size}`);

  const catalog = [];
  for (const [, file] of byHash) {
    const meta = await sharp(file).metadata();
    catalog.push({
      file,
      width: meta.width,
      height: meta.height,
      bytes: (await sharp(file).toBuffer()).length,
      type: classify(meta.width, meta.height),
    });
  }

  catalog.sort((a, b) => b.width * b.height - a.width * a.height);

  const dirs = {
    hero: join(projectRoot, 'public/images/home'),
    blog: join(projectRoot, 'public/images/blog'),
    product: join(projectRoot, 'public/images/products'),
    portrait: join(projectRoot, 'public/images/team'),
    misc: join(projectRoot, 'public/images/figma'),
    carousel: join(projectRoot, 'public/images/carousel'),
  };
  for (const d of Object.values(dirs)) mkdirSync(d, { recursive: true });

  const outputs = [];
  const counters = { hero: 0, blog: 0, product: 0, portrait: 0, misc: 0, icon: 0, carousel: 0 };

  for (const item of catalog) {
    if (item.type === 'icon') {
      counters.icon++;
      continue;
    }
    counters[item.type]++;
    const folderKey = item.type === 'hero' ? 'hero' : item.type;
    const dir = dirs[folderKey] || dirs.misc;
    const prefix =
      item.type === 'hero'
        ? 'hero-accueil-cadeaux-quebec'
        : item.type === 'blog'
          ? `article-figma-${String(counters.blog).padStart(2, '0')}`
          : item.type === 'product'
            ? `produit-figma-${String(counters.product).padStart(2, '0')}`
            : item.type === 'portrait'
              ? `equipe-figma-${String(counters.portrait).padStart(2, '0')}`
              : `figma-${String(counters.misc).padStart(2, '0')}`;
    const result = await optimizeTo(item.file, dir, prefix);
    outputs.push({ ...item, slug: prefix, publicPath: `/images/${dir.split('/public/images/')[1]}/${prefix}` });
  }

  writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), outputs }, null, 2));
  console.log(`\nManifest: ${manifestPath}`);
  console.log('Outputs:');
  for (const o of outputs) {
    console.log(`  ${o.type.padEnd(8)} ${o.width}x${o.height} → ${o.publicPath}`);
  }

  for (const f of uniqueUrls.map((u) => join(tmpDir, `${u.split('/').pop()}.png`)).filter(existsSync)) {
    unlinkSync(f);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
