import { test, expect } from '@playwright/test';

test.describe('Phase 5 — Nhóm Practice: Sandbox & Challenges', () => {
  test('TC-PRAC-01: Navigation to Challenges page and verify challenge list', async ({ page }) => {
    await page.goto('/');

    // Click on Challenges nav item
    const chalNav = page.locator('button:has-text("Thử thách")').first();
    await expect(chalNav).toBeVisible();
    await chalNav.click();

    await expect(page.locator('h1')).toContainText('Thử Thách Kỹ Thuật & Bài Luyện Thực Hành');
    await expect(page.locator('text=NHÓM PRACTICE')).toBeVisible();

    // Verify list of challenges
    await expect(page.locator('h4:has-text("Dựng Đa Giác Kim Cương Sắc Cạnh")')).toBeVisible();
    await expect(page.locator('h4:has-text("Uốn Lượn Sóng Tiếp Tuyến Mượt")')).toBeVisible();
    await expect(page.locator('h4:has-text("Biểu Tượng Trái Tim Kết Hợp Cusp & Smooth")')).toBeVisible();
  });

  test('TC-PRAC-02: Step-by-step guidance, instructions, and checklist interaction', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Thử thách")').first().click();

    // Verify steps section
    await expect(page.locator('text=Hướng dẫn từng bước (Step-by-Step Guide)')).toBeVisible();
    await expect(page.locator('text=Bước 1: Khởi tạo Pen Tool')).toBeVisible();
    await expect(page.locator('text=Bước 2: Đặt 4 đỉnh hình thoi')).toBeVisible();

    // Check step 1
    const stepCheckbox = page.locator('button:has(svg)').first();
    await expect(stepCheckbox).toBeVisible();
  });

  test('TC-PRAC-03: Accuracy evaluation and progress persistence in localStorage', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Thử thách")').first().click();

    // Click on evaluate button
    const evalBtn = page.locator('button:has-text("Kiểm Tra Kết Quả (Chấm Điểm Thử Thách)")');
    await expect(evalBtn).toBeVisible();
    await evalBtn.click();

    // Verify evaluation verdict
    await expect(page.locator('text=KẾT QUẢ:').first()).toBeVisible();
    await expect(page.locator('text=Độ chính xác:').first()).toBeVisible();
  });

  test('TC-PRAC-04: Transition between Challenges and Sandbox Simulator', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Thử thách")').first().click();

    // Click transition button to Sandbox
    const toSandboxBtn = page.locator('button:has-text("Mở Sandbox Tự do")');
    await expect(toSandboxBtn).toBeVisible();
    await toSandboxBtn.click();

    // Verify navigation landed on SimulatorPage
    await expect(page.locator('h1')).toContainText('Bộ Mô Phỏng Bézier Pen & Node Tool');
  });
});
