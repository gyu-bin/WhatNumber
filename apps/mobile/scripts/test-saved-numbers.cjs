// GUIDE_TEST_RUNTIME=/path/to/react19-runtime/node_modules node scripts/test-saved-numbers.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const runtime = process.env.GUIDE_TEST_RUNTIME;
const React = require(runtime ? path.join(runtime, 'react') : 'react');
const { create, act } = require(runtime ? path.join(runtime, 'react-test-renderer') : 'react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT = true;
function load(file, imports) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, require: name => { assert.ok(name in imports, name); return imports[name]; }, console });
  return exports;
}
const service = load('services/favorites/savedNumbers.ts', {});
const { telHref, telWidgetHref } = load('../../packages/shared/src/numbers.ts', {});
const plain = value => JSON.parse(JSON.stringify(value));
async function setup(values = new Map(), readFail = false) {
  let fail = false, result, root;
  const { useFavorites } = load('hooks/useFavorites.ts', {
    react: React, '../services/favorites/savedNumbers': service,
    '@react-native-async-storage/async-storage': { __esModule: true, default: {
      multiGet: async keys => { if (readFail) throw Error('read'); return keys.map(key => [key, values.get(key) ?? null]); },
      setItem: async (key, value) => { if (fail) throw Error('write'); values.set(key, value); },
    } },
  });
  function Harness() { result = useFavorites(); return null; }
  await act(async () => { root = create(React.createElement(Harness)); });
  return { get result() { return result; }, values, failWrites: () => { fail = true; },
    call: async (name, ...args) => { let value; await act(async () => { value = await result[name](...args); }); return value; },
    close: async () => act(() => root.unmount()) };
}
(async () => {
  for (const num of ['tel:119', '123;456', '*123#', '+12', '1234567890123456']) assert.throws(() => service.makeCustomNumber({ title: 'Home', num }, 'custom:a'));
  assert.throws(() => service.makeCustomNumber({ title: ' ', num: '119' }, 'custom:a'));
  const state = await setup(new Map([['favorites_v1', '["e3","e2"]']]));
  assert.deepEqual(plain(state.result.favorites), ['e3', 'e2']);
  const item = await state.call('saveCustom', { title: '우리집', num: '+82 (10) 1234-5678', icon: '🏠' });
  assert.equal(item.num, '+821012345678');
  assert.match(telHref(item.num), /^tel:\+821012345678$/);
  assert.equal(telWidgetHref(item.num), 'tel://+821012345678');
  assert.deepEqual(plain(state.result.favorites), ['e3', 'e2', item.id]);
  await state.call('saveCustom', { title: '가족', num: '010-1111-2222' }, item.id);
  assert.equal(state.result.customNumbers[0].title, '가족');
  await act(async () => { await Promise.all([state.result.toggle('e4'), state.result.toggle('e5')]); });
  assert.equal(state.result.favorites.length, 5, 'Concurrent updates retain all IDs');
  await state.call('reorder', [item.id, 'e2', 'invalid', 'e2']);
  assert.deepEqual(plain(state.result.favorites), [item.id, 'e2', 'e3', 'e4', 'e5']);
  const restarted = await setup(state.values);
  assert.equal(restarted.result.customNumbers[0].num, '01011112222');
  await restarted.call('removeCustom', item.id);
  assert.equal(restarted.result.customNumbers.length, 0);
  assert.equal(restarted.result.favorites.includes(item.id), false);
  assert.deepEqual(JSON.parse(state.values.get('favorites_v1')), plain(restarted.result.favorites));
  restarted.failWrites();
  await assert.rejects(restarted.call('saveCustom', { title: '회사', num: '123-4567' }));
  assert.equal(restarted.result.customNumbers.length, 0, 'Failure must not publish unsaved widget/UI data');
  const broken = await setup(new Map(), true);
  await assert.rejects(broken.call('saveCustom', { title: '회사', num: '123-4567' }));
  assert.equal(broken.values.size, 0, 'Read failure must not overwrite existing data');
  for (const os of ['ios', 'android']) {
    let snapshot;
    const nativeWidget = { updateSnapshot: props => { snapshot = props.items; }, reload() {} };
    const widget = load(`services/widget/syncFavoritesWidget.${os}.ts`, {
      'react-native': { AppState: { addEventListener() {} } },
      'expo-constants': { __esModule: true, default: { executionEnvironment: 'bare' }, ExecutionEnvironment: { StoreClient: 'store' } },
      '@whatnumber/shared': { ALL_NUMBERS: [{ id: 'e2', title: 'Fire', num: '119', icon: '🔥', cat: '긴급/안전' }], telWidgetHref },
      '../../i18n': { localizeNumber: number => ({ ...number, title: 'Localized public number' }) },
      '../../widgets/FavoritesWidget': { default: nativeWidget },
      'expo-widgets/build/ExpoWidgets': { default: { reloadAllWidgets() {} } },
      '../../modules/android-favorite-widget/src': { syncAndroidFavoriteWidget: items => { snapshot = items; } },
    });
    widget.syncFavoritesWidget([item.id, 'e2'], 'en', [item]);
    assert.equal(snapshot.length, 2);
    assert.equal(snapshot[0].title, '우리집', `${os}: custom title must remain unchanged by locale`);
    if (os === 'ios') assert.equal(snapshot[0].tel, 'tel://+821012345678');
    else assert.equal(snapshot[0].phone, '+821012345678');
    assert.equal(snapshot[1].title, 'Localized public number');
    widget.syncFavoritesWidget(['e2'], 'ko', []);
    assert.equal(snapshot.length, 1, `${os}: deleting a number removes it from snapshot`);
  }
  await Promise.all([state.close(), restarted.close(), broken.close()]);
  console.log('PASS saved numbers: validation, migration, persistence, edit/delete, ordering, concurrent updates, storage failures, iOS/Android widget snapshots');
})().catch(error => { console.error(error); process.exitCode = 1; });
