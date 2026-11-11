const { test, expect } = require('@playwright/test');

test.describe('NAV06: Membuka FAQ SIMASIS dari tautan footer', () => {
  test('Membuka FAQ SIMASIS dari tautan footer', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.getByRole('link', { name: 'Pesantren Persis 27 Situaksan Bandung Gelar Agenda Wisata "Goes to Pangandaran"' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'FAQ SIMASIS' })).toBeVisible();
    await page.click('text=FAQ SIMASIS');
    await expect(page.locator('h1:has-text("FAQ SIMASIS")')).toBeVisible();
    await expect(page.locator('h2:has-text("Pertanyaan Umum")')).toBeVisible();
  });
});
