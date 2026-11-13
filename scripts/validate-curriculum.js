/**
 * AFFINITY ACADEMY — STRENGTHENED CURRICULUM VALIDATION HARNESS
 * Validates the curriculum against an independent expected structure manifest,
 * ensuring no missing modules, no missing lessons, no duplicate IDs,
 * no unexpected entries, and full adherence to the 10-part standard content model.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Independent Expected Curriculum Structure Manifest
 * Defines the certified syllabus structure for AFFINITY ACADEMY v4.2.2.
 * This is declared independently and is NOT derived from whatever folders are present on disk.
 */
export const EXPECTED_CURRICULUM = {
  designer: {
    modules: ['D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09', 'D10'],
    lessonCountPerModule: 3,
  },
  photo: {
    modules: ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10'],
    lessonCountPerModule: 3,
  },
  publisher: {
    modules: ['B01'],
    lessonCountPerModule: 3,
  },
  scripting: {
    modules: ['S01'],
    lessonCountPerModule: 3,
  },
};

// Non-track directories maintained alongside the curriculum tracks.
export const ALLOWED_CURRICULUM_ROOT_ENTRIES = ['assets', 'schema'];

export const REQUIRED_SECTIONS = [
  'learningObjectives',
  'foundationalKnowledge',
  'toolAndFeatureExplanation',
  'stepByStepInstructions',
  'visualExamples',
  'guidedPractice',
  'independentChallenge',
  'commonPitfalls',
  'knowledgeCheck',
  'summaryAndResources',
];

export const VALID_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export const VALID_ASSET_STATUSES = [
  'REAL_AFFINITY_FILE',
  'GUIDE_DOCUMENT',
  'JAVASCRIPT_SCRIPT',
  'EXTERNAL_RESOURCE',
  'NOT_YET_AVAILABLE',
];

/**
 * Core validation function. Can be called programmatically for negative testing.
 * @param {object} options
 * @param {string} [options.curriculumDir] Base path to curriculum directory
 * @param {object} [options.expectedCurriculum] Custom expected curriculum structure
 * @param {boolean} [options.silent] Suppress console output
 * @returns {{ totalAudited: number, passes: number, errors: number, errorList: string[] }}
 */
export function validateCurriculum(options = {}) {
  const curriculumDir = path.resolve(options.curriculumDir || 'curriculum');
  const expectedStructure = options.expectedCurriculum || EXPECTED_CURRICULUM;
  const silent = Boolean(options.silent);

  const errorList = [];
  const log = (msg) => { if (!silent) console.log(msg); };
  const logError = (msg) => {
    errorList.push(msg);
    if (!silent) console.error(msg);
  };

  log('======================================================');
  log('   AFFINITY ACADEMY: CURRICULUM AUDIT HARNESS         ');
  log('======================================================\n');

  let totalLessonsAudited = 0;
  let totalPasses = 0;

  const seenModuleIds = new Set();
  const seenLessonIds = new Set();
  const seenDeclaredLessonIds = new Set();

  // ---------------------------------------------------------
  // 0. Curriculum root integrity: only known tracks and support directories
  // ---------------------------------------------------------
  if (!fs.existsSync(curriculumDir) || !fs.statSync(curriculumDir).isDirectory()) {
    logError(`[FAIL] Curriculum root directory is missing or is not a directory: ${curriculumDir}`);
  } else {
    const allowedRootEntries = new Set([
      ...Object.keys(expectedStructure),
      ...ALLOWED_CURRICULUM_ROOT_ENTRIES,
    ]);
    for (const entry of fs.readdirSync(curriculumDir, { withFileTypes: true })) {
      if (!allowedRootEntries.has(entry.name)) {
        logError(`[FAIL] Unexpected curriculum root entry: ${entry.name}`);
      } else if (!entry.isDirectory()) {
        logError(`[FAIL] Curriculum root entry must be a directory: ${entry.name}`);
      }
    }
  }

  // ---------------------------------------------------------
  // 1. Structure Verification: Expected Tracks, Modules & Lessons
  // ---------------------------------------------------------
  for (const [track, trackConfig] of Object.entries(expectedStructure)) {
    const trackDir = path.join(curriculumDir, track);

    if (!Array.isArray(trackConfig.modules)) {
      logError(`[FAIL] Expected curriculum manifest for track ${track} must define a modules array`);
      continue;
    }

    if (!fs.existsSync(trackDir) || !fs.statSync(trackDir).isDirectory()) {
      logError(`[FAIL] Track directory missing or is not a directory: ${track} (${trackDir})`);
      continue;
    }

    for (const mod of trackConfig.modules) {
      const moduleDir = path.join(trackDir, mod);
      const moduleJsonPath = path.join(moduleDir, 'module.json');
      const expectedLessonCount = Number.isInteger(trackConfig.lessonCountPerModule)
        && trackConfig.lessonCountPerModule > 0
        ? trackConfig.lessonCountPerModule
        : 3;
      if (trackConfig.lessonCountPerModule !== undefined && expectedLessonCount !== trackConfig.lessonCountPerModule) {
        logError(`[FAIL] Invalid lessonCountPerModule for ${track}/${mod}: ${trackConfig.lessonCountPerModule}`);
      }
      const expectedLessonIds = Array.from(
        { length: expectedLessonCount },
        (_, index) => `${mod}-${String(index + 1).padStart(2, '0')}`
      );

      log(`Auditing Track [${track.toUpperCase()}] Module [${mod}]...`);

      // A. Verify Module Directory
      if (!fs.existsSync(moduleDir) || !fs.statSync(moduleDir).isDirectory()) {
        logError(`  [FAIL] Missing required module directory: ${track}/${mod}`);
        continue;
      }

      // B. Verify Duplicate Module ID
      if (seenModuleIds.has(mod)) {
        logError(`  [FAIL] Duplicate module ID detected: ${mod}`);
      }
      seenModuleIds.add(mod);

      // C. Verify module.json and its metadata
      if (!fs.existsSync(moduleJsonPath)) {
        logError(`  [FAIL] Missing module.json at ${moduleJsonPath}`);
      } else {
        try {
          const modData = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));

          // Required Module Metadata Fields
          const requiredModuleFields = [
            'id',
            'trackId',
            'title',
            'description',
            'difficulty',
            'estimatedMinutes',
          ];

          for (const field of requiredModuleFields) {
            if (modData[field] === undefined || modData[field] === null || modData[field] === '') {
              logError(`  [FAIL] module.json in ${mod} missing required field: "${field}"`);
            }
          }

          const lessonList = Array.isArray(modData.lessonIds)
            ? modData.lessonIds
            : Array.isArray(modData.lessons)
              ? modData.lessons.map((l) => (typeof l === 'string' ? l : l.id))
              : null;
          if (!lessonList || lessonList.length === 0) {
            logError(`  [FAIL] module.json in ${mod} must contain lessonIds or lessons array`);
          } else {
            const normalizedLessonIds = lessonList.map((lessonEntry) => (
              typeof lessonEntry === 'string' ? lessonEntry : lessonEntry?.id
            ));
            const normalizedIdsAreValid = normalizedLessonIds.every(
              (lessonId) => typeof lessonId === 'string' && lessonId.trim().length > 0
            );
            const duplicateModuleLessonIds = normalizedLessonIds.filter(
              (lessonId, index) => normalizedLessonIds.indexOf(lessonId) !== index
            );
            if (!normalizedIdsAreValid) {
              logError(`  [FAIL] module.json in ${mod} contains an invalid lesson ID entry`);
            }
            if (duplicateModuleLessonIds.length > 0) {
              logError(`  [FAIL] module.json in ${mod} contains duplicate lesson IDs: ${[...new Set(duplicateModuleLessonIds)].join(', ')}`);
            }
            const sortedActualIds = [...normalizedLessonIds].sort();
            const sortedExpectedIds = [...expectedLessonIds].sort();
            if (
              !normalizedIdsAreValid
              || sortedActualIds.length !== sortedExpectedIds.length
              || sortedActualIds.some((lessonId, index) => lessonId !== sortedExpectedIds[index])
            ) {
              logError(`  [FAIL] module.json lesson IDs do not match manifest for ${track}/${mod}. Expected: ${expectedLessonIds.join(', ')}; got: ${normalizedLessonIds.join(', ')}`);
            }
          }

          if (modData.id !== mod) {
            logError(`  [FAIL] module.json ID mismatch in ${mod}: expected "${mod}", got "${modData.id}"`);
          }

          if (modData.trackId !== track) {
            logError(`  [FAIL] module.json trackId mismatch in ${mod}: expected "${track}", got "${modData.trackId}"`);
          }

          if (!VALID_DIFFICULTIES.includes(modData.difficulty)) {
            logError(`  [FAIL] Invalid difficulty in ${mod}/module.json: "${modData.difficulty}"`);
          }

          if (typeof modData.estimatedMinutes !== 'number' || modData.estimatedMinutes <= 0) {
            logError(`  [FAIL] Invalid estimatedMinutes in ${mod}/module.json: "${modData.estimatedMinutes}"`);
          }

          log(`  [PASS] module.json: "${modData.title}" (${modData.difficulty}, ${modData.estimatedMinutes} mins)`);
        } catch (e) {
          logError(`  [FAIL] Invalid JSON in ${moduleJsonPath}: ${e.message}`);
        }
      }

      // D. Verify Expected Lessons in Module
      for (let i = 1; i <= expectedLessonCount; i++) {
        const orderStr = String(i).padStart(2, '0');
        const expectedLessonId = `${mod}-${orderStr}`;
        const lessonPath = path.join(moduleDir, `${expectedLessonId}.json`);

        totalLessonsAudited++;
        log(`  -> Auditing Lesson ${expectedLessonId}...`);

        // Check if lesson file exists
        if (!fs.existsSync(lessonPath)) {
          logError(`     [FAIL] Missing required lesson file: ${lessonPath}`);
          continue;
        }

        // Check for duplicate lesson IDs
        if (seenLessonIds.has(expectedLessonId)) {
          logError(`     [FAIL] Duplicate lesson ID detected: ${expectedLessonId}`);
        }
        seenLessonIds.add(expectedLessonId);

        // Audit Lesson JSON & Content Model
        try {
          const content = fs.readFileSync(lessonPath, 'utf8');
          const lesson = JSON.parse(content);

          let lessonHasError = false;
          if (typeof lesson.id === 'string' && lesson.id.trim()) {
            if (seenDeclaredLessonIds.has(lesson.id)) {
              logError(`     [FAIL] Duplicate lesson ID found in lesson data: ${lesson.id}`);
              lessonHasError = true;
            }
            seenDeclaredLessonIds.add(lesson.id);
          }

          // 1. Core identification & required top-level metadata check
          const requiredLessonFields = [
            'id',
            'moduleId',
            'trackId',
            'order',
            'title',
            'subtitle',
            'durationMinutes',
            'difficulty',
            'standardSections',
            'slides',
          ];

          for (const field of requiredLessonFields) {
            if (lesson[field] === undefined || lesson[field] === null || lesson[field] === '') {
              logError(`     [FAIL] Lesson ${expectedLessonId} missing required field: "${field}"`);
              lessonHasError = true;
            }
          }

          if (lesson.id !== expectedLessonId || lesson.moduleId !== mod || lesson.trackId !== track) {
            logError(`     [FAIL] Identification mismatch in ${expectedLessonId} (id: ${lesson.id}, mod: ${lesson.moduleId}, track: ${lesson.trackId})`);
            lessonHasError = true;
          }

          if (lesson.order !== i) {
            logError(`     [FAIL] Lesson ${expectedLessonId} order mismatch: expected ${i}, got ${lesson.order}`);
            lessonHasError = true;
          }

          if (typeof lesson.durationMinutes !== 'number' || lesson.durationMinutes <= 0) {
            logError(`     [FAIL] Lesson ${expectedLessonId} durationMinutes must be a positive number`);
            lessonHasError = true;
          }

          // 2. 10 Standard Sections Check
          const missingSections = [];
          for (const section of REQUIRED_SECTIONS) {
            if (!lesson.standardSections || !lesson.standardSections[section]) {
              missingSections.push(section);
            }
          }

          if (missingSections.length > 0) {
            logError(`     [FAIL] Missing standard sections in ${expectedLessonId}: ${missingSections.join(', ')}`);
            lessonHasError = true;
          }

          // 3. Shortcuts Win & Mac distinction check
          const shortcuts = lesson.standardSections?.toolAndFeatureExplanation?.shortcut;
          if (!shortcuts || !shortcuts.win || !shortcuts.mac) {
            logError(`     [FAIL] Shortcuts missing Win/Mac distinction in ${expectedLessonId}`);
            lessonHasError = true;
          }

          // 4. Slide deck depth check
          if (!Array.isArray(lesson.slides) || lesson.slides.length < 5) {
            logError(`     [FAIL] Insufficient slides in ${expectedLessonId} (found ${lesson.slides ? lesson.slides.length : 0}, minimum 5 required)`);
            lessonHasError = true;
          }

          // 5. Quiz questions check
          const quiz = lesson.standardSections?.knowledgeCheck;
          if (!Array.isArray(quiz) || quiz.length < 1) {
            logError(`     [FAIL] Missing knowledge check quiz questions in ${expectedLessonId}`);
            lessonHasError = true;
          } else {
            quiz.forEach((q, qIdx) => {
              const hasCorrectIndex = typeof q.correctIndex === 'number' || typeof q.correctOption === 'number';
              if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || !hasCorrectIndex) {
                logError(`     [FAIL] Malformed quiz question #${qIdx + 1} in ${expectedLessonId}`);
                lessonHasError = true;
              }
            });
          }

          // 6. Practice asset existence & status transparency check
          const asset = lesson.standardSections?.independentChallenge?.starterAsset;
          if (asset) {
            if (!asset.assetStatus || !VALID_ASSET_STATUSES.includes(asset.assetStatus)) {
              logError(`     [FAIL] Invalid or missing assetStatus in ${expectedLessonId}: "${asset.assetStatus}"`);
              lessonHasError = true;
            }

            if (asset.filepath) {
              const fullAssetPath = path.resolve(asset.filepath);
              if (!fs.existsSync(fullAssetPath)) {
                if (
                  asset.assetStatus === 'REAL_AFFINITY_FILE' ||
                  asset.assetStatus === 'GUIDE_DOCUMENT' ||
                  asset.assetStatus === 'JAVASCRIPT_SCRIPT'
                ) {
                  logError(`     [FAIL] Asset declared as ${asset.assetStatus} but file missing on disk: ${asset.filepath}`);
                  lessonHasError = true;
                } else {
                  log(`     [WARN] Practice asset declared as ${asset.assetStatus} not on disk: ${asset.filepath}`);
                }
              } else {
                const stats = fs.statSync(fullAssetPath);
                log(`     [PASS] Practice asset [${asset.assetStatus}]: ${asset.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
              }
            }
          }

          // 7. Technical Evidence Check
          if (lesson.standardSections?.technicalEvidence) {
            const evidence = lesson.standardSections.technicalEvidence;
            log(`     [INFO] Technical Evidence: ${evidence.classification} (Source: ${evidence.source})`);
          }

          if (!lessonHasError) {
            log(`     [PASS] 10/10 Sections Valid | ${lesson.slides.length} Slides | ${quiz.length} Quiz Questions`);
            totalPasses++;
          }
        } catch (e) {
          logError(`     [FAIL] Exception parsing ${expectedLessonId}: ${e.message}`);
        }
      }
    }
  }

  // ---------------------------------------------------------
  // 2. Unexpected Entries Detection
  // ---------------------------------------------------------
  log('\nScanning for unexpected curriculum files or directories...');
  for (const [track, trackConfig] of Object.entries(expectedStructure)) {
    const trackDir = path.join(curriculumDir, track);
    if (
      !Array.isArray(trackConfig.modules)
      || !fs.existsSync(trackDir)
      || !fs.statSync(trackDir).isDirectory()
    ) continue;

    const actualEntries = fs.readdirSync(trackDir, { withFileTypes: true });
    for (const entry of actualEntries) {
      if (entry.isDirectory()) {
        if (!trackConfig.modules.includes(entry.name)) {
          logError(`  [FAIL] Unexpected module directory found: ${track}/${entry.name}`);
        } else {
          // Check exact expected filenames; a well-shaped but unplanned ID is still rogue.
          const expectedCount = Number.isInteger(trackConfig.lessonCountPerModule)
            && trackConfig.lessonCountPerModule > 0
            ? trackConfig.lessonCountPerModule
            : 3;
          const allowedModuleFiles = new Set([
            'module.json',
            ...Array.from(
              { length: expectedCount },
              (_, index) => `${entry.name}-${String(index + 1).padStart(2, '0')}.json`
            ),
          ]);
          const modFiles = fs.readdirSync(path.join(trackDir, entry.name));
          for (const file of modFiles) {
            if (!allowedModuleFiles.has(file)) {
              logError(`  [FAIL] Unexpected file in module ${track}/${entry.name}: ${file}`);
            }
          }
        }
      } else {
        logError(`  [FAIL] Unexpected loose file in track directory ${track}: ${entry.name}`);
      }
    }
  }

  log('\n------------------------------------------------------');
  log(`Audit Complete: ${totalPasses}/${totalLessonsAudited} Lessons PASSED | ${errorList.length} Errors.`);
  log('------------------------------------------------------\n');

  return {
    totalAudited: totalLessonsAudited,
    passes: totalPasses,
    errors: errorList.length,
    errorList,
  };
}

// Direct execution from CLI
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  const result = validateCurriculum();
  if (result.errors > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
