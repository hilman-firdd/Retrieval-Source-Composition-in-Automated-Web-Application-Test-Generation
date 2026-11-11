const { test, expect } = require('@playwright/test');

test.describe('INF02 - Membaca FAQ SIMASIS tanpa perlu mengeklik akordeon', () => {
  test('Membaca FAQ SIMASIS tanpa perlu mengeklik akordeon', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/faq-simasis');

    // Pertanyaan '1. Apa itu SIMASIS?' terlihat
    await expect(page.locator('text="1. Apa itu SIMASIS?"')).toBeVisible();

    // Jawabannya langsung terlihat tanpa interaksi apa pun
    await expect(page.locator('text="Pertanyaan yang sering diajukan seputar penggunaan SIMASIS Pesantren Persis 27."')).toBeVisible();
  });
});
