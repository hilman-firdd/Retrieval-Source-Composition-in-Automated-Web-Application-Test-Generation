const { test, expect } = require('@playwright/test');

test.describe('INF02 - Membaca FAQ SIMASIS tanpa perlu mengeklik akordeon', () => {
  test('Pertanyaan dan jawaban SIMASIS', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/faq-simasis');

    // Assert pertanyaan '1. Apa itu SIMASIS?' terlihat
    const question = await page.locator('text="1. Apa itu SIMASIS?"').first();
    expect(question).toBeVisible();

    // Assert jawabannya langsung terlihat tanpa interaksi apa pun
    const answer = await page.locator('text="SIMASIS adalah sistem informasi manajemen yang digunakan oleh Pesantren Persis 27 untuk memantau dan mengelola kegiatan pesantren."').first();
    expect(answer).toBeVisible();
  });
});
