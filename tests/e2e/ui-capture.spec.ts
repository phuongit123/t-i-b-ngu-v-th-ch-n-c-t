import { test, expect } from '@playwright/test';

test.describe('Affinity Academy UI Gallery Capture', () => {
  test('00 - Landing Page', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.screenshot({ path: test.info().outputPath('00-homepage-luxury-redesign.png') });
    await page.screenshot({ path: test.info().outputPath('00-homepage-fullpage.png'), fullPage: true });
  });

  test('01 - Catalog Designer Track', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-catalog').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: test.info().outputPath('01-catalog-designer.png') });
  });

  test('02 - Lesson D01-01 Designer Interface', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('lesson-card-D01-01').click();
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: test.info().outputPath('02-lesson-d01-01-interface.png') });
  });

  test('03 - Lesson D02-01 Pen Tool Geometry', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('lesson-card-D02-01').click();
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: test.info().outputPath('03-lesson-d02-01-pen-geometry.png') });
  });

  test('04 - Lesson P01-01 Photo Interface', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('track-card-photo').click();
    await page.waitForTimeout(300);
    await page.getByTestId('lesson-card-P01-01').click();
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: test.info().outputPath('04-lesson-p01-01-photo-core.png') });
  });

  test('05 - Lesson P05-01 Curves & Color Calibration', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('track-card-photo').click();
    await page.waitForTimeout(300);
    await page.getByTestId('lesson-card-P05-01').click();
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: test.info().outputPath('05-lesson-p05-01-curves-color.png') });
  });

  test('06 - Lesson B01-01 Publisher Bleed Standards', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('track-card-publisher').click();
    await page.waitForTimeout(300);
    await page.getByTestId('lesson-card-B01-01').click();
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: test.info().outputPath('06-lesson-b01-01-publisher-bleed.png') });
  });

  test('07 - Lesson S01-01 Scripting V8 Engine', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('track-card-scripting').click();
    await page.waitForTimeout(300);
    await page.getByTestId('lesson-card-S01-01').click();
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: test.info().outputPath('07-lesson-s01-01-scripting-v8.png') });
  });

  test('08 - Vector Bézier Sandbox Simulator', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Thực hành', exact: true }).click();
    await page.getByTestId('nav-simulator').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: test.info().outputPath('08-simulator-vector-bezier.png') });
  });

  test('09 - Photo Layer & Masking Simulator', async ({ page }) => {
    await page.goto('/simulator');
    await page.getByTestId('sim-tab-photo').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: test.info().outputPath('09-simulator-photo-masking.png') });
  });
});
