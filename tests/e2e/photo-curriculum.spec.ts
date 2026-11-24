import { test, expect, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
async function saveScreenshot(page: Page, filename: string): Promise<void> {
  await page.screenshot({ path: test.info().outputPath(filename) });
}

test('Hai bài Develop có đúng ảnh RAW để làm theo hướng dẫn', async ({ page }) => {
  for (const id of ['p01-02', 'p09-01']) {
    await page.goto(`/bai-hoc/${id}`);
    await page.getByRole('tab', { name: 'Theo từng bước' }).click();
    const starter = page.locator('#lesson-section-4').getByRole('link', { name: /Tải tệp thực hành/ });
    await expect(starter).toHaveAttribute('download', 'P01_RAW_cang_tau.nef');
    const url = await starter.getAttribute('href');
    if (!url) throw new Error('Thiếu đường dẫn tệp RAW.');
    const response = await page.request.get(url);
    expect(response.ok()).toBe(true);
    expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(
      '6c46f9854033e7623ebbb5de8c951df6762ca44f05d45035ccc5cb7e9f4e5692',
    );
    await page.getByRole('tab', { name: 'Bài tập', exact: true }).click();
    await expect(page.locator('#lesson-section-6 a[download$=".nef"]')).toBeVisible();
    await expect(page.locator('#lesson-section-7 a[download$=".nef"]')).toHaveCount(0);
  }
});

test.describe('Giáo trình Pixel Studio (Photo) & Trình mô phỏng Layer', () => {
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

    await saveScreenshot(page, 'photo-catalog-10-modules.png');
  });

  test('TC-PHOTO-02: SlidePlayer khởi chạy và điều hướng bài học P02-01 bằng nhãn tiếng Việt', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('track-card-photo').click();

    await page.getByTestId('lesson-card-P02-01').click();

    await page.getByTestId('lesson-mode-slides').click();
    await expect(page.getByRole('heading', { name: 'Khám Phá Công Cụ & Nguyên Lý Vùng Chọn Pixel' })).toBeVisible();
    await expect(page.getByTestId('slide-counter')).toContainText('Trang 1 / 7');

    await page.getByTestId('next-slide-btn').click();
    await expect(page.getByTestId('slide-counter')).toContainText('Trang 2 / 7');

    await saveScreenshot(page, 'photo-slide-player-active.png');
  });

  test('TC-PHOTO-04: Bài học P10-03 hiển thị nội dung và Mẹo thực hành tiếng Việt sạch', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('track-card-photo').click();

    await page.getByTestId('lesson-card-P10-03').click();

    await page.getByTestId('lesson-mode-slides').click();
    await expect(page.getByRole('heading', { name: 'Khởi động dự án Capstone Masterclass' })).toBeVisible();
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
    await page.getByRole('button', { name: 'Thực hành', exact: true }).click();
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

    await saveScreenshot(page, 'photo-layer-simulator-active.png');
  });
});
