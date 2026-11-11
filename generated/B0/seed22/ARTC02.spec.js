const { test, expect } = require('@playwright/test');

test.describe('ARTC02: Membuka detail artikel dari daftar', () => {
  test('Membuka detail artikel dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/artikel');
    await page.click('text="Judul Artikel Pertama"');
    await expect(page).toHaveURL(/https:\/\/staging\.pesantrenpersis27\.com\/portal\/[a-zA-Z0-9_-]+$/);
    await expect(page.locator('text="Judul Artikel Pertama"')).toBeVisible();
  });
});
