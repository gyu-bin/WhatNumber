/**
 * 몇번이야 모바일 앱 아이콘 · 스플래시 생성
 * 원본: apps/mobile/assets/brand/source.png
 *
 * 사용:
 *   node scripts/generate-mobile-assets.mjs
 */
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'apps', 'mobile', 'assets');
const brandDir = join(outDir, 'brand');
const sourcePath = join(brandDir, 'source.png');

mkdirSync(outDir, { recursive: true });
mkdirSync(brandDir, { recursive: true });

let sharp;
try {
  sharp = require('sharp');
} catch {
  console.error('sharp가 필요합니다. 루트에서 실행하세요:\n  npm install -D sharp');
  process.exit(1);
}

if (!existsSync(sourcePath)) {
  console.error(`원본이 없습니다: ${sourcePath}`);
  console.error('brand/source.png 에 1024 아이콘을 넣어 주세요.');
  process.exit(1);
}

const CREAM = { r: 247, g: 245, b: 242 };

const src = sharp(sourcePath);

await src
  .clone()
  .resize(1024, 1024, { fit: 'cover', position: 'centre' })
  .png()
  .toFile(join(outDir, 'icon.png'));

const fgPad = Math.round(1024 * 0.12);
const fgInner = 1024 - fgPad * 2;
const fgResized = await sharp(sourcePath)
  .resize(fgInner, fgInner, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: fgResized, left: fgPad, top: fgPad }])
  .png()
  .toFile(join(outDir, 'android-icon-foreground.png'));

await sharp({
  create: { width: 1024, height: 1024, channels: 3, background: CREAM },
})
  .png()
  .toFile(join(outDir, 'android-icon-background.png'));

await sharp(sourcePath)
  .resize(1024, 1024, { fit: 'cover' })
  .greyscale()
  .normalize()
  .threshold(210)
  .png()
  .toFile(join(outDir, 'android-icon-monochrome.png'));

const splashPad = Math.round(1024 * 0.14);
const splashInner = 1024 - splashPad * 2;
const splashIcon = await sharp(sourcePath)
  .resize(splashInner, splashInner, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: { ...CREAM, alpha: 1 },
  },
})
  .composite([{ input: splashIcon, left: splashPad, top: splashPad }])
  .png()
  .toFile(join(outDir, 'splash-icon.png'));

await sharp(sourcePath).resize(48, 48, { fit: 'cover' }).png().toFile(join(outDir, 'favicon.png'));
await sharp(sourcePath).resize(256, 256, { fit: 'cover' }).png().toFile(join(brandDir, 'logo-256.png'));

const publicIcons = join(root, 'public', 'icons');
mkdirSync(publicIcons, { recursive: true });
await sharp(sourcePath).resize(192, 192, { fit: 'cover' }).png().toFile(join(publicIcons, 'icon-192.png'));
await sharp(sourcePath).resize(512, 512, { fit: 'cover' }).png().toFile(join(publicIcons, 'icon-512.png'));
await sharp(sourcePath)
  .resize(180, 180, { fit: 'cover' })
  .png()
  .toFile(join(root, 'public', 'apple-touch-icon.png'));
copyFileSync(join(outDir, 'favicon.png'), join(root, 'public', 'favicon.png'));

console.log('Generated from brand/source.png → apps/mobile/assets + public/icons');
