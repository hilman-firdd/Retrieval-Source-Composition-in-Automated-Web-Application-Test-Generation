const { test, expect } = require('@playwright/test');

test.describe('NAV06 - Membuka FAQ SIMASIS dari tautan footer', () => {
  test('membuka halaman FAQ SIMASIS', async ({ page }) => {
    await page.goto('/');
    await page.locator('footer a:has-text("FAQ SIMASIS")').click();
    await expect(page).toHaveURL('/portal/halaman/faq-simasis');
    await expect(page.getByRole('heading', { name: 'FAQ SIMASIS' })).toBeVisible();
  });
});
