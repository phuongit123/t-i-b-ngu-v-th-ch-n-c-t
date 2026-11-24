import fs from 'node:fs';
import path from 'node:path';

function walkFiles(dir, extFilter) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath, extFilter));
    } else if (extFilter(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function stripBlockComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, (match) =>
    match
      .split(/\r?\n/)
      .map(() => '')
      .join('\n')
  );
}

const violations = [];

// 1. UI / Backend Leak & English Copy Checks across src/**/*.{ts,tsx}
const srcFiles = walkFiles(path.resolve('src'), (name) => /\.(ts|tsx)$/.test(name));
const uiLeakRules = [
  { name: 'Internal group badge label (NHÓM ...)', re: /NHÓM\s+(PRACTICE|KNOWLEDGE|DASHBOARD|EXISTING)/i },
  {
    name: 'Offline Test / Role Switcher / 503 debug leak',
    re: /Offline Test|Chuyển vai trò|Giả lập lỗi|Simulate 503|503 Service Unavailable/i,
  },
  {
    name: 'Internal governance ID exposed in UI source',
    re: /\bTASK-\d{3}\b|\bREQ-(SYS|CURR|FE|BE|MCP|QA|OPS|PAGE|LEARN)-\d{3}\b/,
  },
  { name: 'Dead MCP header status pill', re: /MCP:\s*(NGOẠI TUYẾN|OFFLINE|ONLINE)/i },
  { name: 'Deleted Interia furniture asset reference', re: /\/assets\/interia\//i },
  { name: 'Hidden sr-only test-hack class', re: /\bsr-only\b/ },
  {
    name: 'Residual English marketing/navigation copy',
    re: /Explore 40 Modules|120 Slide Lessons|Design Mastery Meets|Black Conceals, White Reveals|Course Catalog|Student Dashboard/,
  },
];

for (const file of srcFiles) {
  const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/');
  const raw = fs.readFileSync(file, 'utf8');
  const lines = stripBlockComments(raw).split(/\r?\n/);

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    for (const rule of uiLeakRules) {
      if (rule.re.test(line)) {
        violations.push(`[UI-LEAK] ${rule.name} in ${relPath}:${idx + 1} -> ${trimmed.slice(0, 120)}`);
      }
    }
  });
}

// 2. Raw LaTeX Dollar Math Check across src/data/**/*.ts and curriculum/**/*.json
const dataFiles = [
  ...walkFiles(path.resolve('src/data'), (name) => /\.ts$/.test(name)),
  ...walkFiles(path.resolve('curriculum'), (name) => /\.json$/.test(name)),
];
const rawLatexRegex = /\$[0-9A-Za-z\\^_%]+\$/;

for (const file of dataFiles) {
  const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/');
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    if (rawLatexRegex.test(line)) {
      violations.push(`[LATEX] Raw LaTeX token in ${relPath}:${idx + 1} -> ${trimmed.slice(0, 120)}`);
    }
  });
}

// 3. Technical SEO & HTML Integrity Check
const indexHtmlPath = path.resolve('index.html');
if (!fs.existsSync(indexHtmlPath)) {
  violations.push('[SEO] Missing index.html');
} else {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  if (!/<html[^>]*\blang=["']vi["']/i.test(html)) {
    violations.push('[SEO] index.html missing <html lang="vi">');
  }
  if (!/rel=["']canonical["']/i.test(html)) {
    violations.push('[SEO] index.html missing rel="canonical"');
  }
  if (!/property=["']og:locale["'][^>]*content=["']vi_VN["']/i.test(html)) {
    violations.push('[SEO] index.html missing property="og:locale" content="vi_VN"');
  }
  if (!/id=["']academy-jsonld["']/i.test(html)) {
    violations.push('[SEO] index.html missing id="academy-jsonld"');
  }
}

const sitemapPath = path.resolve('public/sitemap.xml');
let sitemapUrlCount = 0;
let sitemapLessonCount = 0;
let sitemapRoutes = [];
if (!fs.existsSync(sitemapPath)) {
  violations.push('[SEO] Missing public/sitemap.xml');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  sitemapRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
  const urlMatches = sitemap.match(/<url>/g) || [];
  const lessonMatches = sitemap.match(/<loc>[^<]*\/bai-hoc\/[^<]+<\/loc>/g) || [];
  sitemapUrlCount = urlMatches.length;
  sitemapLessonCount = lessonMatches.length;
  if (sitemapUrlCount !== 85) {
    violations.push(`[SEO] public/sitemap.xml expected 85 <url> entries, found ${sitemapUrlCount}`);
  }
  if (sitemapLessonCount !== 66) {
    violations.push(
      `[SEO] public/sitemap.xml expected 66 /bai-hoc/ entries, found ${sitemapLessonCount}`
    );
  }
}

const robotsPath = path.resolve('public/robots.txt');
if (!fs.existsSync(robotsPath)) {
  violations.push('[SEO] Missing public/robots.txt');
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!/^Sitemap:/im.test(robots)) {
    violations.push('[SEO] public/robots.txt missing Sitemap directive');
  }
}

const redirectsPath = path.resolve('public/_redirects');
if (!fs.existsSync(redirectsPath)) {
  violations.push('[SEO] Missing public/_redirects');
} else {
  const redirects = fs.readFileSync(redirectsPath, 'utf8');
  const rules = redirects.split(/\r?\n/).filter(Boolean).map(line => line.trim().split(/\s+/));
  const validRoutes = new Set(rules.filter(([, file, status]) => file === '/index.html' && status === '200').map(([route]) => route));
  const missing = [...sitemapRoutes, '/reset-password'].filter(route => !validRoutes.has(route));
  if (missing.length) violations.push('[SEO] Missing SPA routes: ' + missing.join(', '));
  if (validRoutes.has('/*')) violations.push('[SEO] A catch-all 200 hides missing routes.');
  if (!fs.existsSync('public/404.html')) violations.push('[SEO] Missing public/404.html');
}

if (violations.length > 0) {
  console.error(`\n[UI & Localization Audit FAILED] ${violations.length} violation(s) found:`);
  for (const v of violations) {
    console.error(`  - ${v}`);
  }
  process.exit(1);
}

console.log(
  `[UI & Localization Audit PASSED] Scanned ${srcFiles.length} src files, ${dataFiles.length} data/curriculum files, sitemap (${sitemapUrlCount} URLs / ${sitemapLessonCount} lessons) — 0 violations.`
);
