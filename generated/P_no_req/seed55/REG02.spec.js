const { test, expect } = require('@playwright/test');

test.describe('Pesantren Persis 27', () => {
  test('halaman menampilkan judul dan tautan ke formulir eksternal', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.getByRole('link', { name: 'Pesantren Persis 27 Situaksan Bandung Gelar Agenda Wisata "Goes to Pangandaran"' })).toBeVisible();

    const tautanFormulir = page.getByRole('link', { name: 'MAJALAH MAJALAH ISLAM DIGITAL Majalah Tafaqquh Baca majalah Islami digital Tafaqquh secara online, penuh kajian dan insp' });
    await expect(tautanFormulir).toBeVisible();
    await expect(tautanFormulir).toHaveAttribute('href', /https?:\/\/tafaqquh\.net/);
  });

  test('halaman menampilkan tombol Pendidikan Adab', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.getByRole('button', { name: 'Pendidikan Adab Pembinaan akhlak dan adab islami sebagai fondasi utama pendidikan Selengkapnya' })).toBeVisible();
  });

  test('halaman menampilkan judul "Berita Terbaru"', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
  });

  test('halaman menampilkan tautan "PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S"', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.getByText('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S')).toBeVisible();
  });

  test('Pendaftaran pesantren khusus', async ({ page }) => {
    await page.goto('/portal/halaman/pendaftaran-pesantren-khusus');
    await expect(page.getByRole('heading', { name: 'PENDAFTARAN PESANTREN KHUSUS' })).toBeVisible();

    const tautanFormulir = page.getByRole('link', { name: 'Buka di tab baru' });
    await expect(tautanFormulir).toBeVisible();
    await expect(tautanFormulir).toHaveAttribute('href', /docs\.google\.com\/forms/);
  });

  test('Daftar berita - paginasi', async ({ page }) => {
    await page.goto('/portal/berita');
    const judulHalamanPertama = await page.locator('h3').first().textContent();

    await page.goto('/portal/berita?page=2');
    const judulHalamanKedua = await page.locator('h3').first().textContent();

    expect(judulHalamanKedua).not.toEqual(judulHalamanPertama);
  });

  test('Daftar berita - pencarian tanpa hasil', async ({ page }) => {
    await page.goto('/portal/berita');
    await page.getByPlaceholder('Cari berita...').fill('zzzzz_kata_tidak_ada_qqqq');
    await page.getByPlaceholder('Cari berita...').press('Enter');

    await expect(page).toHaveURL(/search=/);
    await expect(page.getByText('(0 hasil)')).toBeVisible();
    await expect(page.getByText('Tidak ada berita ditemukan')).toBeVisible();
  });
});
