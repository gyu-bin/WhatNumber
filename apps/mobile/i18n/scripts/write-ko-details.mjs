import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NUMBER_DETAILS } from '../../../../packages/shared/src/numberDetails.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const out = path.join(root, 'i18n/locales/ko/details.json');
fs.writeFileSync(out, `${JSON.stringify(NUMBER_DETAILS, null, 2)}\n`, 'utf8');
console.log('Wrote ko/details.json', Object.keys(NUMBER_DETAILS).length, 'ids');
