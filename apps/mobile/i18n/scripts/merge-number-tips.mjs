/**
 * Merges tips into numbers.json (ko from source, en/zh/ja from tipTranslations).
 * Run: node apps/mobile/i18n/scripts/merge-number-tips.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const localesDir = path.join(root, 'i18n/locales');
const sourcePath = '/tmp/wn-numbers-full.json';

const tipTranslations = JSON.parse(
  fs.readFileSync(path.join(root, 'i18n/data/number-tip-translations.json'), 'utf8'),
);

const orgTips = {
  'org-ins-samsung-auto':
    'ARS 1번은 자동차 사고접수, 2번은 자동차 고장출동 요청입니다.',
  'org-bank-kb-incident':
    'ARS 연결 뒤 * 버튼에서 카드·통장·OTP 분실신고를 선택할 수 있어요.',
  'org-bank-woori-incident':
    'ARS 연결 뒤 #-1은 보이스피싱, #-2-3은 통장·인감, #-2-5는 OTP 분실신고입니다.',
};

function mergeLocale(locale) {
  const filePath = path.join(localesDir, locale, 'numbers.json');
  const numbers = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const source = locale === 'ko' ? JSON.parse(fs.readFileSync(sourcePath, 'utf8')) : null;
  const sourceTips = new Map(
    (source ?? []).filter((x) => x.tip).map((x) => [x.id, x.tip]),
  );
  for (const [id, tip] of Object.entries(orgTips)) {
    sourceTips.set(id, tip);
  }

  for (const id of Object.keys(numbers)) {
    const tip =
      locale === 'ko'
        ? sourceTips.get(id)
        : tipTranslations[locale]?.[id] ?? tipTranslations.en?.[id];
    if (tip) {
      numbers[id] = { ...numbers[id], tip };
    }
  }

  fs.writeFileSync(filePath, `${JSON.stringify(numbers, null, 2)}\n`, 'utf8');
}

for (const locale of ['ko', 'en', 'zh', 'ja']) {
  mergeLocale(locale);
}

console.log('Merged tips into all locale numbers.json files');
