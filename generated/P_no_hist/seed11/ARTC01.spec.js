const { test, expect } = require('@playwright/test');

test.describe('ARTC01 - Membuka daftar artikel dan memverifikasi ada item', () => {
  test('Membuka daftar artikel dan memverifikasi ada item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.getByText('Artikel Tulisan Santri')).toBeVisible();
    await expect(page.getByText('Menata Amal Shalih dalam Skala Prioritas')).toBeVisible();
    await expect(page.getByText('Waktu Lebih dari Sekedar Uang')).toBeVisible();
    await expect(page.getByText('Tuntutan jihad Islam')).toBeVisible();
    await expect(page.getByText('MENASIHATI TANPA MELUKAI')).toBeVisible();
    await expect(page.getByText('What the Meaning of “Loss of Adab”?')).toBeVisible();
    await expect(page.getByText('Lakuin dulu aja')).toBeVisible();
    await expect(page.getByText('Keutamaan Dan Adab-Adab Jihad')).toBeVisible();
    await expect(page.getByText('Sejatinya Manusia; Melihat apa-apa yang tampak')).toBeVisible();
  });
});
