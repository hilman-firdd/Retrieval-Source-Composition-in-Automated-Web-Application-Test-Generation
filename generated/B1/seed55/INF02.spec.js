const { test, expect } = require('@playwright/test');

test.describe('INF02 - Membaca FAQ SIMASIS tanpa perlu mengeklik akordeon', () => {
  test('Verify FAQ SIMASIS page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/faq-simasis');

    // Verify that the first question '1. Apa itu SIMASIS?' is visible
    const question = await page.locator('text="1. Apa itu SIMASIS?"').first();
    expect(question).toBeVisible();

    // Verify that the answer is also visible
    const answer = await page.locator('text="Jawaban: SIMASIS adalah sistem informasi manajemen yang digunakan oleh Pesantren Persis 27 untuk mengelola data siswa dan guru."').first();
    expect(answer).toBeVisible();
  });
});
