const { test, expect } = require('@playwright/test');

test.describe('NAV03: Berpindah dari beranda ke daftar artikel santri', () => {
  test('should navigate from home to article list', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');

    await expect(page).toHaveURL('/');

    await page.locator('text="Lihat Semua"').click();

    await expect(page).toHaveURL('/portal/artikel');

    await expect(page).toHaveTitle('Artikel Tulisan Santri');
  });
});
