// usage (source 폴더에서): node render-reels.mjs <1|2|3|4>  → out/ep<N>.mp4
import puppeteer from 'puppeteer-core';
import { mkdirSync, rmSync } from 'fs';
import { spawnSync } from 'child_process';
const [ep, mode, stills] = process.argv.slice(2);
const FPS=30;
const browser = await puppeteer.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true, args:['--allow-file-access-from-files','--force-color-profile=srgb'] });
const page = await browser.newPage();
await page.setViewport({ width:1080, height:1920, deviceScaleFactor:1 });
await page.goto(`file://${process.cwd()}/reels.html?ep=${ep}`, { waitUntil:'networkidle0' });
await page.evaluate(()=>window.ready);
console.log('font', await page.evaluate(()=>document.fonts.check('800 40px Pretendard')));
const DUR = await page.evaluate(()=>window.DUR);
const shot = async (t,f)=>{ await page.evaluate(t=>window.render(t),t); await page.screenshot({path:f,type:'jpeg',quality:95}); };
if (mode==='stills'){ mkdirSync(`stills/${ep}`,{recursive:true}); for (const t of stills.split(',').map(Number)) await shot(t,`stills/${ep}/t${t.toFixed(2)}.jpg`); }
else {
  const out=`frames/${ep}`; rmSync(out,{recursive:true,force:true}); mkdirSync(out,{recursive:true});
  const N=Math.round(DUR*FPS);
  for (let i=0;i<N;i++) await shot(i/FPS, `${out}/f${String(i).padStart(4,'0')}.jpg`);
  mkdirSync('out',{recursive:true});
  const r=spawnSync('ffmpeg',['-y','-v','error','-framerate',String(FPS),'-i',`${out}/f%04d.jpg`,'-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',`out/ep${ep}.mp4`],{stdio:'inherit'});
  console.log('done', ep, N, r.status);
}
await browser.close();
