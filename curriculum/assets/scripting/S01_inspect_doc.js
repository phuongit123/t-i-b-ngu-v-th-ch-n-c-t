/**
 * AFFINITY ACADEMY — S01-03 PRACTICE ASSET
 * Lesson: S01-03 First Automation Script: Inspecting Active Document Metadata
 * Description: Programmatically inspects the currently open document in Affinity.
 */

const { Application } = require('/application.js');
const { Document } = require('/document.js');

const doc = Document.current;

console.log("=========================================");
console.log("  AFFINITY ACADEMY: DOCUMENT INSPECTOR   ");
console.log("=========================================");

if (!doc) {
  console.log("WARNING: No document is currently open in Affinity.");
  console.log("Action : Please open or create a document to inspect.");
} else {
  console.log("Document Title :", doc.title);
  console.log("Session UUID   :", doc.sessionUuid);
  console.log("Persistent UUID:", doc.persistentUuid);
  console.log("Dimensions     :", doc.widthPixels + " x " + doc.heightPixels + " px");
  console.log("Resolution     :", doc.dpi + " DPI (View: " + doc.viewDpi + " DPI)");
  console.log("Units          :", doc.units);
  console.log("Colour Space   :", doc.colourProfile ? doc.colourProfile.name : "Default");
  console.log("Dirty / Unsaved:", doc.isDirty);
  console.log("Read Only      :", doc.isReadOnly);
  console.log("Spread Count   :", doc.spreadCount);
  console.log("Page Count     :", doc.pageCount);
  console.log("=========================================");
  console.log("Result: PASS — Document metadata successfully retrieved.");
}
