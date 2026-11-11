const { test, expect } = require('@playwright/test');

test.describe('NAV06: Membuka FAQ SIMASIS dari tautan footer', () => {
  test('Membuka halaman FAQ SIMASIS', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/');
    await expect(page.locator('text="FAQ SIMASIS"')).toBeVisible();
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/faq-simasis');
  });
});
