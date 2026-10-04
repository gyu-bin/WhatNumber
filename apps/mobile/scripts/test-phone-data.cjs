/* Offline regressions. Network availability and actual telephone connections are not tested. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { load, validate, root, shared } = require('./validate-phone-data.cjs');
const data = load(path.join(shared, 'index.ts'));
const mobile = path.join(root, 'apps/mobile');
const manifest = require('../audit/corrections.json');
let checks = 0;
function test(name, run) { run(); checks++; console.log(`PASS ${name}`); }
const plain = (value) => JSON.parse(JSON.stringify(value));
function mockLoad(file, mocks) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: file }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {}, { filename: file })((name) => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    throw Error(`Unmocked dependency: ${file} ${name}`);
  }, module, module.exports);
  return module.exports;
}
test('static data and details have no errors', () => assert.deepEqual(validate().errors, []));
test('95 visible contacts, 74 public and 21 organizations', () => {
  assert.equal(data.ALL_NUMBERS.length, 95); assert.equal(data.NUMBERS.length, 74); assert.equal(data.ORGANIZATION_CONTACTS.length, 21);
});
test('every correction matches the implementation', () => {
  for (const [id, change] of Object.entries({ ...manifest.public, ...manifest.organizations })) {
    const actual = data.getContactById(id); assert(actual, id);
    for (const [key, value] of Object.entries(change)) assert.deepEqual(plain(actual[key] ?? null), plain(value), `${id}.${key}`);
    assert.deepEqual(plain(data.getNumberDetail(id)), manifest.details[id], `${id} details`);
  }
});
test('removed items are absent from visible lists and details', () => {
  for (const id of manifest.remove) { assert(!data.ALL_NUMBERS.some((n) => n.id === id), id); assert(!Object.hasOwn(data.NUMBER_DETAILS, id), id); }
});
test('old favorite IDs resolve and deduplicate without changing storage keys', () => {
  assert.deepEqual(plain(data.normalizeFavoriteIds(['e13', 'e7', 'e12', 'c2', 'l6', 'e11', 'missing', null, 17])), ['e7', 'e2', 'c1', 'l11', 'e11', 'missing']);
  for (const invalid of [null, 4, {}, 'e13']) assert.deepEqual(plain(data.normalizeFavoriteIds(invalid)), []);
  for (const [old, canonical] of Object.entries(manifest.aliases)) { assert.equal(data.getContactById(old).id, canonical); assert.equal(data.getNumberById(old).id, canonical); assert.deepEqual(plain(data.getNumberDetail(old)), plain(data.getNumberDetail(canonical))); }
  assert.equal(data.getContactById('e11'), undefined); assert.equal(data.getContactById('h4'), undefined);
});
test('corrected numeric searches return only actual dialing values', () => {
  for (const [query, id] of [['1339', 'e4'], ['1394', 'l4'], ['1577-1389', 'f8'], ['1544-0049', 'c6'], ['02-735-8994', 'f4'], ['1350', 'w3']]) {
    const items = data.searchNumbers(data.ALL_NUMBERS, query); assert(items.some((n) => n.id === id), query);
    assert(items.every((n) => n.num.replace(/\D/g, '').includes(query.replace(/\D/g, ''))), query);
  }
  for (const query of ['1393', '1398', '1588-2100', '1670-1004', '1811-9000', '1644-8000']) assert.equal(data.searchNumbers(data.ALL_NUMBERS, query).length, 0, query);
});
test('1339 is not mapped to ER or pharmacy searches or emergency situations', () => {
  for (const query of ['응급실', '약국', '문 연 병원']) assert(!data.searchNumbers(data.ALL_NUMBERS, query).some((n) => n.id === 'e4'), query);
  for (const query of ['감염병', '예방접종', '질병관리청']) assert(data.searchNumbers(data.ALL_NUMBERS, query).some((n) => n.id === 'e4'), query);
  assert.deepEqual(plain(data.getContactById('e4').situation), []);
  assert.equal(data.searchNumbers(data.ALL_NUMBERS, 'zzzzzzzzz').length, 0);
});
test('specific searches stay on the contact that actually owns the word', () => {
  const ids = (query) => plain(data.searchNumbers(data.ALL_NUMBERS, query).map((item) => item.id));
  assert.deepEqual(ids('층간소음'), ['h2']);
  assert.deepEqual(ids('전기'), ['h5']);
  assert.deepEqual(ids('전세'), ['h3']);
  assert.deepEqual(ids('비자'), ['f5']);
  assert.deepEqual(ids('화재'), ['e2']);
  assert.deepEqual(ids('자살'), ['e7']);
  assert.deepEqual(ids('119'), ['e2', 'c4']);
  assert.deepEqual(ids('112'), ['e3', 'c3']);
  assert.deepEqual(ids('129'), ['e1']);
  assert.ok(ids('120').includes('g2'));
  assert.deepEqual(ids('해경'), ['e3', 'e2']);
  assert.ok(ids('사기').includes('l4'));
  assert.equal(ids('버스에서 물건을 놓고 내렸다')[0], 'c8');
  const crash = ids('차 사고 났음');
  const paraphrased = ids('자동차 박았어');
  for (const id of ['c3', 'c4', 'org-ins-samsung-auto']) {
    assert.ok(crash.includes(id), id);
    assert.ok(paraphrased.includes(id), id);
  }
  assert.ok(!crash.includes('h2') && !crash.includes('h5'));
  assert.ok(ids('차가 고장났어요').includes('c1'));
  assert.ok(!ids('차가 고장났어요').includes('h5'));
  assert.ok(ids('갑자기 아파요').includes('e2'));
  assert.ok(ids('차사고').includes('c3'));
  assert.deepEqual(ids('납치당함'), ['e3', 'e2']);
  assert.deepEqual(ids('맛집'), ['e3', 'e2']);
});
test('all categories, scopes and details remain usable', () => {
  for (const category of data.CATEGORIES.filter((c) => c.id !== 'all')) assert(data.ALL_NUMBERS.some((n) => n.cat === category.id), category.id);
  for (const item of data.ALL_NUMBERS) assert(data.getNumberDetail(item.id).length > 0, item.id);
  assert.match(data.getContactById('h6').title, /K-water/);
  assert.match(data.getContactById('org-ins-mg-auto').organization, /예별/);
});
test('four locale bundles have exactly the live contact IDs and no old advice', () => {
  const forbidden = /1393|1398|1588-2100|1670-1004|1544-0119|1899-0088|1544-0990|1811-9000|1644-8000/;
  for (const locale of ['ko', 'en', 'zh', 'ja']) {
    for (const name of ['numbers', 'details']) {
      const bundle = JSON.parse(fs.readFileSync(path.join(mobile, `i18n/locales/${locale}/${name}.json`), 'utf8'));
      assert.deepEqual(Object.keys(bundle).sort(), plain(data.ALL_NUMBERS.map((n) => n.id).sort()), `${locale}/${name}`);
      assert(!forbidden.test(JSON.stringify(bundle)), `${locale}/${name} old advice`);
    }
    for (const file of [path.join(mobile, `i18n/locales/${locale}/ui.json`), path.join(root, `src/i18n/locales/${locale}/web.json`)]) assert(!forbidden.test(fs.readFileSync(file, 'utf8')), file);
  }
});
const regional = load(path.join(mobile, 'utils/regionalDialing.ts'));
test('all 34 regional dial combinations need an explicit valid area', () => {
  for (const number of ['123', '128']) {
    assert(regional.requiresRegionalDialing(number));
    for (const area of regional.REGIONAL_AREA_CODES) assert.equal(regional.regionalTelHref(number, area.code), `tel:${area.code}${number}`);
    assert.equal(regional.regionalTelHref(number, ''), null); assert.equal(regional.regionalTelHref(number, '999'), null);
  }
  assert(!regional.requiresRegionalDialing('112')); assert.equal(regional.regionalTelHref('112', '02'), null);
});
test('actual mobile call handler never dials unprefixed 123/128 and preserves ordinary calls', () => {
  const calls = []; const requests = [];
  const handler = mockLoad(path.join(mobile, 'utils/phoneCall.ts'), {
    'react-native': { Linking: { openURL: (url) => { calls.push(url); return Promise.resolve(); } } },
    '@whatnumber/shared': data,
    './regionalDialing': regional,
  });
  const remove = handler.registerRegionalCallHandler((n) => requests.push(n));
  handler.callPhoneNumber('123'); handler.callPhoneNumber('128'); handler.callPhoneNumber('112');
  assert.deepEqual(requests, ['123', '128']); assert.deepEqual(calls, ['tel:112']);
  remove(); handler.callPhoneNumber('123'); assert.deepEqual(calls, ['tel:112']);
});
test('actual web call handler handles cancellation, valid region, invalid input and ordinary calls', () => {
  const file = path.join(root, 'src/lib/regionalCall.ts');
  let response; const alerts = []; let prevented = 0;
  const window = { prompt: () => response, alert: (v) => alerts.push(v), location: { href: '' } };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, { window })((name) => name === '@whatnumber/shared' ? data : regional, module, module.exports);
  const event = { stopPropagation() {}, preventDefault() { prevented++; } };
  const web = module.exports;
  response = null; web.handleRegionalCall(event, '123', 'ko'); assert.equal(window.location.href, '');
  response = '031'; web.handleRegionalCall(event, '123', 'ko'); assert.equal(window.location.href, 'tel:031123');
  window.location.href = ''; response = '999'; web.handleRegionalCall(event, '128', 'en'); assert.equal(window.location.href, ''); assert.equal(alerts.length, 1);
  const prior = prevented; web.handleRegionalCall(event, '112', 'ko'); assert.equal(prevented, prior); assert.equal(web.callHref('112'), 'tel:112');
  assert.equal(web.callHref('123'), '#choose-region');
});
function widgetSnapshot(platform, ids, locale, disabled = false) {
  let snapshot;
  const copy = JSON.parse(fs.readFileSync(path.join(mobile, `i18n/locales/${locale}/numbers.json`), 'utf8'));
  const mocks = {
    'react-native': { AppState: { addEventListener() {} } },
    'expo-constants': { __esModule: true, default: { executionEnvironment: disabled ? 'storeClient' : 'standalone', appOwnership: disabled ? 'expo' : 'standalone' }, ExecutionEnvironment: { StoreClient: 'storeClient' } },
    '@whatnumber/shared': data,
    '../../i18n': { localizeNumber: (n) => ({ ...n, ...copy[n.id] }) },
    '../../utils/regionalDialing': regional,
    '../../widgets/FavoritesWidget': { __esModule: true, default: { updateSnapshot: (v) => { snapshot = v.items; }, reload() {} } },
    'expo-widgets/build/ExpoWidgets': { __esModule: true, default: { reloadAllWidgets() {} } },
    '../../modules/android-favorite-widget/src': { syncAndroidFavoriteWidget: (v) => { snapshot = v; } },
  };
  const sync = mockLoad(path.join(mobile, `services/widget/syncFavoritesWidget.${platform}.ts`), mocks);
  sync.syncFavoritesWidget(ids, locale);
  return plain(snapshot ?? null);
}
test('actual iOS/Android snapshot code handles aliases, corrections, deletions and localization', () => {
  const input = ['e13', 'e7', 'e12', 'c2', 'l6', 'e11', 'h4', 'missing', 'h5', 'e14', 'f8', 'l4'];
  const expected = ['e7', 'e2', 'c1', 'l11', 'f8', 'l4'];
  for (const locale of ['ko', 'en', 'zh', 'ja']) {
    for (const platform of ['ios', 'android']) {
      const result = widgetSnapshot(platform, input, locale); assert.equal(result.length, 6);
      result.forEach((row, index) => { const n = data.getContactById(expected[index]); assert.equal(platform === 'ios' ? row.num : row.phone, n.num); if (platform === 'ios') assert.equal(row.tel, data.telWidgetHref(n.num)); else assert.equal(row.id, n.id); });
      assert.deepEqual(widgetSnapshot(platform, [], locale), []);
      assert.equal(widgetSnapshot(platform, input, locale, true), null);
    }
  }
});
test('new public contacts are unique, searchable and keep existing IDs', () => {
  const additions = require('../audit/additions.json');
  const ids = additions.items.map((n) => n.id);
  assert.deepEqual(plain(data.normalizeFavoriteIds([...ids, ...ids])), ids);
  for (const expected of additions.items) {
    const actual = data.getContactById(expected.id);
    assert.deepEqual(plain(actual), expected);
    assert.equal(data.ALL_NUMBERS.filter((n) => n.num === expected.num).length, 1);
    assert.deepEqual(plain(actual.situation), []);
    assert.deepEqual(plain(data.getNumberDetail(expected.id)), additions.locales.ko.details[expected.id]);
    assert.equal(data.searchNumbers(data.ALL_NUMBERS, expected.num)[0].id, expected.id);
    assert.equal(data.telHref(expected.num), 'tel:' + expected.num.replace(/-/g, ''));
    assert(!regional.requiresRegionalDialing(expected.num));
  }
  for (const [query, id] of [['군생활', 'e16'], ['군 고충', 'e16'], ['정신건강', 'f10'], ['심리상담', 'f10'], ['치매', 'f11'], ['기억력', 'f11'], ['도박', 'f12'], ['단도박', 'f12']]) {
    assert(data.searchNumbers(data.ALL_NUMBERS, query).some((n) => n.id === id), query);
  }
  assert.equal(data.getContactById('e7').num, '109');
  assert.notEqual(data.getContactById('f10').id, data.getContactById('e7').id);
  assert.match(data.getNumberDetail('f10').join(' '), /109/);
  assert.match(data.getNumberDetail('f11').join(' '), /07:00~22:00/);
  assert.match(data.getNumberDetail('f12').join(' '), /09:00~22:00/);
});
test('new contacts use real mobile dialing and localized widget snapshots on both platforms', () => {
  const additions = require('../audit/additions.json');
  const calls = [];
  const handler = mockLoad(path.join(mobile, 'utils/phoneCall.ts'), {
    'react-native': { Linking: { openURL: (url) => { calls.push(url); return Promise.resolve(); } } },
    '@whatnumber/shared': data, './regionalDialing': regional,
  });
  for (const n of additions.items) handler.callPhoneNumber(n.num);
  assert.deepEqual(calls, additions.items.map((n) => data.telHref(n.num)));
  for (const locale of ['ko', 'en', 'zh', 'ja']) {
    for (const name of ['numbers', 'details']) {
      const bundle = JSON.parse(fs.readFileSync(path.join(mobile, `i18n/locales/${locale}/${name}.json`), 'utf8'));
      for (const n of additions.items) assert.deepEqual(bundle[n.id], additions.locales[locale][name][n.id]);
    }
    for (const platform of ['ios', 'android']) {
      const rows = widgetSnapshot(platform, additions.items.map((n) => n.id), locale);
      assert.equal(rows.length, 4);
      rows.forEach((row, index) => {
        const n = additions.items[index];
        assert.equal(row.title, additions.locales[locale].numbers[n.id].title);
        assert.equal(platform === 'ios' ? row.num : row.phone, n.num);
        if (platform === 'ios') assert.equal(row.tel, data.telWidgetHref(n.num));
        else assert.equal(row.id, n.id);
      });
    }
  }
});
console.log(`\n${checks} offline regression groups passed. No real calls or official endpoint tests were made.`);
