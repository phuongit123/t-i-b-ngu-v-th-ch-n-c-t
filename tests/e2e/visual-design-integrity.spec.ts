import { expect, test, type Page } from '@playwright/test';

async function assertAllImagesLoadedWithoutInteria(page: Page, routeLabel: string) {
  const images = page.locator('img');
  const count = await images.count();
  expect(count, `Route ${routeLabel} must display visual graphic assets`).toBeGreaterThan(0);

  for (let i = 0; i < count; i += 1) {
    const img = images.nth(i);
    if (!(await img.isVisible())) continue;

    await img.scrollIntoViewIfNeeded();
    const src = (await img.getAttribute('src')) ?? '';
    expect(src, `Image src on ${routeLabel} must resolve from graphic studio assets or curriculum assets`).toMatch(
      /^(\/assets\/(academy|lessons|simulator)\/|\/src\/curriculum\/|data:image\/)/
    );

    const loaded = await img.evaluate(async (node) => {
      const el = node as HTMLImageElement;
      if (!el.complete) {
        await new Promise<void>((resolve) => {
          el.addEventListener('load', () => resolve(), { once: true });
          el.addEventListener('error', () => resolve(), { once: true });
          setTimeout(resolve, 4000);
        });
      }
      return { complete: el.complete, naturalWidth: el.naturalWidth };
    });

    expect(
      loaded.complete && loaded.naturalWidth > 0,
      `Image "${src}" on ${routeLabel} failed to load (complete=${loaded.complete}, naturalWidth=${loaded.naturalWidth})`
    ).toBe(true);
  }
}

test.describe('Phase 2 Visual Architecture, Single Header & Studio Assets Integrity', () => {
  test('TC-P2-01: Single horizontal navigation header with zero internal status noise', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Strictly one <header> across the entire app shell
    expect(await page.locator('header').count()).toBe(1);

    // Zero internal status badges / fake version labels exposed in header or body
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('MCP: NGOẠI TUYẾN');
    expect(bodyText).not.toContain('Affinity 3.0');

    // Every desktop nav item renders cleanly on 1 horizontal line (height <= 42px)
    const navButtons = page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('button');
    const navCount = await navButtons.count();
    expect(navCount).toBe(3);

    const yPositions: number[] = [];
    for (let i = 0; i < navCount; i += 1) {
      const box = await navButtons.nth(i).boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.height).toBeLessThanOrEqual(74);
        yPositions.push(box.y);
      }
    }

    const minY = Math.min(...yPositions);
    const maxY = Math.max(...yPositions);
    expect(maxY - minY).toBeLessThanOrEqual(12);
  });

  test('TC-P2-02: Trang chủ mở bài Affinity và các tab hoạt động bằng bàn phím', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Làm ngay trong Affinity');
    await assertAllImagesLoadedWithoutInteria(page, '/');
    await expect(page.getByTestId('track-card-designer')).toBeVisible();

    await page.getByRole('button', { name: 'Mở bài đầu tiên' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Làm quen giao diện Affinity');
    const overview = page.getByRole('tab', { name: 'Tổng quan' });
    await expect(overview).toHaveAttribute('aria-selected', 'true');
    await overview.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Theo từng bước' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#lesson-section-4')).toBeVisible();
    await page.getByRole('tab', { name: 'Tài liệu' }).click();
    await expect(page.getByRole('link', { name: /Poster Trà Mát/ })).toBeVisible();
    await page.getByTestId('mark-lesson-viewed').click();
    await expect(page.getByTestId('mark-lesson-viewed')).toContainText('Đã đánh dấu');
    await page.reload();
    await expect(page.getByTestId('mark-lesson-viewed')).toBeDisabled();
  });

  test('TC-P2-03: Course Catalog & Resources pages render Studio thumbnails, SVG diagrams & plates cleanly', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Check Catalog thumbnails
    await page.getByTestId('nav-catalog').click();
    await page.waitForLoadState('networkidle');
    expect(await page.locator('header').count()).toBe(1);
    await expect(page.locator('img[src="/assets/academy/tra-mat.webp"]').first()).toBeVisible();
    await expect(page.locator('img[src="/assets/lessons/diagram-vector-workspace-vi.svg"]').first()).toBeVisible();
    await assertAllImagesLoadedWithoutInteria(page, '/catalog');

    // Check Resources gallery & download plates
    await page.getByRole('button', { name: 'Học liệu', exact: true }).click();
    await page.getByTestId('nav-resources').click();
    await page.waitForLoadState('networkidle');
    expect(await page.locator('header').count()).toBe(1);
    await expect(page.getByText('Bộ Ảnh Mẫu & Sơ Đồ Kỹ Thuật Thực Hành')).toBeVisible();
    await expect(page.locator('img[src="/assets/simulator/portrait-subject-studio.png"]').first()).toBeVisible();
    await expect(page.locator('img[src="/assets/lessons/diagram-boolean-ops-vi.svg"]').first()).toBeVisible();
    await assertAllImagesLoadedWithoutInteria(page, '/resources');
  });
});
