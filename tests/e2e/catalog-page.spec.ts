import { test, expect } from '@playwright/test';

test.describe('TASK-072: Course Catalog & Track Browser E2E Tests', () => {
  test('TC-CATALOG-01: Direct access to /catalog displays Course Catalog page title', async ({ page }) => {
    // Test Case 1: Truy cập /catalog, kiểm tra tiêu đề trang "Course Catalog"
    await page.goto('/catalog');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Course Catalog');
    await expect(heading).toContainText('Danh Mục Khóa Học & Lộ Trình Đào Tạo');

    // Verify badge displays Course Catalog
    await expect(page.locator('text=Course Catalog').first()).toBeVisible();
  });

  test('TC-CATALOG-02: Click track filter Photo displays Photo module cards', async ({ page }) => {
    // Test Case 2: Click lọc theo track "Photo", xác nhận hiển thị đúng module card của Photo
    await page.goto('/catalog');

    // Click on Photo filter button (Pixel Studio / Photo)
    const photoFilterBtn = page.locator('button:has-text("Photo")').first();
    await expect(photoFilterBtn).toBeVisible();
    await photoFilterBtn.click();

    // Confirm photo curriculum section heading
    await expect(page.locator('h2')).toContainText('photo Track Curriculum');
    await expect(page.locator('text=30 Lessons Ready to Play')).toBeVisible();

    // Confirm Photo module cards are displayed (P01, P02, P10)
    await expect(page.locator('[data-testid^="module-card-"][data-track="photo"]').first()).toBeVisible();
    await expect(page.locator('[data-testid^="module-card-"][data-track="photo"]')).toHaveCount(10);
    await expect(page.locator('main span:has-text("P01")').first()).toBeVisible();
    await expect(page.locator('main span:has-text("P02")').first()).toBeVisible();
    await expect(page.locator('main span:has-text("P10")').first()).toBeVisible();

    // Confirm Designer module cards (D01, D02) are NOT displayed in main list
    await expect(page.locator('[data-testid^="module-card-"][data-track="designer"]')).toHaveCount(0);
  });

  test('TC-CATALOG-03: Instant search with keyword Masking returns matching module results', async ({ page }) => {
    // Test Case 3: Thử nghiệm thanh instant search với từ khóa "Masking", xác nhận kết quả trả về chính xác
    await page.goto('/catalog');

    // Switch to "Tất cả lộ trình" to search universally across all modules
    await page.locator('button:has-text("Tất cả lộ trình")').click();

    const searchInput = page.locator('input[placeholder*="Tìm module, bài học"]');
    await expect(searchInput).toBeVisible();

    // Search for keyword "Masking"
    await searchInput.fill('Masking');

    // Verify matching module P02 (Layer Nâng Cao, Masking & Chỉnh Sửa Phi Phá Hủy) is displayed
    await expect(page.locator('main span:has-text("P02")').first()).toBeVisible();
    await expect(page.locator('text=Masking').first()).toBeVisible();

    // Verify non-matching beginner module D01 is NOT present in the filtered result
    await expect(page.locator('main span:has-text("D01")')).toHaveCount(0);

    // Clear search and verify full catalog restored
    const clearButton = page.locator('button[aria-label="Xóa từ khóa tìm kiếm"]');
    await expect(clearButton).toBeVisible();
    await clearButton.click();
    await expect(searchInput).toHaveValue('');
    await expect(page.locator('main span:has-text("D01")').first()).toBeVisible();
  });

  test('TC-CATALOG-04: Displays all 4 Track overview cards and TrackFilterBar options', async ({ page }) => {
    await page.goto('/catalog');

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

  test('TC-CATALOG-05: Difficulty filter isolates modules of specific level', async ({ page }) => {
    await page.goto('/catalog');

    // Select "Tất cả lộ trình" first
    await page.locator('button:has-text("Tất cả lộ trình")').click();

    // Filter by "Nâng cao" (Advanced)
    await page.getByRole('button', { name: 'Nâng cao', exact: true }).click();

    // Advanced modules should be present (D09, D10, P09, P10)
    await expect(page.locator('main span:has-text("D09")').first()).toBeVisible();
    await expect(page.locator('main span:has-text("D10")').first()).toBeVisible();
    await expect(page.locator('main span:has-text("P09")').first()).toBeVisible();
    await expect(page.locator('main span:has-text("P10")').first()).toBeVisible();

    // Beginner modules like D01, P01 should NOT be present in filtered results
    await expect(page.locator('main span:has-text("D01")')).toHaveCount(0);
    await expect(page.locator('main span:has-text("P01")')).toHaveCount(0);
  });

  test('TC-CATALOG-06: Empty state renders when no module matches and reset works', async ({ page }) => {
    await page.goto('/catalog');

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

  test('TC-CATALOG-07: Quick Start Module button launches first lesson in SlidePlayer', async ({ page }) => {
    await page.goto('/catalog');

    // Click on "Bắt đầu Module (D01)"
    const startModuleButton = page.locator('button:has-text("Bắt đầu Module (D01)")').first();
    await expect(startModuleButton).toBeVisible();
    await startModuleButton.click();

    // Verify SlidePlayer view launched
    await expect(page.locator('h1')).toContainText('Affinity Designer Workspace & Tri-Persona Architecture');
    await expect(page.locator('text=Slide 1')).toBeVisible();
  });
});
