const { test, expect } = require('@playwright/test');

test.describe('NAV04: Kembali ke beranda melalui logo situs', () => {
  test('Kembali ke beranda melalui logo situs', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/profil');
    await expect(page.locator('text="Pesantren Persis 27"')).toBeVisible();
    await page.locator('text="Pesantren Persis 27"').click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com');
    await expect(page.locator('h1')).toBeVisible();
  });
});
