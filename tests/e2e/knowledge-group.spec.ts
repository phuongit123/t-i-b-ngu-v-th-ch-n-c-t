import { test, expect } from '@playwright/test';

test.describe('Trung tâm Tri thức: Tìm kiếm, Phím tắt, Bảng tóm tắt & Từ điển', () => {
  test('TC-KNOW-01: Điều hướng Trung tâm Tri thức không lộ nhãn nội bộ và tìm kiếm trực tiếp', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Học liệu', exact: true }).click();
    await page.getByTestId('nav-knowledge').click();

    await expect(page.locator('h1')).toContainText('Trung Tâm Tri Thức & Tra Cứu Toàn Diện');
    await expect(page.locator('text=NHÓM KNOWLEDGE')).toHaveCount(0);

    const searchInput = page.locator('input[placeholder*="Tìm kiếm phím tắt"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Pen Tool');

    await expect(page.locator('text=Tìm thấy').first()).toBeVisible();
    await expect(page.locator('h4:has-text("Pen Tool")').first()).toBeVisible();
  });

  test('TC-KNOW-02: Tab Phím tắt đồng bộ bộ lọc Windows / macOS với cấu hình người dùng', async ({ page }) => {
    await page.goto('/knowledge');

    await page.locator('button:has-text("2. Bảng phím tắt")').click();
    await expect(page.locator('button:has-text("Vector Studio")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Pixel Studio")').first()).toBeVisible();

    await page.locator('button:has-text("Vector Studio")').first().click();
    await expect(page.locator('text=Pen Tool (Công cụ vẽ đường cong Bézier)')).toBeVisible();

    // Verify Windows key first, then toggle macOS and check Cmd + Return
    await expect(page.locator('kbd:has-text("Ctrl + Enter")')).toBeVisible();
    const macBtn = page.getByTestId('knowledge-os-mac');
    await expect(macBtn).toBeVisible();
    await macBtn.click();
    await expect(page.locator('kbd:has-text("Cmd + Return")')).toBeVisible();

    // Filter by Pixel Studio
    await page.locator('button:has-text("Pixel Studio")').first().click();
    await expect(page.locator('text=Selection Brush Tool')).toBeVisible();
  });

  test('TC-KNOW-03: Tab Bảng tóm tắt hiển thị đầy đủ phép toán Boolean, Node và chuẩn xuất bản', async ({ page }) => {
    await page.goto('/knowledge');
    await page.locator('button:has-text("3. Bảng tóm tắt")').click();

    await expect(page.locator('text=Phép Toán Hình Học Vector (Boolean Operations)')).toBeVisible();
    await expect(page.locator('text=Add (Hợp nhất)')).toBeVisible();
    await expect(page.locator('text=Phân Loại Điểm Neo Bézier (Node Types & Handles)')).toBeVisible();
    await expect(page.locator('text=Chế Độ Hòa Trộn Lớp Ảnh (Layer Blend Modes)')).toBeVisible();
    await expect(page.locator('text=Chuẩn Xuất Bản Đồ Họa & In Ấn (Production Profiles)')).toBeVisible();
  });

  test('TC-KNOW-04: Tab Từ điển lọc theo danh mục Design Thinking và Pixel Studio', async ({ page }) => {
    await page.goto('/knowledge');
    await page.locator('button:has-text("4. Từ điển thuật ngữ")').click();

    await expect(page.locator('text=Design Thinking (Tư duy Thiết kế)')).toBeVisible();
    await expect(page.locator('text=Brief Deconstruction (Giải mã Đề bài)')).toBeVisible();

    await page.locator('button:has-text("Pixel Studio")').first().click();
    await expect(page.locator('text=Non-Destructive Editing (Chỉnh sửa phi phá hủy)')).toBeVisible();
    await expect(page.locator('text=Develop Studio (Không gian tráng ảnh RAW)')).toBeVisible();
  });

  test('TC-KNOW-05: Trạng thái rỗng và nút Xóa tìm kiếm', async ({ page }) => {
    await page.goto('/knowledge');

    const searchInput = page.locator('input[placeholder*="Tìm kiếm phím tắt"]');
    await searchInput.fill('XYZNONEXISTENTQUERY999');

    await expect(page.locator('text=Không tìm thấy kết quả phù hợp')).toBeVisible();

    await page.locator('button:has-text("Xóa tìm kiếm")').click();
    await expect(searchInput).toHaveValue('');
  });
});
