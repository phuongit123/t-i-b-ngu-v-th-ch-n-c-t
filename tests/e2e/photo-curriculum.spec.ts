import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Phase 5 — Track 2: Affinity Photo Learning Subsystem', () => {
  test.beforeAll(() => {
    const screenshotsDir = path.resolve('tests/screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('TC-PHOTO-01: Course Catalog filters Photo track to 10 modules and 30 lessons', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tracks")').click();

    // Click Photo Track Card
    await page.locator('h3:has-text("Affinity Photo")').click();

    // Verify track title and lessons ready badge
    await expect(page.locator('h2')).toContainText('photo Track Curriculum');
    await expect(page.locator('text=30 Lessons Ready to Play')).toBeVisible();

    // Verify presence of all 10 modules (P01 through P10)
    for (let i = 1; i <= 10; i++) {
      const modNumber = i < 10 ? `P0${i}` : `P${i}`;
      await expect(page.locator(`span:has-text("${modNumber}")`).first()).toBeVisible();
    }

    // Capture visual screenshot of Photo Track catalog
    await page.screenshot({ path: 'tests/screenshots/photo-catalog-10-modules.png' });
  });

  test('TC-PHOTO-02: SlidePlayer launches and navigates a full Photo lesson', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tracks")').click();
    await page.locator('h3:has-text("Affinity Photo")').click();

    // Click on P02-01 Selection Tools lesson
    const p02Lesson = page.locator('h5:has-text("Selection Tools & Core Selection Principles")').first();
    await p02Lesson.click();

    // Verify SlidePlayer view loaded
    await expect(page.locator('h1')).toContainText('Khám Phá Công Cụ & Nguyên Lý Vùng Chọn Pixel');

    // Verify slide count indicator
    await expect(page.locator('text=Slide 1')).toBeVisible();
    await expect(page.locator('text=/ 7')).toBeVisible();

    // Advance slide
    await page.locator('button:has-text("Next Slide")').click();
    await expect(page.locator('text=Slide 2')).toBeVisible();

    // Capture screenshot of interactive slide player
    await page.screenshot({ path: 'tests/screenshots/photo-slide-player-active.png' });
  });

  test('TC-PHOTO-04: Legacy P10 slides render their content and tips', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tracks")').click();
    await page.locator('h3:has-text("Affinity Photo")').click();

    // Open the existing P10 capstone module and its third lesson.
    await page.locator('span:has-text("P10")').first().click();
    await page.locator(
      'h5:has-text("Capstone Project — End-to-End Commercial Portrait/Landscape Master Workflow")'
    ).click();

    // The legacy record uses "content" and "tips", not contentMarkdown/actionBox.
    await expect(page.locator('h1')).toContainText('Khởi động dự án Capstone Masterclass');
    await expect(page.getByText(
      'Chào mừng bạn đến với đồ án tốt nghiệp Track 2 Affinity Photo!',
      { exact: false }
    )).toBeVisible();
    await expect(page.getByText('Practice Tip')).toBeVisible();

    await page.locator('button:has-text("Next Slide")').click();
    await expect(page.getByText('Mở file RAW.', { exact: false })).toBeVisible();
  });

  test('TC-PHOTO-03: Photo Layer Simulator renders with disclaimer and interactive controls', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Simulator")').click();

    // Switch to Photo Simulator Tab
    await page.locator('button:has-text("Layer Stack & Masking Simulator (Photo)")').click();

    // Verify mandatory educational disclaimer banner
    const disclaimer = page.locator('strong:has-text("MÔ HÌNH MÔ PHỎNG GIÁO DỤC:")');
    await expect(disclaimer).toBeVisible();

    // Verify Layers Studio is loaded with default layers
    await expect(page.locator('h3:has-text("Layers Studio")')).toBeVisible();
    await expect(page.locator('text=Main Subject (Fashion Model)')).toBeVisible();
    await expect(page.locator('text=Background Plate (Sunset Sky)')).toBeVisible();

    // Click Blend Modes preset scenario
    await page.locator('button:has-text("2. Blend Modes")').click();

    // Invert Mask button test
    await page.locator('button:has-text("Invert Mask")').click();

    // Verify canvas is present
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Capture screenshot of Photo Layer Simulator
    await page.screenshot({ path: 'tests/screenshots/photo-layer-simulator-active.png' });
  });
});
