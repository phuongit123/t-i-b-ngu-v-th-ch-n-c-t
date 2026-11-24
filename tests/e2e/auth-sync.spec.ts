import { test, expect } from '@playwright/test';

test.describe('Xác thực tài khoản & Trạng thái đồng bộ Header', () => {
  test('TC-AUTH-01: Hộp thoại xác thực mở sạch không chứa Offline Test và đóng bình thường', async ({ page }) => {
    await page.goto('/');

    const authBtn = page.getByTestId('nav-auth-btn');
    await expect(authBtn).toBeVisible();
    await authBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('#auth-modal-title')).toBeVisible();
    await expect(dialog.locator('text=Offline Test')).toHaveCount(0);

    await dialog.locator('button[aria-label="Đóng cửa sổ"]').click();
    await expect(page.locator('#auth-modal-title')).not.toBeVisible();
  });

  test('TC-AUTH-02: Chuyển tab Đăng nhập / Đăng ký / Khôi phục hoạt động chuẩn xác', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-auth-btn').click();

    const dialog = page.getByRole('dialog');
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

    const dialog = page.getByRole('dialog');
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
  test('TC-AUTH-05: Modal trả focus và báo trạng thái khôi phục offline', async ({ page }) => {
    await page.goto('/');
    const opener = page.getByTestId('nav-auth-btn');
    await opener.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('button', { name: 'Đóng cửa sổ' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await opener.click();
    await dialog.getByRole('button', { name: 'Khôi phục', exact: true }).click();
    await dialog.locator('input[type=email]').fill('learner@example.invalid');
    await dialog.getByRole('button', { name: 'Gửi Liên Kết Khôi Phục' }).click();
    await expect(dialog.getByText('Khôi phục mật khẩu cần kết nối dịch vụ tài khoản.')).toBeVisible();
  });

  test('TC-AUTH-06: Hai hồ sơ offline lưu tiến độ riêng trên cùng trình duyệt', async ({ page }) => {
    await page.goto('/');
    const opener = page.getByTestId('nav-auth-btn');
    const dialog = page.getByRole('dialog');
    const openProfile = async (email: string) => {
      await opener.click();
      await dialog.locator('input[type=email]').fill(email);
      await dialog.locator('input[type=password]').fill('audit-password');
      await dialog.locator('button[type=submit]').click();
      await expect(dialog).toBeHidden();
    };
    const signOut = async () => {
      await opener.click();
      await dialog.getByRole('button', { name: /Đăng xuất/ }).click();
      await expect(dialog).toBeHidden();
    };
    await openProfile('learner-a@example.invalid');
    await page.goto('/bai-hoc/d01-01');
    await page.getByTestId('lesson-mode-sections').click();
    await page.getByTestId('sections-complete-lesson-btn').click();
    await page.goto('/ho-so-hoc-tap');
    await expect(page.getByTestId('dashboard-completed-card')).toContainText('1 / 66 bài');
    await signOut();
    await openProfile('learner-b@example.invalid');
    await expect(page.getByTestId('dashboard-completed-card')).toContainText('0 / 66 bài');
    await signOut();
    await openProfile('learner-a@example.invalid');
    await expect(page.getByTestId('dashboard-completed-card')).toContainText('1 / 66 bài');
  });
});
