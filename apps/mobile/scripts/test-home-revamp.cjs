const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const cache = new Map();
const opened = [], alerts = [];
let canOpen = true;
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const exports = {}; cache.set(file, exports);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const requireLocal = name => {
    if (name === 'react-native') return { Linking: { openURL: async url => { if (!canOpen) throw Error('unavailable'); opened.push(url); } }, Alert: { alert: (...args) => alerts.push(args) } };
    if (name === '../i18n') return { __esModule: true, default: { t: key => key } };
    if (name === '@whatnumber/shared') return load(path.resolve(root, '../../packages/shared/src/index.ts'));
    const resolved = path.resolve(path.dirname(file), name);
    if (name.endsWith('.json')) return JSON.parse(fs.readFileSync(resolved, 'utf8'));
    return load(resolved + '.ts');
  };
  vm.runInNewContext(source, { exports, require: requireLocal, console, URL, Date, Map, Set });
  return exports;
}
(async () => {
  const shared = load(path.resolve(root, '../../packages/shared/src/index.ts'));
  const content = load(path.join(root, 'data/homeContent.ts'));
  const search = load(path.join(root, 'services/homeSearch.ts'));
  const maps = load(path.join(root, 'services/maps.ts'));
  for (const scenario of content.HOME_SITUATIONS) assert.ok(content.getSituationNumbers(scenario.id).length > 0, scenario.id);
  for (const season of content.SEASONAL_CONTACTS) {
    assert.equal(content.getSeasonNumbers(season.id).length, season.numberIds.length, `${season.id} missing directory IDs`);
  }
  for (let month = 0; month < 12; month++) assert.ok(content.getCurrentSeasons(new Date(2026, month, 15)).length >= 1);
  const suggestions = ['Car accident', 'Flat tire', 'Dead battery', 'Towing', 'Lost card', 'Voice phishing'];
  for (const query of suggestions) assert.ok(search.searchHomeNumbers(shared.ALL_NUMBERS, query, suggestions).length > 0, query);
  assert.ok(search.searchHomeNumbers(shared.ALL_NUMBERS, '차가 고장났어요', suggestions).some(item => item.situation.includes('car')));
  await maps.openDirections({ latitude: 37.5, longitude: 127.1 }, { destinationName: '병원 & 응급실', origin: { latitude: 37.4, longitude: 127.0 } });
  assert.equal(opened.length, 1);
  const route = new URL(opened[0]);
  assert.equal(route.protocol, 'nmap:');
  assert.equal(route.pathname, '/car');
  assert.equal(route.searchParams.get('dname'), '병원 & 응급실');
  assert.equal(route.searchParams.get('slat'), '37.4');
  canOpen = false;
  await maps.openDirections({ latitude: 37.5, longitude: 127.1 });
  assert.equal(opened.length, 1, 'must not open another map service');
  assert.equal(alerts.length, 1, 'missing NAVER app must show explanation');
  console.log('PASS home revamp: four situations, all seasonal IDs, 12 months, translated search suggestions, natural-language search, NAVER-only route and unavailable state');
})().catch(error => { console.error(error); process.exitCode = 1; });
