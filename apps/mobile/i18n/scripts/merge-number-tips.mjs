/** Retired: /tmp source snapshots and legacy tips must not overwrite audited copy.
 * Reviewed tips live in each locale's numbers.json, including organization contacts.
 * This compatibility command validates data without modifying it. */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
for (const locale of ['ko', 'en', 'zh', 'ja']) {
  const file = fileURLToPath(new URL('../locales/' + locale + '/numbers.json', import.meta.url));
  JSON.parse(fs.readFileSync(file, 'utf8'));
}
console.log('Audited number translations are valid JSON. No files were overwritten.');
