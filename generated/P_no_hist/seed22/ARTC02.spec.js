const { test, expect } = require('@playwright/test');

test.describe('ARTC02 - Membuka detail artikel dari daftar', () => {
  test('Membuka detail artikel dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.getByText('Artikel Tulisan Santri')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Artikel Tulisan Santri' })).toBeVisible();
    await page.click('h3:has-text("JIHAD ISTIMEWA & PELEPASAN JAMA’AH HAJI 2026")');
    await expect(page).toHaveURL('/portal/jihad-istimewa-pelepasan-jama-haji-2026');
    await expect(page.getByText('JIHAD ISTIMEWA & PELEPASAN JAMA’AH HAJI 2026')).toBeVisible();
  });
});
