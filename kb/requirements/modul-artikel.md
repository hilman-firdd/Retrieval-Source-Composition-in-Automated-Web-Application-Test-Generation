# Modul Artikel Tulisan Santri

## REQ-ARTC-01 Daftar artikel menampilkan item
Halaman `/portal/artikel` menampilkan judul "Artikel Tulisan Santri" dan
sedikitnya satu judul artikel berupa elemen `<h3>` yang dapat diklik menuju
halaman detailnya masing-masing di bawah `/portal/<slug-artikel>`.

## REQ-ARTC-02 Pencarian artikel
Kolom pencarian artikel (`input[name=search]`, placeholder "Cari artikel...")
berfungsi sama seperti pada daftar berita: kata kunci yang relevan
menampilkan hasil yang sesuai, kata kunci yang tidak ada menampilkan pesan
hasil kosong.

## REQ-ARTC-03 Navigasi halaman (paginasi)
Daftar artikel memiliki kontrol paginasi. Membuka `/portal/artikel?page=2`
menampilkan himpunan judul artikel yang berbeda dari halaman pertama.

## REQ-ARTC-04 Kategori artikel
Sidebar daftar artikel menampilkan tautan kategori (mis. "Catatan Santri")
beserta jumlah item pada kategori tersebut.
