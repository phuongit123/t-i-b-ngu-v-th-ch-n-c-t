import { test, expect } from '@playwright/test';

test.describe('Hồ sơ học tập, Đồng bộ LearningStore & Cài đặt hệ thống', () => {
  test('TC-DASH-01: Hồ sơ học tập khởi điểm 0/66 sạch nhãn nội bộ và không có nút giả lập lỗi 503', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.locator('h1')).toContainText('Bảng Điều Khiển Học Viên & Hồ Sơ Năng Lực');
    await expect(page.locator('text=NHÓM DASHBOARD')).toHaveCount(0);
    await expect(page.locator('button:has-text("Giả lập lỗi mạng")')).toHaveCount(0);

    const completedCard = page.getByTestId('dashboard-completed-card');
    await expect(completedCard).toContainText('0 / 66 bài');
    await expect(page.locator('text=0 ngày liên tiếp')).toBeVisible();
    await expect(page.locator('text=0 phút học tích lũy')).toBeVisible();
  });

  test('TC-DASH-02: Hoàn thành bài D01-01 cập nhật thật Dashboard từ 0/66 lên 1/66', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('lesson-card-D01-01').click();

    await expect(page.getByTestId('slide-counter')).toContainText('Trang 1');

    // Step through slides to the final slide and mark complete
    while (await page.getByTestId('next-slide-btn').isVisible()) {
      await page.getByTestId('next-slide-btn').click();
    }

    const completeBtn = page.getByTestId('complete-lesson-btn');
    await expect(completeBtn).toBeVisible();
    await completeBtn.click();
    await expect(completeBtn).toContainText('Đã hoàn thành bài học');

    // Verify Dashboard shows real persisted progress 1 / 66
    await page.getByTestId('nav-dashboard').click();
    await expect(page.getByTestId('dashboard-completed-card')).toContainText('1 / 66 bài');
    await expect(page.getByTestId('dashboard-lesson-D01-01')).toHaveAttribute('data-status', 'completed');

    // Verify Studio filter button works in Vietnamese
    await page.getByTestId('dashboard-filter-photo').click();
    await expect(page.getByTestId('dashboard-lesson-P01-01')).toBeVisible();
  });

  test('TC-DASH-03: Cài đặt phím tắt macOS và Đặt lại toàn bộ tiến độ đưa Dashboard về 0/66', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('lesson-card-D01-01').click();
    await expect(page.getByTestId('slide-counter')).toContainText('Trang 1');
    while (await page.getByTestId('next-slide-btn').isVisible()) {
      await page.getByTestId('next-slide-btn').click();
    }
    await page.getByTestId('complete-lesson-btn').click();

    // Go to Settings
    await page.getByTestId('nav-settings').click();
    await expect(page.locator('h1')).toContainText('Cài Đặt Hệ Thống & Cấu Hình Tài Khoản');
    await expect(page.locator('text=NHÓM DASHBOARD')).toHaveCount(0);

    // Edit profile name & switch shortcut modifier to macOS
    const nameInput = page.locator('#settings-display-name');
    await nameInput.fill('Minh Quân Design');
    await page.getByTestId('settings-os-mac').click();
    await page.locator('button:has-text("Lưu Thay Đổi Cài Đặt")').click();
    await expect(page.locator('text=Đã lưu thành công các cài đặt')).toBeVisible();

    // Open reset confirmation modal, cancel first, then confirm
    await page.getByTestId('reset-progress-trigger').click();
    await expect(page.locator('text=Xác nhận xóa toàn bộ tiến độ?')).toBeVisible();
    await page.locator('button:has-text("Hủy bỏ")').click();
    await expect(page.locator('text=Xác nhận xóa toàn bộ tiến độ?')).toHaveCount(0);

    await page.getByTestId('reset-progress-trigger').click();
    await page.getByTestId('confirm-reset-progress-btn').click();
    await expect(page.locator('text=Đã đặt lại toàn bộ tiến độ học tập')).toBeVisible();

    // Verify Dashboard resets cleanly to 0 / 66 and shows saved learner name
    await page.getByTestId('nav-dashboard').click();
    await expect(page.getByTestId('dashboard-completed-card')).toContainText('0 / 66 bài');
    await expect(page.locator('text=Minh Quân Design').first()).toBeVisible();
  });
});
