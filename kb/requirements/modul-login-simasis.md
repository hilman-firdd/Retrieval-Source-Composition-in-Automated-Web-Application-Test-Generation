# Modul Login SIMASIS

## REQ-AUTH-01 Akses halaman login
Pengunjung dapat membuka halaman login SIMASIS di `/login` melalui tautan
"Daftar PSB"/menu SIMASIS pada beranda. Halaman menampilkan judul "SIMASIS",
subjudul "Selamat Datang", kolom input surel/username (`#username`), kolom
input kata sandi (`#password`), dan tombol kirim "Masuk".

## REQ-AUTH-02 Validasi field wajib pada kiriman kosong
Menekan tombol "Masuk" tanpa mengisi kolom apa pun tidak mengirim formulir dan
tidak berpindah halaman. Validasi bawaan peramban ditampilkan pada kolom
username dengan pesan "Please fill out this field." karena kolom memiliki
atribut `required`.

## REQ-AUTH-03 Penolakan kredensial tidak valid
Mengisi username dan kata sandi dengan nilai yang tidak terdaftar lalu menekan
"Masuk" tetap berada di `/login` dan menampilkan pesan kesalahan
"These credentials do not match our records." Formulir tidak mengarahkan
pengguna ke area yang memerlukan otentikasi.

## REQ-AUTH-04 Tautan kembali ke beranda dari login
Halaman login menyediakan tautan "Kembali ke Landing Page" yang mengarah ke
beranda (`/`).
