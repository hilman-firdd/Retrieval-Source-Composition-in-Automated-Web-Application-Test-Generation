const { test, expect } = require('@playwright/test');

test.describe('NAV05 - Kembali ke beranda dari daftar berita', () => {
  test('should navigate to the home page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('text="Beranda"')).toBeVisible();
    await page.locator('text="Beranda"').click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal');
    await expect(page.locator('text="Portal Pesantren PERSIS 27 Situaksan"')).toBeVisible();
  });
});
