const { test, expect } = require('@playwright/test');

test.describe('Membuka detail artikel dari daftar', () => {
  test('membuka detail artikel pertama', async ({ page }) => {
    await page.goto('/portal/artikel');
    await page.getByRole('link', { name: 'Artikel Tulisan Santri' }).first().click();

    await expect(page).toHaveURL(/portal\/[a-zA-Z0-9-_/]+/);
    await expect(page.getByRole('heading', { name: 'Artikel Tulisan Santri' })).toBeVisible();
  });
});
