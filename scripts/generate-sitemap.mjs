import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outPath = join(root, 'public', 'sitemap.xml');

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

function extractIds(filePath, field) {
  const src = readFileSync(join(root, filePath), 'utf8');
  const re = new RegExp(`${field}: '([^']+)'`, 'g');
  return [...src.matchAll(re)].map((m) => m[1]);
}

const env = { ...loadDotEnv(), ...process.env };
const siteUrl = (env.VITE_SITE_URL || 'https://whatnumber-mu.vercel.app').replace(
  /\/$/,
  '',
);

const numberIds = extractIds('packages/shared/src/numbers.ts', 'id');
const guideSlugs = extractIds('src/content/guides.ts', 'slug');

const staticPaths = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.5', changefreq: 'monthly' },
  { path: '/guide', priority: '0.75', changefreq: 'weekly' },
];

const guidePaths = guideSlugs.map((slug) => ({
  path: `/guide/${slug}`,
  priority: '0.8',
  changefreq: 'weekly',
}));

const numberPaths = numberIds.map((id) => ({
  path: `/n/${id}`,
  priority: '0.9',
  changefreq: 'monthly',
}));

const allPaths = [...staticPaths, ...guidePaths, ...numberPaths];
const lastmod = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths
  .map(
    (entry) => `  <url>
    <loc>${siteUrl}${entry.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(outPath, xml, 'utf8');
writeFileSync(
  join(root, 'public', 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  'utf8',
);
console.log(
  `Wrote ${outPath} and robots.txt (${siteUrl}) — ${allPaths.length} URLs (${numberIds.length} numbers)`,
);
