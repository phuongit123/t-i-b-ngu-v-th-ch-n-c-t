import { test, expect } from '@playwright/test';

test.describe('TASK-081: Independent A5 Capstone Assessment Subsystem', () => {
  test('TC-CAP-01: Navigation to Capstone Assessment page and header validation', async ({ page }) => {
    await page.goto('/');

    // Click on Capstone A5 nav item
    const capstoneNav = page.locator('button:has-text("Đồ án A5")');
    await expect(capstoneNav).toBeVisible();
    await capstoneNav.click();

    // Verify page header
    await expect(page.locator('h1')).toContainText('Chiến Dịch Tái Định Vị & Ra Mắt Thương Hiệu Cà Phê Lumina');
    await expect(page.locator('text=A5 GRADUATION CAPSTONE ASSESSMENT')).toBeVisible();
  });

  test('TC-CAP-02: Brief tab displays client overview, PLO-07/PLO-08 requirements, and starter assets', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Đồ án A5")').click();
    await expect(page.locator('h1')).toContainText('Chiến Dịch Tái Định Vị & Ra Mắt Thương Hiệu Cà Phê Lumina');

    // Brief tab is active by default
    await expect(page.locator('h2:has-text("Lumina Artisanal Roastery Launch Campaign")')).toBeVisible();
    await expect(page.locator('text=Ràng buộc Kỹ thuật Bắt buộc')).toBeVisible();
    await expect(page.locator('text=Tài nguyên Đầu vào Cung cấp (Starter Assets)')).toBeVisible();

    // Check specific starter assets
    await expect(page.locator('text=lumina_project_brief.md')).toBeVisible();
    await expect(page.locator('text=lumina_coldbrew_raw_plate.jpg')).toBeVisible();
    await expect(page.locator('text=coffee_texture_bump_map.png')).toBeVisible();

    // Check 8-step Design Thinking
    await expect(page.locator('text=Chu trình Design Thinking 8 Bước Cần Áp Dụng')).toBeVisible();
    await expect(page.locator('text=2. Define (PLO-07)')).toBeVisible();
    await expect(page.locator('text=7. Iterate (PLO-08)')).toBeVisible();
  });

  test('TC-CAP-03: Rubric tab displays 7 dimensions and Critical badges for PLO-07 and PLO-08', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Đồ án A5")').click();
    await expect(page.locator('h1')).toContainText('Chiến Dịch Tái Định Vị & Ra Mắt Thương Hiệu Cà Phê Lumina');

    // Switch to Rubric tab
    await page.locator('button:has-text("2. Tiêu chí & Rubric")').click();

    // Verify graduation threshold
    await expect(page.locator('text=TIÊU CHUẨN TỐT NGHIỆP A5 (GRADUATION THRESHOLD)')).toBeVisible();
    await expect(page.locator('text=CRITICAL (BẮT BUỘC ≥ MỨC 3)').first()).toBeVisible();

    // Verify presence of PLO-07 and PLO-08 dimensions
    await expect(page.locator('text=1. Giải mã Brief & Khán giả mục tiêu (PLO-07)')).toBeVisible();
    await expect(page.locator('text=5. Tự Chẩn đoán, Phản biện & Lặp lại (PLO-08)')).toBeVisible();
  });

  test('TC-CAP-04: Submit tab allows filling artifacts and triggers validation', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Đồ án A5")').click();
    await expect(page.locator('h1')).toContainText('Chiến Dịch Tái Định Vị & Ra Mắt Thương Hiệu Cà Phê Lumina');

    // Switch to Submit tab
    await page.locator('button:has-text("3. Nộp bài & Tự đánh giá")').click();

    // Verify input fields for PLO-07 and PLO-08 artifacts
    await expect(page.locator('label:has-text("brief-deconstruction.md")')).toBeVisible();
    await expect(page.locator('label:has-text("iteration-critique-log.md")')).toBeVisible();

    // Click submit button
    const submitBtn = page.locator('button:has-text("Nộp Bài & Cập Nhật Bản Nộp")');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Verify success toast appears
    await expect(page.locator('text=Đã nộp thành công bài làm phiên bản')).toBeVisible();
  });

  test('TC-CAP-05: Evaluator Mode toggles grading console and updates official verdict', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Đồ án A5")').click();
    await expect(page.locator('h1')).toContainText('Chiến Dịch Tái Định Vị & Ra Mắt Thương Hiệu Cà Phê Lumina');

    // Switch to Results tab
    await page.locator('button:has-text("4. Kết quả & Chứng chỉ A5")').click();

    // Toggle Evaluator mode on
    await page.locator('button:has-text("Giám khảo (Chấm điểm)")').click();

    // Verify Evaluator Console visible
    await expect(page.locator('text=BẢNG ĐIỀU KHIỂN CHẤM ĐIỂM CHÍNH THỨC CỦA GIÁM KHẢO ĐỘC LẬP')).toBeVisible();

    // Click evaluate & sign-off
    const signOffBtn = page.locator('button:has-text("Ký Duyệt Kết Quả Chính Thức & Cấp Chứng Chỉ")');
    await expect(signOffBtn).toBeVisible();
    await signOffBtn.click();

    // Verify official certificate card or result banner appears
    await expect(page.locator('text=KẾT QUẢ ĐÁNH GIÁ CHÍNH THỨC CẤP ĐỘ A5')).toBeVisible();
  });
});
