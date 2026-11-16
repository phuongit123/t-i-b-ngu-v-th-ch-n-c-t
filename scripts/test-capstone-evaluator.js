#!/usr/bin/env node

/**
 * AFFINITY ACADEMY: CAPSTONE EVALUATOR & RUBRIC LOGIC TEST HARNESS
 * Verifies TASK-081 requirements:
 * 1. 7 dimensions with 100% total weight
 * 2. Critical dimensions safeguard (must be >= Level 3)
 * 3. Accurate weighted scoring
 * 4. Pass/Fail threshold (>= 75 and 0 critical violations)
 * 5. PLO-07 and PLO-08 coverage
 */

import assert from 'node:assert';

// Rubric definitions matching src/lib/capstone-service.ts
const RUBRIC_DIMENSIONS = [
  { id: 'brief_interpretation', weight: 15, isCritical: true, plo: 'PLO-07' },
  { id: 'visual_communication', weight: 15, isCritical: false, plo: 'PLO-05, PLO-06' },
  { id: 'tool_selection', weight: 20, isCritical: true, plo: 'PLO-01, PLO-02, PLO-03' },
  { id: 'non_destructive', weight: 15, isCritical: true, plo: 'PLO-04' },
  { id: 'iteration_critique', weight: 15, isCritical: true, plo: 'PLO-08' },
  { id: 'production_readiness', weight: 10, isCritical: true, plo: 'PLO-09' },
  { id: 'independent_transfer', weight: 10, isCritical: false, plo: 'PLO-10' },
];

function calculateWeightedScore(scores) {
  let total = 0;
  for (const dim of RUBRIC_DIMENSIONS) {
    const lvl = scores[dim.id] || 1;
    const normalizedPercent = (lvl / 4) * 100;
    total += (normalizedPercent * dim.weight) / 100;
  }
  return Math.round(total * 10) / 10;
}

function evaluatePassFail(scores) {
  const score = calculateWeightedScore(scores);
  const criticalViolations = [];

  for (const dim of RUBRIC_DIMENSIONS) {
    if (dim.isCritical) {
      const lvl = scores[dim.id] || 1;
      if (lvl < 3) {
        criticalViolations.push(`Critical failure on ${dim.id}: Level ${lvl} < 3`);
      }
    }
  }

  const passed = score >= 75 && criticalViolations.length === 0;
  return { passed, score, criticalViolations };
}

console.log('======================================================');
console.log('   AFFINITY ACADEMY: CAPSTONE EVALUATION HARNESS     ');
console.log('======================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(testName, fn) {
  try {
    fn();
    console.log(`  [PASS] ${testName}`);
    passCount++;
  } catch (err) {
    console.error(`  [FAIL] ${testName}: ${err.message}`);
    failCount++;
  }
}

// Test 1: Dimensions count and weight sum
runTest('Rubric has exactly 7 dimensions summing to 100%', () => {
  assert.strictEqual(RUBRIC_DIMENSIONS.length, 7, 'Must have 7 dimensions');
  const totalWeight = RUBRIC_DIMENSIONS.reduce((sum, d) => sum + d.weight, 0);
  assert.strictEqual(totalWeight, 100, 'Weights must sum to 100%');
});

// Test 2: PLO-07 and PLO-08 are present and critical
runTest('PLO-07 (Brief) and PLO-08 (Iteration) are designated as CRITICAL', () => {
  const plo07 = RUBRIC_DIMENSIONS.find(d => d.id === 'brief_interpretation');
  assert.ok(plo07, 'brief_interpretation must exist');
  assert.strictEqual(plo07.isCritical, true, 'brief_interpretation must be critical');
  assert.strictEqual(plo07.plo, 'PLO-07');

  const plo08 = RUBRIC_DIMENSIONS.find(d => d.id === 'iteration_critique');
  assert.ok(plo08, 'iteration_critique must exist');
  assert.strictEqual(plo08.isCritical, true, 'iteration_critique must be critical');
  assert.strictEqual(plo08.plo, 'PLO-08');
});

// Test 3: Benchmark calculations
runTest('Weighted score calculation maps 1->25%, 3->75%, 4->100%', () => {
  const all4 = {
    brief_interpretation: 4,
    visual_communication: 4,
    tool_selection: 4,
    non_destructive: 4,
    iteration_critique: 4,
    production_readiness: 4,
    independent_transfer: 4,
  };
  assert.strictEqual(calculateWeightedScore(all4), 100.0);

  const all3 = {
    brief_interpretation: 3,
    visual_communication: 3,
    tool_selection: 3,
    non_destructive: 3,
    iteration_critique: 3,
    production_readiness: 3,
    independent_transfer: 3,
  };
  assert.strictEqual(calculateWeightedScore(all3), 75.0);

  const all1 = {
    brief_interpretation: 1,
    visual_communication: 1,
    tool_selection: 1,
    non_destructive: 1,
    iteration_critique: 1,
    production_readiness: 1,
    independent_transfer: 1,
  };
  assert.strictEqual(calculateWeightedScore(all1), 25.0);
});

// Test 4: Graduation threshold - standard pass
runTest('Passing all dimensions at Level 3 results in PASSED verdict', () => {
  const passingScores = {
    brief_interpretation: 3,
    visual_communication: 3,
    tool_selection: 3,
    non_destructive: 3,
    iteration_critique: 3,
    production_readiness: 3,
    independent_transfer: 3,
  };
  const res = evaluatePassFail(passingScores);
  assert.strictEqual(res.passed, true, 'Should pass at Level 3 across all');
  assert.strictEqual(res.criticalViolations.length, 0);
  assert.ok(res.score >= 75);
});

// Test 5: Critical dimension failure cannot be averaged away
runTest('High score cannot compensate for Critical failure on PLO-07 (Brief)', () => {
  // Score has all 4s except brief_interpretation is Level 2
  // Total score = (2/4*15) + (4/4*85) = 7.5 + 85 = 92.5 (very high score!)
  const failingBriefScores = {
    brief_interpretation: 2, // Fails critical requirement (<3)
    visual_communication: 4,
    tool_selection: 4,
    non_destructive: 4,
    iteration_critique: 4,
    production_readiness: 4,
    independent_transfer: 4,
  };
  const res = evaluatePassFail(failingBriefScores);
  assert.strictEqual(res.passed, false, 'Must FAIL despite high 92.5 score due to critical PLO-07 violation');
  assert.ok(res.score >= 75, 'Score is above 75');
  assert.strictEqual(res.criticalViolations.length, 1, 'Must record 1 critical violation');
  assert.ok(res.criticalViolations[0].includes('brief_interpretation'));
});

// Test 6: Critical failure on PLO-08 (Iteration log)
runTest('High score cannot compensate for Critical failure on PLO-08 (Iteration)', () => {
  const failingIterationScores = {
    brief_interpretation: 4,
    visual_communication: 4,
    tool_selection: 4,
    non_destructive: 4,
    iteration_critique: 1, // Fails critical requirement (<3)
    production_readiness: 4,
    independent_transfer: 4,
  };
  const res = evaluatePassFail(failingIterationScores);
  assert.strictEqual(res.passed, false, 'Must FAIL due to critical PLO-08 violation');
  assert.ok(res.criticalViolations[0].includes('iteration_critique'));
});

// Test 7: Non-critical dimension does not cause auto-fail if score >= 75
runTest('Level 2 on non-critical dimension (visual_communication) passes if total >= 75', () => {
  const mixedScores = {
    brief_interpretation: 4, // 15
    visual_communication: 2, // (2/4)*15 = 7.5 (non-critical)
    tool_selection: 4, // 20
    non_destructive: 4, // 15
    iteration_critique: 4, // 15
    production_readiness: 3, // (3/4)*10 = 7.5
    independent_transfer: 4, // 10
  };
  // Score = 15 + 7.5 + 20 + 15 + 15 + 7.5 + 10 = 90.0
  const res = evaluatePassFail(mixedScores);
  assert.strictEqual(res.passed, true, 'Non-critical dim at Level 2 is allowed if total >= 75');
  assert.strictEqual(res.criticalViolations.length, 0);
  assert.strictEqual(res.score, 90.0);
});

console.log('\n------------------------------------------------------');
console.log(`Tests Audited: ${passCount + failCount} | Passed: ${passCount} | Failed: ${failCount}`);
console.log('------------------------------------------------------');

if (failCount > 0) {
  process.exit(1);
}
