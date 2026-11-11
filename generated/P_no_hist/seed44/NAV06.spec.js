const { test, expect } = require('@playwright/test');

test.describe('NAV06: Membuka FAQ SIMASIS dari tautan footer', () => {
  test('Membuka FAQ SIMASIS dari tautan footer', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('text="Pesantren Persis 27 Situaksan Bandung Gelar Agenda Wisata "Goes to Pangandaran"'')).toBeVisible();
    await page.locator('text="FAQ SIMASIS"').click();
    await expect(page).toHaveURL('/portal/halaman/faq-simasis');
    await expect(page.locator('text="FAQ SIMASIS"')).toBeVisible();
  });
});
