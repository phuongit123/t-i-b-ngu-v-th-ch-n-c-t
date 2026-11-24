import { expect, test } from '@playwright/test';

test('Ảnh theo từng thao tác phục vụ cả chế độ đọc và trình chiếu', async ({ page }) => {
  await page.goto('/bai-hoc/d02-01');
  await page.getByRole('tab', { name: 'Theo từng bước' }).click();
  const figures = page.locator('#lesson-section-4').getByTestId('lesson-step-figure');
  await expect(figures).toHaveCount(4);
  await expect(figures.nth(1)).toContainText('Tay nắm điều khiển hướng');
  await expect(figures.nth(1).locator('img')).toHaveAttribute('src', '/assets/lessons/steps/d02-01-02.webp');
  await expect(page.locator('#lesson-section-5 img[src*="studio-vector-art"]')).toHaveCount(0);

  const zoom = figures.nth(1).getByRole('button');
  await zoom.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('alt', /Bước 2/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(zoom).toBeFocused();

  await page.getByTestId('lesson-mode-slides').click();
  await page.getByRole('button', { name: 'Hình theo từng bước' }).click();
  await expect(page.getByRole('region', { name: 'Hình minh họa theo từng bước' }).getByTestId('lesson-step-figure')).toHaveCount(4);
});

test('Điện thoại tải hình xếp dọc và phóng to ảnh hướng dẫn', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/bai-hoc/p02-02');
  await page.getByRole('tab', { name: 'Theo từng bước' }).click();
  const figure = page.locator('#lesson-step-3').getByTestId('lesson-step-figure');
  const preview = figure.locator('img');
  await preview.scrollIntoViewIfNeeded();
  await expect.poll(() => preview.evaluate((image: HTMLImageElement) => ({
    file: image.currentSrc ? new URL(image.currentSrc).pathname : '',
    width: image.naturalWidth,
    height: image.naturalHeight,
  }))).toEqual({ file: '/assets/lessons/steps/p02-02-03-stacked.webp', width: 460, height: 588 });
  await figure.getByRole('button').click();
  await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('alt', /Adjustment Brush/);
  await expect(page.getByLabel('Đóng khung xem phóng to')).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
