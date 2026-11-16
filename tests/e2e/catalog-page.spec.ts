import { test, expect } from '@playwright/test';

test.describe('TASK-072: Course Catalog & Track Browser E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to Catalog view via sidebar button
    await page.locator('button:has-text("Tracks")').click();
    await expect(page.locator('h1')).toContainText('Danh Mục Khóa Học & Lộ Trình Đào Tạo');
  });

  test('TC-CATALOG-01: Displays all 4 TrackCards and TrackFilterBar options', async ({ page }) => {
    // 4 Track overview cards should be visible
    await expect(page.locator('h3:has-text("Vector Studio")')).toBeVisible();
    await expect(page.locator('h3:has-text("Pixel Studio")')).toBeVisible();
    await expect(page.locator('h3:has-text("Layout Studio")')).toBeVisible();
    await expect(page.locator('h3:has-text("Automation & MCP")')).toBeVisible();

    // TrackFilterBar should contain all 5 options: All, Designer, Photo, Publisher, Scripting
    const filterBar = page.locator('div[role="tablist"][aria-label="Lọc khóa học theo chuyên ngành"]');
    await expect(filterBar).toBeVisible();
    await expect(filterBar.locator('button:has-text("Tất cả lộ trình")')).toBeVisible();
    await expect(filterBar.locator('button:has-text("Vector Studio")')).toBeVisible();
    await expect(filterBar.locator('button:has-text("Pixel Studio")')).toBeVisible();
    await expect(filterBar.locator('button:has-text("Layout Studio")')).toBeVisible();
    await expect(filterBar.locator('button:has-text("Automation & MCP")')).toBeVisible();
  });

  test('TC-CATALOG-02: Switching tracks via TrackFilterBar filters modules correctly', async ({ page }) => {
    const filterBar = page.locator('div[role="tablist"]');

    // Switch to Pixel Studio (Photo)
    await filterBar.locator('button:has-text("Pixel Studio")').click();
    await expect(page.locator('h2')).toContainText('photo Track Curriculum');
    await expect(page.locator('text=30 Lessons Ready to Play')).toBeVisible();
    await expect(page.locator('span:has-text("P01")').first()).toBeVisible();
    await expect(page.locator('span:has-text("P10")').first()).toBeVisible();

    // Switch to Layout Studio (Publisher)
    await filterBar.locator('button:has-text("Layout Studio")').click();
    await expect(page.locator('h2')).toContainText('publisher Track Curriculum');
    await expect(page.locator('text=3 Lessons Ready to Play')).toBeVisible();
    await expect(page.locator('span:has-text("B01")').first()).toBeVisible();

    // Switch to Automation & MCP (Scripting)
    await filterBar.locator('button:has-text("Automation & MCP")').click();
    await expect(page.locator('h2')).toContainText('scripting Track Curriculum');
    await expect(page.locator('text=3 Lessons Ready to Play')).toBeVisible();
    await expect(page.locator('span:has-text("S01")').first()).toBeVisible();

    // Switch to All Tracks
    await filterBar.locator('button:has-text("Tất cả lộ trình")').click();
    await expect(page.locator('h2')).toContainText('all Track Curriculum');
    await expect(page.locator('text=66 Lessons Ready to Play')).toBeVisible();
  });

  test('TC-CATALOG-03: Instant search filters modules by keyword', async ({ page }) => {
    // Select "Tất cả lộ trình" to search universally across all tracks
    await page.locator('div[role="tablist"] button:has-text("Tất cả lộ trình")').click();

    const searchInput = page.locator('input[placeholder*="Tìm module, bài học"]');
    await expect(searchInput).toBeVisible();

    // Search for "Bézier"
    await searchInput.fill('Bézier');
    await expect(page.locator('main span:has-text("D02")').first()).toBeVisible();

    // Clear search using clear button
    const clearButton = page.locator('button[aria-label="Xóa từ khóa tìm kiếm"]');
    await expect(clearButton).toBeVisible();
    await clearButton.click();
    await expect(searchInput).toHaveValue('');

    // Search for a specific lesson title: "Baseline"
    await searchInput.fill('Baseline');
    await expect(page.locator('main span:has-text("B01")').first()).toBeVisible();
  });

  test('TC-CATALOG-04: Difficulty filter isolates modules of specific level', async ({ page }) => {
    // Select "Tất cả lộ trình" first
    await page.locator('div[role="tablist"] button:has-text("Tất cả lộ trình")').click();

    // Filter by "Nâng cao" (Advanced) using exact name to distinguish from module titles
    await page.getByRole('button', { name: 'Nâng cao', exact: true }).click();
    // Advanced modules should be present in the main catalog view (D09, D10, P09, P10)
    await expect(page.locator('main span:has-text("D09")').first()).toBeVisible();
    await expect(page.locator('main span:has-text("D10")').first()).toBeVisible();
    await expect(page.locator('main span:has-text("P09")').first()).toBeVisible();
    await expect(page.locator('main span:has-text("P10")').first()).toBeVisible();
    // Beginner modules like D01, P01 should NOT be present in main catalog view
    await expect(page.locator('main span:has-text("D01")')).toHaveCount(0);
    await expect(page.locator('main span:has-text("P01")')).toHaveCount(0);
  });

  test('TC-CATALOG-05: Empty state renders when no module matches and reset works', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Tìm module, bài học"]');
    await searchInput.fill('xyz_non_existent_query_99999');

    // Empty state should be visible
    await expect(page.locator('text=Không tìm thấy module phù hợp')).toBeVisible();
    await expect(page.locator('button:has-text("Xóa bộ lọc tìm kiếm")')).toBeVisible();

    // Click reset button
    await page.locator('button:has-text("Xóa bộ lọc tìm kiếm")').click();

    // Modules should reappear
    await expect(page.locator('text=Không tìm thấy module phù hợp')).toHaveCount(0);
    await expect(searchInput).toHaveValue('');
  });

  test('TC-CATALOG-06: Quick Start Module button launches first lesson in SlidePlayer', async ({ page }) => {
    // Click on "Bắt đầu Module (D01)"
    const startModuleButton = page.locator('button:has-text("Bắt đầu Module (D01)")').first();
    await startModuleButton.click();

    // Verify SlidePlayer view launched
    await expect(page.locator('h1')).toContainText('Affinity Designer Workspace & Tri-Persona Architecture');
    await expect(page.locator('text=Slide 1')).toBeVisible();
  });
});
