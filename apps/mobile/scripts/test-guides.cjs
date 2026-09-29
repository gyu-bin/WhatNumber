// Run with a matching React 19.2.3 react-test-renderer runtime installed separately:
// GUIDE_TEST_RUNTIME=/path/to/runtime/node_modules node scripts/test-guides.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const runtime = process.env.GUIDE_TEST_RUNTIME;
const React = require(runtime ? path.join(runtime, 'react') : 'react');
const { create, act } = require(runtime ? path.join(runtime, 'react-test-renderer') : 'react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT = true;

function load(relative, imports, extra = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports, require: name => {
    assert.ok(name in imports, `Unexpected import: ${name}`);
    return imports[name];
  }, console, __DEV__: false, ...extra });
  return exports;
}

async function scenario(initial = {}, available = true, readFailure = false) {
  const values = new Map(Object.entries(initial));
  const writes = [];
  const storage = load('services/guides/guideStorage.ts', {
    '@react-native-async-storage/async-storage': { __esModule: true, default: {
      multiGet: async keys => { if (readFailure) throw Error('unavailable'); return keys.map(key => [key, values.get(key) ?? null]); },
      setItem: async (key, value) => { values.set(key, value); writes.push(key); },
    } },
  });
  const timers = new Map();
  let timerID = 0;
  const { useGuides } = load('hooks/useGuides.ts', { react: React, '../services/guides/guideStorage': storage }, {
    setTimeout: callback => { timers.set(++timerID, callback); return timerID; },
    clearTimeout: id => timers.delete(id),
  });
  let guide, root, emergencyCalls = 0;
  const enter = () => { emergencyCalls++; };
  function Harness() { guide = useGuides(available, enter); return null; }
  await act(async () => { root = create(React.createElement(Harness)); });
  const invoke = async (method, ...args) => {
    let result;
    await act(async () => { result = guide[method](...args); });
    return result;
  };
  const advance = async () => { await act(async () => {
    const pending = [...timers.values()]; timers.clear(); pending.forEach(callback => callback());
  }); };
  return { get guide() { return guide; }, values, writes, timers, keys: storage.GUIDE_KEYS, invoke, advance,
    get emergencyCalls() { return emergencyCalls; }, unmount: async () => act(() => root.unmount()) };
}

(async () => {
  const first = await scenario();
  assert.equal(first.guide.ready, true);
  assert.equal(first.guide.active, null, 'Hydration alone must not show a guide');
  await first.invoke('afterSplash');
  assert.equal(first.guide.active, 'firstLaunch');
  assert.equal(await first.invoke('favoriteAdded'), false, 'No context over onboarding');
  await first.invoke('openEmergency');
  assert.equal(first.emergencyCalls, 0);
  await first.invoke('close'); await first.advance();
  assert.equal(first.values.get(first.keys.onboarding), 'true');
  const saved = Object.fromEntries(first.values);
  await first.unmount();

  const existing = await scenario(saved);
  await existing.invoke('afterSplash');
  assert.equal(existing.guide.active, null, 'Completed onboarding stays hidden on restart');
  await existing.invoke('openManual', 'manual');
  assert.equal(existing.guide.active, 'manual');
  await existing.invoke('close'); await existing.advance();
  assert.equal(existing.writes.length, 0, 'Manual replay must not change flags');
  assert.equal(await existing.invoke('favoriteAdded'), true);
  assert.equal(existing.guide.active, null, 'Wait for favorite feedback before intro');
  assert.equal(existing.guide.transitioning, true);
  assert.equal(await existing.invoke('favoriteAdded'), false, 'Rapid adds cannot enqueue two guides');
  await existing.advance();
  assert.equal(existing.guide.active, 'widgetIntro');
  await existing.invoke('showWidgetHowTo'); await existing.invoke('showWidgetHowTo');
  assert.equal(existing.timers.size, 1);
  await existing.advance(); assert.equal(existing.guide.active, 'widgetHowTo');
  await existing.invoke('close'); await existing.advance();
  assert.equal(await existing.invoke('favoriteAdded'), false);
  await existing.invoke('openEmergency');
  assert.equal(existing.guide.active, 'emergency'); assert.equal(existing.emergencyCalls, 0);
  await existing.invoke('close'); await existing.advance();
  assert.equal(existing.emergencyCalls, 0, 'Cancel never starts permission flow');
  await existing.invoke('openEmergency');
  assert.equal(existing.emergencyCalls, 1, 'Next entry uses original finder flow');
  await existing.unmount();

  const accept = await scenario(saved);
  await accept.invoke('afterSplash'); await accept.invoke('openEmergency');
  await accept.invoke('continueEmergency'); await accept.invoke('continueEmergency');
  assert.equal(accept.emergencyCalls, 0, 'Wait for modal dismissal before finder mount');
  await accept.advance(); assert.equal(accept.emergencyCalls, 1);
  await accept.unmount();

  const unavailable = await scenario(saved, false);
  await unavailable.invoke('afterSplash');
  assert.equal(await unavailable.invoke('favoriteAdded'), false);
  await unavailable.invoke('openManual', 'widgetHowTo'); assert.equal(unavailable.guide.active, null);
  await unavailable.unmount();

  const cancelled = await scenario(saved);
  await cancelled.invoke('afterSplash'); await cancelled.invoke('favoriteAdded');
  await cancelled.unmount(); assert.equal(cancelled.timers.size, 0, 'Unmount cancels delayed presentation');

  const failedRead = await scenario({}, true, true);
  await failedRead.invoke('afterSplash'); assert.equal(failedRead.guide.active, null);
  await failedRead.unmount();
  console.log('PASS: hydration, splash ordering, completion/restart, manual replay, first add, deduplication, widget availability, emergency cancel/continue, cleanup, storage read failure');
})().catch(error => { console.error(error); process.exitCode = 1; });
