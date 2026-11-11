const { test, expect } = require('@playwright/test');

test.describe('Daftar artikel santri', () => {
  test('membuka daftar artikel dan memverifikasi ada item', async ({ page }) => {
    await page.goto('/portal/artikel');
    await expect(page.getByText('Artikel Tulisan Santri')).toBeVisible();
    const jumlahJudul = await page.locator('h3').count();
    expect(jumlahJudul).toBeGreaterThan(0);
  });
});
