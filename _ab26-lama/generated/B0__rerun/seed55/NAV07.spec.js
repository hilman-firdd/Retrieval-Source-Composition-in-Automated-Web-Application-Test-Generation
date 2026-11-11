const { test, expect } = require('@playwright/test');

test.describe('NAV07: Membuka halaman galeri dan memverifikasi konten visual', () => {
  test('Verify gallery page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await page.getByRole('link', { name: 'Galeri' }).click();
    await expect(page).toHaveURL('/galeri');
    await expect(page.locator('img')).toBeVisible();
  });
});
