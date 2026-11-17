import { test, expect } from '@playwright/test';

test.describe('Đồ án tốt nghiệp — Tải tệp thật & Bảo mật phân quyền Giám khảo (RBAC)', () => {
  test('TC-CAP-01: Giao diện học viên sạch nhãn nội bộ và ẩn hoàn toàn bảng chấm điểm Giám khảo', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-capstone').click();

    await expect(page.locator('h1')).toContainText(
      'Chiến Dịch Tái Định Vị & Ra Mắt Thương Hiệu Cà Phê Lumina'
    );
    await expect(page.locator('text=Đồ án tốt nghiệp cuối khóa')).toBeVisible();

    // Zero internal task IDs or public grading toggles
    await expect(page.locator('text=TASK-081')).toHaveCount(0);
    await expect(page.locator('text=A5 GRADUATION CAPSTONE ASSESSMENT')).toHaveCount(0);
    await expect(page.locator('button:has-text("Giám khảo (Chấm điểm)")')).toHaveCount(0);

    // Switch to Results tab as unauthenticated/student user
    await page.getByTestId('capstone-tab-results').click();
    await expect(page.getByTestId('evaluator-console')).toHaveCount(0);
    await expect(
      page.locator('text=Hồ sơ đồ án đang chờ Hội đồng Giám khảo độc lập thẩm định')
    ).toBeVisible();
  });

  test('TC-CAP-02: Tab Đề tài & Tab Rubric hiển thị đầy đủ chuẩn PLO-07 và PLO-08', async ({ page }) => {
    await page.goto('/capstone');

    await expect(page.locator('text=Bối cảnh dự án & Hồ sơ thương hiệu')).toBeVisible();
    await expect(page.locator('text=Ràng buộc kỹ thuật bắt buộc')).toBeVisible();
    await expect(page.locator('text=Bộ học liệu khởi đầu')).toBeVisible();
    await expect(page.locator('text=lumina_project_brief.md')).toBeVisible();
    await expect(page.locator('text=2. Xác định (Define · PLO-07)')).toBeVisible();

    await page.getByTestId('capstone-tab-rubric').click();
    await expect(page.locator('text=Ngưỡng điểm đạt chuẩn tốt nghiệp')).toBeVisible();
    await expect(page.locator('text=1. Giải mã Brief & Khán giả mục tiêu (PLO-07)')).toBeVisible();
    await expect(page.locator('text=5. Tự Chẩn đoán, Phản biện & Lặp lại (PLO-08)')).toBeVisible();
  });

  test('TC-CAP-03: Kiểm tra định dạng tệp tải lên và nộp thành công đủ 6 tệp bằng chứng', async ({ page }) => {
    await page.goto('/capstone');
    await page.getByTestId('capstone-tab-submit').click();

    // Invalid extension (.exe) must be rejected cleanly
    await page.getByTestId('upload-brief').setInputFiles({
      name: 'malware.exe',
      mimeType: 'application/x-msdownload',
      buffer: Buffer.from('MZ'),
    });
    await expect(page.getByTestId('upload-brief-error')).toBeVisible();

    // Valid files for all 6 required deliverables
    await page.getByTestId('upload-brief').setInputFiles({
      name: 'brief-deconstruction.md',
      mimeType: 'text/markdown',
      buffer: Buffer.from('# Phan ra Brief Lumina\nAudience, Constraints...'),
    });
    await page.getByTestId('upload-iteration').setInputFiles({
      name: 'iteration-critique-log.md',
      mimeType: 'text/markdown',
      buffer: Buffer.from('# Nhat ky sua doi Draft 1 vs Draft 2'),
    });
    await page.getByTestId('upload-vector').setInputFiles({
      name: 'lumina-brand-system.afdesign',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from('AFFINITY_VECTOR_MOCK'),
    });
    await page.getByTestId('upload-pixel').setInputFiles({
      name: 'lumina-coldbrew-kv.afphoto',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from('AFFINITY_PHOTO_MOCK'),
    });
    await page.getByTestId('upload-print-pdf').setInputFiles({
      name: 'label-packaging-print.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n%%EOF'),
    });
    await page.getByTestId('upload-digital-webp').setInputFiles({
      name: 'lumina-ad-banner-2x.webp',
      mimeType: 'image/webp',
      buffer: Buffer.from('RIFF\x00\x00\x00\x00WEBP'),
    });

    await expect(page.getByTestId('upload-brief-status')).toContainText('brief-deconstruction.md');
    await expect(page.getByTestId('upload-print-pdf-status')).toContainText('label-packaging-print.pdf');

    await page.getByTestId('submit-capstone-btn').click();
    await expect(page.locator('text=Đã nộp thành công hồ sơ đồ án phiên bản v1')).toBeVisible();
  });

  test('TC-CAP-04: Chỉ tài khoản vai trò Giám khảo mới mở được Bảng thẩm định và khóa điểm liệt PLO-07', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'affinity_academy_offline_user',
        JSON.stringify({
          role: 'evaluator',
          email: 'evaluator@affinity.academy',
          displayName: 'Giám Khảo Độc Lập',
        })
      );
    });

    await page.goto('/capstone');
    await expect(page.getByTestId('evaluator-role-badge')).toBeVisible();

    await page.getByTestId('capstone-tab-results').click();
    await expect(page.getByTestId('evaluator-console')).toBeVisible();

    // Critical violation on PLO-07 (< Level 3) must force FAILED preview even when others pass
    await page.getByTestId('eval-brief_interpretation-lvl-2').click();
    await expect(page.getByTestId('evaluator-preview-verdict')).toContainText('KHÔNG ĐẠT');

    // Raise back to Level 3 and sign off
    await page.getByTestId('eval-brief_interpretation-lvl-3').click();
    await expect(page.getByTestId('evaluator-preview-verdict')).toContainText('ĐẠT');

    await page.getByTestId('evaluator-signoff-btn').click();
    await expect(page.locator('text=ĐẠT CHUẨN TỐT NGHIỆP — XÁC NHẬN NĂNG LỰC ĐỘC LẬP')).toBeVisible();
    await expect(page.locator('text=CHỨNG NHẬN TỐT NGHIỆP AFFINITY ACADEMY')).toBeVisible();
  });
});
