/**
 * 번호 카드용 기관/기업 마크 PNG 생성
 * (상표 로고 복제가 아닌, 브랜드 컬러 + 이니셜/약칭 배지)
 *
 *   node scripts/generate-org-logos.mjs
 */
import { mkdirSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'apps', 'mobile', 'assets', 'org-logos');
mkdirSync(outDir, { recursive: true });

const SIZE = 128;

/** @type {{ key: string; bg: string; fg: string; label: string; fontSize?: number }[]} */
const MARKS = [
  // 기업
  { key: 'samsung-fire', bg: '#0057A8', fg: '#FFFFFF', label: '삼화', fontSize: 42 },
  { key: 'db-insure', bg: '#00A651', fg: '#FFFFFF', label: 'DB', fontSize: 48 },
  { key: 'kb-insure', bg: '#60584C', fg: '#FFCC00', label: 'KB', fontSize: 48 },
  { key: 'hyundai-card', bg: '#1A1A1A', fg: '#FFFFFF', label: '현대', fontSize: 40 },
  { key: 'samsung-card', bg: '#1428A0', fg: '#FFFFFF', label: 'SC', fontSize: 48 },
  { key: 'lotte-card', bg: '#E60012', fg: '#FFFFFF', label: 'LC', fontSize: 48 },
  { key: 'shinhan-card', bg: '#0046FF', fg: '#FFFFFF', label: '신한', fontSize: 40 },
  { key: 'kb-card', bg: '#60584C', fg: '#FFCC00', label: 'KB', fontSize: 48 },
  { key: 'woori-card', bg: '#0066B3', fg: '#FFFFFF', label: '우리', fontSize: 40 },
  { key: 'hana-card', bg: '#009178', fg: '#FFFFFF', label: '하나', fontSize: 40 },
  { key: 'nh-card', bg: '#1E8E3E', fg: '#FFFFFF', label: 'NH', fontSize: 48 },
  { key: 'kb-bank', bg: '#60584C', fg: '#FFCC00', label: 'KB', fontSize: 48 },
  { key: 'woori-bank', bg: '#0066B3', fg: '#FFFFFF', label: '우리', fontSize: 40 },

  // 긴급·안전
  { key: 'mohw-129', bg: '#D94F3D', fg: '#FFFFFF', label: '129', fontSize: 44 },
  { key: 'fire-119', bg: '#C62828', fg: '#FFFFFF', label: '소방', fontSize: 40 },
  { key: 'police-112', bg: '#1565C0', fg: '#FFFFFF', label: '경찰', fontSize: 40 },
  { key: 'ems-1339', bg: '#00897B', fg: '#FFFFFF', label: '1339', fontSize: 40 },
  { key: 'crime-victim', bg: '#6A1B9A', fg: '#FFFFFF', label: '피해', fontSize: 40 },
  { key: 'mofa-consul', bg: '#00205B', fg: '#FFFFFF', label: '영사', fontSize: 40 },
  { key: 'mental-109', bg: '#2E7D32', fg: '#FFFFFF', label: '109', fontSize: 44 },
  { key: 'suicide-1393', bg: '#455A64', fg: '#FFFFFF', label: '1393', fontSize: 40 },
  { key: 'nis-111', bg: '#1A237E', fg: '#FFFFFF', label: '국정', fontSize: 40 },
  { key: 'police-113', bg: '#0D47A1', fg: '#FFFFFF', label: '113', fontSize: 44 },
  { key: 'defense-1338', bg: '#37474F', fg: '#FFFFFF', label: '방위', fontSize: 40 },
  { key: 'dssc-1337', bg: '#263238', fg: '#FFFFFF', label: '군사', fontSize: 40 },
  { key: 'coast-122', bg: '#0277BD', fg: '#FFFFFF', label: '해경', fontSize: 40 },
  { key: 'env-128', bg: '#2E7D32', fg: '#FFFFFF', label: '환경', fontSize: 40 },
  { key: 'food-1399', bg: '#EF6C00', fg: '#FFFFFF', label: '식품', fontSize: 40 },

  // 교통
  { key: 'molit-road', bg: '#1B4F9C', fg: '#FFFFFF', label: '도로', fontSize: 40 },
  { key: 'korail', bg: '#0054A6', fg: '#FFFFFF', label: 'KTX', fontSize: 40 },
  { key: 'police-lost-182', bg: '#1565C0', fg: '#FFFFFF', label: '182', fontSize: 44 },
  { key: 'insure-generic', bg: '#5D4037', fg: '#FFFFFF', label: '보험', fontSize: 40 },
  { key: 'hit-run', bg: '#BF360C', fg: '#FFFFFF', label: '무보험', fontSize: 34 },

  // 주거·생활
  { key: 'post-address', bg: '#C62828', fg: '#FFFFFF', label: '우체', fontSize: 40 },
  { key: 'noise-center', bg: '#6A1B9A', fg: '#FFFFFF', label: '소음', fontSize: 40 },
  { key: 'jeonse', bg: '#1565C0', fg: '#FFFFFF', label: '전세', fontSize: 40 },
  { key: 'gas', bg: '#E87722', fg: '#FFFFFF', label: '가스', fontSize: 40 },
  { key: 'kepco', bg: '#00A0E9', fg: '#FFFFFF', label: '한전', fontSize: 40 },
  { key: 'kwater', bg: '#0288D1', fg: '#FFFFFF', label: '수공', fontSize: 40 },
  { key: 'kma', bg: '#0277BD', fg: '#FFFFFF', label: '기상', fontSize: 40 },

  // 법률·금융·통신
  { key: 'klac-132', bg: '#37474F', fg: '#FFFFFF', label: '법률', fontSize: 40 },
  { key: 'nhis', bg: '#00796B', fg: '#FFFFFF', label: '건보', fontSize: 40 },
  { key: 'fss', bg: '#003A70', fg: '#FFFFFF', label: '금감', fontSize: 40 },
  { key: 'phishing-1398', bg: '#B71C1C', fg: '#FFFFFF', label: '1398', fontSize: 40 },
  { key: 'pipc', bg: '#4527A0', fg: '#FFFFFF', label: '개인', fontSize: 40 },
  { key: 'kisa', bg: '#1F4E79', fg: '#FFFFFF', label: 'KISA', fontSize: 36 },
  { key: 'spo', bg: '#1A237E', fg: '#FFFFFF', label: '검찰', fontSize: 40 },
  { key: 'kcc', bg: '#0D47A1', fg: '#FFFFFF', label: '방통', fontSize: 40 },
  { key: 'kt-114', bg: '#E60012', fg: '#FFFFFF', label: '114', fontSize: 44 },
  { key: 'kocsc', bg: '#283593', fg: '#FFFFFF', label: '심의', fontSize: 40 },
  { key: 'kca', bg: '#00695C', fg: '#FFFFFF', label: '소비', fontSize: 40 },
  { key: 'nts', bg: '#003764', fg: '#FFFFFF', label: '국세', fontSize: 40 },
  { key: 'local-tax', bg: '#455A64', fg: '#FFFFFF', label: '지방세', fontSize: 34 },
  { key: 'ftc', bg: '#1565C0', fg: '#FFFFFF', label: '공정', fontSize: 40 },
  { key: 'credit-recovery', bg: '#5D4037', fg: '#FFFFFF', label: '신용', fontSize: 40 },
  { key: 'kiss', bg: '#EF6C00', fg: '#FFFFFF', label: '서민', fontSize: 34 },
  { key: 'nhrck', bg: '#00838F', fg: '#FFFFFF', label: '인권', fontSize: 40 },

  // 가족·복지
  { key: 'elder-care', bg: '#6D4ACA', fg: '#FFFFFF', label: '돌봄', fontSize: 40 },
  { key: 'school-117', bg: '#C62828', fg: '#FFFFFF', label: '117', fontSize: 44 },
  { key: 'women-1366', bg: '#AD1457', fg: '#FFFFFF', label: '1366', fontSize: 40 },
  { key: 'digital-sexcrime', bg: '#880E4F', fg: '#FFFFFF', label: '촬영', fontSize: 40 },
  { key: 'immigration', bg: '#1565C0', fg: '#FFFFFF', label: '출입', fontSize: 40 },
  { key: 'youth-1388', bg: '#00838F', fg: '#FFFFFF', label: '1388', fontSize: 40 },
  { key: 'nps', bg: '#008C95', fg: '#FFFFFF', label: '연금', fontSize: 40 },
  { key: 'elder-abuse', bg: '#6A1B9A', fg: '#FFFFFF', label: '노인', fontSize: 40 },

  // 고용
  { key: 'moel', bg: '#0D7490', fg: '#FFFFFF', label: '고용', fontSize: 40 },
  { key: 'comwel', bg: '#0D6E6E', fg: '#FFFFFF', label: '산재', fontSize: 40 },
  { key: 'hrd', bg: '#1565C0', fg: '#FFFFFF', label: '배움', fontSize: 40 },
  { key: 'equal-work', bg: '#6A1B9A', fg: '#FFFFFF', label: '평등', fontSize: 40 },

  // 행정·지역
  { key: 'mois', bg: '#00205B', fg: '#FFFFFF', label: '110', fontSize: 44 },
  { key: 'gov24', bg: '#0B5CAB', fg: '#FFFFFF', label: '정부', fontSize: 40 },
  { key: 'customs', bg: '#1B5E20', fg: '#FFFFFF', label: '관세', fontSize: 40 },
  { key: 'mma', bg: '#37474F', fg: '#FFFFFF', label: '병무', fontSize: 40 },
  { key: 'seoul-120', bg: '#1D9E75', fg: '#FFFFFF', label: '서울', fontSize: 40 },
  { key: 'gg-120', bg: '#1565C0', fg: '#FFFFFF', label: '경기', fontSize: 40 },
  { key: 'incheon-120', bg: '#0277BD', fg: '#FFFFFF', label: '인천', fontSize: 40 },
  { key: 'busan-120', bg: '#00695C', fg: '#FFFFFF', label: '부산', fontSize: 40 },
  { key: 'daegu-120', bg: '#4527A0', fg: '#FFFFFF', label: '대구', fontSize: 40 },
  { key: 'gwangju-120', bg: '#EF6C00', fg: '#FFFFFF', label: '광주', fontSize: 40 },
  { key: 'daejeon-120', bg: '#5D4037', fg: '#FFFFFF', label: '대전', fontSize: 40 },
  { key: 'ulsan-120', bg: '#455A64', fg: '#FFFFFF', label: '울산', fontSize: 40 },
  { key: 'sejong-120', bg: '#2E7D32', fg: '#FFFFFF', label: '세종', fontSize: 40 },
  { key: 'gangwon-120', bg: '#00695C', fg: '#FFFFFF', label: '강원', fontSize: 40 },
  { key: 'chungbuk-120', bg: '#558B2F', fg: '#FFFFFF', label: '충북', fontSize: 40 },
  { key: 'chungnam-120', bg: '#9E9D24', fg: '#FFFFFF', label: '충남', fontSize: 40 },
  { key: 'jeonbuk-120', bg: '#2E7D32', fg: '#FFFFFF', label: '전북', fontSize: 40 },
  { key: 'jeonnam-120', bg: '#00897B', fg: '#FFFFFF', label: '전남', fontSize: 40 },
  { key: 'gyeongbuk-120', bg: '#AD1457', fg: '#FFFFFF', label: '경북', fontSize: 40 },
  { key: 'gyeongnam-120', bg: '#C62828', fg: '#FFFFFF', label: '경남', fontSize: 40 },
  { key: 'jeju-120', bg: '#0277BD', fg: '#FFFFFF', label: '제주', fontSize: 40 },
];

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function writeMark(mark) {
  const fontSize = mark.fontSize ?? 42;
  const svg = `
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${SIZE}" height="${SIZE}" rx="28" fill="${mark.bg}"/>
  <text
    x="50%"
    y="52%"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"
    font-size="${fontSize}"
    font-weight="700"
    fill="${mark.fg}"
  >${escapeXml(mark.label)}</text>
</svg>`;

  const outPath = join(outDir, `${mark.key}.png`);
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log('wrote', mark.key);
}

for (const mark of MARKS) {
  await writeMark(mark);
}

console.log(`done: ${MARKS.length} marks → ${outDir}`);
