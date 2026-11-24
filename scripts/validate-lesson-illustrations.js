import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const curriculum = join(root, 'curriculum');
const images = join(root, 'public/assets/lessons/steps');
const manifest = JSON.parse(readFileSync(join(curriculum, 'lesson-illustrations.json'), 'utf8'));
const plannedLessons = new Set(Object.keys(manifest));
function validateEntries(lessonId, entries, steps) {
  if (!Array.isArray(entries) || entries.length < 4 || entries.length !== steps.length) {
    throw new Error(`${lessonId}: every procedure step requires an illustration, with at least four per lesson.`);
  }
  const fingerprints = new Set();
  for (const [index, illustration] of entries.entries()) {
    const { step, tool, before, after, lookFor } = illustration;
    if (step !== steps[index] || !tool?.trim() || !lookFor?.trim()
      || !before?.label?.trim() || !after?.label?.trim() || !before.scene || !after.scene || before.scene === after.scene) {
      throw new Error(`${lessonId}: invalid illustration for procedure step ${index + 1}.`);
    }
    const basename = `${lessonId.toLowerCase()}-${String(step).padStart(2, '0')}`;
    for (const suffix of ['', '-stacked']) {
      const filename = `${basename}${suffix}.webp`;
      const bytes = readFileSync(join(images, filename));
      if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
        throw new Error(`${filename} is not a WebP illustration.`);
      }
      const fingerprint = createHash('sha256').update(bytes).digest('hex');
      if (fingerprints.has(fingerprint)) throw new Error(`${lessonId}: repeated artwork in ${filename}.`);
      fingerprints.add(fingerprint);
    }
  }
  return entries.length;
}

let illustrationCount = 0;
let lessonCount = 0;

for (const entry of readdirSync(curriculum, { withFileTypes: true })) {
  if (!entry.isDirectory() || !['designer', 'photo', 'publisher', 'scripting'].includes(entry.name)) continue;
  const trackPath = join(curriculum, entry.name);
  for (const module of readdirSync(trackPath, { withFileTypes: true })) {
    if (!module.isDirectory()) continue;
    const modulePath = join(trackPath, module.name);
    for (const file of readdirSync(modulePath)) {
      if (!/^[DPBS]\d{2}-\d{2}\.json$/.test(file)) continue;
      const lesson = JSON.parse(readFileSync(join(modulePath, file), 'utf8'));
      const steps = lesson.standardSections.stepByStepInstructions.map(({ stepNumber }) => stepNumber);
      illustrationCount += validateEntries(lesson.id, manifest[lesson.id], steps);
      plannedLessons.delete(lesson.id);
      lessonCount++;
    }
  }
}

if (plannedLessons.size) throw new Error(`Illustration plans with no lesson: ${[...plannedLessons].join(', ')}`);
const workshop = JSON.parse(readFileSync(join(curriculum, 'first-project.json'), 'utf8'));
const workshopCount = validateEntries('starter-poster', workshop, workshop.map((_, index) => index + 1));
console.log(`Validated ${illustrationCount} illustrations across ${lessonCount} lessons and ${workshopCount} in the first project, each with desktop and mobile artwork.`);
