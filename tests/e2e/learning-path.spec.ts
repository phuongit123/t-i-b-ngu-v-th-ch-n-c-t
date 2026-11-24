import { expect, test } from '@playwright/test';

test('A beginner can start a practical project and follow the recommended lesson order', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Bắt đầu từ số 0' }).click();
  await expect(page.getByRole('heading', { name: 'Học Affinity từ số 0' })).toBeVisible();
  await page.getByRole('link', { name: 'Bắt đầu bài thực hành' }).click();
  await expect(page).toHaveURL(/lo-trinh\/bat-dau#bai-dau-tien$/);
  await expect(page.getByRole('list', { name: 'Các bước dựng poster' }).locator('> li')).toHaveCount(5);
  await expect(page.locator('#bai-dau-tien').getByTestId('lesson-step-figure')).toHaveCount(5);
  const draft = page.getByRole('button', { name: 'Bản nháp' });
  await draft.click();
  await expect(draft).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Bản đã sửa' }).click();
  await expect(draft).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Mở bài làm quen Affinity' }).click();
  await expect(page).toHaveURL(/bai-hoc\/d01-01[^?]*\?tu=lo-trinh$/);
  await page.getByTestId('mark-lesson-viewed').click();
  await page.getByRole('link', { name: 'Về chặng Nền tảng thị giác' }).click();
  await expect(page.locator('#nen-tang')).toHaveAttribute('open', '');
  await expect(page.locator('#nen-tang')).toContainText('1/4 bài đã đánh dấu');
  await page.locator('#nen-tang a[href*="d01-03"]').click();
  await expect(page.getByTestId('next-lesson-btn')).toHaveAttribute('href', /d06-01.*\?tu=lo-trinh$/);
  await page.getByTestId('next-lesson-btn').click();
  await page.getByRole('link', { name: 'Làm bài tự làm của chặng Nền tảng thị giác' }).click();
  await expect(page.locator('#nen-tang')).toHaveAttribute('open', '');
  await expect(page.locator('#nen-tang').getByText(/buổi chiếu phim ngoài trời/)).toBeVisible();
  await page.getByRole('link', { name: 'Mở đề và tiêu chí chấm' }).click();
  await expect(page).toHaveURL(/do-an-tot-nghiep$/);
});

test('Lesson tabs use the full reading area with the module outline open', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/bai-hoc/d01-01');
  await expect(page.getByTestId('outline-sidebar')).toBeVisible();
  const reader = page.getByTestId('lesson-sections-reader');
  const width = await page.locator('.course-lesson').evaluate((node) => node.getBoundingClientRect().width);
  for (const name of ['Tổng quan', 'Theo từng bước', 'Bài tập', 'Tài liệu']) {
    await page.getByRole('tab', { name, exact: true }).click();
    const box = await reader.boundingBox();
    expect(box?.width).toBeCloseTo(width, 0);
  }
  await page.getByRole('tab', { name: 'Bài tập', exact: true }).click();
  const guided = page.locator('#lesson-section-6');
  const independent = page.locator('#lesson-section-7');
  const desktopGuided = await guided.boundingBox();
  const desktopIndependent = await independent.boundingBox();
  expect(desktopGuided?.y).toBeCloseTo(desktopIndependent?.y ?? NaN);
  expect(desktopIndependent?.x).toBeGreaterThan(desktopGuided?.x ?? NaN);
  await expect(guided.getByText('Kết quả mong đợi:', { exact: true })).toHaveCSS('color', 'rgb(32, 77, 61)');
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileGuided = await guided.boundingBox();
  const mobileIndependent = await independent.boundingBox();
  expect(mobileGuided?.x).toBeCloseTo(mobileIndependent?.x ?? NaN);
  expect(mobileIndependent?.y).toBeGreaterThan(mobileGuided?.y ?? NaN);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
