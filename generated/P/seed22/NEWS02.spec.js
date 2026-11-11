const { test, expect } = require('@playwright/test');

test.describe('Daftar berita - detail berita', () => {
  test('membuka detail berita dari daftar', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.getByRole('heading', { name: 'Berita Terbaru' })).toBeVisible();
    const judulBeritaPertama = await page.locator('h3').first().textContent();
    await page.locator(`h3:has-text("${judulBeritaPertama}")`).click();
    await expect(page).toHaveURL(/portal\/[a-zA-Z0-9-]+/);
    await expect(page.getByRole('heading', { name: judulBeritaPertama })).toBeVisible();
  });
});
