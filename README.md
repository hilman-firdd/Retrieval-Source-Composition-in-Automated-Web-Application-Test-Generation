# RAG-Based Automated Test Generation and Validation for Web Applications

Harness eksperimen untuk penelitian tesis. Menghasilkan skrip pengujian Playwright dengan
pendekatan Retrieval-Augmented Generation, menjalankannya terhadap SUT, dan mengukur sepuluh
metrik yang dapat dipertanggungjawabkan secara statistik.

**SUT:** `https://staging.pesantrenpersis27.com`
**Model generator:** Llama 3 8B (lokal, melalui Ollama)
**Embedding:** Sentence-BERT `all-MiniLM-L6-v2`
**Vector store:** FAISS `IndexFlatIP` (cosine, exact search)
**Framework eksekusi:** Playwright + JavaScript

---

## 1. Persiapan

### 1.1 Dependensi

```bash
# Node
npm install
npx playwright install chromium

# Python
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 1.2 Model lokal

```bash
# pasang Ollama dari https://ollama.com, lalu:
ollama pull llama3:8b
ollama serve                        # biarkan berjalan di terminal terpisah
curl http://localhost:11434/api/tags   # verifikasi model tersedia
```

### 1.3 Sesuaikan konfigurasi

Buka `config/experiment.config.json` dan perbaiki daftar `sut.routes` agar sesuai struktur
staging yang sebenarnya. Untuk menemukannya secara otomatis:

```bash
node scripts/01-capture-dom.js --discover
```

### 1.4 Isi knowledge base

Tiga sumber harus terisi sebelum indeks dibangun. Ini bukan langkah opsional — kombinasi
ketiganya adalah kontribusi yang diklaim penelitian ini, jadi ketiganya harus benar-benar ada
dan terdokumentasi.

| Direktori | Isi | Cara memperolehnya |
|---|---|---|
| `kb/requirements/` | Spesifikasi kebutuhan fungsional situs dalam Markdown | Tulis manual berdasarkan observasi situs dan wawancara dengan pengelola. Simpan sebagai lampiran tesis. |
| `kb/dom-snapshots/pruned/` | Inventaris elemen tiap halaman | Dihasilkan otomatis oleh `01-capture-dom.js` |
| `kb/historical-tests/` | Test case yang sudah ada sebelumnya | Tulis 8–12 skrip Playwright manual sebagai *seed*. Ini juga berguna sebagai pembanding kualitas. |

Format `kb/requirements/*.md` yang disarankan: satu berkas per modul, dengan heading `##`
untuk tiap kebutuhan agar pemotongan chunk mengikuti batas semantik.

```markdown
# Modul PPDB

## REQ-PPDB-01 Akses informasi pendaftaran
Pengunjung dapat membuka halaman PPDB dari menu utama dan membaca alur
serta jadwal pendaftaran tanpa perlu masuk akun.

## REQ-PPDB-02 Validasi formulir pendaftaran
Formulir pendaftaran menolak kiriman apabila field wajib kosong dan
menampilkan penanda kesalahan pada field yang bersangkutan.
```

---

## 2. Menjalankan eksperimen

Urutan berikut dijalankan sekali penuh. Perkiraan waktu total pada laptop dengan GPU
menengah: 6–10 jam, didominasi tahap generasi dan uji flakiness.

```bash
# Tahap 1 — tangkap DOM dan bangun indeks
node scripts/01-capture-dom.js
python scripts/02-build-index.py

# Tahap 2 — hasilkan skrip untuk seluruh kondisi dan seed
python scripts/03-generate.py                  # B0, B1, B2, P
python scripts/03-generate.py --ablations       # tiga kondisi ablasi
python scripts/03-generate.py --greedy          # run referensi deterministik

# Tahap 3 — analisis statis (tidak membuka browser, cepat)
node scripts/04-static-validate.js

# Tahap 4 — eksekusi
npm run run:baseline          # hasil dasar
npm run probe:selectors       # validitas selector
npm run run:faults            # deteksi cacat
npm run run:mutations         # ketahanan locator
npm run run:flaky             # 10 repetisi, tahap paling lama

# Tahap 5 — loop perbaikan
python scripts/07-repair.py --condition P
python scripts/07-repair.py --condition B0     # pembanding

# Tahap 6 — agregasi dan uji statistik
python scripts/08-analyze.py --out results/tables.md
```

Uji coba kecil sebelum menjalankan penuh, sangat disarankan:

```bash
python scripts/03-generate.py --conditions B0 P --limit 3
node scripts/04-static-validate.js
node scripts/05-run-suite.js --dir generated/P/seed11 --tag smoke
```

---

## 3. Rancangan eksperimen

### 3.1 Kondisi perbandingan

| Kode | Konteks yang diberikan ke model | Fungsi dalam argumen |
|---|---|---|
| B0 | Tidak ada | Batas bawah kemampuan model murni |
| B1 | HTML mentah halaman awal, dipotong pada batas konteks, tanpa retrieval | Memisahkan efek *adanya konteks* dari efek *retrieval* |
| B2 | Retrieval atas chunk DOM saja | Memisahkan kontribusi DOM dari kontribusi dua sumber lain |
| P | Retrieval atas requirement + DOM + test historis | Sistem yang diusulkan |
| P_no_req / P_no_hist / P_no_dom | Ablasi satu sumber | Membuktikan tiap sumber berkontribusi |

B1 adalah kondisi yang paling sering diabaikan peneliti dan paling sering ditanyakan reviewer.
Tanpa B1, klaim "RAG lebih baik" tidak dapat dibedakan dari "model dengan konteks lebih baik
daripada model tanpa konteks", yang merupakan temuan trivial.

### 3.2 Kendali eksperimen

- **Retrieval berimbang per sumber.** Chunk DOM jumlahnya jauh lebih banyak daripada chunk
  requirement. Retrieval global akan didominasi DOM dan membuat studi ablasi tidak mengukur
  apa pun. Karena itu top-k diambil per `source_type`, bukan secara global.
- **Lima seed, temperature 0,2.** Keluaran LLM bersifat stokastik; satu kali eksekusi bukan
  hasil melainkan anekdot. Setiap seed diperlakukan sebagai satu observasi, sehingga
  mean ± SD dan uji signifikansi memiliki dasar.
- **Run referensi greedy (temperature 0).** Dilaporkan terpisah sebagai titik acuan
  deterministik yang dapat direplikasi persis oleh peneliti lain.
- **Isolasi proses.** Setiap skrip dijalankan di sandbox Playwright tersendiri, sehingga satu
  skrip yang menggantung tidak mencemari pengukuran skrip lain.
- **Perturbasi tanpa menyentuh skrip.** Injeksi cacat dan mutasi DOM diterapkan melalui
  `addInitScript` pada fixture `harness/hooked.js`. Berkas skrip yang diuji pada kondisi normal
  dan kondisi terperturbasi benar-benar identik byte per byte.

### 3.3 Metrik

| Metrik | Definisi operasional | Diukur oleh |
|---|---|---|
| Syntax Validity Rate | Lolos `node --check` | 04 |
| Executable Rate | Berjalan sampai selesai tanpa galat runtime | 05 |
| Pass Rate | Seluruh assertion terpenuhi | 05 |
| Selector Validity | Selector yang berhasil di-resolve pada SUT / total selector | 06 |
| Fault Detection Rate | Cacat terinjeksi yang menyebabkan skrip gagal / total cacat | 05 + 08 |
| Locator Robustness | Skrip yang tetap lolos setelah mutasi DOM / skrip yang lolos di baseline | 05 + 08 |
| Flakiness Rate | Skrip dengan hasil tidak konsisten dalam 10 eksekusi | 05 |
| Assertion Presence | Skrip yang memuat sedikitnya satu `expect` | 04 |
| Mean Selector Tier | Rerata tingkat stabilitas selector, 1 terbaik sampai 5 terburuk | 04 |
| Repair Success Rate | Skrip gagal yang berhasil diperbaiki dalam ≤2 iterasi | 07 |
| Generation Latency | Waktu retrieval + generasi per skrip | 03 |

**Selector Validity diukur terpisah dari Pass Rate dengan sengaja.** Sebuah skrip dapat gagal
karena alur logikanya keliru meski seluruh selectornya benar, atau lolos secara kebetulan.
Memisahkan keduanya membuat klaim "RAG mengurangi halusinasi elemen" dapat dibuktikan
langsung, bukan disimpulkan secara tidak langsung dari pass rate.

### 3.4 Uji statistik

Wilcoxon signed-rank untuk data berpasangan per skenario, karena distribusi metrik proporsi
tidak dapat diasumsikan normal. Cliff's delta sebagai effect size non-parametrik, karena nilai
p hanya menyatakan ada tidaknya perbedaan, bukan besarnya. Ambang besaran mengikuti konvensi
yang lazim: di bawah 0,147 dapat diabaikan; di bawah 0,33 kecil; di bawah 0,474 sedang;
selebihnya besar. α = 0,05.

---

## 4. Etika dan keamanan eksperimen

Poin-poin berikut sebaiknya ditulis apa adanya di bagian Research Method dan Threats to Validity.

1. **Izin.** Dapatkan persetujuan tertulis dari pengelola Pesantren PERSIS 27 untuk menguji
   staging. Simpan sebagai lampiran tesis.
2. **Jangan menguji produksi.** Seluruh konfigurasi menunjuk ke staging. Jangan pernah
   mengarahkan `baseUrl` ke domain produksi.
3. **Skenario REG04 sengaja tidak menekan tombol kirim.** Verifikasi dilakukan pada nilai yang
   tersimpan di field, agar formulir pendaftaran tidak mencemari basis data staging dengan data
   palsu. Bila tim pengelola mengizinkan pengiriman, sediakan mekanisme pembersihan data dan
   catat prosedurnya.
4. **Injeksi cacat bersifat sementara dan sisi klien.** Tidak ada baris kode server yang diubah.
   Setiap cacat aktif hanya selama satu konteks peramban.
5. **Snapshot DOM mungkin memuat data pribadi.** Periksa `kb/dom-snapshots/` sebelum
   memublikasikan artefak penelitian. Direktori `raw/` sudah dimasukkan ke `.gitignore`.

---

## 5. Pemetaan keluaran ke manuskrip

| Berkas hasil | Bagian manuskrip |
|---|---|
| `kb/index/manifest.json` | Research Method — statistik knowledge base |
| `results/01-capture-summary.json` | Research Method — cakupan SUT |
| `results/tables.md` Tabel 1 | Results — perbandingan metrik utama |
| `results/tables.md` Tabel 2 | Results — uji signifikansi dan effect size |
| `results/tables.md` Tabel 3 | Results — studi ablasi |
| `results/tables.md` Tabel 4 | Results — efektivitas loop validasi |
| `results/tables.md` Tabel 5 | Discussion — profil selector dan pembahasan ketahanan |
| `results/06-selector-validity.json` | Discussion — contoh konkret halusinasi elemen |
| `results/03-generation-log.jsonl` | Discussion — biaya komputasi dan latensi |

Bidang `hallucinated_selectors` pada berkas 06 berisi daftar selector yang dikarang model dan
tidak ada di aplikasi. Ambil dua sampai tiga contoh nyata untuk dikutip di Discussion; contoh
konkret semacam ini jauh lebih meyakinkan reviewer daripada angka agregat saja.

---

## 6. Catatan pemeliharaan

- Bila situs staging diperbarui, jalankan ulang `01-capture-dom.js` dan `02-build-index.py`
  sebelum generasi. Indeks yang basi akan menghasilkan selector yang sudah tidak ada, dan itu
  akan terbaca sebagai kegagalan RAG padahal sebenarnya kegagalan pemeliharaan indeks.
- Bila `03-generate.py` mengembalikan galat koneksi, pastikan `ollama serve` masih berjalan.
- Bila banyak skrip berstatus `syntax_error`, periksa dulu beberapa berkas di `generated/`.
  Model kadang menyisipkan prosa sebelum kode; fungsi `strip_fences` sudah menanganinya, tetapi
  pola baru dapat muncul dan perlu ditambahkan.
- Simpan seluruh isi `results/` dan `generated/` sebagai artefak penelitian. Bila reviewer
  meminta bukti, inilah yang ditunjukkan.
