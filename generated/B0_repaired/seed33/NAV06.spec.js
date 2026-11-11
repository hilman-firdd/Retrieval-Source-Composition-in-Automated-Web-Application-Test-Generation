const { test, expect } = require('@playwright/test');

test.describe('NAV06: Membuka FAQ SIMASIS dari tautan footer', () => {
  test('Membuka FAQ SIMASIS dari tautan footer', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('footer')).toBeVisible();
    await page.locator('footer a:has-text("FAQ SIMASIS")').click();
    await expect(page.locator('li.breadcrumb-item.active')).toBeVisible();
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/faq-simasis');
    await expect(page.locator('li.breadcrumb-item.active')).toBeVisible();
  });
});
