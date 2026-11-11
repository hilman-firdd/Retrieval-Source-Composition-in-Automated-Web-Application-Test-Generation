const { test, expect } = require('@playwright/test');

test.describe('NEWS02 - Membuka detail berita dari daftar', () => {
  test('Membuka detail berita dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('h3')).toBeVisible();
    await page.click('h3:has-text("JIHAD ISTIMEWA & PELEPASAN JAMA’AH HAJI 2026")');
    await expect(page).toHaveURL(/portal\/[a-zA-Z0-9-]+$/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
