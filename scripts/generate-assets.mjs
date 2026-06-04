import { writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { deflateSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const iconsDir = join(publicDir, 'icons');

mkdirSync(iconsDir, { recursive: true });

const RED = [217, 79, 61];
const BG = [250, 250, 249];
const TEXT = [17, 17, 16];
const SUB = [111, 111, 106];

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, draw) {
  const rowSize = 1 + width * 4;
  const raw = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    raw[y * rowSize] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = draw(x, y);
      const i = y * rowSize + 1 + x * 4;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** 카카오·SNS 스크래퍼용 — 알파 채널 없는 RGB PNG */
function createPngRgb(width, height, draw) {
  const rowSize = 1 + width * 3;
  const raw = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    raw[y * rowSize] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b] = draw(x, y);
      const i = y * rowSize + 1 + x * 3;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function roundedRect(x, y, w, h, r, fill, px, py, pw, ph) {
  const cx = px + x;
  const cy = py + y;
  if (
    cx >= px &&
    cx < px + pw &&
    cy >= py &&
    cy < py + ph &&
    cx >= x &&
    cx < x + w &&
    cy >= y &&
    cy < y + h
  ) {
    const dx = Math.min(cx - x, x + w - 1 - cx);
    const dy = Math.min(cy - y, y + h - 1 - cy);
    const corner =
      (cx < x + r || cx > x + w - 1 - r) && (cy < y + r || cy > y + h - 1 - r);
    if (!corner || (cx >= x + r && cx <= x + w - 1 - r) || (cy >= y + r && cy <= y + h - 1 - r)) {
      return fill;
    }
    const corners = [
      [x + r, y + r],
      [x + w - 1 - r, y + r],
      [x + r, y + h - 1 - r],
      [x + w - 1 - r, y + h - 1 - r],
    ];
    for (const [ccx, ccy] of corners) {
      const dist = Math.hypot(cx - ccx, cy - ccy);
      if (dist <= r) return fill;
    }
  }
  return null;
}

function iconPng(size, radius, qScale) {
  const png = createPng(size, size, (x, y) => {
    const bg = roundedRect(0, 0, size, size, radius, [...RED, 255], 0, 0, size, size);
    if (bg) {
      const cx = size / 2;
      const cy = size / 2 + size * 0.04;
      const r = size * 0.22 * qScale;
      const thick = Math.max(2, size * 0.08);
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      const dotY = cy + r * 0.55;
      if (Math.abs(x - cx) < thick && y > cy - r * 0.2 && y < dotY) {
        return [255, 255, 255, 255];
      }
      if (Math.abs(dist - r) < thick * 0.55) {
        return [255, 255, 255, 255];
      }
      if (Math.hypot(x - cx, y - dotY) < thick * 0.9) {
        return [255, 255, 255, 255];
      }
      return bg;
    }
    return [0, 0, 0, 0];
  });
  return png;
}

function drawQuestionMarkRgb(x, y, cx, cy, r, thick) {
  const dx = x - cx;
  const dy = y - cy;
  const dotY = cy + r * 0.55;
  if (Math.abs(x - cx) < thick && y > cy - r * 0.2 && y < dotY) {
    return [255, 255, 255];
  }
  if (Math.abs(Math.hypot(dx, dy) - r) < thick * 0.55) {
    return [255, 255, 255];
  }
  if (Math.hypot(x - cx, y - dotY) < thick * 0.9) {
    return [255, 255, 255];
  }
  return null;
}

function ogPng() {
  const w = 1200;
  const h = 630;
  const topH = 268;
  const pad = 72;
  const iconSize = 168;
  const ix = pad;
  const iy = Math.floor((topH - iconSize) / 2) + 8;

  return createPngRgb(w, h, (x, y) => {
    if (y < topH) {
      const icon = roundedRect(ix, iy, iconSize, iconSize, 36, [...RED, 255], 0, 0, w, h);
      if (icon) {
        const cx = ix + iconSize / 2;
        const cy = iy + iconSize / 2 + 10;
        const mark = drawQuestionMarkRgb(x, y, cx, cy, iconSize * 0.22, 14);
        if (mark) return mark;
        return RED;
      }
      const tx = ix + iconSize + 56;
      const titleY = iy + 12;
      if (y >= titleY && y < titleY + 72 && x >= tx && x < w - pad) {
        return [255, 255, 255];
      }
      const subY = titleY + 88;
      if (y >= subY && y < subY + 48 && x >= tx && x < w - pad - 80) {
        return [255, 230, 226];
      }
      return RED;
    }

    const bodyY = topH + pad;
    const titleBarH = 56;
    if (y >= bodyY && y < bodyY + titleBarH && x >= pad && x < w - pad) {
      return TEXT;
    }

    const subY = bodyY + titleBarH + 28;
    const subH = 40;
    if (y >= subY && y < subY + subH && x >= pad && x < w - pad - 120) {
      return SUB;
    }

    const tagY = subY + subH + 36;
    const tagH = 48;
    if (y >= tagY && y < tagY + tagH && x >= pad && x < pad + 560) {
      return RED;
    }

    const chipY = tagY + tagH + 32;
    const chipW = 108;
    const chipH = 44;
    const gap = 16;
    for (let i = 0; i < 6; i++) {
      const sx = pad + i * (chipW + gap);
      if (x >= sx && x < sx + chipW && y >= chipY && y < chipY + chipH) {
        const inner =
          x >= sx + 6 &&
          x < sx + chipW - 6 &&
          y >= chipY + 8 &&
          y < chipY + chipH - 8;
        return inner ? RED : [255, 255, 255];
      }
    }

    return BG;
  });
}

writeFileSync(join(iconsDir, 'icon-192.png'), iconPng(192, 44, 1));
writeFileSync(join(iconsDir, 'icon-512.png'), iconPng(512, 115, 1));
writeFileSync(join(publicDir, 'apple-touch-icon.png'), iconPng(180, 40, 1));
writeFileSync(join(publicDir, 'favicon.ico'), iconPng(32, 7, 0.85));
writeFileSync(join(iconsDir, 'favicon-32.png'), iconPng(32, 7, 0.85));
const ogPath = join(publicDir, 'og-image.png');
writeFileSync(ogPath, ogPng());

const ogJpgPath = join(publicDir, 'og-image.jpg');
try {
  if (process.platform === 'darwin') {
    execSync(`sips -s format jpeg -s formatOptions 92 "${ogPath}" --out "${ogJpgPath}"`, {
      stdio: 'ignore',
    });
  }
} catch {
  /* JPEG는 macOS 로컬에서만 생성 — 배포 OG는 RGB PNG */
}

console.log('Generated public assets');
