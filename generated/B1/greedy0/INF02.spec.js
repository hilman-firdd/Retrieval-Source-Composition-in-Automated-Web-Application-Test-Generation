const { test, expect } = require('@playwright/test');

test.describe('INF02 - Membaca FAQ SIMASIS tanpa perlu mengeklik akordeon', () => {
  test('Verify FAQ SIMASIS page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/faq-simasis');

    // Verify question '1. Apa itu SIMASIS?' is visible
    const question = await page.locator('text="1. Apa itu SIMASIS?"').first();
    expect(question).toBeVisible();

    // Verify answer is visible
    const answer = await page.locator('text="Pertanyaan yang sering diajukan seputar penggunaan SIMASIS Pesantren Persis 27."').first();
    expect(answer).toBeVisible();
  });
});
