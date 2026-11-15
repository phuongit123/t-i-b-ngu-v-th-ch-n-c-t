import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Affinity Academy UI Gallery Capture', () => {
  const screenshotsDir = path.resolve('tests/screenshots/gallery');

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('00 - Landing Page Luxury Redesign (Figma Interia)', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '00-homepage-luxury-redesign.png') });
    await page.screenshot({ path: path.join(screenshotsDir, '00-homepage-fullpage.png'), fullPage: true });
  });

  test('01 - Catalog Designer Track', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tracks")').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '01-catalog-designer.png') });
  });

  test('02 - Lesson D01-01 Designer Interface', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tracks")').click();
    await page.locator('h5:has-text("Designer Workspace Anatomy & Persona Switching")').first().click();
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '02-lesson-d01-01-interface.png') });
  });

  test('03 - Lesson D02-01 Pen Tool Geometry', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tracks")').click();
    await page.locator('h5:has-text("Pen Tool Modes & Bezier Handle Mechanics")').first().click();
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '03-lesson-d02-01-pen-geometry.png') });
  });

  test('04 - Lesson P01-01 Photo Interface', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tracks")').click();
    await page.locator('h3:has-text("Pixel Studio")').click();
    await page.waitForTimeout(300);
    await page.locator('h5:has-text("Photo Interface, Toolbars & Studio Panels")').first().click();
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '04-lesson-p01-01-photo-core.png') });
  });

  test('05 - Lesson P05-01 Curves & Color Calibration', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tracks")').click();
    await page.locator('h3:has-text("Pixel Studio")').click();
    await page.waitForTimeout(300);
    await page.locator('h5:has-text("Exposure, Dynamic Range & White Balance Calibration")').first().click();
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '05-lesson-p05-01-curves-color.png') });
  });

  test('06 - Lesson B01-01 Publisher Bleed Standards', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tracks")').click();
    await page.locator('h3:has-text("Layout Studio")').click();
    await page.waitForTimeout(300);
    await page.locator('h5:has-text("Publication Architecture, Facing Pages, Slug & Bleed Standards")').first().click();
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '06-lesson-b01-01-publisher-bleed.png') });
  });

  test('07 - Lesson S01-01 Scripting V8 Engine', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tracks")').click();
    await page.locator('h3:has-text("Scripting & MCP")').click();
    await page.waitForTimeout(300);
    await page.locator('h5:has-text("Affinity JS Runtime Architecture, V8 Engine & Sandbox Limits")').first().click();
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '07-lesson-s01-01-scripting-v8.png') });
  });

  test('08 - Vector Bézier Sandbox Simulator', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Simulator")').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '08-simulator-vector-bezier.png') });
  });

  test('09 - Photo Layer & Masking Simulator', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Simulator")').click();
    await page.locator('button:has-text("Layer Stack & Masking Simulator (Photo)")').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '09-simulator-photo-masking.png') });
  });
});
