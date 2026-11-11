const { test, expect } = require('@playwright/test');

test.describe('INF02: Membaca FAQ SIMASIS tanpa perlu mengeklik akordeon', () => {
  test('Verify FAQ SIMASIS page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/faq-simasis');

    // Verify the first question and answer are visible
    const question = await page.locator('text="1. Apa itu SIMASIS?"').first();
    expect(question).toBeVisible();
    const answer = await page.locator('text="SIMASIS adalah sistem informasi manajemen pesantren yang berisi berbagai data pesantren dan siswa."').first();
    expect(answer).toBeVisible();
  });
});
