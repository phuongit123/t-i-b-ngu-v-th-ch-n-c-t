import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Giáo trình Pixel Studio (Photo) & Trình mô phỏng Layer', () => {
  test.beforeAll(() => {
    const screenshotsDir = path.resolve('tests/screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('TC-PHOTO-01: Danh mục lọc lộ trình Pixel Studio hiển thị 10 học phần và 30 bài học', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-catalog').click();

    await page.getByTestId('track-card-photo').click();

    await expect(page.getByTestId('catalog-track-heading')).toContainText('Pixel Studio');
    await expect(page.getByTestId('catalog-lesson-count-badge')).toContainText('30 bài học sẵn sàng');

    for (let i = 1; i <= 10; i++) {
      const modNumber = i < 10 ? `P0${i}` : `P${i}`;
      await expect(page.getByTestId(`module-card-${modNumber}`)).toBeVisible();
    }

    await page.screenshot({ path: 'tests/screenshots/photo-catalog-10-modules.png' });
  });

  test('TC-PHOTO-02: SlidePlayer khởi chạy và điều hướng bài học P02-01 bằng nhãn tiếng Việt', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('track-card-photo').click();

    await page.getByTestId('lesson-card-P02-01').click();

    await expect(page.locator('h1')).toContainText('Khám Phá Công Cụ & Nguyên Lý Vùng Chọn Pixel');
    await expect(page.getByTestId('slide-counter')).toContainText('Trang 1 / 7');

    await page.getByTestId('next-slide-btn').click();
    await expect(page.getByTestId('slide-counter')).toContainText('Trang 2 / 7');

    await page.screenshot({ path: 'tests/screenshots/photo-slide-player-active.png' });
  });

  test('TC-PHOTO-04: Bài học P10-03 hiển thị nội dung và Mẹo thực hành tiếng Việt sạch', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('track-card-photo').click();

    await page.getByTestId('lesson-card-P10-03').click();

    await expect(page.locator('h1')).toContainText('Khởi động dự án Capstone Masterclass');
    await expect(
      page.getByText('Chào mừng bạn đến với đồ án tốt nghiệp Track 2 Affinity Photo!', {
        exact: false,
      })
    ).toBeVisible();
    await expect(page.getByText('Mẹo thực hành')).toBeVisible();

    await page.getByTestId('next-slide-btn').click();
    await expect(page.getByText('Mở file RAW.', { exact: false })).toBeVisible();
  });

  test('TC-PHOTO-03: Trình mô phỏng Pixel Studio hiển thị bảng Layer và tương tác Mask', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-simulator').click();

    await page.getByTestId('sim-tab-photo').click();

    const disclaimer = page.locator('strong:has-text("MÔ HÌNH MÔ PHỎNG GIÁO DỤC:")');
    await expect(disclaimer).toBeVisible();

    await expect(page.locator('h3:has-text("Layers Studio")')).toBeVisible();
    await expect(page.getByTestId('layer-item-layer-subject')).toBeVisible();
    await expect(page.getByTestId('layer-item-layer-bg')).toBeVisible();

    await page.locator('button:has-text("2. Blend Modes")').click();
    await page.locator('button:has-text("Invert Mask")').click();

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/photo-layer-simulator-active.png' });
  });
});
