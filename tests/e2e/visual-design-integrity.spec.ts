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
    const navButtons = page.locator('header nav button');
    const navCount = await navButtons.count();
    expect(navCount).toBe(9);

    const yPositions: number[] = [];
    for (let i = 0; i < navCount; i += 1) {
      const box = await navButtons.nth(i).boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.height).toBeLessThanOrEqual(42);
        yPositions.push(box.y);
      }
    }

    const minY = Math.min(...yPositions);
    const maxY = Math.max(...yPositions);
    expect(maxY - minY).toBeLessThanOrEqual(12);
  });

  test('TC-P2-02: Interactive BeforeAfterSlider and Canva Studio Kit switch cleanly on Homepage', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const slider = page.getByTestId('before-after-slider');
    await slider.scrollIntoViewIfNeeded();
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute('aria-valuenow', '50');

    await slider.focus();
    await page.keyboard.press('Shift+ArrowRight');
    const updatedValue = Number(await slider.getAttribute('aria-valuenow'));
    expect(updatedValue).toBeGreaterThan(50);

    // Click Slide 02 Canva Studio Kit button and check slide preview swaps to canva-slide-2.png
    const slide2Btn = page.getByRole('button', { name: /Slide 02 · Canva Studio Kit/i });
    await slide2Btn.scrollIntoViewIfNeeded();
    await slide2Btn.click();
    await expect(page.locator('img[src="/assets/academy/canva-slide-2.png"]')).toBeVisible();

    await assertAllImagesLoadedWithoutInteria(page, '/');

    // Verify Hero primary CTA launches lesson D01-01 directly
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole('button', { name: /Học thử bài D01 ngay/i }).click();
    await expect(page.getByTestId('slide-counter')).toBeVisible();
  });

  test('TC-P2-03: Course Catalog & Resources pages render Studio thumbnails, SVG diagrams & plates cleanly', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Check Catalog thumbnails
    await page.getByTestId('nav-catalog').click();
    await page.waitForLoadState('networkidle');
    expect(await page.locator('header').count()).toBe(1);
    await expect(page.locator('img[src="/assets/academy/studio-vector-art.png"]').first()).toBeVisible();
    await expect(page.locator('img[src="/assets/lessons/diagram-vector-workspace-vi.svg"]').first()).toBeVisible();
    await assertAllImagesLoadedWithoutInteria(page, '/catalog');

    // Check Resources gallery & download plates
    await page.getByTestId('nav-resources').click();
    await page.waitForLoadState('networkidle');
    expect(await page.locator('header').count()).toBe(1);
    await expect(page.getByText('Bộ Ảnh Mẫu & Sơ Đồ Kỹ Thuật Thực Hành')).toBeVisible();
    await expect(page.locator('img[src="/assets/simulator/portrait-subject-studio.png"]').first()).toBeVisible();
    await expect(page.locator('img[src="/assets/lessons/diagram-boolean-ops-vi.svg"]').first()).toBeVisible();
    await assertAllImagesLoadedWithoutInteria(page, '/resources');
  });
});
