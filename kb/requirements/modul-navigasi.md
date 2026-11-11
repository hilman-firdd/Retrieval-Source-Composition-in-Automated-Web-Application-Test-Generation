# Modul Navigasi dan Beranda

## REQ-NAV-01 Identitas situs pada beranda
Pengunjung yang membuka beranda (`/`) melihat judul dokumen yang memuat kata
"Pesantren", menu navigasi utama yang terlihat, dan judul utama halaman
("Pendidikan Adab Tafaqquh Fid Din") yang terlihat.

## REQ-NAV-02 Menu navigasi utama konsisten
Menu navigasi utama (IFTITAH, MANHAJ, NASYATH, PESANTREN UMUM, INFO PSB,
SIMASIS) tetap terlihat pada seluruh halaman portal: beranda, daftar berita,
daftar artikel, halaman brosur, dan halaman FAQ SIMASIS.

## REQ-NAV-03 Tautan ke daftar berita
Dari beranda, pengunjung dapat membuka daftar berita melalui tautan
"Info Terbaru" atau "Semua Berita"/"Lihat Semua", yang mengarah ke
`/portal/berita`.

## REQ-NAV-04 Tautan ke daftar artikel
Dari beranda, pengunjung dapat membuka daftar artikel tulisan santri melalui
tautan "Lihat Semua" pada bagian "Artikel Tulisan Santri", yang mengarah ke
`/portal/artikel`.

## REQ-NAV-05 Tautan kembali ke beranda dari halaman portal
Dari halaman daftar berita, daftar artikel, brosur, atau FAQ, pengunjung dapat
kembali ke beranda melalui tautan "Beranda" pada menu, yang mengarah ke
`/portal`.

## REQ-NAV-06 Penanganan alamat yang tidak dikenal
Saat ini, membuka alamat yang tidak terdaftar (mis. `/halaman-tidak-ada-12345`)
menampilkan halaman dengan judul dokumen "Not Found" dan isi teks polos
"404 NOT FOUND", tanpa tautan navigasi apa pun kembali ke beranda. Ini dicatat
sebagai perilaku SUT saat ini, bukan sebagai perilaku ideal — ketiadaan jalan
kembali dari halaman 404 adalah temuan celah pengalaman pengguna yang layak
dibahas di bagian Discussion.
