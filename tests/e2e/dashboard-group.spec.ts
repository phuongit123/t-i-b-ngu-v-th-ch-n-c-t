import { test, expect } from '@playwright/test';

test.describe('Phase 5 — Nhóm Dashboard: ProgressDashboard & Settings', () => {
  test('TC-DASH-01: ProgressDashboard displays overall progress and studio tracks', async ({ page }) => {
    await page.goto('/');

    // Navigate to Dashboard
    const dashNav = page.locator('button:has-text("Hồ sơ học tập")').first();
    await expect(dashNav).toBeVisible();
    await dashNav.click();

    await expect(page.locator('h1')).toContainText('Bảng Điều Khiển Học Viên & Hồ Sơ Năng Lực');
    await expect(page.locator('text=NHÓM DASHBOARD')).toBeVisible();

    // Verify 4 stat cards
    await expect(page.locator('span:has-text("Bài học hoàn thành")').first()).toBeVisible();
    await expect(page.locator('span:has-text("Thử thách thực hành")').first()).toBeVisible();
    await expect(page.locator('span:has-text("Tốt nghiệp Đồ án A5")').first()).toBeVisible();
    await expect(page.locator('span:has-text("Chuỗi ngày học tập")').first()).toBeVisible();

    // Verify Studio Track Breakdown
    await expect(page.locator('text=Tiến Độ Đào Tạo Theo Từng Studio (Track Breakdown)')).toBeVisible();
    await expect(page.locator('text=Vector Studio').first()).toBeVisible();
    await expect(page.locator('text=Pixel Studio').first()).toBeVisible();
  });

  test('TC-DASH-02: Completed and available lessons list with track filter', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Hồ sơ học tập")').first().click();

    await expect(page.locator('text=Danh Sách Bài Học Hiện Có (66 Bài)')).toBeVisible();

    // Filter by Pixel Studio
    await page.locator('button:has-text("photo")').click();
    await expect(page.locator('text=P01-01').first()).toBeVisible();
  });

  test('TC-DASH-03: Cloud Sync status bar and simulated sync error handling with retry', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Hồ sơ học tập")').first().click();

    // Click "Giả lập lỗi mạng"
    const simErrorBtn = page.locator('button:has-text("Giả lập lỗi mạng")');
    await expect(simErrorBtn).toBeVisible();
    await simErrorBtn.click();

    // Verify error banner appears
    await expect(page.locator('text=Lỗi kết nối đồng bộ đám mây')).toBeVisible();
    await expect(page.locator('text=503 Service Unavailable')).toBeVisible();

    // Click retry
    const retryBtn = page.locator('button:has-text("Thử lại đồng bộ")').first();
    await expect(retryBtn).toBeVisible();
    await retryBtn.click();

    // Verify recovered to synced
    await expect(page.locator('text=Đã đồng bộ cục bộ an toàn')).toBeVisible();
  });

  test('TC-DASH-04: Settings page configuration and preferences saving', async ({ page }) => {
    await page.goto('/');

    // Navigate to Settings
    const settingsBtn = page.locator('button[aria-label="Cài đặt hệ thống & tài khoản"]');
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    await expect(page.locator('h1')).toContainText('Cài Đặt Hệ Thống & Cấu Hình Tài Khoản');

    // Edit display name
    const nameInput = page.locator('input[value*="Nhà Thiết Kế"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Alex Nguyen');

    // Toggle macOS modifier
    await page.locator('button:has-text("macOS (Cmd / Option / Shift)")').click();

    // Submit form
    await page.locator('button:has-text("Lưu Thay Đổi Cài Đặt")').click();

    // Verify success toast
    await expect(page.locator('text=Đã lưu thành công các cài đặt')).toBeVisible();
  });

  test('TC-DASH-05: Settings reset progress modal and cancellation', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Cài đặt hệ thống & tài khoản"]').click();

    // Click reset button
    const resetBtn = page.locator('button:has-text("Đặt Lại Toàn Bộ Tiến Độ (Reset Progress)")');
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();

    // Verify modal appears
    await expect(page.locator('text=Xác nhận xóa toàn bộ tiến độ?')).toBeVisible();

    // Cancel modal
    await page.locator('button:has-text("Hủy bỏ")').click();
    await expect(page.locator('text=Xác nhận xóa toàn bộ tiến độ?')).not.toBeVisible();
  });
});
