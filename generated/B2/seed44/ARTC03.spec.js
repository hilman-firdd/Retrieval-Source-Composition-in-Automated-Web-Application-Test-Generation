const { test, expect } = require('@playwright/test');

test.describe('ARTC03 - Menggunakan navigasi halaman pada daftar artikel', () => {
  test('Menggunakan navigasi halaman pada daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');

    // Assert that the first article title on the first page is correct
    const firstArticleTitle = await page.getByText('Keutamaan Dan Adab-Adab Jihad');
    expect(firstArticleTitle).toBeVisible();

    // Navigate to the second page
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel?page=2');

    // Assert that the first article title on the second page is different from the first page
    const secondPageFirstArticleTitle = await page.getByText('Sejatinya Manusia; Melihat apa-apa yang tampak');
    expect(secondPageFirstArticleTitle).toBeVisible();
  });
});
