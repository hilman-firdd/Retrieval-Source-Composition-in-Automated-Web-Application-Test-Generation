const { test, expect } = require('@playwright/test');

test.describe('NEWS01 - Membuka daftar berita dan memverifikasi ada item', () => {
  test('daftar berita memuat sedikitnya satu judul', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    const jumlahJudul = await page.locator('h3').count();
    expect(jumlahJudul).toBeGreaterThan(0);
  });
});
