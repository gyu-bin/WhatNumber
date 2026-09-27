import { searchNumbers, expandQueryTokens } from '../packages/shared/src/search.ts';
import { ALL_NUMBERS } from '../packages/shared/src/contacts.ts';

const cases = [
  '버스에서 물건을 놓고 내렸다',
  '버스',
  '지하철에 짐 놓고 내림',
  'KTX 가방',
  '차 고장',
  '카드 분실',
  '유실물',
];

let failed = false;

for (const q of cases) {
  const results = searchNumbers(ALL_NUMBERS, q);
  console.log(`\n=== ${q}`);
  console.log('tokens:', expandQueryTokens(q).join(', '));
  console.log(
    results
      .slice(0, 5)
      .map((r) => `${r.id} ${r.title} (${r.num})`)
      .join('\n') || '(none)',
  );
}

const busLost = searchNumbers(ALL_NUMBERS, '버스에서 물건을 놓고 내렸다');
if (busLost[0]?.id !== 'c8') {
  console.error('\nFAIL: expected c8 first for bus lost-item query, got', busLost[0]?.id);
  failed = true;
}

const subway = searchNumbers(ALL_NUMBERS, '지하철에 짐 놓고 내림');
if (subway[0]?.id !== 'c8') {
  console.error('\nFAIL: expected c8 first for subway query, got', subway[0]?.id);
  failed = true;
}

const ktx = searchNumbers(ALL_NUMBERS, 'KTX 가방');
if (ktx[0]?.id !== 'c9') {
  console.error('\nFAIL: expected c9 first for KTX bag query, got', ktx[0]?.id);
  failed = true;
}

if (failed) process.exit(1);
console.log('\nOK');
