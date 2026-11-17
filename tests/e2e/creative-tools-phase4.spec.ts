import { test, expect } from '@playwright/test';

test.describe('Phase 4 — Bộ Công Cụ Đồ Họa Tương Tác & JS DOM Playground', () => {
  test('TC-P4-01: Vector Studio hỗ trợ đa lớp, cặp hình Boolean thật (Subtract/Xor), Undo và Corner Tool', async ({
    page,
  }) => {
    await page.goto('/simulator');
    await expect(page.locator('h1')).toContainText('Bộ Mô Phỏng Bézier Pen & Node Tool');

    // Tạo cặp hình mẫu chồng lấn (Elip Cyan + Ngôi sao Vàng)
    await page.getByTestId('vec-seed-boolean-pair').click();
    const layerList = page.getByTestId('vec-layer-list');
    await expect(layerList).toContainText('Hình Elip nền (Cyan)');
    await expect(layerList).toContainText('Ngôi sao 5 cánh (Vàng)');

    // Chạy phép Cắt trừ (Subtract) thật
    await page.getByTestId('vec-bool-subtract').click();
    await expect(page.getByTestId('vec-boolean-status')).toContainText('Cắt trừ (Subtract)');
    await expect(layerList).toContainText('Kết quả Cắt trừ (Subtract)');

    // Hoàn tác khôi phục lại 2 lớp nguồn rồi chạy tiếp Xor
    await page.locator('button[title*="Hoàn tác"]').click();
    await expect(layerList).toContainText('Hình Elip nền (Cyan)');
    await expect(layerList).toContainText('Ngôi sao 5 cánh (Vàng)');

    await page.getByTestId('vec-bool-xor').click();
    await expect(page.getByTestId('vec-boolean-status')).toContainText('Loại trừ phần giao (Xor)');

    // Tạo Hình chữ nhật tham số và bo góc Corner Tool
    await page.getByTestId('vec-tool-rect').click();
    const svg = page.locator('svg.cursor-crosshair');
    await svg.click({ position: { x: 240, y: 240 } });

    const radiusSlider = page.getByTestId('vec-corner-radius');
    await radiusSlider.fill('24');

    const pathsCount = await svg.locator('path').count();
    expect(pathsCount).toBeGreaterThanOrEqual(2);
    const lastPathD = await svg.locator('path').last().getAttribute('d');
    expect(lastPathD).toContain(' C ');
  });

  test('TC-P4-02: Pixel Studio render ảnh thật, chỉnh Curves LUT / HSL làm đổi pixel và đổi thứ tự/tên Layer', async ({
    page,
  }) => {
    await page.goto('/simulator');
    await page.getByTestId('sim-tab-photo').click();
    await expect(page.locator('h3:has-text("Layers Studio")')).toBeVisible();

    // Chỉ được phép có đúng 1 thẻ <canvas> trong DOM
    await expect(page.locator('canvas')).toHaveCount(1);

    // Chờ ảnh chân dung và nền hoàng hôn tải hoàn tất lên canvas
    await page.waitForTimeout(550);

    const getCanvasChromaSignature = async () =>
      page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { sum: 0, chroma: 0 };
        const ctx = canvas.getContext('2d');
        if (!ctx) return { sum: 0, chroma: 0 };
        const data = ctx.getImageData(120, 80, 400, 260).data;
        let sum = 0;
        let chroma = 0;
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          sum += r + g + b;
          chroma += Math.abs(r - g) + Math.abs(g - b);
        }
        return { sum, chroma };
      });

    const beforeSig = await getCanvasChromaSignature();
    expect(beforeSig.sum).toBeGreaterThan(0);

    // Thêm lớp Adjustment Curves/HSL mới và giảm Saturation xuống -100% + tăng Contrast
    await page.getByTestId('photo-add-adjustment-layer').click();
    await expect(page.getByTestId('photo-adjustments-panel')).toBeVisible();

    await page.getByTestId('adj-slider-saturation').fill('-100');
    await page.getByTestId('adj-slider-curveMidtone').fill('40');
    await page.waitForTimeout(200);

    const afterSig = await getCanvasChromaSignature();
    expect(afterSig.chroma).toBeLessThan(beforeSig.chroma * 0.25);

    // Đổi tên và hạ thứ tự layer mới
    const renameBtn = page.locator('button[data-testid^="layer-rename-btn-adj-custom-"]').first();
    await renameBtn.click();
    const renameInput = page.locator('input[data-testid^="layer-rename-input-adj-custom-"]').first();
    await renameInput.fill('Hiệu chỉnh Đen Trắng Điện Ảnh');
    await renameInput.press('Enter');
    await expect(page.locator('text=Hiệu chỉnh Đen Trắng Điện Ảnh')).toBeVisible();

    const moveDownBtn = page.locator('button[data-testid^="layer-down-adj-custom-"]').first();
    await moveDownBtn.click();
  });

  test('TC-P4-03: ChallengesPage chấm điểm thực tế hình học Vector & mặt nạ Pixel trên Canvas nhúng', async ({
    page,
  }) => {
    await page.goto('/challenges');
    const liveWorkspace = page.getByTestId('challenge-live-workspace');
    await expect(liveWorkspace).toBeVisible();

    // Chấm trực tiếp khi chưa vẽ gì -> bắt buộc trả về 0% CẦN CẢI THIỆN
    await page.getByTestId('evaluate-live-canvas-btn').click();
    const resultBox = page.getByTestId('challenge-evaluation-result');
    await expect(resultBox).toContainText('KẾT QUẢ: CẦN CẢI THIỆN');
    await expect(resultBox).toContainText('Độ chính xác: 0%');

    // Vẽ 4 đỉnh hình thoi chuẩn ngay trên Canvas nhúng của Thử thách 01
    const svg = liveWorkspace.locator('svg.cursor-crosshair');
    await svg.click({ position: { x: 400, y: 120 } });
    await page.waitForTimeout(60);
    await svg.click({ position: { x: 580, y: 260 } });
    await page.waitForTimeout(60);
    await svg.click({ position: { x: 400, y: 400 } });
    await page.waitForTimeout(60);
    await svg.click({ position: { x: 220, y: 260 } });
    await page.waitForTimeout(60);
    await svg.click({ position: { x: 400, y: 120 } });
    await page.waitForTimeout(120);

    await expect(page.getByTestId('challenge-live-telemetry')).toContainText('100%');
    await page.getByTestId('evaluate-challenge-btn').click();
    await expect(resultBox).toContainText('KẾT QUẢ: ĐẠT CHUẨN THỬ THÁCH');
    await expect(resultBox).toContainText('Độ chính xác: 100%');

    // Chuyển sang Thử thách 04 tách nền ảnh chân dung thật
    await page.getByTestId('challenge-item-ch-pix-portrait-mask').click();
    await page.waitForTimeout(550);
    await liveWorkspace.getByTestId('photo-smart-matte-btn').click();
    await page.waitForTimeout(120);

    await page.getByTestId('evaluate-live-canvas-btn').click();
    await expect(resultBox).toContainText('KẾT QUẢ: ĐẠT CHUẨN THỬ THÁCH');
  });

  test('TC-P4-04: Encyclopedia mở "Chạy thử trong Playground" và chạy đủ 4 kịch bản JS DOM vẽ Live Canvas', async ({
    page,
  }) => {
    await page.goto('/encyclopedia');
    await page.getByTestId('api-symbol-ShapeStar').click();
    await expect(page.locator('span:has-text("Ngôi sao tham số tùy chỉnh số cánh")')).toBeVisible();

    await page.getByTestId('try-in-playground-btn').click();
    await expect(page.locator('h1')).toContainText('Phòng Thí Nghiệm Lập Trình Scripting & MCP');
    await expect(page.getByTestId('playground-editor')).toHaveValue(/ShapeStar\.create/);

    const countNonBackgroundPixels = async () =>
      page.evaluate(() => {
        const canvas = document.querySelector('[data-testid="playground-canvas"]') as HTMLCanvasElement | null;
        if (!canvas) return 0;
        const ctx = canvas.getContext('2d');
        if (!ctx) return 0;
        const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let nonBg = 0;
        for (let i = 0; i < d.length; i += 16) {
          if (d[i] > 28 || d[i + 1] > 28 || d[i + 2] > 36) nonBg++;
        }
        return nonBg;
      });

    expect(await countNonBackgroundPixels()).toBeGreaterThan(300);

    // Chạy kiểm chứng lần lượt đủ cả 4 kịch bản mẫu Việt hóa
    for (const presetId of [
      'preset-geometric-series',
      'preset-batch-recolor',
      'preset-artboard-grid',
      'preset-inspect-layers',
    ]) {
      await page.getByTestId(presetId).click();
      await page.getByTestId('playground-run-btn').click();
      const consoleBox = page.getByTestId('playground-console');
      await expect(consoleBox).toContainText('Thành công');
      await expect(consoleBox).not.toContainText('Lỗi thực thi');
      await expect(consoleBox).not.toContainText('Bị chặn bởi Sandbox');
      expect(await countNonBackgroundPixels()).toBeGreaterThan(300);
    }
  });
});
