const { test, expect } = require('@playwright/test');

test.describe('NWS02: Membuka detail berita dari daftar', () => {
  test('Membuka detail berita dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    await expect(page.locator('text="Berita"')).toBeVisible();
    await page.locator('text="Berita"').click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/berita/*');
    await expect(page.locator('text="Judul Berita"')).toBeVisible();
    await expect(page.locator('text="Isi Berita"')).toBeVisible();
  });
});
