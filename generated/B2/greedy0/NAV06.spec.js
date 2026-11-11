const { test, expect } = require('@playwright/test');

test.describe('NAV06 - Membuka FAQ SIMASIS dari tautan footer', () => {
  test('Membuka FAQ SIMASIS dari tautan footer', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page).toHaveURL('/');
    await page.locator('text="FAQ SIMASIS"').click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/halaman/faq-simasis');
    await expect(page).toHaveTitle('FAQ SIMASIS - Pesantren Persis 27 - Pesantren PERSIS 27');
  });
});
