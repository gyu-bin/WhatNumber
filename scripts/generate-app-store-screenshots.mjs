/**
 * App Store 스크린샷 생성 (1284 × 2778 — iPhone 6.5")
 *
 *   node scripts/generate-app-store-screenshots.mjs
 */
import { mkdirSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcDir = join(root, 'apps', 'mobile', 'artifacts', 'app-store-screenshots');
const outDir = join(srcDir, 'asc');

mkdirSync(outDir, { recursive: true });

const W = 1284;
const H = 2778;

/** Soft brand wash */
const BG_TOP = '#FFE8E4';
const BG_BOTTOM = '#FFF9F7';
const TEXT = '#1C1917';
const MUTED = '#78716C';
const ACCENT = '#D94F3D';

const SLIDES = [
  {
    file: '01-home-feature.png',
    source: '01-home.png',
    title: '필요한 번호,\n바로 찾아드릴게요.',
    subtitle: '응급·생활·금융 공공번호를\n상황별로 한곳에서',
    // show upper/mid home UI
    crop: { top: 0, heightRatio: 0.92 },
  },
  {
    file: '02-categories-feature.png',
    source: '01-home.png',
    title: '필요한 분야만\n골라서 찾아보세요.',
    subtitle: '교통·금융·주거·복지·민원까지\n카테고리로 빠르게',
    // focus on category grid area
    crop: { top: 0.42, heightRatio: 0.55 },
  },
  {
    file: '03-emergency-feature.png',
    source: '03-emergency.png',
    title: '가까운 응급실을\n빠르게 확인하세요.',
    subtitle: '현재 위치 기준으로\n병상·거리·전화·길찾기까지',
    crop: { top: 0, heightRatio: 0.95 },
  },
];

function escapeXml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function titleLines(title) {
  return title.split('\n').map(escapeXml);
}

function subtitleLines(subtitle) {
  return subtitle.split('\n').map(escapeXml);
}

function buildFrameSvg({ title, subtitle }) {
  const t = titleLines(title);
  const s = subtitleLines(subtitle);
  const titleY0 = 168;
  const titleLh = 78;
  const subY0 = titleY0 + t.length * titleLh + 28;
  const subLh = 44;

  const titleTs = t
    .map(
      (line, i) =>
        `<text x="642" y="${titleY0 + i * titleLh}" text-anchor="middle" font-family="-apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" font-size="68" font-weight="800" fill="${TEXT}" letter-spacing="-1.5">${line}</text>`,
    )
    .join('\n');

  const subTs = s
    .map(
      (line, i) =>
        `<text x="642" y="${subY0 + i * subLh}" text-anchor="middle" font-family="-apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" font-size="32" font-weight="500" fill="${MUTED}">${line}</text>`,
    )
    .join('\n');

  // decorative accent pill under subtitle
  const pillY = subY0 + s.length * subLh + 36;

  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BG_TOP}"/>
      <stop offset="55%" stop-color="${BG_BOTTOM}"/>
      <stop offset="100%" stop-color="#FFFFFF"/>
    </linearGradient>
    <linearGradient id="glow" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <ellipse cx="642" cy="120" rx="520" ry="220" fill="url(#glow)"/>
  ${titleTs}
  ${subTs}
  <rect x="592" y="${pillY}" width="100" height="8" rx="4" fill="${ACCENT}" opacity="0.85"/>
</svg>`);
}

async function makePhoneScreen(sourcePath, crop) {
  const meta = await sharp(sourcePath).metadata();
  const sw = meta.width;
  const sh = meta.height;
  const top = Math.round(sh * crop.top);
  const height = Math.min(sh - top, Math.round(sh * crop.heightRatio));

  // Target phone content area inside frame
  const phoneW = 980;
  const phoneH = 1960;
  const radius = 72;

  const screen = await sharp(sourcePath)
    .extract({ left: 0, top, width: sw, height })
    .resize(phoneW, phoneH, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();

  // Rounded mask
  const mask = Buffer.from(
    `<svg width="${phoneW}" height="${phoneH}"><rect width="${phoneW}" height="${phoneH}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`,
  );

  const rounded = await sharp(screen)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Bezel / shadow plate
  const bezelPad = 18;
  const outerW = phoneW + bezelPad * 2;
  const outerH = phoneH + bezelPad * 2;
  const outerR = radius + 10;

  const bezelSvg = Buffer.from(`<?xml version="1.0"?>
<svg width="${outerW}" height="${outerH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="s" x="-20%" y="-10%" width="140%" height="140%">
      <feDropShadow dx="0" dy="28" stdDeviation="36" flood-color="#1C1917" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect x="0" y="0" width="${outerW}" height="${outerH}" rx="${outerR}" ry="${outerR}" fill="#1C1917" filter="url(#s)"/>
</svg>`);

  const withBezel = await sharp(bezelSvg)
    .composite([{ input: rounded, left: bezelPad, top: bezelPad }])
    .png()
    .toBuffer();

  return { buffer: withBezel, width: outerW, height: outerH };
}

async function renderSlide(slide) {
  const sourcePath = join(srcDir, slide.source);
  const frame = await sharp(buildFrameSvg(slide)).png().toBuffer();
  const phone = await makePhoneScreen(sourcePath, slide.crop);

  // Place phone lower-center
  const left = Math.round((W - phone.width) / 2);
  const top = Math.round(H - phone.height - 72);

  const outPath = join(outDir, slide.file);
  await sharp(frame)
    .composite([{ input: phone.buffer, left, top }])
    .png({ quality: 100 })
    .toFile(outPath);

  const meta = await sharp(outPath).metadata();
  console.log(`wrote ${slide.file} (${meta.width}×${meta.height})`);
}

// Also export 1242×2688 variants (scale from master)
async function exportAltSize(file, tw, th) {
  const src = join(outDir, file);
  const dest = join(outDir, file.replace('-feature.png', `-feature-${tw}x${th}.png`));
  await sharp(src).resize(tw, th, { fit: 'cover', position: 'top' }).png().toFile(dest);
  console.log(`wrote ${dest.split('/').pop()}`);
}

for (const slide of SLIDES) {
  await renderSlide(slide);
}

for (const slide of SLIDES) {
  await exportAltSize(slide.file, 1242, 2688);
}

console.log(`done → ${outDir}`);
