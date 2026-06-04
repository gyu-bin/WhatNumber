import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outPath = join(root, 'public', 'ads.txt');
const CERT_ID = 'f08c47fec0942fa0';

function loadDotEnv() {
  const path = join(root, '.env');
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function isValidPubId(id) {
  return typeof id === 'string' && /^pub-\d{16}$/.test(id);
}

function writeAdsTxt(publisherId) {
  const line = `google.com, ${publisherId}, DIRECT, ${CERT_ID}\n`;
  writeFileSync(outPath, line, 'utf8');
  console.log(`Wrote ${outPath}`);
}

const env = { ...loadDotEnv(), ...process.env };
const fromCli = process.argv[2];
const publisherId =
  fromCli || env.VITE_ADSENSE_PUBLISHER_ID || env.ADSENSE_PUBLISHER_ID;

if (isValidPubId(publisherId)) {
  writeAdsTxt(publisherId);
  process.exit(0);
}

if (existsSync(outPath)) {
  const existing = readFileSync(outPath, 'utf8').trim();
  const match = existing.match(/^google\.com, (pub-\d{16}), DIRECT/);
  if (match && isValidPubId(match[1])) {
    console.log('ads.txt already valid');
    process.exit(0);
  }
}

console.warn(
  '[ads.txt] Skipped — set publisher ID first:\n' +
    '  AdSense → 사이트 → ads.txt (또는 계정 → 게시자 ID)\n' +
    '  VITE_ADSENSE_PUBLISHER_ID=pub-... npm run generate-ads-txt',
);
process.exit(0);
