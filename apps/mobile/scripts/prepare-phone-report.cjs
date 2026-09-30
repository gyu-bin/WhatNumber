/* Generate audit artifacts from evidence + final code. Outputs a patch, never writes files. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { execFileSync } = require('node:child_process');
const { load, validate, root, shared } = require('./validate-phone-data.cjs');
const manifest = require('../audit/corrections.json');
const current = load(path.join(shared, 'index.ts'));
function baseline(file, key) {
  const module = { exports: {} };
  const source = execFileSync('git', ['show', '140c7f6c1a64308383e6def835978e4e52a9fe9f:' + file], { cwd: root, encoding: 'utf8' });
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(`(function(module,exports){${code}\n})`, {})(module, module.exports);
  return module.exports[key];
}
const original = [...baseline('packages/shared/src/numbers.ts', 'NUMBERS'), ...baseline('packages/shared/src/organizationContacts.ts', 'ORGANIZATION_CONTACTS')];
const evidence = ['public-safety', 'public-other', 'organizations'].flatMap((file) => require('../audit/' + file + '.json').records);
const additionalSources = {
  w4: ['https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=16169', 'https://1350.moel.go.kr/rtmview.do?id=1000322176&page=1&type=ALL'],
};
const records = original.map((before) => {
  const audit = evidence.find((r) => r.id === before.id);
  if (!audit) throw Error('Missing audit: ' + before.id);
  const visible = current.ALL_NUMBERS.find((n) => n.id === before.id);
  const alias = manifest.aliases[before.id];
  const after = visible ?? (alias ? current.getContactById(alias) : null);
  const sources = [...audit.sources, ...(additionalSources[before.id] ?? []).map((url) => ({ url, readMethod: 'main agent web open body', supports: '1350 노동문제 상담 범위·2026 실제 상담 답변' }))];
  const status = audit.classification ?? audit.status;
  let note = audit.notes ?? audit.reason;
  if (before.id === 'w4') note += ' 원번호 운영 확인 불가와 별개로, 공식 노동부 본문에서 직장 내 괴롭힘·성희롱 등의 상담 범위를 확인한 1350으로 정정. ID는 사용자 의도인 노동문제 상담을 유지.';
  if (before.id === 'org-ins-hanwha-auto') note += ' 최종 표시는 현재 기업 앱 설명에서 확인된 사고·보상 문의로 한정. 24시간·고장출동은 표시하지 않음. 메인 재확인 시 앱 설명 업데이트 2026-09-29.';
  return {
    id: before.id, before: { title: before.title, number: before.num, category: before.cat },
    initialAuditClassification: status,
    finalAction: alias ? 'alias' : visible ? (before.num !== visible.num ? 'correct-number' : 'correct-copy-and-details') : 'hold-unverified',
    canonicalId: alias ?? (visible ? before.id : null),
    after: after ? { title: after.title, number: after.num, category: after.cat, situation: after.situation } : null,
    organization: before.id === 'w4' ? '고용노동부 고객상담센터(대체 창구)' : audit.organization,
    serviceName: before.id === 'w4' ? '고용·노동 문제 상담' : audit.officialServiceName ?? audit.serviceName,
    purpose: audit.purpose,
    hours: audit.hours, cost: audit.fee ?? audit.cost,
    scope: (audit.scope ?? 'UNKNOWN').replace('전국(모바일114는가입통신사)', before.id === 'd2' ? '가입 통신사 고객' : '전국'),
    audience: audit.audience ?? audit.target,
    operatingStatus: audit.operatingStatus ?? audit.active,
    sourceURLs: sources.map((s) => s.url), sources, checkedAt: '2026-09-30', note,
  };
});
const counts = {};
records.forEach((r) => { counts[r.initialAuditClassification] = (counts[r.initialAuditClassification] ?? 0) + 1; });
const validation = validate();
const finalCounts = { reviewed: records.length, visible: current.ALL_NUMBERS.length, public: current.NUMBERS.length, organizations: current.ORGANIZATION_CONTACTS.length, directlyCorrectedNumbers: records.filter((r) => r.finalAction === 'correct-number').length, aliases: records.filter((r) => r.finalAction === 'alias').length, heldUnverified: records.filter((r) => r.finalAction === 'hold-unverified').length };
const result = { checkedAt: '2026-09-30', baselineCommit: '140c7f6c1a64308383e6def835978e4e52a9fe9f', initialClassificationCounts: counts, finalCounts, limitations: ['실제 전화 발신·기관 응답 미검증', '공식 페이지 게시 상태와 실제 연결 상태는 동일하지 않음', '시간·요금 UNKNOWN은 UI에서 추측하지 않음', '일부 직접 열기 실패 시 공식 검색의 전체 색인 본문 확인; sources.readMethod에 구분', '동적 응급실 API 데이터 및 사용자 직접 등록 번호는 정적 104개 감사 범위 밖'], duplicateCandidates: validation.duplicateCandidates, records };
const link = (r) => r.sourceURLs.length ? r.sourceURLs.map((url, i) => `[공식 ${i + 1}](${url})`).join(' · ') : '현행 공식 근거 미확보';
const cell = (v) => String(v ?? 'UNKNOWN').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const lines = [
  '# 전화번호 전수 점검 결과', '',
  '기준일: 2026-09-30. 시작 main: `140c7f6c1a64308383e6def835978e4e52a9fe9f`(당시 origin/main과 일치).', '',
  '정적 등록 데이터 **104개(공공 82 + 기업 22)**를 조사했습니다. 이 보고서는 공식 게시 내용 대조와 실제 코드 검증 결과이며, 전화망의 실제 연결을 인증하는 보고서가 아닙니다.', '',
  '## 최초 데이터 판정', '',
  '| 판정 | 개수 |', '|---|---:|',
  ...Object.entries(counts).map(([k, v]) => `| ${k} | ${v} |`),
  '| 합계 | 104 |', '',
  '`VALID`도 기관 페이지에서 확인되지 않은 시간·요금까지 보장한다는 의미는 아닙니다. 각 필드의 UNKNOWN과 증거 취득 방식을 별도 기록했습니다. 최초 판정은 감사 당시 구 데이터 기준이며 아래 실제 적용 건수와 중복해서 더하지 않습니다.', '',
  '## 실제 반영', '',
  `- 현재 노출 ${finalCounts.visible}개: 공공 ${finalCounts.public}, 기업 ${finalCounts.organizations}.`,
  `- 기존 ID를 유지한 직접 번호 정정 ${finalCounts.directlyCorrectedNumbers}개.`,
  `- 통합·잘못된 중복 매핑 ${finalCounts.aliases}개는 기존 즐겨찾기 ID를 현재 창구로 alias 처리.`,
  `- 현행 연결을 확정하지 못한 ${finalCounts.heldUnverified}개는 노출 보류. **폐지·전화 단절로 단정하지 않음.**`,
  '- 91개 항목의 제목·설명·팁·상세를 정리하고 한국어/영어/중국어/일본어 및 웹 FAQ·가이드에도 반영.',
  '- 기존 storage key와 남아 있는 ID는 유지. 보류/알 수 없는 ID는 안전하게 건너뛰고 화면 즐겨찾기 개수에서는 제외. 이후 재검증 시 복구 가능.', '',
  '## 주요 정정', '',
  '| ID | 기존 | 수정 | 이유 | 공식 출처 |', '|---|---|---|---|---|',
  ...records.filter((r) => r.finalAction === 'correct-number').map((r) => `| ${r.id} | ${cell(r.before.title)} · ${r.before.number} | ${cell(r.after.title)} · ${r.after.number} | ${cell(r.note)} | ${link(r)} |`), '',
  '1339는 질병관리청의 감염병·질병 상담으로 정정하고 응급실·약국 검색 및 emergency 상황 매핑에서 제외했습니다. 129는 보건복지 상담으로 정정하고 국가가 반드시 치료비를 대신 지급한다는 단정을 제거했습니다. HUG와 우체국·K-water의 범위도 실제 기관 소관으로 제한했습니다.', '',
  '## 목록 제외 및 호환 처리', '',
  '| ID | 이전 번호 | 처리 | 현재 대체 / 이유 | 공식 출처 |', '|---|---|---|---|---|',
  ...records.filter((r) => ['alias', 'hold-unverified'].includes(r.finalAction)).map((r) => `| ${r.id} | ${r.before.number} | ${r.finalAction === 'alias' ? '현재 항목으로 연결' : '미확인·노출 보류'} | ${r.after ? `${r.canonicalId} · ${r.after.number}` : cell(r.note)} | ${link(r)} |`), '',
  'e13(1393)→e7(109), e12(122)→e2(119), c2(잘못된 농협 번호)→c1(1588-2504), l6→l11(1372). 해양 범죄 신고는 112이며 e12 alias는 해양 긴급 구조 의도를 기준으로 119에 연결합니다.', '',
  '## 추가 확인 필요', '',
  '- e11(1337), h4(1670-1004), l8(1661-7600), g13~g17의 120 안내, 합병 이후 캐롯 전용 1566-0300은 현행 공식 확인이 부족합니다. 보류 상태이며 전화 발신으로 임의 검증하지 않았습니다.',
  '- w4의 원번호 1544-4140은 현행 확인 불가. 다만 같은 사용자 목적의 노동문제 상담은 고용노동부 공식 본문으로 1350이 확인돼 정정했습니다. 원래 기관과 동일하다는 주장은 하지 않습니다.',
  '- 한화손보 1566-8000은 현재 기업이 게시한 앱 설명에서 사고접수·보상 업무를 확인했습니다. 최신 24시간·고장출동 ARS는 미확정이므로 해당 단정은 제거했습니다.',
  '- DB·메리츠·예별·신한 등의 확인되지 않은 24시간 표기는 제거했습니다. 시간·요금 UNKNOWN은 원본 감사 JSON에서 확인할 수 있습니다.', '',
  '## 지역번호·중복 후보·위젯', '',
  '- 지역 120은 대규모 모델 변경 없이 공식 확인된 지역 카드만 유지하고 해당 지역 소관을 명시했습니다. 충북·충남·전북·전남·경북 등 미확인 카드는 보류했습니다.',
  '- 한전123·환경128은 휴대전화에서 지역번호가 필요하므로 앱은 지역 선택 후, 웹은 검증된 지역번호 입력 후 전화앱을 엽니다. 임의 기본 지역은 없습니다.',
  '- 위젯에서는 지역을 선택할 수 없으므로 123·128 직접 전화 항목은 제외했습니다. 앱 즐겨찾기에는 유지됩니다. 저장 지역을 지원하는 후속 모델 설계 전까지의 안전 조치입니다.',
  '- 기존 위젯의 캐시·스냅샷은 **업데이트된 앱을 한 번 열고 즐겨찾기 로딩 완료/foreground 동기화** 시 재작성됩니다. 앱을 실행하지 않은 기존 네이티브 캐시를 원격으로 바꾸는 작업은 하지 않았습니다.',
  '- 다음 중복 번호는 서로 다른 상담 분야/상황 카드로 유지했습니다(같은 기관임을 설명).', '',
  '| 번호 | 유지 ID | 구분 |', '|---|---|---|',
  ...validation.duplicateCandidates.map((g) => `| ${g.number} | ${g.items.map((i) => i.id).join(', ')} | ${g.items.map((i) => cell(i.title)).join(' / ')} |`), '',
  '## 모든 항목의 적용 결과', '',
  '| ID | 기존 제목 / 번호 | 현재 제목 / 번호 | 최초 판정 · 최종 처리 | 공식 출처 |', '|---|---|---|---|---|',
  ...records.map((r) => `| ${r.id} | ${cell(r.before.title)} / ${r.before.number} | ${r.after ? `${cell(r.after.title)} / ${r.after.number}` : '노출 보류'} | ${r.initialAuditClassification} · ${r.finalAction} | ${link(r)} |`), '',
  '## 생성·수정 파일', '',
  '- 공유 데이터: `packages/shared/src/{numbers,numberDetails,organizationContacts,contacts,search}.ts`.',
  '- 모바일: `App.tsx`, `components/NumberCards.tsx`, `components/RegionalCallSheet.tsx`, `utils/{phoneCall,regionalDialing}.ts`, 즐겨찾기 hook, 기관 이미지 매핑, iOS/Android 위젯 동기화.',
  '- 번역: 4개 언어의 numbers/details/ui 및 웹 web.json. `index.html`의 정적 안내와 웹 guide 관련 ID도 정정.',
  '- 웹: 즐겨찾기 hook/count, 번호 카드·상세·페이지의 지역 전화 선택.',
  '- 재오염 방지: 구 번역 생성/팁 합성 스크립트는 감사된 JSON 검증 전용으로 전환. 기존 미확인 팁 저장본도 정정.',
  '- `scripts/validate-phone-data.cjs`, `scripts/test-phone-data.cjs`, `audit/corrections.json`, `audit/contact-audit.json`, 개별 근거 보고서와 본 문서.', '',
  '## 검증 결과', '',
  '- 정적 validator: 91개, 오류 0, 경고 0. ID·형식·중복·category·situation·상세·번역·tel 변환 확인.',
  '- 오프라인 회귀 테스트 13그룹 통과: manifest 일치, 숫자 검색, 1339 오매핑 제거, 통합/보류 즐겨찾기, 다국어, 34개 지역 전화 조합, 실제 모바일/웹 호출 핸들러, 실제 iOS/Android 스냅샷 생성 코드.',
  '- 모바일 TypeScript 및 웹 TypeScript 통과.',
  '- 수정된 공유·웹 파일 ESLint: 오류 0, 기존 HomePage useMemo 의존성 경고 1. 기존 링크 리다이렉트의 조건부 hook 순서 문제도 보완.',
  '- Vite production build/PWA 생성 통과(기존 번들 500kB 경고 있음).',
  '- Expo iOS/Android export 통과. 이는 JS/자산 번들 생성이며 App Store/Play 네이티브 서명 빌드나 실제 위젯 렌더 검증은 아닙니다.',
  '- 코드 리뷰에서 미확인 즐겨찾기 개수 오류와 iOS Modal 전환 충돌 가능성을 검출해 보완.',
  '- 실제 기관 전화 발신, 실기기 OS 전화 UI, 네이티브 위젯 화면 렌더, Production 배포는 이번에 수행하지 않았습니다.', '',
  '## 구조 개선 TODO', '',
  '전수 근거 메타데이터는 `audit/contact-audit.json`에 둬 UI 타입의 대규모 migration을 피했습니다. 다음 단계에서는 공공·기업 공통 verification metadata, 지역별 발신 규칙, 120 그룹화, 마지막 확인일·확인 수준·재검증 주기를 모델로 분리하는 것이 좋습니다. 시간·요금은 추측 대신 nullable/unknown으로 유지해야 합니다.', '',
];
const outputs = { 'audit/REPORT.md': lines.join('\n'), 'audit/contact-audit.json': JSON.stringify(result, null, 2) + '\n' };
const selected = process.argv[2];
const patch = ['*** Begin Patch'];
for (const [relative, content] of Object.entries(outputs)) {
  if (selected && relative !== selected) continue;
  const file = path.join(root, 'apps/mobile', relative);
  if (fs.existsSync(file)) patch.push('*** Update File: ' + file, '@@', ...fs.readFileSync(file, 'utf8').trimEnd().split('\n').map((l) => '-' + l));
  else patch.push('*** Add File: ' + file);
  patch.push(...content.trimEnd().split('\n').map((l) => '+' + l));
}
patch.push('*** End Patch');
console.log(JSON.stringify({ patch: patch.join('\n'), finalCounts, initialCounts: counts }));
