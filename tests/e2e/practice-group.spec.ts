import { test, expect } from '@playwright/test';

test.describe('Thử thách thực hành & Đồng bộ điểm với Học tập', () => {
  test('TC-PRAC-01: Trang Thử thách sạch nhãn nội bộ và hiển thị đầy đủ danh sách', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Thực hành', exact: true }).click();
    await page.getByTestId('nav-challenges').click();

    await expect(page.locator('h1')).toContainText('Thử Thách Kỹ Thuật & Bài Luyện Thực Hành');
    await expect(page.locator('text=NHÓM PRACTICE')).toHaveCount(0);
    await expect(page.locator('text=(Step-by-Step Guide)')).toHaveCount(0);

    await expect(page.locator('h4:has-text("Dựng Đa Giác Kim Cương Sắc Cạnh")')).toBeVisible();
    await expect(page.locator('h4:has-text("Uốn Lượn Sóng Tiếp Tuyến Mượt")')).toBeVisible();
    await expect(page.locator('h4:has-text("Biểu Tượng Trái Tim Kết Hợp Cusp & Smooth")')).toBeVisible();
  });

  test('TC-PRAC-02: Kiểm tra 0 bước phải đạt 0%, checklist đủ bước không tính là điểm Canvas', async ({ page }) => {
    await page.goto('/challenges');

    await expect(page.locator('text=Hướng dẫn thực hiện từng bước')).toBeVisible();
    await expect(page.locator('text=Bước 1: Khởi tạo Pen Tool')).toBeVisible();

    // Evaluating with 0 steps checked must return 0% FAIL (never free 75%)
    const evalBtn = page.getByTestId('evaluate-challenge-btn');
    await evalBtn.click();
    const resultBox = page.getByTestId('challenge-evaluation-result');
    await expect(resultBox).toContainText('KẾT QUẢ: CẦN CẢI THIỆN');
    await expect(resultBox).toContainText('Độ chính xác: 0%');

    // Complete all 4 steps and re-evaluate -> 100% PASSED
    await page.getByTestId('challenge-step-1').click();
    await page.getByTestId('challenge-step-2').click();
    await page.getByTestId('challenge-step-3').click();
    await page.getByTestId('challenge-step-4').click();
    await evalBtn.click();

    await expect(resultBox).toContainText('CHECKLIST TỰ ĐÁNH GIÁ');
    await expect(resultBox).toContainText('Số bước đã đánh dấu: 100%');

    // Verify synced to Dashboard
    await page.getByTestId('nav-dashboard').click();
    await expect(page.getByText('Đã hoàn thành thử thách kỹ thuật')).toHaveCount(0);
  });

  test('TC-PRAC-03: Chuyển tiếp từ Thử thách sang Phòng mô phỏng tương tác', async ({ page }) => {
    await page.goto('/challenges');

    const toSandboxBtn = page.locator('button:has-text("Mở Phòng mô phỏng")');
    await expect(toSandboxBtn).toBeVisible();
    await toSandboxBtn.click();

    await expect(page.locator('h1')).toContainText('Bộ Mô Phỏng Bézier Pen & Node Tool');
  });
});
