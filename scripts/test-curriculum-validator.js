/**
 * AFFINITY ACADEMY — CURRICULUM VALIDATOR NEGATIVE & INTEGRITY TEST SUITE
 * Proves that scripts/validate-curriculum.js correctly rejects missing modules,
 * missing lessons, duplicate IDs, unexpected entries, and invalid metadata.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { validateCurriculum, EXPECTED_CURRICULUM } from './validate-curriculum.js';

console.log('======================================================');
console.log('   CURRICULUM VALIDATOR NEGATIVE TEST HARNESS         ');
console.log('======================================================\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    testsFailed++;
  }
}

// ---------------------------------------------------------------------
// TEST 1: Positive Baseline Verification (Real Repository)
// ---------------------------------------------------------------------
console.log('Test 1: Validating real repository baseline...');
const baselineResult = validateCurriculum({ silent: true });
assert(baselineResult.errors === 0, `Baseline has 0 errors (got ${baselineResult.errors})`);
assert(baselineResult.passes === 66, `Baseline passes all 66 lessons (got ${baselineResult.passes})`);
assert(baselineResult.totalAudited === 66, `Baseline audits exactly 66 lessons (got ${baselineResult.totalAudited})`);

// ---------------------------------------------------------------------
// TEST 2: Negative Test — Missing Required Module
// ---------------------------------------------------------------------
console.log('\nTest 2: Negative test — Detecting missing required module...');
const missingModuleConfig = {
  ...EXPECTED_CURRICULUM,
  designer: {
    modules: ['D01', 'D99_NON_EXISTENT'],
    lessonCountPerModule: 3,
  },
};
const missingModuleResult = validateCurriculum({
  expectedCurriculum: missingModuleConfig,
  silent: true,
});
assert(missingModuleResult.errors > 0, `Missing module caused validation failure (${missingModuleResult.errors} errors)`);
assert(
  missingModuleResult.errorList.some((e) => e.includes('Missing required module directory: designer/D99_NON_EXISTENT')),
  'Caught exact error: "Missing required module directory: designer/D99_NON_EXISTENT"'
);

// ---------------------------------------------------------------------
// TEST 3: Negative Test — Missing Required Lesson
// ---------------------------------------------------------------------
console.log('\nTest 3: Negative test — Detecting missing required lesson...');
const missingLessonConfig = {
  designer: {
    modules: ['D01'],
    lessonCountPerModule: 4, // D01 only has 3 lessons, so D01-04 is missing
  },
};
const missingLessonResult = validateCurriculum({
  expectedCurriculum: missingLessonConfig,
  silent: true,
});
assert(missingLessonResult.errors > 0, `Missing lesson caused validation failure (${missingLessonResult.errors} errors)`);
assert(
  missingLessonResult.errorList.some((e) => e.includes('Missing required lesson file') && e.includes('D01-04.json')),
  'Caught exact error: "Missing required lesson file: ... D01-04.json"'
);

// ---------------------------------------------------------------------
// TEST 4: Negative Test — Duplicate Module ID
// ---------------------------------------------------------------------
console.log('\nTest 4: Negative test — Detecting duplicate module ID...');
const duplicateModuleConfig = {
  designer: {
    modules: ['D01', 'D01'], // Duplicate
    lessonCountPerModule: 3,
  },
};
const duplicateModuleResult = validateCurriculum({
  expectedCurriculum: duplicateModuleConfig,
  silent: true,
});
assert(duplicateModuleResult.errors > 0, `Duplicate module caused validation failure (${duplicateModuleResult.errors} errors)`);
assert(
  duplicateModuleResult.errorList.some((e) => e.includes('Duplicate module ID detected: D01')),
  'Caught exact error: "Duplicate module ID detected: D01"'
);

// ---------------------------------------------------------------------
// TEST 5: Negative Test — Unexpected Module Entry
// ---------------------------------------------------------------------
console.log('\nTest 5: Negative test — Detecting unexpected module entry...');
const unexpectedModuleConfig = {
  // Deliberately omit D10 from expected designer modules
  designer: {
    modules: ['D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09'],
    lessonCountPerModule: 3,
  },
};
const unexpectedModuleResult = validateCurriculum({
  expectedCurriculum: unexpectedModuleConfig,
  silent: true,
});
assert(unexpectedModuleResult.errors > 0, `Unexpected module entry caused failure (${unexpectedModuleResult.errors} errors)`);
assert(
  unexpectedModuleResult.errorList.some((e) => e.includes('Unexpected module directory found: designer/D10')),
  'Caught exact error: "Unexpected module directory found: designer/D10"'
);

// ---------------------------------------------------------------------
// TEST 6: Negative Test — Invalid Metadata (Mock Isolated Directory)
// ---------------------------------------------------------------------
console.log('\nTest 6: Negative test — Detecting invalid metadata in mock directory...');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'curriculum-test-'));
try {
  const mockTrackDir = path.join(tempDir, 'designer');
  const mockModDir = path.join(mockTrackDir, 'D01');
  fs.mkdirSync(mockModDir, { recursive: true });

  // Create module.json with invalid difficulty and missing title
  fs.writeFileSync(
    path.join(mockModDir, 'module.json'),
    JSON.stringify({
      id: 'D01',
      trackId: 'designer',
      description: 'Test',
      difficulty: 'ExpertLevelSuperHard', // Invalid difficulty
      estimatedMinutes: -10, // Invalid duration
      lessonIds: ['D01-01'],
    })
  );

  // Create D01-01.json with missing standard sections and only 2 slides
  fs.writeFileSync(
    path.join(mockModDir, 'D01-01.json'),
    JSON.stringify({
      id: 'D01-01',
      moduleId: 'D01',
      trackId: 'designer',
      order: 1,
      title: 'Mock Lesson',
      subtitle: 'Sub',
      durationMinutes: 10,
      difficulty: 'Beginner',
      standardSections: {
        learningObjectives: ['Test'],
        // Missing the other 9 sections!
      },
      slides: [
        { id: 'S1', slideNumber: 1, type: 'theory', title: 'T1', contentMarkdown: 'M' },
        { id: 'S2', slideNumber: 2, type: 'theory', title: 'T2', contentMarkdown: 'M' },
        // Only 2 slides, minimum is 5!
      ],
    })
  );

  const mockConfig = {
    designer: {
      modules: ['D01'],
      lessonCountPerModule: 1,
    },
  };

  const mockResult = validateCurriculum({
    curriculumDir: tempDir,
    expectedCurriculum: mockConfig,
    silent: true,
  });

  assert(mockResult.errors > 0, `Mock metadata violations caught (${mockResult.errors} errors)`);
  assert(
    mockResult.errorList.some((e) => e.includes('missing required field: "title"')),
    'Caught missing title in module.json'
  );
  assert(
    mockResult.errorList.some((e) => e.includes('Invalid difficulty')),
    'Caught invalid difficulty in module.json'
  );
  assert(
    mockResult.errorList.some((e) => e.includes('Missing standard sections')),
    'Caught missing standard sections in lesson'
  );
  assert(
    mockResult.errorList.some((e) => e.includes('Insufficient slides')),
    'Caught insufficient slide count (< 5)'
  );
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

// ---------------------------------------------------------------------
// FINAL TEST RESULTS
// ---------------------------------------------------------------------
console.log('\n======================================================');
console.log(`TEST RESULTS: ${testsPassed} passed, ${testsFailed} failed`);
console.log('======================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
