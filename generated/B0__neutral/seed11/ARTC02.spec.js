const { test, expect } = require('@playwright/test');

test.describe('ARTC02: Membuka detail artikel dari daftar', () => {
  test('Membuka detail artikel dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('text="Artikel"')).toBeVisible();
    await page.locator('text="Artikel"').click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/*');
    await expect(page.locator('text="Judul Artikel"')).toBeVisible();
  });
});
