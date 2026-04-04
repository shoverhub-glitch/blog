import fs from 'node:fs';
import path from 'node:path';

const distRoot = path.resolve('dist');
const assetsDir = path.join(distRoot, 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('Performance budget check failed: dist/assets not found. Run `npm run build` first.');
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);

const findSingle = (prefixes) => {
  for (const prefix of prefixes) {
    const match = files.find((file) => file.startsWith(prefix) && file.endsWith('.js'));
    if (match) return match;
  }
  return null;
};

const readSize = (fileName) => fs.statSync(path.join(assetsDir, fileName)).size;

const budgetRules = [
  {
    name: 'app entry chunk',
    file: findSingle(['index-']),
    maxBytes: 180 * 1024,
  },
  {
    name: 'react vendor chunk',
    file: findSingle(['vendor-react-']),
    maxBytes: 300 * 1024,
  },
  {
    name: 'supabase vendor chunk',
    file: findSingle(['vendor-supabase-']),
    maxBytes: 260 * 1024,
  },
];

const pretty = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

let hasFailure = false;

for (const rule of budgetRules) {
  if (!rule.file) {
    console.warn(`Skipping ${rule.name}: chunk not present.`);
    continue;
  }

  const size = readSize(rule.file);
  const ok = size <= rule.maxBytes;
  const status = ok ? 'OK' : 'FAIL';

  console.log(`${status}: ${rule.name} (${rule.file}) = ${pretty(size)} / limit ${pretty(rule.maxBytes)}`);

  if (!ok) {
    hasFailure = true;
  }
}

if (hasFailure) {
  console.error('Performance budget exceeded. Reduce bundle size or adjust budget thresholds intentionally.');
  process.exit(1);
}

console.log('Performance budget check passed.');
