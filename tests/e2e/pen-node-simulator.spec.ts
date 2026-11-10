import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Phase 4 MVP: Pen & Node Tool Bézier Simulator', () => {
  test.beforeAll(() => {
    const screenshotsDir = path.resolve('tests/screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Simulator")').click();
    await expect(page.locator('h1')).toContainText('Affinity Pen & Node Tool Bézier Simulator');
  });

  test('TC-SIM-01: Displays mandatory disclaimer banner and tools', async ({ page }) => {
    const banner = page.locator('strong:has-text("Bản mô phỏng cơ chế Bézier trong trình duyệt")');
    await expect(banner).toBeVisible();

    await expect(page.locator('button:has-text("Pen Tool [P]")')).toBeVisible();
    await expect(page.locator('button:has-text("Node Tool [A]")')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sharp', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Smooth', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Smart', exact: true })).toBeVisible();

    // Visual proof: Initial simulator view
    await page.screenshot({ path: 'tests/screenshots/simulator-initial-state.png' });
  });

  test('TC-SIM-02: Pen Tool places nodes, closes path, and evaluates accuracy', async ({ page }) => {
    const svg = page.locator('svg.cursor-crosshair');

    // Place 4 diamond nodes using exact relative SVG coordinates
    await svg.click({ position: { x: 400, y: 120 } });
    await page.waitForTimeout(100);
    await svg.click({ position: { x: 580, y: 260 } });
    await page.waitForTimeout(100);
    await svg.click({ position: { x: 400, y: 400 } });
    await page.waitForTimeout(100);
    await svg.click({ position: { x: 220, y: 260 } });
    await page.waitForTimeout(100);

    // Visual proof: Active canvas with drawn nodes
    await page.screenshot({ path: 'tests/screenshots/simulator-canvas-active.png' });

    // Click start node to close path
    await svg.click({ position: { x: 400, y: 120 } });
    await page.waitForTimeout(200);

    // Verify closed path
    const statusText = await page.locator('.absolute.bottom-2').textContent();
    expect(statusText).toContain('Nodes: 4');
    expect(statusText).toContain('Đóng (Closed)');

    // Click Evaluate
    await page.locator('button:has-text("Chấm điểm đường cong")').click();
    await page.waitForTimeout(200);

    const evalCard = page.locator('text=Độ chính xác:');
    await expect(evalCard).toBeVisible();
    const evalText = await evalCard.textContent();
    expect(evalText).toMatch(/Độ chính xác: \d+%/);

    // Visual proof: Evaluated path score card
    await page.screenshot({ path: 'tests/screenshots/simulator-diamond-evaluated.png' });
  });

  test('TC-SIM-03: Node Tool selects node and converts between Sharp and Smooth', async ({ page }) => {
    const svg = page.locator('svg.cursor-crosshair');

    // Place 3 nodes
    await svg.click({ position: { x: 300, y: 200 } });
    await page.waitForTimeout(50);
    await svg.click({ position: { x: 400, y: 300 } });
    await page.waitForTimeout(50);
    await svg.click({ position: { x: 500, y: 200 } });
    await page.waitForTimeout(50);

    // Switch to Node Tool
    await page.locator('button:has-text("Node Tool [A]")').click();

    // Select node 2
    await svg.click({ position: { x: 400, y: 300 } });
    await page.waitForTimeout(100);

    // Smooth button should be enabled
    const smoothBtn = page.getByRole('button', { name: 'Smooth', exact: true });
    await expect(smoothBtn).toBeEnabled();

    // Convert to smooth
    await smoothBtn.click();
    await page.waitForTimeout(100);

    const statusText = await page.locator('.absolute.bottom-2').textContent();
    expect(statusText).toContain('(smooth)');

    // Visual proof: Node Tool with smooth handles
    await page.screenshot({ path: 'tests/screenshots/simulator-node-tool-smooth.png' });
  });

  test('TC-SIM-04: Supports Undo, Redo, and Reset', async ({ page }) => {
    const svg = page.locator('svg.cursor-crosshair');

    // Place node 1
    await svg.click({ position: { x: 200, y: 200 } });
    await page.waitForTimeout(50);
    // Place node 2
    await svg.click({ position: { x: 300, y: 250 } });
    await page.waitForTimeout(50);

    let status = await page.locator('.absolute.bottom-2').textContent();
    expect(status).toContain('Nodes: 2');

    // Undo
    await page.locator('button[title*="Hoàn tác"]').click();
    await page.waitForTimeout(100);
    status = await page.locator('.absolute.bottom-2').textContent();
    expect(status).toContain('Nodes: 1');

    // Redo
    await page.locator('button[title*="Làm lại"]').click();
    await page.waitForTimeout(100);
    status = await page.locator('.absolute.bottom-2').textContent();
    expect(status).toContain('Nodes: 2');

    // Reset
    await page.locator('button[title*="Vẽ lại từ đầu"]').click();
    await page.waitForTimeout(100);
    status = await page.locator('.absolute.bottom-2').textContent();
    expect(status).toContain('Nodes: 0');
  });

  test('TC-SIM-05: Exercises switch target ghost path and hints', async ({ page }) => {
    // Switch to Wave exercise
    await page.locator('text=D03: Smooth S-Wave Curve').click();
    await page.waitForTimeout(100);
    const waveGhost = page.locator('path[stroke-dasharray="6 4"]');
    await expect(waveGhost).toBeVisible();

    // Switch to Heart exercise
    await page.locator('text=D03: Heart Silhouette').click();
    await page.waitForTimeout(100);
    const heartGhost = page.locator('path[stroke-dasharray="6 4"]');
    await expect(heartGhost).toBeVisible();
    await expect(page.locator('text=Rãnh trên (400, 190)')).toBeVisible();

    // Visual proof: Heart exercise guidelines
    await page.screenshot({ path: 'tests/screenshots/simulator-heart-exercise.png' });
  });

  test('TC-SIM-06: Responsive viewport verification (Tablet & Mobile captures)', async ({ page }) => {
    // Tablet viewport 768x1024
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(150);
    await page.screenshot({ path: 'tests/screenshots/simulator-tablet-768.png' });

    // Mobile viewport 375x667
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(150);
    await page.screenshot({ path: 'tests/screenshots/simulator-mobile-375.png' });
  });
});
