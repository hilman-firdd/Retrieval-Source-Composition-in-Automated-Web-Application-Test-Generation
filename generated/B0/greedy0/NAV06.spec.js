const { test, expect } = require('@playwright/test');

test.describe('NAV06: Membuka FAQ SIMASIS dari tautan footer', () => {
  test('Membuka FAQ SIMASIS dari tautan footer', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('footer')).toBeVisible();
    await page.locator('footer a:has-text("FAQ SIMASIS")').click();
    await expect(page).toHaveURL(/.*\/faq-simasis$/);
    await expect(page.locator('h1:has-text("FAQ SIMASIS")')).toBeVisible();
  });
});
