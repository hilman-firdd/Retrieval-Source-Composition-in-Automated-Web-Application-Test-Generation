const { test, expect } = require('@playwright/test');

test.describe('Berita - Membuka detail berita', () => {
  test('membuka detail berita', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.getByRole('heading', { name: 'Berita Terbaru' })).toBeVisible();
    const judulBeritaPertama = await page.locator('h3').first();
    await judulBeritaPertama.click();
    await expect(page).toHaveURL(/portal/.+);
    await expect(page.getByRole('heading', { name: /Berita Terbaru/ })).toBeVisible();
  });
});
