const { test, expect } = require('@playwright/test');

test.describe('ARTC02 - Membuka detail artikel dari daftar', () => {
  test('Membuka detail artikel dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.getByText('Artikel Tulisan Santri')).toBeVisible();
    await page.getByText('Artikel Tulisan Santri').click();
    await expect(page).toHaveURL(/\/portal\/[a-zA-Z0-9-]+/);
    await expect(page.getByText('Artikel Tulisan Santri')).toBeVisible();
  });
});
