# Modul Daftar Berita

## REQ-NEWS-01 Daftar berita menampilkan item
Halaman `/portal/berita` menampilkan judul "Berita Terbaru" dan sedikitnya
satu judul berita berupa elemen `<h3>` yang dapat diklik menuju halaman
detailnya masing-masing di bawah `/portal/<slug-berita>`.

## REQ-NEWS-02 Pencarian berita dengan kata kunci yang ada
Mengisi kolom pencarian (`input[name=search]`, placeholder "Cari berita...")
dengan kata kunci yang relevan (mis. "santri") lalu menekan Enter mengarahkan
ke `/portal/berita?search=<kata kunci>` dan menampilkan hasil yang mengandung
kata kunci tersebut.

## REQ-NEWS-03 Pencarian berita tanpa hasil
Mengisi kolom pencarian dengan kata kunci acak yang dipastikan tidak ada
menampilkan teks "Hasil pencarian untuk: "<kata kunci>" (0 hasil)" dan pesan
"Tidak ada berita ditemukan", bukan halaman kosong atau galat.

## REQ-NEWS-04 Navigasi halaman (paginasi)
Daftar berita memiliki kontrol paginasi bernomor di bagian bawah. Membuka
`/portal/berita?page=2` menampilkan himpunan judul berita yang berbeda dari
halaman pertama.

## REQ-NEWS-05 Kategori berita
Sidebar daftar berita menampilkan tautan kategori "Berita Kuttab" dan
"Berita Umum" beserta jumlah item pada masing-masing kategori.
