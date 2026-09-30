/* Prepare Korean consumer-copy patches from the audited shared data; does not write files. */
const fs = require('node:fs');
const path = require('node:path');
const { load, root, shared } = require('./validate-phone-data.cjs');
const a = load(path.join(shared, 'index.ts'));
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const files = {};
files['apps/mobile/i18n/locales/ko/numbers.json'] = Object.fromEntries(a.ALL_NUMBERS.map((n) => [n.id, { title: n.title, desc: n.desc, ...(n.tip ? { tip: n.tip } : {}) }]));
files['apps/mobile/i18n/locales/ko/details.json'] = a.NUMBER_DETAILS;
const mobile = read('apps/mobile/i18n/locales/ko/ui.json');
Object.assign(mobile.situationTips, {
  emergency: '생명이 위급하면 119, 자살예방 상담은 109입니다. 의료비 지원제도는 129에서 확인하세요.',
  car: '부상·구조는 119, 긴급 교통사고 신고는 112. 고속도로 견인 범위는 1588-2504에 문의하세요.',
  crime: '긴급 범죄 신고는 112, 피싱 상담·제보는 1394, 인터넷 침해사고 상담은 118입니다.',
  home: '담당 기관을 모르면 110에 문의하세요. 전기 고장 신고는 지역번호+123, 가스 사고 등 긴급 위험은 119입니다.',
  legal: '법률 상담은 132, 채무조정 상담은 1600-5500입니다. 통화요금과 지원 요건을 확인하세요.',
});
files['apps/mobile/i18n/locales/ko/ui.json'] = mobile;
const web = read('src/i18n/locales/ko/web.json');
web.home.faq = [
  { question: '의료비 지원제도는 어디에 문의하나요?', answer: '129 보건복지상담센터에서 긴급복지·의료비 지원제도를 상담합니다. 지원 여부와 절차를 확인하세요. 생명이 위급하면 먼저 119에 연락하세요.' },
  { question: '고속도로 긴급견인은 어디에 문의하나요?', answer: '한국도로공사 고속도로 콜센터 1588-2504에서 서비스 대상·견인 범위를 확인하세요. 정비소까지의 모든 이동이 무료인 것은 아닙니다.' },
  web.home.faq[2],
];
web.intro.paragraph1 = '보건복지 상담 129, 고속도로 콜센터 1588-2504, HUG 보증상품 상담 1566-9009 등 필요한 연락처를 상황별로 찾아보세요. 몇번이야는 전화번호와 서비스 범위를 정리한 무료 안내 서비스입니다.';
Object.assign(web.situationTips, mobile.situationTips, { abroad: '해외 사건·사고는 영사안전콜센터 +82-2-3210-0404, 통관·관세 상담은 125입니다.' });
const guides = {
  emergency: ['응급·안전 상황의 연락처', '119·112 긴급 신고와 129·1339·109의 서로 다른 상담 범위를 확인하세요.', ['e2', 'e3', 'e1', 'e4', 'e7']],
  'car-accident': ['교통사고·차량 고장 연락처', '긴급 신고, 한국도로공사 긴급견인 안내와 정부보장사업의 범위를 구분하세요.', ['c4', 'c3', 'c1', 'c6']],
  housing: ['주거·생활 문의 연락처', 'HUG 보증상품, 우편물 전송, 층간소음과 지역별 생활 문의를 구분하세요.', ['h3', 'h1', 'h2', 'h5', 'h6']],
  'legal-finance': ['금융사기·소비자·법률 상담', '피싱 제보, 금융상담, 소비자상담과 법률상담을 구분하세요.', ['l4', 'l3', 'l11', 'l1', 'l2']],
  'civil-admin': ['정부·지역 민원 문의', '전국 안내 110과 공식 확인된 지역별 콜센터의 범위를 구분하세요. 모든 시·도가 동일한 120 서비스를 제공하는 것은 아닙니다.', ['g1', 'g4', 'g5', 'g2']],
  'family-welfare': ['가족·복지·피해지원 연락처', '학교폭력·여성폭력·디지털성범죄·노인학대·청소년 상담의 용도를 확인하세요.', ['f2', 'f3', 'f4', 'f8', 'f6']],
};
for (const [slug, [title, summary, ids]] of Object.entries(guides)) {
  web.guides.items[slug] = { title, summary, sections: ids.map((id) => ({ heading: a.getContactById(id).title, paragraphs: a.getNumberDetail(id) })) };
}
files['src/i18n/locales/ko/web.json'] = web;
const selected = process.argv[2];
const patch = ['*** Begin Patch'];
for (const [relative, value] of Object.entries(files)) {
  if (selected && !relative.endsWith(selected)) continue;
  const file = path.join(root, relative);
  patch.push('*** Update File: ' + file, '@@', ...fs.readFileSync(file, 'utf8').trimEnd().split('\n').map((l) => '-' + l), ...JSON.stringify(value, null, 2).split('\n').map((l) => '+' + l));
}
patch.push('*** End Patch');
console.log(JSON.stringify({ patch: patch.join('\n') }));
