/**
 * AFFINITY ACADEMY — CURRICULUM VALIDATOR NEGATIVE & INTEGRITY TEST SUITE
 * Covers manifest enforcement, unexpected entries, metadata consistency,
 * and duplicate IDs found in the actual lesson payloads.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { validateCurriculum, EXPECTED_CURRICULUM } from './validate-curriculum.js';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CURRICULUM_ROOT = path.join(PROJECT_ROOT, 'curriculum');
const SOURCE_MODULE = path.join(CURRICULUM_ROOT, 'designer', 'D01');
const SINGLE_MODULE_EXPECTATION = {
  designer: {
    modules: ['D01'],
    lessonCountPerModule: 3,
  },
};

console.log('======================================================');
console.log('   CURRICULUM VALIDATOR NEGATIVE & INTEGRITY TESTS    ');
console.log('======================================================\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log('  [PASS] ' + message);
    testsPassed++;
  } else {
    console.error('  [FAIL] ' + message);
    testsFailed++;
  }
}

function createFixture() {
  if (!fs.existsSync(SOURCE_MODULE)) {
    throw new Error('Required fixture source is missing: ' + SOURCE_MODULE);
  }

  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'curriculum-validator-'));
  const moduleDir = path.join(root, 'designer', 'D01');
  fs.mkdirSync(path.dirname(moduleDir), { recursive: true });
  fs.cpSync(SOURCE_MODULE, moduleDir, { recursive: true });

  // Copy only assets referenced by this module into the isolated fixture.
  for (const entry of fs.readdirSync(moduleDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.json') || entry.name === 'module.json') continue;
    const lesson = readJson(path.join(moduleDir, entry.name));
    const assetPath = lesson.standardSections?.independentChallenge?.starterAsset?.filepath;
    if (typeof assetPath !== 'string' || !assetPath.trim()) continue;

    const relativeAssetPath = assetPath.replace(/^curriculum[\\/]/, '');
    const sourceAssetPath = path.resolve(PROJECT_ROOT, 'curriculum', relativeAssetPath);
    const fixtureAssetPath = path.resolve(root, relativeAssetPath);
    if (fs.existsSync(sourceAssetPath)) {
      fs.mkdirSync(path.dirname(fixtureAssetPath), { recursive: true });
      fs.copyFileSync(sourceAssetPath, fixtureAssetPath);
    }
  }

  return { root, moduleDir };
}

function runFixture(
  mutator = () => {},
  expectedCurriculum = SINGLE_MODULE_EXPECTATION,
  { silent = true } = {}
) {
  const fixture = createFixture();
  try {
    mutator(fixture);
    return validateCurriculum({
      curriculumDir: fixture.root,
      expectedCurriculum,
      silent,
    });
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
}

function captureConsole(callback) {
  const output = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => output.push(args.join(' '));
  console.error = (...args) => output.push(args.join(' '));
  try {
    return { result: callback(), output: output.join('\n') };
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n');
}

function assertContainsError(result, expectedText, label) {
  assert(
    result.errorList.some((error) => error.includes(expectedText)),
    label + ' (expected diagnostic containing "' + expectedText + '")'
  );
}

// TEST 1: Positive baseline verification against the actual repository.
console.log('Test 1: Current repository baseline...');
const baselineResult = validateCurriculum({
  curriculumDir: CURRICULUM_ROOT,
  expectedCurriculum: EXPECTED_CURRICULUM,
  silent: true,
});
assert(baselineResult.errors === 0, 'Baseline has 0 errors (got ' + baselineResult.errors + ')');
assert(baselineResult.passes === 66, 'Baseline passes all 66 lessons (got ' + baselineResult.passes + ')');
assert(baselineResult.totalAudited === 66, 'Baseline audits exactly 66 lessons (got ' + baselineResult.totalAudited + ')');

// A clean, isolated fixture prevents unrelated repository files masking test failures.
console.log('\nTest 2: Isolated valid fixture...');
const validFixture = runFixture();
assert(validFixture.errors === 0 && validFixture.passes === 3, 'Minimal D01 fixture passes all three expected lessons');

// TEST 3: Missing required module.
console.log('\nTest 3: Missing required module...');
const missingModuleResult = runFixture(
  () => {},
  { designer: { modules: ['D01', 'D99_NON_EXISTENT'], lessonCountPerModule: 3 } }
);
assert(missingModuleResult.errors > 0, 'Missing module fails validation');
assertContainsError(missingModuleResult, 'Missing required module directory: designer/D99_NON_EXISTENT', 'Missing module diagnostic is specific');

// TEST 4: Missing required lesson.
console.log('\nTest 4: Missing required lesson...');
const missingLessonResult = runFixture(
  () => {},
  { designer: { modules: ['D01'], lessonCountPerModule: 4 } }
);
assert(missingLessonResult.errors > 0, 'Missing lesson fails validation');
assertContainsError(missingLessonResult, 'D01-04.json', 'Missing lesson diagnostic identifies D01-04.json');

// TEST 5: Duplicate module ID in the independent manifest.
console.log('\nTest 5: Duplicate module ID in manifest...');
const duplicateModuleResult = runFixture(
  () => {},
  { designer: { modules: ['D01', 'D01'], lessonCountPerModule: 3 } }
);
assert(duplicateModuleResult.errors > 0, 'Duplicate module ID in manifest fails validation');
assertContainsError(duplicateModuleResult, 'Duplicate module ID detected: D01', 'Duplicate module diagnostic is specific');

// TEST 6: Existing module omitted from expected manifest.
console.log('\nTest 6: Unexpected module directory...');
const unexpectedModuleResult = runFixture(
  () => {},
  { designer: { modules: [], lessonCountPerModule: 3 } }
);
assertContainsError(unexpectedModuleResult, 'Unexpected module directory found: designer/D01', 'Unlisted module directory is rejected');

// TEST 7: Unexpected track at curriculum root.
console.log('\nTest 7: Unexpected curriculum track...');
const unexpectedTrackResult = runFixture(({ root }) => {
  fs.mkdirSync(path.join(root, 'experimental'), { recursive: true });
});
assertContainsError(unexpectedTrackResult, 'Unexpected curriculum root entry: experimental', 'Unexpected root track is rejected');

// TEST 8: Unexpected lesson file that matched the old loose filename regex.
console.log('\nTest 8: Unexpected lesson filename...');
const unexpectedLessonFileResult = runFixture(({ moduleDir }) => {
  fs.copyFileSync(path.join(moduleDir, 'D01-01.json'), path.join(moduleDir, 'D01-99.json'));
});
assertContainsError(unexpectedLessonFileResult, 'Unexpected file in module designer/D01: D01-99.json', 'Well-shaped but unplanned lesson filename is rejected');

// TEST 9: Module metadata must list the exact manifest lesson IDs.
console.log('\nTest 9: Module lessonIds must match manifest...');
const lessonListMismatchResult = runFixture(({ moduleDir }) => {
  const modulePath = path.join(moduleDir, 'module.json');
  const moduleData = readJson(modulePath);
  moduleData.lessonIds = ['D01-01', 'D01-02'];
  writeJson(modulePath, moduleData);
});
assertContainsError(lessonListMismatchResult, 'module.json lesson IDs do not match manifest for designer/D01', 'Incomplete module lessonIds list is rejected');

// TEST 10: Duplicate lesson IDs in actual lesson payloads.
console.log('\nTest 10: Duplicate IDs in lesson data...');
const duplicateLessonDataResult = runFixture(({ moduleDir }) => {
  const lessonPath = path.join(moduleDir, 'D01-02.json');
  const lessonData = readJson(lessonPath);
  lessonData.id = 'D01-01';
  writeJson(lessonPath, lessonData);
});
assertContainsError(duplicateLessonDataResult, 'Duplicate lesson ID found in lesson data: D01-01', 'Duplicate payload lesson ID is rejected');

// TEST 11: Duplicate IDs inside module metadata.
console.log('\nTest 11: Duplicate IDs in module lessonIds...');
const duplicateMetadataLessonIdsResult = runFixture(({ moduleDir }) => {
  const modulePath = path.join(moduleDir, 'module.json');
  const moduleData = readJson(modulePath);
  moduleData.lessonIds = ['D01-01', 'D01-01', 'D01-03'];
  writeJson(modulePath, moduleData);
});
assertContainsError(duplicateMetadataLessonIdsResult, 'contains duplicate lesson IDs: D01-01', 'Duplicate metadata lesson ID is rejected');

// TEST 12: Invalid module metadata.
console.log('\nTest 12: Invalid module metadata...');
const invalidMetadataCapture = captureConsole(() => runFixture(({ moduleDir }) => {
  const modulePath = path.join(moduleDir, 'module.json');
  const moduleData = readJson(modulePath);
  moduleData.title = '';
  moduleData.difficulty = 'ExpertLevelSuperHard';
  moduleData.estimatedMinutes = -10;
  writeJson(modulePath, moduleData);
}, SINGLE_MODULE_EXPECTATION, { silent: false }));
const invalidMetadataResult = invalidMetadataCapture.result;
assertContainsError(invalidMetadataResult, 'missing required field: "title"', 'Missing title is rejected');
assertContainsError(invalidMetadataResult, 'Invalid difficulty', 'Invalid difficulty is rejected');
assertContainsError(invalidMetadataResult, 'Invalid estimatedMinutes', 'Non-positive duration is rejected');
assert(
  !invalidMetadataCapture.output.includes('[PASS] module.json:'),
  'Invalid module metadata is not reported as a module PASS'
);

// TEST 13: Unexpected loose entry at curriculum root.
console.log('\nTest 13: Unexpected root file...');
const unexpectedRootFileResult = runFixture(({ root }) => {
  fs.writeFileSync(path.join(root, 'README-untracked.txt'), 'unexpected');
});
assertContainsError(unexpectedRootFileResult, 'Unexpected curriculum root entry: README-untracked.txt', 'Unexpected root file is rejected');

// TEST 14: The documented curriculum root README is an allowed support file.
console.log('\nTest 14: Allowed curriculum root README...');
const allowedReadmeResult = runFixture(({ root }) => {
  fs.writeFileSync(path.join(root, 'README.md'), '# Curriculum fixture\n');
});
assert(
  allowedReadmeResult.errors === 0 && allowedReadmeResult.passes === 3,
  'Allowed curriculum root README does not cause validation failure'
);

// TEST 15: Accept the supported lessons: [{ id }] metadata representation.
console.log('\nTest 15: Object-based module lessons metadata...');
const objectLessonsResult = runFixture(({ moduleDir }) => {
  const modulePath = path.join(moduleDir, 'module.json');
  const moduleData = readJson(modulePath);
  moduleData.lessons = moduleData.lessonIds.map((id) => ({ id }));
  delete moduleData.lessonIds;
  writeJson(modulePath, moduleData);
});
assert(
  objectLessonsResult.errors === 0 && objectLessonsResult.passes === 3,
  'Object-based lessons metadata validates all three expected lessons'
);

// TEST 16: Reject null/malformed entries in the lessons array without throwing.
console.log('\nTest 16: Null entry in module lessons metadata...');
const nullLessonEntryResult = runFixture(({ moduleDir }) => {
  const modulePath = path.join(moduleDir, 'module.json');
  const moduleData = readJson(modulePath);
  moduleData.lessons = [{ id: 'D01-01' }, null, { id: 'D01-03' }];
  delete moduleData.lessonIds;
  writeJson(modulePath, moduleData);
});
assert(nullLessonEntryResult.errors > 0, 'Null lesson metadata entry fails validation');
assertContainsError(
  nullLessonEntryResult,
  'contains an invalid lesson ID entry',
  'Null lesson metadata entry receives a specific diagnostic'
);

// TEST 17: Reject a null track entry in a custom manifest without throwing.
console.log('\nTest 17: Null track entry in manifest...');
const nullTrackResult = runFixture(
  () => {},
  { designer: null }
);
assert(nullTrackResult.errors > 0, 'Null track manifest entry fails validation without throwing');
assertContainsError(
  nullTrackResult,
  'Expected curriculum manifest for track designer must be an object',
  'Null track manifest entry receives a specific diagnostic'
);

// TEST 18: Reject lesson metadata with incorrect primitive types and enum values.
console.log('\nTest 18: Invalid lesson metadata types...');
const invalidLessonMetadataResult = runFixture(({ moduleDir }) => {
  const lessonPath = path.join(moduleDir, 'D01-01.json');
  const lessonData = readJson(lessonPath);
  lessonData.title = 123;
  lessonData.difficulty = 'ExpertLevelSuperHard';
  lessonData.durationMinutes = 2.5;
  writeJson(lessonPath, lessonData);
});
assertContainsError(
  invalidLessonMetadataResult,
  'title must be a non-empty string',
  'Numeric lesson title is rejected'
);
assertContainsError(
  invalidLessonMetadataResult,
  'Invalid lesson difficulty',
  'Out-of-enum lesson difficulty is rejected'
);
assertContainsError(
  invalidLessonMetadataResult,
  'durationMinutes must be a positive integer',
  'Fractional lesson duration is rejected'
);

// TEST 19: Enforce the slide maximum and validate required slide fields.
console.log('\nTest 19: Slide count and item schema...');
const invalidSlidesResult = runFixture(({ moduleDir }) => {
  const lessonPath = path.join(moduleDir, 'D01-01.json');
  const lessonData = readJson(lessonPath);
  const firstSlide = lessonData.slides[0];
  lessonData.slides = Array.from({ length: 16 }, (_, index) => ({
    ...firstSlide,
    id: 'D01-01-S' + (index + 1),
    slideNumber: index + 1,
  }));
  lessonData.slides[0].title = 42;
  writeJson(lessonPath, lessonData);
});
assertContainsError(
  invalidSlidesResult,
  'slides must contain between 5 and 15 items',
  'More than 15 slides are rejected'
);
assertContainsError(
  invalidSlidesResult,
  'slide #1 title must be a non-empty string',
  'Malformed slide title is rejected'
);

// TEST 20: A quiz correctIndex must point to an existing option.
console.log('\nTest 20: Quiz correctIndex bounds...');
const invalidQuizIndexResult = runFixture(({ moduleDir }) => {
  const lessonPath = path.join(moduleDir, 'D01-01.json');
  const lessonData = readJson(lessonPath);
  lessonData.standardSections.knowledgeCheck[0].correctIndex =
    lessonData.standardSections.knowledgeCheck[0].options.length;
  writeJson(lessonPath, lessonData);
});
assertContainsError(
  invalidQuizIndexResult,
  'correctIndex must be an integer within the options range',
  'Out-of-range quiz answer index is rejected'
);

// TEST 21: Required section objects cannot be empty.
console.log('\nTest 21: Empty required standard section...');
const emptySectionResult = runFixture(({ moduleDir }) => {
  const lessonPath = path.join(moduleDir, 'D01-01.json');
  const lessonData = readJson(lessonPath);
  lessonData.standardSections.toolAndFeatureExplanation = {};
  writeJson(lessonPath, lessonData);
});
assertContainsError(
  emptySectionResult,
  'standardSections.toolAndFeatureExplanation must be a non-empty object',
  'Empty required section object is rejected'
);

// TEST 22: Asset paths resolve against the isolated fixture, not the real repository.
console.log('\nTest 22: Fixture-local asset resolution...');
const fixtureAssetResult = runFixture(({ root, moduleDir }) => {
  const fixtureAssetPath = path.join(root, 'assets', 'designer', 'fixture-only.md');
  fs.mkdirSync(path.dirname(fixtureAssetPath), { recursive: true });
  fs.writeFileSync(fixtureAssetPath, '# Fixture-only guide\n');

  const lessonPath = path.join(moduleDir, 'D01-01.json');
  const lessonData = readJson(lessonPath);
  lessonData.standardSections.independentChallenge.starterAsset.filepath =
    'curriculum/assets/designer/fixture-only.md';
  writeJson(lessonPath, lessonData);
});
assert(
  fixtureAssetResult.errors === 0 && fixtureAssetResult.passes === 3,
  'Fixture-local asset resolves successfully without reading repository assets'
);

// TEST 23: Missing required assets are detected inside the fixture.
console.log('\nTest 23: Missing required asset...');
const missingRequiredAssetResult = runFixture(({ moduleDir }) => {
  const lessonPath = path.join(moduleDir, 'D01-01.json');
  const lessonData = readJson(lessonPath);
  lessonData.standardSections.independentChallenge.starterAsset.assetStatus = 'REAL_AFFINITY_FILE';
  lessonData.standardSections.independentChallenge.starterAsset.filepath =
    'curriculum/assets/designer/missing-required.afdesign';
  writeJson(lessonPath, lessonData);
});
assert(missingRequiredAssetResult.errors > 0, 'Missing required asset fails validation');
assertContainsError(
  missingRequiredAssetResult,
  'Asset declared as REAL_AFFINITY_FILE but file missing on disk',
  'Missing required asset receives a specific diagnostic'
);

console.log('\n======================================================');
console.log('TEST RESULTS: ' + testsPassed + ' passed, ' + testsFailed + ' failed');
console.log('======================================================\n');

if (testsFailed > 0) {
  process.exit(1);
}
