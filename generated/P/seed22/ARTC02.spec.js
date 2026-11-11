const { test, expect } = require('@playwright/test');

test.describe('Daftar artikel santri - membuka detail artikel', () => {
  test('membuka detail artikel', async ({ page }) => {
    await page.goto('/portal/artikel');
    await expect(page.getByRole('heading', { name: 'Artikel Tulisan Santri' })).toBeVisible();
    const judulArtikelPertama = await page.locator('h3').first().textContent();
    await page.locator(`h3:has-text("${judulArtikelPertama}")`).click();

    await expect(page).toHaveURL(/portal\/[a-zA-Z0-9-]+/);
    await expect(page.getByRole('heading', { name: judulArtikelPertama })).toBeVisible();
  });
});
