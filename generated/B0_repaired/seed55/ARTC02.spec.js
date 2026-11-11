const { test, expect } = require('@playwright/test');

test.describe('ARTC02: Membuka detail artikel dari daftar', () => {
  test('Membuka detail artikel dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('h1:has-text("Judul Artikel Pertama")')).toBeVisible();
    await page.locator('h1:has-text("Judul Artikel Pertama")').click();
    await expect(page).toHaveURL(/portal/.+);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1:has-text("Judul Artikel Pertama")')).toBeVisible();
  });
});
