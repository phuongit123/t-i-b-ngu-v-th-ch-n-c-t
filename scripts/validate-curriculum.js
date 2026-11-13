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
export const ALLOWED_CURRICULUM_ROOT_FILES = ['README.md'];

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

const VALID_SLIDE_TYPES = [
  'intro',
  'theory',
  'tool-anatomy',
  'step-by-step',
  'guided-practice',
  'pitfalls',
  'quiz',
  'challenge',
  'summary',
];

const VALID_VISUAL_EXAMPLE_TYPES = ['diagram', 'code', 'table', 'callout', 'comparison'];
const VALID_RESOURCE_TYPES = ['doc', 'asset', 'next-lesson', 'mcp-api'];
const VALID_TECHNICAL_CLASSIFICATIONS = ['VERIFIED', 'DOCUMENTED', 'UNVERIFIED', 'INCORRECT'];

const isPlainObject = (value) => (
  value !== null && typeof value === 'object' && !Array.isArray(value)
);

const isNonEmptyString = (value) => (
  typeof value === 'string' && value.trim().length > 0
);

function resolveCurriculumAssetPath(curriculumDir, filepath) {
  if (path.isAbsolute(filepath)) return filepath;
  const relativePath = filepath.replace(/^curriculum[\\/]/, '');
  return path.resolve(curriculumDir, relativePath);
}

function getQuizQuestionErrors(question, context) {
  if (!isPlainObject(question)) {
    return [`     [FAIL] ${context} must be an object`];
  }

  const errors = [];
  if (!isNonEmptyString(question.id)) {
    errors.push(`     [FAIL] ${context} id must be a non-empty string`);
  }
  if (!isNonEmptyString(question.question)) {
    errors.push(`     [FAIL] ${context} question must be a non-empty string`);
  }
  if (
    !Array.isArray(question.options)
    || question.options.length < 2
    || !question.options.every(isNonEmptyString)
  ) {
    errors.push(`     [FAIL] ${context} options must contain at least two non-empty strings`);
  }

  const correctIndex = Number.isInteger(question.correctIndex)
    ? question.correctIndex
    : question.correctOption;
  if (
    !Number.isInteger(correctIndex)
    || !Array.isArray(question.options)
    || correctIndex < 0
    || correctIndex >= question.options.length
  ) {
    errors.push(`     [FAIL] ${context} correctIndex must be an integer within the options range`);
  }
  if (!isNonEmptyString(question.explanation)) {
    errors.push(`     [FAIL] ${context} explanation must be a non-empty string`);
  }

  return errors;
}

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
  const expectedStructure = options.expectedCurriculum ?? EXPECTED_CURRICULUM;
  const silent = Boolean(options.silent);

  const errorList = [];
  if (!isPlainObject(expectedStructure)) {
    const message = '[FAIL] Expected curriculum manifest must be an object';
    if (!silent) console.error(message);
    return { totalAudited: 0, passes: 0, errors: 1, errorList: [message] };
  }
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
    const allowedRootFiles = new Set(ALLOWED_CURRICULUM_ROOT_FILES);
    for (const entry of fs.readdirSync(curriculumDir, { withFileTypes: true })) {
      if (allowedRootFiles.has(entry.name)) {
        if (!entry.isFile()) {
          logError(`[FAIL] Curriculum root entry must be a file: ${entry.name}`);
        }
      } else if (!allowedRootEntries.has(entry.name)) {
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
    if (!isPlainObject(trackConfig)) {
      logError(`[FAIL] Expected curriculum manifest for track ${track} must be an object`);
      continue;
    }
    if (!isPlainObject(trackConfig)) {
      logError(`[FAIL] Expected curriculum manifest for track ${track} must be an object`);
      continue;
    }
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
          let moduleHasError = false;
          const logModuleError = (message) => {
            moduleHasError = true;
            logError(message);
          };

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
              logModuleError(`  [FAIL] module.json in ${mod} missing required field: "${field}"`);
            }
          }

          const lessonList = Array.isArray(modData.lessonIds)
            ? modData.lessonIds
            : Array.isArray(modData.lessons)
              ? modData.lessons.map((l) => (typeof l === 'string' ? l : l?.id))
              : null;
          if (!lessonList || lessonList.length === 0) {
            logModuleError(`  [FAIL] module.json in ${mod} must contain lessonIds or lessons array`);
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
              logModuleError(`  [FAIL] module.json in ${mod} contains an invalid lesson ID entry`);
            }
            if (duplicateModuleLessonIds.length > 0) {
              logModuleError(`  [FAIL] module.json in ${mod} contains duplicate lesson IDs: ${[...new Set(duplicateModuleLessonIds)].join(', ')}`);
            }
            const sortedActualIds = [...normalizedLessonIds].sort();
            const sortedExpectedIds = [...expectedLessonIds].sort();
            if (
              !normalizedIdsAreValid
              || sortedActualIds.length !== sortedExpectedIds.length
              || sortedActualIds.some((lessonId, index) => lessonId !== sortedExpectedIds[index])
            ) {
              logModuleError(`  [FAIL] module.json lesson IDs do not match manifest for ${track}/${mod}. Expected: ${expectedLessonIds.join(', ')}; got: ${normalizedLessonIds.join(', ')}`);
            }
          }

          if (modData.id !== mod) {
            logModuleError(`  [FAIL] module.json ID mismatch in ${mod}: expected "${mod}", got "${modData.id}"`);
          }

          if (modData.trackId !== track) {
            logModuleError(`  [FAIL] module.json trackId mismatch in ${mod}: expected "${track}", got "${modData.trackId}"`);
          }

          if (!VALID_DIFFICULTIES.includes(modData.difficulty)) {
            logModuleError(`  [FAIL] Invalid difficulty in ${mod}/module.json: "${modData.difficulty}"`);
          }

          if (typeof modData.estimatedMinutes !== 'number' || modData.estimatedMinutes <= 0) {
            logModuleError(`  [FAIL] Invalid estimatedMinutes in ${mod}/module.json: "${modData.estimatedMinutes}"`);
          }

          if (moduleHasError) {
            log(`  [FAIL] module.json validation failed for ${track}/${mod}`);
          } else {
            log(`  [PASS] module.json: "${modData.title}" (${modData.difficulty}, ${modData.estimatedMinutes} mins)`);
          }
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

          if (!isPlainObject(lesson)) {
            logError(`     [FAIL] Lesson ${expectedLessonId} must be a JSON object`);
            continue;
          }

          let lessonHasError = false;
          const logLessonError = (message) => {
            lessonHasError = true;
            logError(message);
          };

          if (typeof lesson.id === 'string' && lesson.id.trim()) {
            if (seenDeclaredLessonIds.has(lesson.id)) {
              logLessonError(`     [FAIL] Duplicate lesson ID found in lesson data: ${lesson.id}`);
            }
            seenDeclaredLessonIds.add(lesson.id);
          }

          // 1. Required fields and primitive types, aligned with curriculum/schema/lesson-schema.json.
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
              logLessonError(`     [FAIL] Lesson ${expectedLessonId} missing required field: "${field}"`);
            }
          }

          for (const field of ['id', 'moduleId', 'trackId', 'title', 'subtitle']) {
            if (!isNonEmptyString(lesson[field])) {
              logLessonError(`     [FAIL] Lesson ${expectedLessonId} ${field} must be a non-empty string`);
            }
          }

          if (lesson.id !== expectedLessonId || lesson.moduleId !== mod || lesson.trackId !== track) {
            logLessonError(`     [FAIL] Identification mismatch in ${expectedLessonId} (id: ${lesson.id}, mod: ${lesson.moduleId}, track: ${lesson.trackId})`);
          }

          if (!Number.isInteger(lesson.order) || lesson.order !== i) {
            logLessonError(`     [FAIL] Lesson ${expectedLessonId} order must be integer ${i}, got ${lesson.order}`);
          }

          if (!Number.isInteger(lesson.durationMinutes) || lesson.durationMinutes <= 0) {
            logLessonError(`     [FAIL] Lesson ${expectedLessonId} durationMinutes must be a positive integer`);
          }

          if (!VALID_DIFFICULTIES.includes(lesson.difficulty)) {
            logLessonError(`     [FAIL] Invalid lesson difficulty in ${expectedLessonId}: "${lesson.difficulty}"`);
          }

          // 2. Required standard sections must have the declared shapes and non-empty content.
          const standardSections = isPlainObject(lesson.standardSections)
            ? lesson.standardSections
            : null;
          if (!standardSections) {
            logLessonError(`     [FAIL] Lesson ${expectedLessonId} standardSections must be an object`);
          }

          const requiredSectionShapes = [
            ['learningObjectives', 'array'],
            ['foundationalKnowledge', 'string'],
            ['toolAndFeatureExplanation', 'object'],
            ['stepByStepInstructions', 'array'],
            ['visualExamples', 'array'],
            ['guidedPractice', 'object'],
            ['independentChallenge', 'object'],
            ['commonPitfalls', 'array'],
            ['knowledgeCheck', 'array'],
            ['summaryAndResources', 'object'],
          ];

          for (const [sectionName, expectedType] of requiredSectionShapes) {
            const value = standardSections?.[sectionName];
            const validType = expectedType === 'array'
              ? Array.isArray(value) && value.length > 0
              : expectedType === 'object'
                ? isPlainObject(value) && Object.keys(value).length > 0
                : isNonEmptyString(value);
            if (!validType) {
              logLessonError(`     [FAIL] Lesson ${expectedLessonId} standardSections.${sectionName} must be a non-empty ${expectedType}`);
            }
          }

          if (standardSections?.technicalEvidence !== undefined) {
            const evidence = standardSections.technicalEvidence;
            if (
              !isPlainObject(evidence)
              || !VALID_TECHNICAL_CLASSIFICATIONS.includes(evidence.classification)
              || !isNonEmptyString(evidence.source)
            ) {
              logLessonError(`     [FAIL] Lesson ${expectedLessonId} technicalEvidence has invalid metadata`);
            }
          }

          // 3. Shortcuts Win/Mac distinction check.
          const shortcuts = standardSections?.toolAndFeatureExplanation?.shortcut;
          if (
            !isPlainObject(shortcuts)
            || !isNonEmptyString(shortcuts.win)
            || !isNonEmptyString(shortcuts.mac)
          ) {
            logLessonError(`     [FAIL] Shortcuts missing Win/Mac distinction in ${expectedLessonId}`);
          }

          // 4. Slide deck shape and bounds check.
          if (!Array.isArray(lesson.slides) || lesson.slides.length < 5 || lesson.slides.length > 15) {
            logLessonError(`     [FAIL] Lesson ${expectedLessonId} slides must contain between 5 and 15 items (found ${Array.isArray(lesson.slides) ? lesson.slides.length : 0})`);
          } else {
            lesson.slides.forEach((slide, slideIndex) => {
              const slideContext = `Lesson ${expectedLessonId} slide #${slideIndex + 1}`;
              if (!isPlainObject(slide)) {
                logLessonError(`     [FAIL] ${slideContext} must be an object`);
                return;
              }
              if (!isNonEmptyString(slide.id)) {
                logLessonError(`     [FAIL] ${slideContext} id must be a non-empty string`);
              }
              if (!Number.isInteger(slide.slideNumber) || slide.slideNumber < 1) {
                logLessonError(`     [FAIL] ${slideContext} slideNumber must be a positive integer`);
              }
              if (!VALID_SLIDE_TYPES.includes(slide.type)) {
                logLessonError(`     [FAIL] ${slideContext} has an invalid type: "${slide.type}"`);
              }
              if (!isNonEmptyString(slide.title)) {
                logLessonError(`     [FAIL] ${slideContext} title must be a non-empty string`);
              }
              if (!isNonEmptyString(slide.contentMarkdown)) {
                logLessonError(`     [FAIL] ${slideContext} contentMarkdown must be a non-empty string`);
              }
              if (slide.quizData !== undefined) {
                getQuizQuestionErrors(slide.quizData, `${slideContext} quizData`).forEach(logLessonError);
              }
            });
          }

          // 5. Quiz question schema and answer-index bounds.
          const quiz = standardSections?.knowledgeCheck;
          if (!Array.isArray(quiz) || quiz.length < 1) {
            logLessonError(`     [FAIL] Missing knowledge check quiz questions in ${expectedLessonId}`);
          } else {
            quiz.forEach((question, questionIndex) => {
              getQuizQuestionErrors(
                question,
                `Lesson ${expectedLessonId} quiz question #${questionIndex + 1}`
              ).forEach(logLessonError);
            });
          }

          // 6. Practice asset existence & status transparency check
          const asset = lesson.standardSections?.independentChallenge?.starterAsset;
          if (asset) {
            if (!asset.assetStatus || !VALID_ASSET_STATUSES.includes(asset.assetStatus)) {
              logLessonError(`     [FAIL] Invalid or missing assetStatus in ${expectedLessonId}: "${asset.assetStatus}"`);
              lessonHasError = true;
            }

            if (asset.filepath) {
              const fullAssetPath = resolveCurriculumAssetPath(curriculumDir, asset.filepath);
              if (!fs.existsSync(fullAssetPath)) {
                if (
                  asset.assetStatus === 'REAL_AFFINITY_FILE' ||
                  asset.assetStatus === 'GUIDE_DOCUMENT' ||
                  asset.assetStatus === 'JAVASCRIPT_SCRIPT'
                ) {
                  logLessonError(`     [FAIL] Asset declared as ${asset.assetStatus} but file missing on disk: ${asset.filepath}`);
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
