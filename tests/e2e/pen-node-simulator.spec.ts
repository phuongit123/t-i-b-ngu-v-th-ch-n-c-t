import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Phòng mô phỏng Pen & Node Tool Bézier (Vector Studio)', () => {
  test.beforeAll(() => {
    const screenshotsDir = path.resolve('tests/screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-simulator').click();
    await expect(page.locator('h1')).toContainText('Bộ Mô Phỏng Bézier Pen & Node Tool');
  });

  test('TC-SIM-01: Hiển thị biểu ngữ mô phỏng giáo dục và các công cụ Vector chính', async ({ page }) => {
    const banner = page.locator('strong:has-text("Bản mô phỏng cơ chế Bézier trong trình duyệt")');
    await expect(banner).toBeVisible();

    await expect(page.locator('button:has-text("Pen Tool [P]")')).toBeVisible();
    await expect(page.locator('button:has-text("Node Tool [A]")')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sharp', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Smooth', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Smart', exact: true })).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/simulator-initial-state.png' });
  });

  test('TC-SIM-02: Pen Tool đặt 4 đỉnh hình thoi, khép kín path và chấm điểm độ chính xác', async ({ page }) => {
    const svg = page.locator('svg.cursor-crosshair');

    await svg.click({ position: { x: 400, y: 120 } });
    await page.waitForTimeout(100);
    await svg.click({ position: { x: 580, y: 260 } });
    await page.waitForTimeout(100);
    await svg.click({ position: { x: 400, y: 400 } });
    await page.waitForTimeout(100);
    await svg.click({ position: { x: 220, y: 260 } });
    await page.waitForTimeout(100);

    await page.screenshot({ path: 'tests/screenshots/simulator-canvas-active.png' });

    await svg.click({ position: { x: 400, y: 120 } });
    await page.waitForTimeout(200);

    const statusText = await page.locator('.absolute.bottom-2').textContent();
    expect(statusText).toContain('Nodes: 4');
    expect(statusText).toContain('Đóng (Closed)');

    await page.locator('button:has-text("Chấm điểm đường cong")').click();
    await page.waitForTimeout(200);

    const evalCard = page.locator('text=Độ chính xác:');
    await expect(evalCard).toBeVisible();
    const evalText = await evalCard.textContent();
    expect(evalText).toMatch(/Độ chính xác: \d+%/);

    await page.screenshot({ path: 'tests/screenshots/simulator-diamond-evaluated.png' });
  });

  test('TC-SIM-03: Node Tool chọn điểm neo và chuyển đổi giữa Sharp và Smooth', async ({ page }) => {
    const svg = page.locator('svg.cursor-crosshair');

    await svg.click({ position: { x: 300, y: 200 } });
    await page.waitForTimeout(50);
    await svg.click({ position: { x: 400, y: 300 } });
    await page.waitForTimeout(50);
    await svg.click({ position: { x: 500, y: 200 } });
    await page.waitForTimeout(50);

    await page.locator('button:has-text("Node Tool [A]")').click();
    await svg.click({ position: { x: 400, y: 300 } });
    await page.waitForTimeout(100);

    const smoothBtn = page.getByRole('button', { name: 'Smooth', exact: true });
    await expect(smoothBtn).toBeEnabled();

    await smoothBtn.click();
    await page.waitForTimeout(100);

    const statusText = await page.locator('.absolute.bottom-2').textContent();
    expect(statusText).toContain('(smooth)');

    await page.screenshot({ path: 'tests/screenshots/simulator-node-tool-smooth.png' });
  });

  test('TC-SIM-04: Hỗ trợ Hoàn tác (Undo), Làm lại (Redo) và Vẽ lại từ đầu', async ({ page }) => {
    const svg = page.locator('svg.cursor-crosshair');

    await svg.click({ position: { x: 200, y: 200 } });
    await page.waitForTimeout(50);
    await svg.click({ position: { x: 300, y: 250 } });
    await page.waitForTimeout(50);

    let status = await page.locator('.absolute.bottom-2').textContent();
    expect(status).toContain('Nodes: 2');

    await page.locator('button[title*="Hoàn tác"]').click();
    await page.waitForTimeout(100);
    status = await page.locator('.absolute.bottom-2').textContent();
    expect(status).toContain('Nodes: 1');

    await page.locator('button[title*="Làm lại"]').click();
    await page.waitForTimeout(100);
    status = await page.locator('.absolute.bottom-2').textContent();
    expect(status).toContain('Nodes: 2');

    await page.locator('button[title*="Vẽ lại từ đầu"]').click();
    await page.waitForTimeout(100);
    status = await page.locator('.absolute.bottom-2').textContent();
    expect(status).toContain('Nodes: 0');
  });

  test('TC-SIM-05: Chuyển đổi bài tập mẫu S-Wave và Trái tim hiển thị đường nét mẫu', async ({ page }) => {
    await page.locator('text=D03: Đường cong chữ S mượt').click();
    await page.waitForTimeout(100);
    const waveGhost = page.locator('path[stroke-dasharray="6 4"]');
    await expect(waveGhost).toBeVisible();

    await page.locator('text=D03: Biểu tượng trái tim').click();
    await page.waitForTimeout(100);
    const heartGhost = page.locator('path[stroke-dasharray="6 4"]');
    await expect(heartGhost).toBeVisible();
    await expect(page.locator('text=Rãnh trên (400, 190)')).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/simulator-heart-exercise.png' });
  });

  test('TC-SIM-06: Kiểm tra giao diện đáp ứng trên Tablet và Mobile', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(150);
    await page.screenshot({ path: 'tests/screenshots/simulator-tablet-768.png' });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(150);
    await page.screenshot({ path: 'tests/screenshots/simulator-mobile-375.png' });
  });
});
