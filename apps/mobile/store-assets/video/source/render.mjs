// usage: node render.mjs <portrait|square> [--stills t1,t2,...]
import puppeteer from 'puppeteer-core';
import { mkdirSync, rmSync } from 'fs';
import { spawnSync } from 'child_process';
import path from 'path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const fmt = process.argv[2] || 'portrait';
const stillsArg = process.argv.indexOf('--stills');
const W = 1080, H = { square: 1080, feed: 1350 }[fmt] || 1920;
const FPS = 30, DUR = 18;

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--allow-file-access-from-files', '--force-color-profile=srgb'],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.goto(`file://${dir}/video/index.html?render=1&fmt=${fmt}`, { waitUntil: 'networkidle0' });
await page.evaluate(() => window.ready);
const fontOk = await page.evaluate(() => document.fonts.check('800 40px Pretendard'));
console.log('pretendard loaded:', fontOk);

async function frame(t, file) {
  await page.evaluate(t => window.render(t), t);
  await page.screenshot({ path: file, type: file.endsWith('.jpg') ? 'jpeg' : 'png', ...(file.endsWith('.jpg') ? { quality: 96 } : {}) });
}

if (stillsArg > 0) {
  const out = path.join(dir, 'stills', fmt); mkdirSync(out, { recursive: true });
  for (const t of process.argv[stillsArg + 1].split(',').map(Number)) await frame(t, path.join(out, `t${t.toFixed(2)}.png`));
} else {
  const out = path.join(dir, 'frames', fmt); rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true });
  const N = FPS * DUR;
  for (let i = 0; i < N; i++) {
    await frame(i / FPS, path.join(out, `f${String(i).padStart(4, '0')}.jpg`));
    if (i % 60 === 0) console.log(`${fmt} frame ${i}/${N}`);
  }
  const mp4 = path.join(dir, `whatnumber_${W}x${H}.mp4`);
  const r = spawnSync('ffmpeg', ['-y', '-framerate', String(FPS), '-i', path.join(out, 'f%04d.jpg'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
  console.log('ffmpeg exit', r.status, mp4);
}
await browser.close();
