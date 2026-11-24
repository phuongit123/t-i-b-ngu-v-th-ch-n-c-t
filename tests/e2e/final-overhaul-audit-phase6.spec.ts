import { test, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const SCRATCH_SCREENSHOT_DIR = path.resolve('test-results', 'phase6-audit');

async function saveAuditScreenshot(page: Page, filename: string): Promise<void> {
  if (!fs.existsSync(SCRATCH_SCREENSHOT_DIR)) {
    fs.mkdirSync(SCRATCH_SCREENSHOT_DIR, { recursive: true });
  }
  const buffer = await page.screenshot();
  const targetPath = path.join(SCRATCH_SCREENSHOT_DIR, filename);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      fs.writeFileSync(targetPath, buffer);
      return;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (attempt < 2 && (code === 'UNKNOWN' || code === 'EBUSY' || code === 'EPERM')) {
        await new Promise((r) => setTimeout(r, 120));
        continue;
      }
      throw err;
    }
  }
}

test.describe('Phase 6 — Kiểm Toán Cuối Cùng: Hành Trình Học Viên, Chống Gian Lận & Responsive', () => {
  test('TC-P6-01: Hành trình học viên xuyên suốt Trang chủ -> Đọc sâu 10 Học phần -> Hoàn thành -> Đồng bộ Hồ sơ 1/66', async ({
    page,
  }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify clean Vietnamese HTML & zero broken visible images
    const domHealth = await page.evaluate(() => {
      const lang = document.documentElement.lang;
      const headerCount = document.querySelectorAll('header').length;
      const imgs = Array.from(document.querySelectorAll('img'));
      const brokenImgs = imgs
        .filter((img) => {
          const style = window.getComputedStyle(img);
          return style.display !== 'none' && img.complete && img.naturalWidth === 0;
        })
        .map((img) => img.getAttribute('src'));
      const bodyText = document.body.innerText;
      const hasRawMarkdown = /\*\*[^*]+\*\*/.test(bodyText) || /^###\s/m.test(bodyText);
      const hasRawLatex = /\$180|\$1\.0\$|\$50\\%/.test(bodyText);
      return { lang, headerCount, brokenImgs, hasRawMarkdown, hasRawLatex, imgCount: imgs.length };
    });

    expect(domHealth.lang).toBe('vi');
    expect(domHealth.headerCount).toBe(1);
    expect(domHealth.imgCount).toBeGreaterThan(0);
    expect(domHealth.brokenImgs).toEqual([]);
    expect(domHealth.hasRawMarkdown).toBe(false);
    expect(domHealth.hasRawLatex).toBe(false);

    // Launch D01-01 cleanly and switch to 10-Section Reader mode
    await page.goto('/bai-hoc/d01-01');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('lesson-mode-sections')).toBeVisible();
    await page.getByTestId('lesson-mode-sections').click();

    // Assert all 10 sections render cleanly in DOM
    for (let i = 1; i <= 10; i++) {
      await expect(page.locator(`#lesson-section-${i}`)).toBeVisible();
    }

    // Complete lesson directly from Section 10
    const completeBtn = page.getByTestId('sections-complete-lesson-btn');
    await expect(completeBtn).toBeVisible();
    await completeBtn.click();
    await expect(completeBtn).toContainText('Đã hoàn thành bài học');

    // Navigate to Dashboard and confirm live persistence updated 0 -> 1 / 66
    await page.getByTestId('nav-dashboard').click();
    await expect(page.locator('h1')).toContainText('Bảng Điều Khiển Học Viên');
    await expect(page.getByTestId('dashboard-completed-card')).toContainText('1 / 66 bài');
  });

  test('TC-P6-02: Chống gian lận Thử thách thực hành (0 thao tác = 0%) & Bảo vệ RBAC Giám khảo Đồ án A5', async ({
    page,
  }) => {
    await page.goto('/thu-thach');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/thu-thach');
    await page.waitForLoadState('networkidle');

    // Submitting live canvas evaluation with zero interaction must evaluate to 0%
    await page.getByTestId('evaluate-live-canvas-btn').click();
    const evalBanner = page.getByTestId('challenge-evaluation-result');
    await expect(evalBanner).toBeVisible();
    await expect(evalBanner).toContainText('Độ chính xác: 0%');
    await expect(evalBanner).toContainText('CẦN CẢI THIỆN');

    // Visit Capstone as student: zero evaluator controls may exist
    await page.goto('/do-an-tot-nghiep');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Lumina');
    await expect(page.locator('button:has-text("Chấm điểm chính thức")')).toHaveCount(0);
    await expect(page.getByTestId('evaluator-panel')).toHaveCount(0);
  });

  test('TC-P6-03: Kiểm toán giao diện đáp ứng đa khung nhìn (Desktop 1440, Tablet 768, Mobile 375) không tràn ngang', async ({
    page,
  }) => {
    const auditRoutes = [
      { route: '/', checkHeading: 'h1' },
      { route: '/lo-trinh/bat-dau', checkHeading: 'h1' },
      { route: '/lo-trinh/vector-studio', checkHeading: 'h1' },
      { route: '/bai-hoc/d01-01', checkHeading: 'h2' },
      { route: '/phong-mo-phong', checkHeading: 'h1' },
      { route: '/thuc-hanh-tu-dong-hoa', checkHeading: 'h1' },
    ];

    const viewports = [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 812 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const item of auditRoutes) {
        await page.goto(item.route, { waitUntil: 'domcontentloaded' });
        await expect(page.locator(item.checkHeading).first()).toBeVisible();
        await page.evaluate(() => document.fonts.ready);

        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }));
        expect(
          overflow.scrollWidth,
          `Horizontal overflow on ${vp.name} (${vp.width}px) route ${item.route}: scrollWidth=${overflow.scrollWidth}, innerWidth=${overflow.innerWidth}`
        ).toBeLessThanOrEqual(overflow.innerWidth + 2);

        if (vp.name === 'desktop' && item.route === '/') {
          await saveAuditScreenshot(page, 'phase6-desktop-home.png');
        } else if (vp.name === 'desktop' && item.route === '/thuc-hanh-tu-dong-hoa') {
          await saveAuditScreenshot(page, 'phase6-desktop-playground.png');
        } else if (vp.name === 'tablet' && item.route === '/lo-trinh/vector-studio') {
          await saveAuditScreenshot(page, 'phase6-tablet-catalog.png');
        } else if (vp.name === 'mobile' && item.route === '/') {
          await saveAuditScreenshot(page, 'phase6-mobile-home.png');
        } else if (vp.name === 'mobile' && item.route === '/bai-hoc/d01-01') {
          await saveAuditScreenshot(page, 'phase6-mobile-lesson.png');
        }
      }
    }

    // Test mobile drawer open & navigation cleanly at 375x812
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const mobileMenuBtn = page.locator('button[aria-label="Mở menu di động"]');
    await expect(mobileMenuBtn).toBeVisible();
    await mobileMenuBtn.click();
    await expect(page.getByTestId('mobile-nav-catalog')).toBeVisible();
    await page.getByTestId('mobile-nav-catalog').click();
    await expect(page.locator('h1')).toContainText('Khóa học');
  });
});
