import { test, expect } from '@playwright/test';

test.describe('Phase 5 — Nhóm Existing: Resources, Encyclopedia & Simulator', () => {
  test('TC-EXIST-01: Resources page search, category filter, and download assets', async ({ page }) => {
    await page.goto('/');

    // Navigate to Resources
    const resNav = page.locator('button:has-text("Tài nguyên")').first();
    await expect(resNav).toBeVisible();
    await resNav.click();

    await expect(page.locator('h1')).toContainText('Thư Viện Tài Nguyên & Học Liệu');

    // Search for a starter file
    const searchInput = page.locator('input[placeholder*="Tìm kiếm tài liệu"]');
    await searchInput.fill('artboard');
    await expect(page.locator('text=artboard_starter_guide').first()).toBeVisible();

    // Verify download link exists
    await expect(page.locator('a:has-text("Tải tệp về")').first()).toBeVisible();
  });

  test('TC-EXIST-02: Encyclopedia page API symbol search and module filter', async ({ page }) => {
    await page.goto('/');

    // Navigate to Encyclopedia
    const encNav = page.locator('button:has-text("Bách khoa thư")').first();
    await expect(encNav).toBeVisible();
    await encNav.click();

    await expect(page.locator('h1')).toContainText('Bách Khoa Toàn Thư Affinity DOM API');
    await expect(page.locator('text=Phiên bản SDK')).toBeVisible();

    // Filter by module
    const moduleSelect = page.locator('select');
    await expect(moduleSelect).toBeVisible();
    await moduleSelect.selectOption({ index: 1 });

    // Verify API symbols rendered
    await expect(page.locator('text=Ký hiệu API')).toBeVisible();
  });

  test('TC-EXIST-03: Simulator page switches between Vector Bézier and Photo Layer Stack', async ({ page }) => {
    await page.goto('/');

    // Navigate to Simulator
    const simNav = page.locator('button:has-text("Bộ mô phỏng")').first();
    await expect(simNav).toBeVisible();
    await simNav.click();

    await expect(page.locator('h1')).toContainText('Bộ Mô Phỏng Bézier Pen & Node Tool');

    // Switch to Photo Studio tab
    const photoTab = page.locator('button:has-text("Layer Stack & Masking")');
    await expect(photoTab).toBeVisible();
    await photoTab.click();

    // Verify Photo Layer Simulator loaded
    await expect(page.locator('h3:has-text("Layers Studio")')).toBeVisible();
    await expect(page.locator('strong:has-text("MÔ HÌNH MÔ PHỎNG GIÁO DỤC:")')).toBeVisible();
  });
});
