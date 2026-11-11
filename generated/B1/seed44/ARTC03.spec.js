const { test, expect } = require('@playwright/test');

test.describe('ARTC03 - Menggunakan navigasi halaman pada daftar artikel', () => {
  test('Menggunakan navigasi halaman pada daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('text="Artikel Santri"')).toBeVisible();
    await expect(page.locator('text="Portal Pesantren PERSIS 27 Situaksan"')).toBeVisible();
    await page.locator('text="Artikel"').click();
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel?page=2');
    await expect(page.locator('text="Artikel Santri"')).toBeVisible();
    await expect(page.locator('text="Portal Pesantren PERSIS 27 Situaksan"')).toBeVisible();
    const firstArticleTitle = await page.locator('text').first();
    await expect(firstArticleTitle).not.toEqual(await page.locator('text').nth(0));
  });
});
