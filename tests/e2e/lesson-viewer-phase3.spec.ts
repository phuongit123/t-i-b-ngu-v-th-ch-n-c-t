import { expect, test } from '@playwright/test';

test.describe('Phase 3 Multi-Pane Lesson Viewer, Safe Markdown & Vietnamese Curriculum', () => {
  test('TC-P3-01: Multi-pane D01-01 renders outline sidebar, clean Markdown, and step illustration zoom', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/catalog');
    await page.getByTestId('lesson-card-D01-01').click();

    await expect(page.getByTestId('outline-sidebar')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Làm quen giao diện Affinity và ba Studio');

    // Starter asset link must resolve and return real guide content (not HTML 404 fallback)
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId('lesson-starter-download').click(),
    ]);
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    expect(Buffer.concat(chunks).toString()).toContain('TÀI LIỆU HƯỚNG DẪN');

    await page.getByTestId('lesson-mode-slides').click();

    // The first tool illustration loads and opens a zoomable view.
    const diagramImg = page.locator('img[src="/assets/lessons/steps/d01-01-01.webp"]');
    await expect(diagramImg).toBeVisible();
    await expect.poll(() => diagramImg.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);

    await page.getByTestId('open-visual-lightbox').click();
    await expect(page.getByTestId('lesson-visual-lightbox')).toBeVisible();
    await page.getByLabel('Đóng khung xem phóng to').click();
    await expect(page.getByTestId('lesson-visual-lightbox')).toHaveCount(0);

    // Traverse all slides of D01-01: zero raw ** or ### tokens in rendered text
    const counterText = await page.getByTestId('slide-counter').innerText();
    const totalMatch = /\/\s*(\d+)/.exec(counterText);
    const totalSlides = totalMatch ? Number(totalMatch[1]) : 7;

    for (let s = 0; s < totalSlides; s++) {
      const stageText = await page.locator('main').innerText();
      expect(stageText).not.toContain('**');
      expect(stageText).not.toContain('### ');
      if (s < totalSlides - 1) {
        await page.getByTestId('next-slide-btn').click();
      }
    }
  });

  test('TC-P3-02: Switching to 10-Section Reader Mode renders full 10 pedagogical sections, Markdown tables, and quiz', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/catalog');
    await page.getByTestId('lesson-card-D01-01').click();

    await page.locator('.course-section-index summary').click();
    await page.getByTestId('outline-section-5').click();
    await expect(page.locator('#lesson-section-5 table')).toBeVisible();
    await page.getByTestId('lesson-mode-sections').click();
    const reader = page.getByTestId('lesson-sections-reader');
    await expect(reader).toBeVisible();

    await expect(reader.locator('#lesson-section-1')).toContainText('Bạn sẽ làm được gì');
    await expect(reader.locator('#lesson-section-10')).toContainText('10 · Tổng kết nguyên lý');
    await expect(reader.locator('#lesson-section-5 table')).toBeVisible();
    await expect(reader.locator('#lesson-section-9')).toContainText('Kiểm tra kiến thức');
  });

  test('TC-P3-03: Vietnamese localization renders across Publisher B01-01, Scripting S01-01, and legacy D10-01', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/catalog');

    // D01-01 -> Next Lesson button advances cleanly to D01-02
    await page.getByTestId('lesson-card-D01-01').click();
    await page.getByTestId('next-lesson-btn').click();
    await expect(page.locator('h1')).toContainText('Cấu trúc Artboard và thiết lập bản vẽ đơn');

    // Check D10-01 legacy bullets/criteria/pitfalls render cleanly in Vietnamese 10-section mode
    await page.goto('/catalog');
    await page.getByTestId('lesson-card-D10-01').click();
    await page.getByTestId('lesson-mode-sections').click();
    await expect(page.locator('#lesson-section-8')).toContainText('Cách xử lý');

    // Check Publisher B01-01
    await page.goto('/catalog');
    await page.getByTestId('track-filter-publisher').click();
    await page.getByTestId('lesson-card-B01-01').click();
    await page.getByRole('tab', { name: 'Theo từng bước' }).click();
    await expect(page.getByTestId('lesson-step-figure')).toHaveCount(5);
    await expect(page.locator('#lesson-step-4 img')).toHaveAttribute('alt', /Bleed/);

    // Check Scripting S01-01
    await page.goto('/catalog');
    await page.getByTestId('track-filter-scripting').click();
    await page.getByTestId('lesson-card-S01-01').click();
    await page.getByRole('tab', { name: 'Theo từng bước' }).click();
    await expect(page.getByTestId('lesson-step-figure')).toHaveCount(4);
    await expect(page.locator('#lesson-step-2 img')).toHaveAttribute('alt', /Console/);
  });
});
