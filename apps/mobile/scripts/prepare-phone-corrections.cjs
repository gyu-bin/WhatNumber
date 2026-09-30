/* Creates a reviewable patch from the audited correction manifest; never writes source files. */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { load, root, shared } = require('./validate-phone-data.cjs');
const manifestFile = process.argv[2];
if (!manifestFile) throw Error('Usage: node scripts/prepare-phone-corrections.cjs audit/corrections.json');
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const changes = new Map();
function get(file) { return changes.get(file)?.next ?? fs.readFileSync(file, 'utf8'); }
function set(file, next) {
  const previous = changes.get(file)?.previous ?? fs.readFileSync(file, 'utf8');
  changes.set(file, { previous, next });
}
function replaceDeclarationArray(file, name, edits, removals) {
  const original = get(file);
  const source = ts.createSourceFile(file, original, ts.ScriptTarget.Latest, true);
  const nodes = [];
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === name && node.initializer && ts.isArrayLiteralExpression(node.initializer)) nodes.push(...node.initializer.elements);
    ts.forEachChild(node, visit);
  }
  visit(source);
  const replacements = [];
  const data = load(file)[name];
  for (const node of nodes) {
    if (!ts.isObjectLiteralExpression(node)) throw Error(`Unexpected ${name} entry`);
    const idNode = node.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText(source) === 'id');
    const id = idNode.initializer.text;
    if (!edits[id] && !removals.includes(id)) continue;
    const current = data.find((item) => item.id === id);
    if (edits[id]?.id && edits[id].id !== id) throw Error(`ID change forbidden: ${id}`);
    const updated = { ...current, ...edits[id] };
    for (const key of Object.keys(updated)) if (updated[key] === null) delete updated[key];
    let end = node.end;
    if (original[end] === ',') end++;
    replacements.push({ start: node.getStart(source), end, text: removals.includes(id) ? '' : JSON.stringify(updated, null, 2).replace(/\n/g, '\n  ') + ',' });
  }
  for (const id of Object.keys(edits)) if (!data.some((item) => item.id === id)) throw Error(`Unknown correction ID: ${id}`);
  let next = original;
  for (const r of replacements.sort((a, b) => b.start - a.start)) next = next.slice(0, r.start) + r.text + next.slice(r.end);
  set(file, next);
}
replaceDeclarationArray(path.join(shared, 'numbers.ts'), 'NUMBERS', manifest.public, manifest.remove ?? []);
replaceDeclarationArray(path.join(shared, 'organizationContacts.ts'), 'ORGANIZATION_CONTACTS', manifest.organizations, manifest.remove ?? []);

const detailsFile = path.join(shared, 'numberDetails.ts');
const details = { ...load(detailsFile).NUMBER_DETAILS, ...manifest.details };
for (const id of manifest.remove ?? []) delete details[id];
const detailsOriginal = get(detailsFile);
const start = detailsOriginal.indexOf('export const NUMBER_DETAILS: Record<string, string[]> = ');
const end = detailsOriginal.indexOf('\n\nexport function getNumberDetail', start);
if (start < 0 || end < 0) throw Error('Details declaration not found');
set(detailsFile, detailsOriginal.slice(0, start) + 'export const NUMBER_DETAILS: Record<string, string[]> = ' + JSON.stringify(details, null, 2) + ';' + detailsOriginal.slice(end));

for (const [relative, edits] of Object.entries(manifest.textFiles ?? {})) {
  const file = path.join(root, relative);
  let next = get(file);
  for (const { before, after } of edits) {
    if (!next.includes(before)) throw Error(`Missing expected text in ${relative}: ${before}`);
    next = next.split(before).join(after);
  }
  set(file, next);
}

for (const [relative, updates] of Object.entries(manifest.jsonFiles ?? {})) {
  const file = path.join(root, relative);
  const content = JSON.parse(get(file));
  for (const [key, value] of Object.entries(updates)) {
    const parts = key.split('.');
    let parent = content;
    for (const part of parts.slice(0, -1)) {
      if (!(part in parent)) throw Error(`Unknown JSON path: ${relative} ${key}`);
      parent = parent[part];
    }
    if (value === null) delete parent[parts.at(-1)];
    else parent[parts.at(-1)] = value;
  }
  set(file, `${JSON.stringify(content, null, 2)}\n`);
}

const patch = ['*** Begin Patch'];
for (const [file, { previous, next }] of changes) {
  if (next === previous) continue;
  patch.push(`*** Update File: ${file}`, '@@', ...previous.trimEnd().split('\n').map((l) => `-${l}`), ...next.trimEnd().split('\n').map((l) => `+${l}`));
}
patch.push('*** End Patch');
console.log(JSON.stringify({ patch: patch.join('\n'), files: [...changes.keys()], corrections: Object.keys(manifest.public).length + Object.keys(manifest.organizations).length, removed: manifest.remove }));
