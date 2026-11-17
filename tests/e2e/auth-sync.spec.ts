import { test, expect } from '@playwright/test';

test.describe('Xác thực tài khoản & Trạng thái đồng bộ Header', () => {
  test('TC-AUTH-01: Hộp thoại xác thực mở sạch không chứa Offline Test và đóng bình thường', async ({ page }) => {
    await page.goto('/');

    const authBtn = page.getByTestId('nav-auth-btn');
    await expect(authBtn).toBeVisible();
    await authBtn.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(page.locator('#auth-modal-title')).toBeVisible();
    await expect(dialog.locator('text=Offline Test')).toHaveCount(0);

    await dialog.locator('button[aria-label="Đóng cửa sổ"]').click();
    await expect(page.locator('#auth-modal-title')).not.toBeVisible();
  });

  test('TC-AUTH-02: Chuyển tab Đăng nhập / Đăng ký / Khôi phục hoạt động chuẩn xác', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-auth-btn').click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog.locator('input[placeholder="tenhocvien@domain.com"]')).toBeVisible();

    await dialog.locator('button:has-text("Đăng ký")').click();
    await expect(dialog.locator('input[placeholder="Nguyễn Văn A"]')).toBeVisible();
    await expect(dialog.locator('select')).toBeVisible();

    await dialog.locator('button:has-text("Khôi phục")').click();
    await expect(
      dialog.locator('text=Nhập địa chỉ email đăng ký để nhận liên kết xác thực')
    ).toBeVisible();

    await dialog.locator('button[aria-label="Đóng cửa sổ"]').click();
    await expect(page.locator('#auth-modal-title')).not.toBeVisible();
  });

  test('TC-AUTH-03: Đăng ký tài khoản học viên lưu hồ sơ không lộ bảng đổi vai trò demo', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-auth-btn').click();

    const dialog = page.locator('div[role="dialog"]');
    await dialog.locator('button:has-text("Đăng ký")').click();
    await dialog.locator('input[placeholder="Nguyễn Văn A"]').fill('Lê Hoàng Anh');
    await dialog.locator('input[placeholder="tenhocvien@domain.com"]').fill('hoanganh@affinity.vn');
    await dialog.locator('input[type="password"]').fill('matkhau123');
    await dialog.locator('button:has-text("Tạo Tài Khoản Học Viên")').click();

    await page.waitForTimeout(1050);

    // Reopen profile modal and verify clean student profile without role escalation switcher
    await page.getByTestId('nav-auth-btn').click();
    await expect(page.locator('#auth-modal-title')).toContainText('Hồ Sơ Học Viên');
    await expect(dialog).toContainText('Lê Hoàng Anh');
    await expect(dialog).toContainText('Vai trò: Học viên');
    await expect(dialog.locator('text=Offline Test')).toHaveCount(0);
    await expect(dialog.locator('button:has-text("Giám khảo")')).toHaveCount(0);
  });

  test('TC-AUTH-04: Header hiển thị huy hiệu trạng thái đồng bộ', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('sync-status-badge')).toBeVisible();
  });
});
