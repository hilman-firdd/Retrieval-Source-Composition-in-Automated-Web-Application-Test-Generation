# Modul Pendaftaran Pesantren Khusus

## REQ-REG-01 Akses halaman pendaftaran khusus
Halaman `/portal/halaman/pendaftaran-pesantren-khusus` menampilkan judul
"PENDAFTARAN PESANTREN KHUSUS" dan dapat diakses tanpa perlu masuk akun.

## REQ-REG-02 Formulir pendaftaran adalah embed pihak ketiga
Formulir pendaftaran pada halaman ini bukan formulir HTML native pada situs,
melainkan embed Google Form (`docs.google.com/forms/...`) beserta tautan
"Buka di tab baru" yang mengarah ke Google Form tersebut. Pengujian otomatis
CUKUP memverifikasi kehadiran tautan/iframe ini dan TIDAK BOLEH mengisi atau
mengirim Google Form tersebut, karena formulir berada di layanan pihak ketiga
di luar kendali staging dan pengiriman data uji ke sana tidak dapat
dibersihkan oleh tim peneliti.

## REQ-REG-03 Konsistensi menu pada halaman pendaftaran
Menu navigasi utama tetap terlihat pada halaman ini, konsisten dengan
REQ-NAV-02.
