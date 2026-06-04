import { writeFileSync, mkdirSync } from 'fs';
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

function ogPng() {
  const w = 1200;
  const h = 630;
  return createPng(w, h, (x, y) => {
    const dist = Math.hypot(x - w * 0.92, y - h * 0.88);
    if (dist < 180) {
      const a = Math.floor(20 * (1 - dist / 180));
      return [...RED, a];
    }
    let color = [...BG, 255];

    const iconSize = 120;
    const ix = Math.floor(w / 2 - iconSize - 80);
    const iy = Math.floor(h * 0.28);
    const icon = roundedRect(ix, iy, iconSize, iconSize, 28, [...RED, 255], 0, 0, w, h);
    if (icon) {
      const cx = ix + iconSize / 2;
      const cy = iy + iconSize / 2 + 6;
      const r = iconSize * 0.22;
      const thick = 10;
      const dx = x - cx;
      const dy = y - cy;
      if (Math.hypot(dx, dy - r * 0.55) < thick * 0.8 && y > cy - r && y < cy + r * 0.8) {
        return [255, 255, 255, 255];
      }
      if (Math.abs(Math.hypot(dx, dy) - r) < thick * 0.5) {
        return [255, 255, 255, 255];
      }
      if (Math.hypot(x - cx, y - (cy + r * 0.55)) < thick) {
        return [255, 255, 255, 255];
      }
      return icon;
    }

    const titleY = iy + 20;
    const titleH = 72;
    const titleX = ix + iconSize + 28;
    const titleW = 520;
    if (y >= titleY && y < titleY + titleH && x >= titleX && x < titleX + titleW) {
      return [...TEXT, 255];
    }

    const subY = titleY + titleH + 16;
    const subH = 36;
    if (y >= subY && y < subY + subH && x >= titleX && x < titleX + 400) {
      return [...SUB, 255];
    }

    const tagY = h * 0.62;
    if (y >= tagY && y < tagY + 40 && x >= w / 2 - 280 && x < w / 2 + 280) {
      return [...SUB, 255];
    }

    const samples = ['129', '119', '1588-2504', '132', '1398'];
    const startX = w / 2 - 220;
    samples.forEach((_, i) => {
      const sx = startX + i * 88;
      if (y >= tagY + 56 && y < tagY + 88 && x >= sx && x < sx + 76) {
        return [...RED, 255];
      }
    });

    return color;
  });
}

writeFileSync(join(iconsDir, 'icon-192.png'), iconPng(192, 44, 1));
writeFileSync(join(iconsDir, 'icon-512.png'), iconPng(512, 115, 1));
writeFileSync(join(publicDir, 'apple-touch-icon.png'), iconPng(180, 40, 1));
writeFileSync(join(publicDir, 'favicon.ico'), iconPng(32, 7, 0.85));
writeFileSync(join(iconsDir, 'favicon-32.png'), iconPng(32, 7, 0.85));
writeFileSync(join(publicDir, 'og-image.png'), ogPng());

console.log('Generated public assets');
