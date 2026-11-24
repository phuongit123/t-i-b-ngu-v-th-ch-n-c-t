import { test, expect } from '@playwright/test';

test.describe('Phase 5 — Technical SEO, URL Tiếng Việt & JSON-LD Schema', () => {
  test('TC-P5-01: Truy cập trực tiếp URL bài học tiếng Việt cập nhật chuẩn <html lang="vi">, canonical và JSON-LD LearningResource', async ({
    page,
  }) => {
    await page.goto('/bai-hoc/p05-01-nguyen-ly-can-chinh-mau-sac-bieu-do-histogram-va-curves');

    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
    await expect(page.locator('h1')).toContainText('Exposure, dải tương phản và cân bằng trắng');
    await expect(page.locator('h1')).toBeVisible();

    const title = await page.title();
    expect(title).toContain('P05-01');
    expect(title).toContain('Affinity Academy');

    const canonicalHref = await page.locator('#canonical-link').getAttribute('href');
    expect(canonicalHref).toContain('/bai-hoc/p05-01-');

    const jsonLdRaw = await page.locator('#academy-jsonld').textContent();
    expect(jsonLdRaw).toBeTruthy();
    const parsed = JSON.parse(jsonLdRaw ?? '{}');
    const graph = parsed['@graph'] as Array<Record<string, unknown>>;
    expect(Array.isArray(graph)).toBe(true);
    expect(graph.some((node) => node['@type'] === 'LearningResource' && node.inLanguage === 'vi')).toBe(
      true
    );
    expect(graph.some((node) => node['@type'] === 'BreadcrumbList')).toBe(true);
  });

  test('TC-P5-02: Toàn bộ các phân hệ hỗ trợ định tuyến URL tiếng Việt trực tiếp và cập nhật Title/Metadata riêng', async ({
    page,
  }) => {
    await page.goto('/lo-trinh/pixel-studio');
    await expect(page.getByTestId('catalog-track-heading')).toContainText('Pixel Studio');
    await expect(page.getByTestId('catalog-lesson-count-badge')).toContainText('30 bài học sẵn sàng');
    expect(await page.title()).toContain('Pixel Studio');

    const routesAndHeadings: Array<{ url: string; h1: string; titleContains: string }> = [
      {
        url: '/phong-mo-phong',
        h1: 'Bộ Mô Phỏng Bézier Pen & Node Tool',
        titleContains: 'Phòng Mô Phỏng',
      },
      {
        url: '/thu-thach',
        h1: 'Thử Thách Kỹ Thuật & Bài Luyện Thực Hành',
        titleContains: 'Thử Thách Kỹ Thuật',
      },
      {
        url: '/thuc-hanh-tu-dong-hoa',
        h1: 'Phòng Thí Nghiệm Lập Trình Scripting & MCP',
        titleContains: 'Tự Động Hóa',
      },
      {
        url: '/bach-khoa-api',
        h1: 'Bách Khoa Toàn Thư Affinity DOM API',
        titleContains: 'Bách Khoa Toàn Thư',
      },
      {
        url: '/tri-thuc/tu-dien-thuat-ngu',
        h1: 'Trung Tâm Tri Thức & Tra Cứu Toàn Diện',
        titleContains: 'Từ Điển Thuật Ngữ',
      },
      {
        url: '/tai-nguyen',
        h1: 'Thư Viện Tài Nguyên & Học Liệu',
        titleContains: 'Thư Viện Tài Nguyên',
      },
      {
        url: '/ho-so-hoc-tap',
        h1: 'Bảng Điều Khiển Học Viên & Hồ Sơ Năng Lực',
        titleContains: 'Hồ Sơ Học Tập',
      },
      {
        url: '/do-an-tot-nghiep',
        h1: 'Chiến Dịch Tái Định Vị & Ra Mắt Thương Hiệu Cà Phê Lumina',
        titleContains: 'Đồ Án Tốt Nghiệp',
      },
    ];

    for (const item of routesAndHeadings) {
      await page.goto(item.url);
      await expect(page.locator('h1')).toContainText(item.h1);
      expect(await page.title()).toContain(item.titleContains);
    }
  });

  test('TC-P5-03: Liên kết nội bộ Silo hai chiều kết nối trực tiếp Từ điển <-> Bài học <-> Bộ mô phỏng', async ({
    page,
  }) => {
    await page.goto('/tri-thuc/tu-dien-thuat-ngu');

    // Không còn ký hiệu LaTeX $ thô ở tab Từ điển hoặc Bảng tóm tắt
    await expect(page.locator('text=$180')).toHaveCount(0);

    const siloLink = page.getByTestId('glossary-silo-lesson-D02-01');
    await expect(siloLink).toBeVisible();
    const href = await siloLink.getAttribute('href');
    expect(href).toMatch(/^\/bai-hoc\/d02-01-/);

    await siloLink.click();
    await expect(page.locator('h1')).toContainText('Vẽ đường cong bằng Pen Tool');
    await expect(page).toHaveURL(/\/bai-hoc\/d02-01-/);

    const lessonSiloBar = page.getByTestId('lesson-seo-silo-bar');
    await expect(lessonSiloBar).toBeVisible();
    await expect(lessonSiloBar.locator('a[href="/phong-mo-phong"]')).toBeVisible();
    await expect(lessonSiloBar.locator('a[href="/tri-thuc/tu-dien-thuat-ngu"]')).toBeVisible();
  });

  test('TC-P5-04: sitemap.xml liệt kê đủ 85 URL (19 chuyên mục + 66 bài học) và robots.txt hợp lệ', async ({
    page,
  }) => {
    const sitemapRes = await page.request.get('/sitemap.xml');
    expect(sitemapRes.status()).toBe(200);
    const sitemapXml = await sitemapRes.text();

    expect(sitemapXml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(sitemapXml).toContain('<loc>https://affinityacademy.vn/lo-trinh/vector-studio</loc>');
    expect(sitemapXml).toContain('<loc>https://affinityacademy.vn/phong-mo-phong</loc>');
    expect(sitemapXml).toContain('<loc>https://affinityacademy.vn/thuc-hanh-tu-dong-hoa</loc>');

    const urlMatches = sitemapXml.match(/<url>/g) ?? [];
    expect(urlMatches.length).toBe(85);
    expect(sitemapXml).toContain('<loc>https://affinityacademy.vn/lo-trinh/bat-dau</loc>');

    const lessonUrlMatches = sitemapXml.match(/\/bai-hoc\/[dpbs]\d{2}-\d{2}-/g) ?? [];
    expect(lessonUrlMatches.length).toBe(66);

    const robotsRes = await page.request.get('/robots.txt');
    expect(robotsRes.status()).toBe(200);
    const robotsTxt = await robotsRes.text();
    expect(robotsTxt).toContain('User-agent: *');
    expect(robotsTxt).toContain('Sitemap: https://affinityacademy.vn/sitemap.xml');
  });
});
