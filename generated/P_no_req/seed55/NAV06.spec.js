const { test, expect } = require('@playwright/test');

test.describe('NAV06 Membuka FAQ SIMASIS dari tautan footer', () => {
  test('membuka halaman FAQ SIMASIS', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'FAQ SIMASIS' })).toBeVisible();
    await page.getByRole('link', { name: 'FAQ SIMASIS' }).click();
    await expect(page.getByText('FAQ SIMASIS')).toBeVisible();
    await expect(page.getByText('1. Apa itu SIMASIS?')).toBeVisible();
  });
});
