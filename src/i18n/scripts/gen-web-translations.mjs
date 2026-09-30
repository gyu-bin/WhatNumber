/** Retired: the old generator contained unaudited hotline advice.
 * Locale files are now reviewed source data; this command validates JSON only.
 * Update ko/en/zh/ja together and run npm run test:phones --workspace=mobile. */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
for (const locale of ['ko', 'en', 'zh', 'ja']) {
  const file = fileURLToPath(new URL('../locales/' + locale + '/web.json', import.meta.url));
  JSON.parse(fs.readFileSync(file, 'utf8'));
}
console.log('Audited web translations are valid JSON. No files were overwritten.');
