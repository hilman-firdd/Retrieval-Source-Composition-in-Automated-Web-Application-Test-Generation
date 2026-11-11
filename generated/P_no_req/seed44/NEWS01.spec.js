const { test, expect } = require('@playwright/test');

test.describe('Berita Terbaru', () => {
  test('membuka daftar berita dan memverifikasi ada item', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    const jumlahJudul = await page.locator('h3').count();
    expect(jumlahJudul).toBeGreaterThan(0);
  });
});
