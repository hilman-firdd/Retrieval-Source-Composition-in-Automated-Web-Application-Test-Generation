const { test, expect } = require('@playwright/test');

test.describe('INF02: Membaca FAQ SIMASIS tanpa perlu mengeklik akordeon', () => {
  test('Verify FAQ SIMASIS page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/faq-simasis');
    await expect(page.locator('text="1. Apa itu SIMASIS?"')).toBeVisible();
    await expect(page.locator('text="Jawaban: ..."')).toBeVisible();
  });
});
