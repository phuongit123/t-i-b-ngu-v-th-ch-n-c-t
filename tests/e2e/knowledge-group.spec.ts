import { test, expect } from '@playwright/test';

test.describe('Phase 5 — Nhóm Knowledge: Search, Shortcuts, CheatSheet, Glossary', () => {
  test('TC-KNOW-01: Navigation to Knowledge Hub and live search across all categories', async ({ page }) => {
    await page.goto('/');

    // Navigate to Knowledge Hub
    const knowNav = page.locator('button:has-text("Tri thức")').first();
    await expect(knowNav).toBeVisible();
    await knowNav.click();

    await expect(page.locator('h1')).toContainText('Trung Tâm Tri Thức & Tra Cứu Toàn Diện');
    await expect(page.locator('text=NHÓM KNOWLEDGE')).toBeVisible();

    // Type query in search tab
    const searchInput = page.locator('input[placeholder*="Tìm kiếm phím tắt"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Pen Tool');

    // Verify search results show matched shortcuts
    await expect(page.locator('text=Tìm thấy').first()).toBeVisible();
    await expect(page.locator('h4:has-text("Pen Tool")').first()).toBeVisible();
  });

  test('TC-KNOW-02: Shortcuts tab with studio filter and Windows/Mac modifier toggle', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tri thức")').first().click();

    // Switch to Shortcuts tab
    await page.locator('button:has-text("2. Bảng phím tắt")').click();

    // Verify shortcuts heading or content
    await expect(page.locator('button:has-text("Vector Studio")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Pixel Studio")').first()).toBeVisible();

    // Filter by Vector Studio
    await page.locator('button:has-text("Vector Studio")').first().click();
    await expect(page.locator('text=Pen Tool (Công cụ vẽ đường cong Bézier)')).toBeVisible();

    // Toggle macOS
    const macBtn = page.locator('button:has-text("macOS (Cmd)")');
    await expect(macBtn).toBeVisible();
    await macBtn.click();

    // Filter by Pixel Studio
    await page.locator('button:has-text("Pixel Studio")').first().click();
    await expect(page.locator('text=Selection Brush Tool')).toBeVisible();
  });

  test('TC-KNOW-03: CheatSheet tab displays Boolean operations, node types, and export profiles', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tri thức")').first().click();

    // Switch to CheatSheet tab
    await page.locator('button:has-text("3. Bảng tóm tắt")').click();

    // Verify sections
    await expect(page.locator('text=Phép Toán Hình Học Vector (Boolean Operations)')).toBeVisible();
    await expect(page.locator('text=Add (Hợp nhất)')).toBeVisible();
    await expect(page.locator('text=Phân Loại Điểm Neo Bézier (Node Types & Handles)')).toBeVisible();
    await expect(page.locator('text=Chế Độ Hòa Trộn Lớp Ảnh (Layer Blend Modes)')).toBeVisible();
    await expect(page.locator('text=Chuẩn Xuất Bản Đồ Họa & In Ấn (Production Profiles)')).toBeVisible();
  });

  test('TC-KNOW-04: Glossary tab with category filter and Design Thinking terms', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tri thức")').first().click();

    // Switch to Glossary tab
    await page.locator('button:has-text("4. Từ điển thuật ngữ")').click();

    // Verify presence of Design Thinking
    await expect(page.locator('text=Design Thinking (Tư duy Thiết kế)')).toBeVisible();
    await expect(page.locator('text=Brief Deconstruction (Giải mã Đề bài)')).toBeVisible();

    // Filter by Pixel Studio
    await page.locator('button:has-text("Pixel Studio")').first().click();
    await expect(page.locator('text=Non-Destructive Editing (Chỉnh sửa phi phá hủy)')).toBeVisible();
    await expect(page.locator('text=Develop Studio (Không gian tráng ảnh RAW)')).toBeVisible();
  });

  test('TC-KNOW-05: Empty state and error recovery in Knowledge Hub', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Tri thức")').first().click();

    // Search for non-existent term
    const searchInput = page.locator('input[placeholder*="Tìm kiếm phím tắt"]');
    await searchInput.fill('XYZNONEXISTENTQUERY999');

    // Verify empty state
    await expect(page.locator('text=Không tìm thấy kết quả phù hợp')).toBeVisible();

    // Clear search
    await page.locator('button:has-text("Xóa tìm kiếm")').click();
    await expect(searchInput).toHaveValue('');
  });
});
