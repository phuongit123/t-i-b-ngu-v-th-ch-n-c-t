/**
 * AFFINITY ACADEMY — S01-01 PRACTICE ASSET
 * Lesson: S01-01 Affinity JS Runtime Architecture & Sandbox Limits
 * Description: Hello World automation script verifying V8 runtime and application version.
 */

const { Application } = require('/application.js');

console.log("=========================================");
console.log("   AFFINITY ACADEMY: HELLO WORLD SCRIPT   ");
console.log("=========================================");
console.log("Product Name   :", Application.productFullName);
console.log("Build Version  :", Application.buildVersion);
console.log("Full Version   :", Application.version);
console.log("Platform       :", Application.platformName || "Desktop");
console.log("Desktop Path   :", Application.userDesktopPath);
console.log("Execution Time :", new Date().toISOString());
console.log("=========================================");
console.log("Result: PASS — Affinity JavaScript DOM is operational.");
