const { test, expect } = require('@playwright/test');

test.describe('Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('/portal/berita');
    const judulBeritaPertama = await page.locator('h3').first().textContent();

    await page.goto(`/portal/${judulBeritaPertama.replace(/\s+/g, '-')}`);
    await expect(page.getByRole('heading', { name: judulBeritaPertama })).toBeVisible();

    expect(await page.getByRole('heading', { name: judulBeritaPertama }).textContent()).toBe(judulBeritaPertama);
  });
});
