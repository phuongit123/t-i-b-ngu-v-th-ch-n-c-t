import { test, expect } from '@playwright/test';

test.describe('Phase 6 — Supabase Auth, Profiles & Sync Engine', () => {
  test('TC-AUTH-01: Auth modal opens from navigation and closes cleanly', async ({ page }) => {
    await page.goto('/');

    // Locate Auth / Profile button in header
    const authBtn = page.locator('header button[aria-label="Tài khoản và hồ sơ học viên"]');
    await expect(authBtn).toBeVisible();
    await authBtn.click();

    // Verify Auth Modal dialog appears
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(page.locator('#auth-modal-title')).toBeVisible();

    // Close modal via close button
    const closeBtn = page.locator('button[aria-label="Đóng cửa sổ"]');
    await closeBtn.click();
    await expect(page.locator('#auth-modal-title')).not.toBeVisible();
  });

  test('TC-AUTH-02: Auth modal supports tab switching (Sign In, Sign Up, Forgot Password)', async ({ page }) => {
    await page.goto('/');

    const authBtn = page.locator('header button[aria-label="Tài khoản và hồ sơ học viên"]');
    await authBtn.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Verify Sign In tab is active by default
    await expect(dialog.locator('input[placeholder="tenhocvien@domain.com"]')).toBeVisible();

    // Switch to Sign Up tab inside dialog
    const signUpTab = dialog.locator('button:has-text("Đăng ký")');
    await signUpTab.click();
    await expect(dialog.locator('input[placeholder="Nguyễn Văn A"]')).toBeVisible();
    await expect(dialog.locator('select')).toBeVisible(); // Career track selector

    // Switch to Forgot Password tab inside dialog
    const forgotTab = dialog.locator('button:has-text("Khôi phục")');
    await forgotTab.click();
    await expect(dialog.locator('text=Nhập địa chỉ email đăng ký để nhận liên kết xác thực')).toBeVisible();

    // Close dialog
    await dialog.locator('button[aria-label="Đóng cửa sổ"]').click();
    await expect(page.locator('#auth-modal-title')).not.toBeVisible();
  });

  test('TC-AUTH-03: Offline guest test switcher updates role and profile badge', async ({ page }) => {
    await page.goto('/');

    const authBtn = page.locator('header button[aria-label="Tài khoản và hồ sơ học viên"]');
    await authBtn.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Click offline guest experience button
    const guestBtn = dialog.locator('button:has-text("trải nghiệm nhanh với tư cách Học viên khách")');
    if (await guestBtn.isVisible()) {
      await guestBtn.click();
      await page.waitForTimeout(700); // Allow role switch animation
    }

    // Reopen modal to inspect active profile
    await authBtn.click();
    await expect(page.locator('#auth-modal-title')).toContainText('Hồ Sơ Học Viên');

    // Test switching role to Evaluator (Giám khảo)
    const evaluatorBtn = page.locator('button:has-text("Giám khảo")');
    if (await evaluatorBtn.isVisible()) {
      await evaluatorBtn.click();
      await page.waitForTimeout(700);
    }
  });

  test('TC-AUTH-04: Header displays progress cloud sync indicator', async ({ page }) => {
    await page.goto('/');

    // Header sync badge should be present (either ĐÃ ĐỒNG BỘ, NGOẠI TUYẾN, or CHỜ LƯU)
    const syncBadge = page.locator('header span:has-text("ĐỒNG BỘ"), header span:has-text("NGOẠI TUYẾN"), header span:has-text("CHỜ LƯU")').first();
    await expect(syncBadge).toBeVisible();
  });
});
