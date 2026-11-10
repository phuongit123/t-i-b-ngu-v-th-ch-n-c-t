/**
 * AFFINITY ACADEMY — SCRIPT ASSET VERIFICATION SUITE
 * Validates syntax, structure, and execution safety of all curriculum scripting assets.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SCRIPT_DIR = path.resolve('curriculum/assets/scripting');
const scripts = ['S01_hello_affinity.js', 'S01_ping_mcp.js', 'S01_inspect_doc.js'];

console.log('======================================================');
console.log('   AFFINITY ACADEMY: SCRIPT ASSET SYNTAX HARNESS     ');
console.log('======================================================\n');

let passCount = 0;
let failCount = 0;

for (const scriptFile of scripts) {
  const filePath = path.join(SCRIPT_DIR, scriptFile);
  console.log(`Auditing Script [${scriptFile}]...`);

  if (!fs.existsSync(filePath)) {
    console.error(`  [FAIL] Script file missing at: ${filePath}`);
    failCount++;
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  try {
    // 1. Verify syntax check via node --check
    execFileSync(process.execPath, ['--check', filePath], { stdio: 'pipe' });
    console.log(`  [PASS] Syntax check passed (node --check).`);

    // 2. Content assertions
    if (scriptFile === 'S01_hello_affinity.js') {
      if (!content.includes("require('/application.js')")) {
        throw new Error("Missing Application import require('/application.js')");
      }
      if (!content.includes('Application.productFullName')) {
        throw new Error('Missing Application.productFullName query');
      }
    } else if (scriptFile === 'S01_ping_mcp.js') {
      if (!content.includes('6767') || !content.includes('/sse')) {
        throw new Error('Missing port 6767 or /sse endpoint configuration');
      }
    } else if (scriptFile === 'S01_inspect_doc.js') {
      if (!content.includes("require('/document.js')")) {
        throw new Error("Missing Document import require('/document.js')");
      }
      if (!content.includes('sessionUuid')) {
        throw new Error('Missing sessionUuid inspection check');
      }
    }

    console.log(`  [PASS] Architecture assertions verified.`);
    passCount++;
  } catch (err) {
    console.error(`  [FAIL] Validation error in ${scriptFile}: ${err.message}`);
    failCount++;
  }
}

console.log('\n------------------------------------------------------');
console.log(`Scripts Audited: ${passCount + failCount} | Passed: ${passCount} | Failed: ${failCount}`);
console.log('------------------------------------------------------\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
