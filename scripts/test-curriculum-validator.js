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
  return { root, moduleDir };
}

function runFixture(mutator = () => {}, expectedCurriculum = SINGLE_MODULE_EXPECTATION) {
  const fixture = createFixture();
  try {
    mutator(fixture);
    return validateCurriculum({
      curriculumDir: fixture.root,
      expectedCurriculum,
      silent: true,
    });
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
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
const invalidMetadataResult = runFixture(({ moduleDir }) => {
  const modulePath = path.join(moduleDir, 'module.json');
  const moduleData = readJson(modulePath);
  moduleData.title = '';
  moduleData.difficulty = 'ExpertLevelSuperHard';
  moduleData.estimatedMinutes = -10;
  writeJson(modulePath, moduleData);
});
assertContainsError(invalidMetadataResult, 'missing required field: "title"', 'Missing title is rejected');
assertContainsError(invalidMetadataResult, 'Invalid difficulty', 'Invalid difficulty is rejected');
assertContainsError(invalidMetadataResult, 'Invalid estimatedMinutes', 'Non-positive duration is rejected');

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

console.log('\n======================================================');
console.log('TEST RESULTS: ' + testsPassed + ' passed, ' + testsFailed + ' failed');
console.log('======================================================\n');

if (testsFailed > 0) {
  process.exit(1);
}
