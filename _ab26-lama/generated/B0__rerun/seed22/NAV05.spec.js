const { test, expect } = require('@playwright/test');

test.describe('NAV05: Menu navigasi konsisten di seluruh halaman utama', () => {
  test('Menu navigasi terlihat pada setiap halaman yang dikunjungi', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');

    await expect(page.locator('role=navigation')).toBeVisible();

    await page.goto('https://staging.pesantrenpersis27.com/profil');

    await expect(page.locator('role=navigation')).toBeVisible();

    await page.goto('https://staging.pesantrenpersis27.com/berita');

    await expect(page.locator('role=navigation')).toBeVisible();
  });
});
