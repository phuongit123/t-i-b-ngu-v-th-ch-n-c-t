import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_ORIGIN = 'https://affinityacademy.vn';
const CURRICULUM_TRACKS = ['designer', 'photo', 'publisher', 'scripting'];

function toVietnameseSlug(text) {
  return String(text || '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function loadTranslationsVi() {
  const source = fs.readFileSync(
    path.join(ROOT, 'src', 'data', 'curriculum', 'translationsVi.ts'),
    'utf8'
  );
  const marker = 'export const lessonTranslationsVi: Record<string, string> = {';
  const start = source.indexOf(marker);
  if (start < 0) return {};
  const bodyStart = start + marker.length;
  const end = source.indexOf('};', bodyStart);
  const body = source.slice(bodyStart, end > bodyStart ? end : undefined);
  const map = {};
  for (const m of body.matchAll(/^\s*'([^']+)'\s*:\s*'([^']*)'\s*,?\s*$/gm)) {
    map[m[1]] = m[2];
  }
  return map;
}

function collectLessonRoutes(translationsMap) {
  const routes = [];
  for (const track of CURRICULUM_TRACKS) {
    const trackDir = path.join(ROOT, 'curriculum', track);
    if (!fs.existsSync(trackDir)) continue;
    const modules = fs
      .readdirSync(trackDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();

    for (const modName of modules) {
      const modDir = path.join(trackDir, modName);
      const files = fs
        .readdirSync(modDir)
        .filter((f) => /^[DPBS]\d{2}-\d{2}\.json$/i.test(f))
        .sort();

      for (const file of files) {
        const lesson = JSON.parse(fs.readFileSync(path.join(modDir, file), 'utf8'));
        const id = lesson.id;
        const titleVi = translationsMap[id] || lesson.title || id;
        const slug = toVietnameseSlug(titleVi);
        const urlPath = slug
          ? `/bai-hoc/${id.toLowerCase()}-${slug}`
          : `/bai-hoc/${id.toLowerCase()}`;
        routes.push({
          loc: `${SITE_ORIGIN}${urlPath}`,
          changefreq: 'monthly',
          priority: '0.8',
        });
      }
    }
  }
  return routes;
}

const staticRoutes = [
  { loc: `${SITE_ORIGIN}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${SITE_ORIGIN}/lo-trinh`, changefreq: 'weekly', priority: '0.9' },
  { loc: `${SITE_ORIGIN}/lo-trinh/bat-dau`, changefreq: 'weekly', priority: '0.9' },
  { loc: `${SITE_ORIGIN}/lo-trinh/vector-studio`, changefreq: 'weekly', priority: '0.9' },
  { loc: `${SITE_ORIGIN}/lo-trinh/pixel-studio`, changefreq: 'weekly', priority: '0.9' },
  { loc: `${SITE_ORIGIN}/lo-trinh/layout-studio`, changefreq: 'weekly', priority: '0.85' },
  { loc: `${SITE_ORIGIN}/lo-trinh/tu-dong-hoa`, changefreq: 'weekly', priority: '0.85' },
  { loc: `${SITE_ORIGIN}/phong-mo-phong`, changefreq: 'weekly', priority: '0.9' },
  { loc: `${SITE_ORIGIN}/thu-thach`, changefreq: 'weekly', priority: '0.85' },
  { loc: `${SITE_ORIGIN}/tri-thuc`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${SITE_ORIGIN}/tri-thuc/phim-tat`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${SITE_ORIGIN}/tri-thuc/tom-tat`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${SITE_ORIGIN}/tri-thuc/tu-dien-thuat-ngu`, changefreq: 'monthly', priority: '0.85' },
  { loc: `${SITE_ORIGIN}/tai-nguyen`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${SITE_ORIGIN}/thuc-hanh-tu-dong-hoa`, changefreq: 'weekly', priority: '0.85' },
  { loc: `${SITE_ORIGIN}/bach-khoa-api`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${SITE_ORIGIN}/do-an-tot-nghiep`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${SITE_ORIGIN}/ho-so-hoc-tap`, changefreq: 'monthly', priority: '0.6' },
  { loc: `${SITE_ORIGIN}/he-thong-thiet-ke`, changefreq: 'monthly', priority: '0.5' },
];

const translations = loadTranslationsVi();
const lessonRoutes = collectLessonRoutes(translations);
const allUrls = [...staticRoutes, ...lessonRoutes];
const today = new Date().toISOString().slice(0, 10);

const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...allUrls.map(
    (entry) =>
      `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
  ),
  '</urlset>',
  '',
];

const robotsTxt = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /cai-dat',
  '',
  `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
  '',
].join('\n');

const aliases = [
  'home', 'catalog', 'simulator', 'sandbox', 'challenges', 'knowledge', 'search', 'shortcuts', 'cheatsheet',
  'glossary', 'resources', 'playground', 'encyclopedia', 'dashboard', 'settings', 'capstone', 'design-system',
  'preview', 'reset-password', 'lo-trinh/designer', 'lo-trinh/photo', 'lo-trinh/publisher', 'lo-trinh/scripting',
  'bai-hoc/p05-01-nguyen-ly-can-chinh-mau-sac-bieu-do-histogram-va-curves',
  // Previous canonical paths continue to resolve after lesson titles are corrected.
  'bai-hoc/d01-01-cau-truc-giao-dien-designer-va-chuyen-doi-persona',
  'bai-hoc/d02-01-cac-che-do-pen-tool-va-co-che-tay-cam-bezier',
  'bai-hoc/d05-01-phan-cap-layers-studio-nhom-va-gan-mau-doi-tuong',
  'bai-hoc/d09-01-pixel-persona-va-dong-luc-co-raster-trong-designer',
  'bai-hoc/d10-01-export-persona-va-cau-truc-slices',
  'bai-hoc/p01-01-giao-dien-photo-thanh-cong-cu-va-cac-bang-studio',
  'bai-hoc/p01-02-raw-develop-persona-va-quy-trinh-mau-hdr-32-bit',
  'bai-hoc/p04-02-clone-stamp-healing-brush-va-nguyen-ly-phuc-che',
  'bai-hoc/p10-01-export-persona-slices-da-dinh-dang-1x-2x-3x-va-continuous-export',
].map(route => '/' + route);
const validRoutes = new Set([
  ...aliases, ...allUrls.map(entry => new URL(entry.loc).pathname),
  ...lessonRoutes.map(entry => new URL(entry.loc).pathname.slice(0, '/bai-hoc/d00-00'.length)),
]);
const netlifyRedirects = [...validRoutes].map(route => route + ' /index.html 200').join('\n') + '\n';

const publicDir = path.join(ROOT, 'public');
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xmlLines.join('\n'), 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
fs.writeFileSync(path.join(publicDir, '_redirects'), netlifyRedirects, 'utf8');

console.log(
  `[SEO] Generated public/sitemap.xml (${allUrls.length} URLs: ${staticRoutes.length} core + ${lessonRoutes.length} lessons), public/robots.txt, and public/_redirects.`
);
