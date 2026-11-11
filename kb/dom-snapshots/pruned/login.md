# Halaman: Login

- route_id: login
- path: /login
- url: https://staging.pesantrenpersis27.com/login
- title: SIMASIS - Sistem Manajemen Pesantren Persis 27
- captured_at: 2026-09-09T17:00:14.238Z

## Struktur judul

- <h1> "SIMASIS" 
  locator: page.getByText('SIMASIS')
- <h2> "Selamat Datang" 
  locator: page.getByText('Selamat Datang')

## Formulir

- <form> "Email atau Username Password Masuk Kembali ke Landing Page" 
  locator: page.getByText('Email atau Username Password Masuk Kembali ke Landing Page')

## Kolom input

- <input> [type=text, id=username, name=username, placeholder="Masukkan email atau username", required]
  locator: page.locator('#username')
- <input> [type=password, id=password, name=password, placeholder="Masukkan password", required]
  locator: page.locator('#password')

## Tombol

- <button> "Masuk" [type=submit]
  locator: page.getByRole('button', { name: 'Masuk' })

## Tautan navigasi

- <a> "Kembali ke Landing Page" [href=https://staging.pesantrenpersis27.com]
  locator: page.getByRole('link', { name: 'Kembali ke Landing Page' })
