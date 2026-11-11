const { test, expect } = require('@playwright/test');

test.describe('ARTC02 - Membuka detail artikel dari daftar', () => {
  test('Membuka detail artikel dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('h3')).toBeVisible();
    await page.click('h3');
    await expect(page).toHaveURL(/portal\/[a-zA-Z0-9-]+/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
