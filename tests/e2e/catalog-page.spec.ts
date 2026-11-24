import { test, expect } from '@playwright/test';

test.describe('Danh mục khóa học & Bộ lọc chuyên ngành', () => {
  test('TC-CATALOG-01: Truy cập /catalog hiển thị đầy đủ tiêu đề và huy hiệu tiếng Việt', async ({ page }) => {
    await page.goto('/catalog');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Khóa học Affinity');
    await expect(page.locator('text=66 bài · 22 học phần').first()).toBeVisible();
  });

  test('TC-CATALOG-02: Lọc chuyên ngành Pixel Studio hiển thị đúng 10 học phần P01-P10', async ({ page }) => {
    await page.goto('/catalog');

    const photoFilterBtn = page.getByTestId('track-filter-photo');
    await expect(photoFilterBtn).toBeVisible();
    await photoFilterBtn.click();

    await expect(page.getByTestId('catalog-track-heading')).toContainText('Pixel Studio');
    await expect(page.getByTestId('catalog-lesson-count-badge')).toContainText('30 bài học sẵn sàng');

    await expect(page.locator('[data-testid^="module-card-"][data-track="photo"]').first()).toBeVisible();
    await expect(page.locator('[data-testid^="module-card-"][data-track="photo"]')).toHaveCount(10);
    await expect(page.locator('main span:has-text("P01")').first()).toBeVisible();
    await expect(page.locator('main span:has-text("P10")').first()).toBeVisible();

    await expect(page.locator('[data-testid^="module-card-"][data-track="designer"]')).toHaveCount(0);
  });

  test('TC-CATALOG-03: Tìm kiếm tức thì với từ khóa Masking trả về học phần phù hợp', async ({ page }) => {
    await page.goto('/catalog');

    await page.getByTestId('track-filter-all').click();

    const searchInput = page.locator('input[placeholder*="Tìm học phần, bài học"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Masking');

    await expect(page.getByTestId('module-card-P03')).toBeVisible();
    await expect(page.getByTestId('module-card-D01')).toHaveCount(0);

    const clearButton = page.locator('button[aria-label="Xóa từ khóa tìm kiếm"]');
    await expect(clearButton).toBeVisible();
    await clearButton.click();
    await expect(searchInput).toHaveValue('');
    await expect(page.getByTestId('module-card-D01')).toBeVisible();
  });

  test('TC-CATALOG-04: Hiển thị 4 thẻ Studio tổng quan và đủ 5 tab lọc lộ trình', async ({ page }) => {
    await page.goto('/catalog');

    await expect(page.getByTestId('track-card-designer')).toBeVisible();
    await expect(page.getByTestId('track-card-photo')).toBeVisible();
    await expect(page.getByTestId('track-card-publisher')).toBeVisible();
    await expect(page.getByTestId('track-card-scripting')).toBeVisible();

    const filterBar = page.locator('div[role="tablist"][aria-label="Lọc khóa học theo chuyên ngành"]');
    await expect(filterBar).toBeVisible();
    await expect(filterBar.getByTestId('track-filter-all')).toBeVisible();
    await expect(filterBar.getByTestId('track-filter-designer')).toBeVisible();
    await expect(filterBar.getByTestId('track-filter-photo')).toBeVisible();
    await expect(filterBar.getByTestId('track-filter-publisher')).toBeVisible();
    await expect(filterBar.getByTestId('track-filter-scripting')).toBeVisible();
  });

  test('TC-CATALOG-05: Lọc độ khó Nâng cao chỉ hiển thị học phần chuyên sâu', async ({ page }) => {
    await page.goto('/catalog');

    await page.getByTestId('track-filter-all').click();
    await page.getByRole('button', { name: 'Nâng cao', exact: true }).click();

    await expect(page.getByTestId('module-card-D09')).toBeVisible();
    await expect(page.getByTestId('module-card-D10')).toBeVisible();
    await expect(page.getByTestId('module-card-P09')).toBeVisible();
    await expect(page.getByTestId('module-card-P10')).toBeVisible();

    await expect(page.getByTestId('module-card-D01')).toHaveCount(0);
    await expect(page.getByTestId('module-card-P01')).toHaveCount(0);
  });

  test('TC-CATALOG-06: Trạng thái rỗng và nút Xóa bộ lọc khôi phục danh sách', async ({ page }) => {
    await page.goto('/catalog');

    const searchInput = page.locator('input[placeholder*="Tìm học phần, bài học"]');
    await searchInput.fill('xyz_non_existent_query_99999');

    await expect(page.locator('text=Không tìm thấy học phần phù hợp')).toBeVisible();
    await expect(page.locator('button:has-text("Xóa bộ lọc tìm kiếm")')).toBeVisible();

    await page.locator('button:has-text("Xóa bộ lọc tìm kiếm")').click();

    await expect(page.locator('text=Không tìm thấy học phần phù hợp')).toHaveCount(0);
    await expect(searchInput).toHaveValue('');
  });

  test('TC-CATALOG-07: Bắt đầu học phần D01 mở trình học bài giảng tiếng Việt', async ({ page }) => {
    await page.goto('/catalog');

    const startModuleButton = page.getByTestId('start-module-D01');
    await expect(startModuleButton).toBeVisible();
    await startModuleButton.click();

    await expect(page.locator('h1')).toContainText('Làm quen giao diện Affinity và ba Studio');
    await page.getByTestId('lesson-mode-slides').click();
    await expect(page.getByTestId('slide-counter')).toContainText('Trang 1');
  });
});
