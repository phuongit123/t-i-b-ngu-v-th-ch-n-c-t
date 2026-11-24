import fs from 'node:fs';
import path from 'node:path';

const tracks = ['designer', 'photo', 'publisher', 'scripting'];
const viRegex =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;

function hasVi(value) {
  return typeof value === 'string' && viRegex.test(value);
}

const errors = [];
let modulesChecked = 0;
let lessonsChecked = 0;
let guidesChecked = 0;

for (const track of tracks) {
  const trackDir = path.resolve('curriculum', track);
  for (const modName of fs.readdirSync(trackDir).sort()) {
    const modDir = path.join(trackDir, modName);
    if (!fs.statSync(modDir).isDirectory()) continue;

    modulesChecked++;
    const modJsonPath = path.join(modDir, 'module.json');
    const mod = JSON.parse(fs.readFileSync(modJsonPath, 'utf8'));
    if (!hasVi(mod.title)) errors.push(`${modName}/module.json: title is not Vietnamese`);
    if (!hasVi(mod.description)) errors.push(`${modName}/module.json: description is not Vietnamese`);

    const lessonFiles = fs
      .readdirSync(modDir)
      .filter((f) => f.endsWith('.json') && f !== 'module.json')
      .sort();

    for (const file of lessonFiles) {
      lessonsChecked++;
      const lesson = JSON.parse(fs.readFileSync(path.join(modDir, file), 'utf8'));
      const prefix = `${modName}/${lesson.id || file}`;
      const sec = lesson.standardSections || {};

      if (!hasVi(lesson.title)) errors.push(`${prefix}.title lacks Vietnamese`);
      if (!hasVi(lesson.subtitle)) errors.push(`${prefix}.subtitle lacks Vietnamese`);

      if (!Array.isArray(sec.learningObjectives) || !sec.learningObjectives.every(hasVi)) {
        errors.push(`${prefix}.standardSections.learningObjectives has untranslated entries`);
      }
      if (!hasVi(sec.foundationalKnowledge)) {
        errors.push(`${prefix}.standardSections.foundationalKnowledge lacks Vietnamese`);
      }
      if (!hasVi(sec.toolAndFeatureExplanation?.description)) {
        errors.push(`${prefix}.standardSections.toolAndFeatureExplanation.description lacks Vietnamese`);
      }
      if (
        !Array.isArray(sec.toolAndFeatureExplanation?.contextBarOptions) ||
        !sec.toolAndFeatureExplanation.contextBarOptions.every(hasVi)
      ) {
        errors.push(`${prefix}.standardSections.toolAndFeatureExplanation.contextBarOptions has untranslated entries`);
      }

      if (
        !Array.isArray(sec.stepByStepInstructions) ||
        sec.stepByStepInstructions.some((s) => !hasVi(s.title) || !hasVi(s.instruction))
      ) {
        errors.push(`${prefix}.standardSections.stepByStepInstructions has untranslated step`);
      }

      if (
        !Array.isArray(sec.visualExamples) ||
        sec.visualExamples.some((v) => !hasVi(v.title) || !hasVi(v.description))
      ) {
        errors.push(`${prefix}.standardSections.visualExamples has untranslated metadata`);
      }

      if (
        !hasVi(sec.guidedPractice?.title) ||
        !hasVi(sec.guidedPractice?.taskDescription) ||
        !hasVi(sec.guidedPractice?.expectedOutcome) ||
        !Array.isArray(sec.guidedPractice?.checkpoints) ||
        !sec.guidedPractice.checkpoints.every(hasVi)
      ) {
        errors.push(`${prefix}.standardSections.guidedPractice has untranslated text`);
      }

      const criteria =
        sec.independentChallenge?.challengeCriteria ??
        sec.independentChallenge?.successCriteria ??
        [];
      if (
        !hasVi(sec.independentChallenge?.title) ||
        !hasVi(sec.independentChallenge?.prompt) ||
        criteria.length === 0 ||
        !criteria.every(hasVi)
      ) {
        errors.push(`${prefix}.standardSections.independentChallenge has untranslated text`);
      }

      if (
        !Array.isArray(sec.commonPitfalls) ||
        sec.commonPitfalls.some((p) => {
          const head = p.pitfall ?? p.mistake;
          const tail = p.cause ?? p.consequence;
          return !hasVi(head) || (tail && !hasVi(tail)) || !hasVi(p.solution);
        })
      ) {
        errors.push(`${prefix}.standardSections.commonPitfalls has untranslated text`);
      }

      if (
        !Array.isArray(sec.knowledgeCheck) ||
        sec.knowledgeCheck.some((q) => !hasVi(q.question) || !hasVi(q.explanation))
      ) {
        errors.push(`${prefix}.standardSections.knowledgeCheck has untranslated text`);
      }

      const summaryList =
        sec.summaryAndResources?.summaryPoints ??
        sec.summaryAndResources?.keyTakeaways ??
        [];
      if (summaryList.length === 0 || !summaryList.every(hasVi)) {
        errors.push(`${prefix}.standardSections.summaryAndResources has untranslated summary points`);
      }

      (lesson.slides || []).forEach((slide, idx) => {
        const body = slide.contentMarkdown ?? slide.content ?? (slide.bullets || []).join(' ');
        if (!hasVi(slide.title) || !hasVi(body)) {
          errors.push(`${prefix}.slides[${idx}] (${slide.title || idx + 1}) lacks Vietnamese text`);
        }
      });
    }
  }
}

function walkAssets(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAssets(fullPath);
    } else if (entry.name.endsWith('.md')) {
      guidesChecked++;
      const text = fs.readFileSync(fullPath, 'utf8');
      if (!hasVi(text)) {
        errors.push(`${path.relative(process.cwd(), fullPath)} lacks Vietnamese text`);
      }
    }
  }
}
walkAssets(path.resolve('curriculum/assets'));

console.log('======================================================');
console.log('   AFFINITY ACADEMY: VIETNAMESE CURRICULUM AUDIT      ');
console.log('======================================================');
console.log(`Modules audited : ${modulesChecked}`);
console.log(`Lessons audited : ${lessonsChecked}`);
console.log(`Guides audited  : ${guidesChecked}`);
console.log(`Violations      : ${errors.length}`);

if (errors.length > 0) {
  console.error('\nFailed localization checks:');
  errors.forEach((err) => console.error(`  - ${err}`));
  process.exit(1);
}

console.log('\n[PASS] 100% Vietnamese coverage across all modules, lessons, and practice guides.');
