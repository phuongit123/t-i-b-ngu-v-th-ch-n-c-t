import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const curriculumRoots = ['designer', 'photo', 'publisher', 'scripting'];
const lessonIds = [];

function collectLessons(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectLessons(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      const lesson = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      if (typeof lesson?.id === 'string' && /^[DPBS]\d{2}-\d{2}$/.test(lesson.id)) {
        lessonIds.push(lesson.id);
      }
    }
  }
}

for (const track of curriculumRoots) {
  const directory = path.join(root, 'curriculum', track);
  if (fs.existsSync(directory)) collectLessons(directory);
}

const source = fs.readFileSync(
  path.join(root, 'src', 'data', 'curriculum', 'translationsVi.ts'),
  'utf8'
);
const marker = 'export const lessonTranslationsVi: Record<string, string> = {';
const start = source.indexOf(marker);
if (start < 0) throw new Error('lessonTranslationsVi map not found.');

const bodyStart = start + marker.length;
const end = source.indexOf('};', bodyStart);
if (end < 0) throw new Error('lessonTranslationsVi map is not closed.');

const body = source.slice(bodyStart, end);
const entries = [...body.matchAll(/^\s*'([^']+)'\s*:\s*'([^']*)'\s*,?\s*$/gm)];
const translationKeys = entries.map((match) => match[1]);
const duplicates = translationKeys.filter((key, index) => translationKeys.indexOf(key) !== index);
const uniqueKeys = [...new Set(translationKeys)];
const uniqueLessonIds = [...new Set(lessonIds)];
const missing = uniqueLessonIds.filter((id) => !uniqueKeys.includes(id));
const extra = uniqueKeys.filter((id) => !uniqueLessonIds.includes(id));
const empty = entries.filter((match) => !match[2].trim()).map((match) => match[1]);

if (missing.length || extra.length || duplicates.length || empty.length) {
  console.error('Vietnamese translation coverage FAILED.');
  if (missing.length) console.error('Missing lesson translations:', missing.join(', '));
  if (extra.length) console.error('Unknown lesson translation keys:', extra.join(', '));
  if (duplicates.length) console.error('Duplicate translation keys:', duplicates.join(', '));
  if (empty.length) console.error('Empty translations:', empty.join(', '));
  process.exit(1);
}

console.log('Vietnamese lesson translations: ' + uniqueKeys.length + '/' + uniqueLessonIds.length + ' unique lesson IDs mapped; 0 missing, 0 extra, 0 duplicates.');
