const { test, expect } = require('@playwright/test');

test.describe('Berita Terbaru', () => {
  test('judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('/portal/berita');
    const judulBeritaPertama = await page.locator('h3').first().textContent();

    await page.goto(`/portal/${judulBeritaPertama}`);
    await expect(page.getByRole('heading', { name: judulBeritaPertama })).toBeVisible();

    expect(await page.locator('h1').textContent()).toBe(judulBeritaPertama);
  });
});
