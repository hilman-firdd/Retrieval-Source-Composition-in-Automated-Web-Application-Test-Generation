const { test, expect } = require('@playwright/test');

test.describe('Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('NEWS03: Judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('/portal/berita');
    const judulBeritaPertama = await page.locator('h3').first().textContent();

    await page.goto(`/portal/berita/${judulBeritaPertama}`);
    await expect(page.getByRole('heading', { name: judulBeritaPertama })).toBeVisible();

    await expect(page.getByRole('heading', { name: judulBeritaPertama })).toHaveText(judulBeritaPertama);
  });
});
