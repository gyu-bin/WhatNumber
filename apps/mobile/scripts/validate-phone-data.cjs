/* Static data checks only. Official service availability requires a human audit. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '../../..');
const shared = path.join(root, 'packages/shared/src');
const cache = new Map();

function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: file,
  }).outputText;
  const localRequire = (name) => {
    if (name === '@whatnumber/shared') return load(path.join(shared, 'index.ts'));
    if (name.startsWith('.')) {
      const target = path.resolve(path.dirname(file), name);
      return load(target.endsWith('.ts') ? target : `${target}.ts`);
    }
    return require(name);
  };
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {}, { filename: file })(localRequire, module, module.exports);
  return module.exports;
}

function validate() {
  const data = load(path.join(shared, 'index.ts'));
  const errors = [];
  const warnings = [];
  const ids = new Set();
  const exact = new Set();
  const categories = new Set(data.CATEGORIES.map((c) => c.id).filter((id) => id !== 'all'));
  const situations = new Set(Object.keys(data.SITUATION_LABELS));
  const groups = new Map();
  for (const item of data.ALL_NUMBERS) {
    if (!item.id || ids.has(item.id)) errors.push(`duplicate/empty id: ${item.id}`);
    ids.add(item.id);
    if (!item.title?.trim()) errors.push(`empty title: ${item.id}`);
    if (!item.desc?.trim()) errors.push(`empty description: ${item.id}`);
    if (!/^(?:\+?\d{1,4}-)?\d{2,4}(?:-\d{3,4}){0,2}$/.test(item.num ?? '')) errors.push(`malformed number: ${item.id} ${item.num}`);
    if (!categories.has(item.cat)) errors.push(`unknown category: ${item.id} ${item.cat}`);
    for (const situation of item.situation ?? []) {
      if (!situations.has(situation)) errors.push(`unknown situation: ${item.id} ${situation}`);
    }
    const key = `${item.num}|${item.title}|${item.desc}`;
    if (exact.has(key)) errors.push(`duplicate exact entry: ${item.id}`);
    exact.add(key);
    const digits = item.num.replace(/\D/g, '');
    groups.set(digits, [...(groups.get(digits) ?? []), { id: item.id, title: item.title }]);
    if (data.telHref(item.num) !== `tel:${digits}` || data.telWidgetHref(item.num) !== `tel://${digits}`) errors.push(`dialing mismatch: ${item.id}`);
    if (!data.getNumberDetail(item.id).length) warnings.push(`detail missing: ${item.id}`);
  }
  for (const id of Object.keys(data.NUMBER_DETAILS)) {
    if (!ids.has(id)) errors.push(`orphan detail: ${id}`);
  }
  const organizationKeys = new Set();
  for (const item of data.ORGANIZATION_CONTACTS) {
    const key = `${item.organization}|${item.purpose}|${item.num}`;
    if (organizationKeys.has(key)) errors.push(`duplicate organization contact: ${item.id}`);
    organizationKeys.add(key);
    if (!/^https:\/\//.test(item.source ?? '')) errors.push(`missing official source URL: ${item.id}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.verifiedAt ?? '')) errors.push(`invalid verifiedAt: ${item.id}`);
  }
  for (const locale of ['ko', 'en', 'zh', 'ja']) {
    const base = path.join(root, 'apps/mobile/i18n/locales', locale);
    for (const name of ['numbers', 'details']) {
      const bundle = JSON.parse(fs.readFileSync(path.join(base, `${name}.json`), 'utf8'));
      for (const id of Object.keys(bundle)) if (!ids.has(id)) warnings.push(`${locale} orphan ${name} translation: ${id}`);
      for (const item of data.ALL_NUMBERS) {
        if (name === 'numbers' && !bundle[item.id]) warnings.push(`${locale} missing number translation: ${item.id}`);
        if (name === 'details' && data.NUMBER_DETAILS[item.id] && !bundle[item.id]?.length) warnings.push(`${locale} missing detail translation: ${item.id}`);
      }
    }
  }
  return {
    total: data.ALL_NUMBERS.length,
    public: data.NUMBERS.length,
    organizations: data.ORGANIZATION_CONTACTS.length,
    errors, warnings,
    duplicateCandidates: [...groups.entries()].filter(([, items]) => items.length > 1).map(([number, items]) => ({ number, items })),
  };
}

if (require.main === module) {
  const result = validate();
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.errors.length ? 1 : 0;
}
module.exports = { load, validate, root, shared };
