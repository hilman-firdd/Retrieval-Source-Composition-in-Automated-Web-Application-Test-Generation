const { test, expect } = require('@playwright/test');

test.describe('Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('/portal/berita');
    const judulBeritaDaftar = await page.locator('h3').first().textContent();

    await page.goto(`/portal/${judulBeritaDaftar.replace(/\s+/g, '-')}`);
    await expect(page.getByRole('heading', { name: judulBeritaDaftar })).toBeVisible();

    expect(await page.getByRole('heading', { name: judulBeritaDaftar }).textContent()).toBe(judulBeritaDaftar);
  });
});
