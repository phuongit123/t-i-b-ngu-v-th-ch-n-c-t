/**
 * AFFINITY ACADEMY — CURRICULUM VALIDATION HARNESS
 * Validates lesson files against the 10-part standard content model,
 * slide deck structures, shortcut conventions, and asset file existence.
 */

import fs from 'node:fs';
import path from 'node:path';

const CURRICULUM_DIR = path.resolve('curriculum');

// Discover all modules across all tracks dynamically
const TRACKS = ['designer', 'photo', 'publisher', 'scripting'];
const ACTIVE_MODULES = [];

for (const track of TRACKS) {
  const trackDir = path.join(CURRICULUM_DIR, track);
  if (fs.existsSync(trackDir)) {
    const moduleDirs = fs.readdirSync(trackDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort();

    for (const mod of moduleDirs) {
      const modPath = path.join(trackDir, mod);
      const lessonFiles = fs.readdirSync(modPath)
        .filter(f => f.startsWith(`${mod}-`) && f.endsWith('.json'))
        .map(f => f.replace('.json', ''))
        .sort();

      ACTIVE_MODULES.push({
        track,
        module: mod,
        lessons: lessonFiles
      });
    }
  }
}

const REQUIRED_SECTIONS = [
  'learningObjectives',
  'foundationalKnowledge',
  'toolAndFeatureExplanation',
  'stepByStepInstructions',
  'visualExamples',
  'guidedPractice',
  'independentChallenge',
  'commonPitfalls',
  'knowledgeCheck',
  'summaryAndResources'
];

console.log('======================================================');
console.log('   AFFINITY ACADEMY: PILOT CURRICULUM AUDIT HARNESS   ');
console.log('======================================================\n');

let totalLessonsAudited = 0;
let totalPasses = 0;
let totalErrors = 0;

for (const item of ACTIVE_MODULES) {
  const moduleDir = path.join(CURRICULUM_DIR, item.track, item.module);
  const moduleJsonPath = path.join(moduleDir, 'module.json');

  console.log(`Auditing Track [${item.track.toUpperCase()}] Module [${item.module}]...`);

  if (!fs.existsSync(moduleJsonPath)) {
    console.error(`  [FAIL] Missing module.json at ${moduleJsonPath}`);
    totalErrors++;
  } else {
    try {
      const modData = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
      console.log(`  [PASS] module.json: "${modData.title}" (${modData.difficulty}, ${modData.estimatedMinutes} mins)`);
    } catch (e) {
      console.error(`  [FAIL] Invalid JSON in ${moduleJsonPath}: ${e.message}`);
      totalErrors++;
    }
  }

  for (const lessonId of item.lessons) {
    totalLessonsAudited++;
    const lessonPath = path.join(moduleDir, `${lessonId}.json`);
    console.log(`  -> Auditing Lesson ${lessonId}...`);

    if (!fs.existsSync(lessonPath)) {
      console.error(`     [FAIL] File missing: ${lessonPath}`);
      totalErrors++;
      continue;
    }

    try {
      const content = fs.readFileSync(lessonPath, 'utf8');
      const lesson = JSON.parse(content);

      // 1. Core identification check
      if (lesson.id !== lessonId || lesson.moduleId !== item.module || lesson.trackId !== item.track) {
        console.error(`     [FAIL] Identification mismatch in ${lessonId}`);
        totalErrors++;
        continue;
      }

      // 2. 10 Standard Sections Check
      const missingSections = [];
      for (const section of REQUIRED_SECTIONS) {
        if (!lesson.standardSections || !lesson.standardSections[section]) {
          missingSections.push(section);
        }
      }

      if (missingSections.length > 0) {
        console.error(`     [FAIL] Missing standard sections: ${missingSections.join(', ')}`);
        totalErrors++;
        continue;
      }

      // 3. Shortcuts Win & Mac distinction check
      const shortcuts = lesson.standardSections.toolAndFeatureExplanation?.shortcut;
      if (!shortcuts || !shortcuts.win || !shortcuts.mac) {
        console.error(`     [FAIL] Shortcuts missing Win/Mac distinction`);
        totalErrors++;
        continue;
      }

      // 4. Slide deck depth check
      if (!Array.isArray(lesson.slides) || lesson.slides.length < 5) {
        console.error(`     [FAIL] Insufficient slides (found ${lesson.slides ? lesson.slides.length : 0}, minimum 5 required)`);
        totalErrors++;
        continue;
      }

      // 5. Quiz questions check
      const quiz = lesson.standardSections.knowledgeCheck;
      if (!Array.isArray(quiz) || quiz.length < 1) {
        console.error(`     [FAIL] Missing knowledge check quiz questions`);
        totalErrors++;
        continue;
      }

      // 6. Practice asset existence & status transparency check
      const VALID_ASSET_STATUSES = [
        'REAL_AFFINITY_FILE',
        'GUIDE_DOCUMENT',
        'JAVASCRIPT_SCRIPT',
        'EXTERNAL_RESOURCE',
        'NOT_YET_AVAILABLE'
      ];

      const asset = lesson.standardSections.independentChallenge?.starterAsset;
      if (asset) {
        if (!asset.assetStatus || !VALID_ASSET_STATUSES.includes(asset.assetStatus)) {
          console.error(`     [FAIL] Invalid or missing assetStatus: "${asset.assetStatus}"`);
          totalErrors++;
          continue;
        }

        if (asset.filepath) {
          const fullAssetPath = path.resolve(asset.filepath);
          if (!fs.existsSync(fullAssetPath)) {
            if (asset.assetStatus === 'REAL_AFFINITY_FILE' || asset.assetStatus === 'GUIDE_DOCUMENT' || asset.assetStatus === 'JAVASCRIPT_SCRIPT') {
              console.error(`     [FAIL] Asset declared as ${asset.assetStatus} but file missing on disk: ${asset.filepath}`);
              totalErrors++;
              continue;
            } else {
              console.warn(`     [WARN] Practice asset declared as ${asset.assetStatus} not on disk: ${asset.filepath}`);
            }
          } else {
            const stats = fs.statSync(fullAssetPath);
            console.log(`     [PASS] Practice asset [${asset.assetStatus}]: ${asset.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
          }
        }
      }

      // 7. Technical Evidence Check
      if (lesson.standardSections.technicalEvidence) {
        const evidence = lesson.standardSections.technicalEvidence;
        console.log(`     [INFO] Technical Evidence: ${evidence.classification} (Source: ${evidence.source})`);
      }

      console.log(`     [PASS] 10/10 Sections Valid | ${lesson.slides.length} Slides | ${quiz.length} Quiz Questions`);
      totalPasses++;
    } catch (e) {
      console.error(`     [FAIL] Exception parsing ${lessonId}: ${e.message}`);
      totalErrors++;
    }
  }
  console.log('');
}

console.log('------------------------------------------------------');
console.log(`Audit Complete: ${totalPasses}/${totalLessonsAudited} Lessons PASSED | ${totalErrors} Errors.`);
console.log('------------------------------------------------------\n');

if (totalErrors > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
