# Retrieval Source Composition in Automated Web Application Test Generation

> **Pembaruan 11 Nov 2026 — probe Selector Validity v2.** Ekstraktor locator v1 di `06-selector-probe.js` memotong selector yang berisi tanda kutip (mis. `input[name="q"]` → `input[name=`), sehingga selector itu selalu dihitung tidak valid (B0: 166 dari 262 locator terpotong; P: 16 dari 361). Ekstraktor diperbaiki di `scripts/lib/selectors.js` (uji tanpa jaringan: `node scripts/06b-selector-extract-check.js`) dan probe diulang untuk semua skrip pada satu tanggal (`bash scripts/run-probe-v2.sh run`). Hasil lama disimpan di `results/_probe-v1/`. Semua angka Selector Validity di naskah berasal dari probe v2.

> **Probe v3 (11 Nov 2026, audit ke-3).** Rute cadangan probe ternyata memakai daftar contoh di `config/experiment.config.json` (`/profil`, `/berita`, ...) yang tidak ada di situs. Probe sekarang memakai 7 halaman yang ditangkap ke knowledge base (`kb/dom-snapshots/pruned/*.inventory.json`; tercatat sebagai `routes_source: "kb"`). `09-recompute.py` juga menghitung varian **Selector Validity tanpa locator bergantung-state**: locator yang menargetkan pesan yang menurut requirement baru muncul setelah interaksi (REQ-AUTH-03, REQ-NEWS-03, REQ-ARTC-02) dikeluarkan dari penyebut. Jalankan ulang: `bash scripts/run-probe-v2.sh run && bash scripts/run-probe-v2.sh report`.

Harness eksperimen untuk studi empiris: **sumber konteks mana (requirement, DOM, test historis)
yang membuat LLM lokal menghasilkan skrip Playwright yang lebih valid** pada satu aplikasi web.

| | |
|---|---|
| SUT | `https://staging.pesantrenpersis27.com` (staging, satu aplikasi) |
| Generator | Llama 3 8B lokal via Ollama, temperature 0,2, 5 seed (11, 22, 33, 44, 55) + 1 run greedy |
| Embedding | `sentence-transformers/all-MiniLM-L6-v2`, FAISS `IndexFlatIP` (cosine, exact) |
| Retrieval | top-k **tetap per sumber**: requirement 3, DOM 4, historis 3; budget konteks 12.000 karakter |
| Eksekusi | Playwright + JavaScript, 1 worker |

> ## ⚠️ Status: MAJOR REVISION REQUIRED (audit 10 Nov 2026)
>
> - **Jangan gunakan angka dari PDF naskah versi 2 Nov 2026.** Tabel 4 (fault detection &
>   robustness efektif) memakai penyebut yang salah. Tabel 2 mencampur run greedy dengan run seed.
> - **Sumber angka yang sah: `results/tables-corrected.md`**, dihasilkan oleh
>   `python scripts/09-recompute.py` (v2).
> - Repo ini **belum dapat direplikasi penuh**. Daftar artefak yang belum ada ada di §2.
> - Bagian 4.2 naskah (halusinasi `getByTestId`) dan 4.3 (*context competition*) belum didukung
>   data. Lihat §3.

> ## Pembaruan 11 Nov 2026 — bahan asli 2 Nov sudah dipulihkan
>
> `scenarios/scenarios.json` (28 skenario), `kb/` asli, dan `generated/` asli sudah ada di folder ini
> dan cocok dengan `results/` (1092 skrip, tanpa selisih). Masalah #3 dan #4 di §2 **selesai**.
> Log generasi dan log repair run 2 Nov **tidak ada**.
>
> **Audit kebocoran** (`python scripts/11-leakage-audit.py`, hasil di `results/leakage-audit.md`):
> 15 dari 28 skenario mengulang alur skrip historis, 8 mirip sebagian, 5 tidak tumpang-tindih.
> Pada P, 59 dari 140 skrip (42,1%) adalah near-copy skrip historis (kemiripan teks ≥ 0,80).
> Pass rate P / P tanpa historis: alur sama 69,3 / 29,3; mirip 42,5 / 17,5; tidak tumpang-tindih 40,0 / 0,0
> (B2 pada kelas terakhir: 44,0). Kelas di `results/leakage-confirmed.csv` adalah usulan dan
> **harus diperiksa penulis**.
>
> **Budget konteks** tidak pernah tercapai: konteks terbesar yang mungkin untuk P sekitar 8.300
> karakter (batas 12.000), dihitung dari `kb/index/chunks.jsonl`. Masalah #7 selesai: klaim
> *context competition* tidak dapat diuji dengan desain ini.
>
> Knowledge base: 7 berkas requirement, 7 halaman, 13 skrip historis, 132 chunk (34 / 85 / 13).

---

## 1. Ringkasan hasil terkoreksi

Protokol: hanya 5 seed. Unit analisis adalah **skenario** (n = 28): nilai tiap skenario adalah
rata-rata kelima seed. CI 95% dihitung dengan bootstrap berkelompok per skenario (5000 resample).

**Outcome primer: Pass Rate.** Uji yang dipakai: Wilcoxon signed-rank dua sisi dengan koreksi
Holm atas 7 perbandingan. Effect size: rank-biserial berpasangan (r_rb).

| Kondisi | Pass Rate (%) | Perbandingan | Selisih (pp) [CI 95%] | p Holm | r_rb |
|---|---|---|---|---|---|
| B0 | 15.0 ± 31.6 | B0 vs P | +41.4 [+25.0, +59.3] | 0.0034 | 0.91 |
| B1 | 23.6 ± 35.7 | B1 vs P | +32.9 [+10.7, +53.6] | 0.035 | 0.63 |
| B2 | 26.4 ± 42.5 | B2 vs P | +30.0 [+15.0, +45.7] | 0.0086 | 0.97 |
| P | 56.4 ± 46.2 | – | – | – | – |
| P_no_req | 51.4 ± 47.9 | P_no_req vs P | +5.0 [−9.3, +20.7] | 0.88 (ts) | 0.29 |
| P_no_hist | 20.7 ± 37.9 | P_no_hist vs P | +35.7 [+21.4, +51.4] | 0.0026 | 1.00 |
| P_no_dom | 62.1 ± 45.3 | P_no_dom vs P | −5.7 [−25.0, +12.9] | 0.88 (ts) | −0.18 |

**Metrik efektif (menggantikan Tabel 4 naskah).** Skor sebuah skrip = 0 bila skrip itu gagal di
baseline. Penyebutnya 140 skrip (5 seed × 28 skenario).

| Kondisi | Robustness efektif [CI 95%] | Naskah 2 Nov | Fault detection efektif [CI 95%] | Naskah 2 Nov |
|---|---|---|---|---|
| B0 | 14.3 [4.3–25.0] | 11.9 | 2.9 [0.6–5.7] | 2.4 |
| B1 | 20.9 [9.3–33.9] | 17.4 | 4.6 [1.8–8.0] | 3.9 |
| B2 | 25.5 [11.4–41.2] | 21.3 | 3.6 [0.6–7.4] | 3.0 |
| P | 52.9 [36.1–69.3] | 44.0 | 11.0 [5.6–17.9] | 9.1 |

Arah kesimpulannya tidak berubah: robustness P sekitar 3,7× B0, dan fault detection P sekitar
2,1× baseline terbaik. Ada dua catatan:

- Pada ketiga ablasi, metrik efektif **tidak sahih** karena cakupan perturbasinya tidak lengkap.
  Baris fault yang tersedia hanya 432 (P_no_req), 174 (P_no_hist), dan 542 (P_no_dom) dari 840.
- Batas CI bisa berbeda ±1–2 pp dari laporan audit karena generator bilangan acak bootstrap-nya
  berbeda. Nilai titiknya identik.

Tabel lengkap (semua metrik, metrik sekunder, jumlah locator, run greedy) ada di
`results/tables-corrected.md`.

---

## 2. Masalah yang diketahui dan artefak yang belum ada

| # | Masalah | Dampak | Status |
|---|---|---|---|
| 1 | Penyebut Tabel 4 naskah = 168 (termasuk run greedy yang tidak pernah diperturbasi) | Nilai efektif terlalu rendah sekitar 1/6 | **Diperbaiki** di `09-recompute.py` v2 |
| 2 | Tabel 2 naskah mencampur greedy (6 run) untuk B0–P dengan 5 seed untuk ablasi | Perbandingan antarkondisi tidak setara | **Diperbaiki**: semua tabel 5 seed, greedy terpisah (Tabel G). `08-analyze.py` juga kini membuang greedy |
| 3 | `scenarios/scenarios.json` (26 ID) tidak sama dengan skenario yang dieksekusi (28 ID). 13 ID di repo tidak pernah dijalankan dan 15 ID di hasil tidak ada di repo | Eksperimen tidak dapat direplikasi | **Terbuka**: unggah berkas skenario yang benar-benar dipakai. Perbaiki juga daftar kategori di naskah (hasil memuat ARTC, AUTH, INF, NAV, NEWS, REG, RES dan tidak memuat "contact") |
| 4 | KB di repo hanya berisi berkas contoh (`CONTOH-*`) | Audit kebocoran tidak mungkin dilakukan | **Terbuka**: unggah skrip historis dan requirement asli |
| 5 | `results/03-generation-log.jsonl` dan `results/07-repair-log.jsonl` tidak ada | Ukuran konteks, latensi, dan repair tidak dapat diverifikasi | **Terbuka** |
| 6 | `SYSTEM_PROMPT` menempatkan `getByTestId` sebagai preferensi pertama | Klaim "halusinasi getByTestId" pada B0 (30/139 = 21,6% locator, semua run) bercampur dengan efek instruksi | **Sebagian terbukti (statis)**: B0 prompt netral = 0 dari 192 locator `getByTestId` (asli: 30/139). Eksekusi di staging belum: lihat §5b |
| 7 | Top-k per sumber tetap dan budget 12.000 karakter kemungkinan tidak mengikat (≈10 chunk × 900 karakter) | Klaim *context competition* (§4.3) lemah menurut desain | **Belum bisa dijalankan**: `kb/index/` dan KB asli tidak ada. Skrip siap: `03-generate.py --retrieval-only` (§5b-2) |
| 8 | Hanya 6 dari 15 cacat (`F02, F04, F06, F08, F09, F13`) dan 4 dari 8 mutasi (`M01, M03, M05, M08`) yang dieksekusi | Naskah harus menyebut subset ini dan alasan pemilihannya | **Terbuka** |
| 9 | Perturbasi ablasi tidak lengkap (lihat §1) | Klaim robustness dan fault detection hanya sahih untuk B0–P | **Terbuka**: `generated/P_no_*` dari 2 Nov tidak ada di folder ini. Jika ditemukan: §5b-3. Jika tidak, batasi klaim robustness/fault ke B0–P |
| 10 | Jumlah locator sangat timpang (5 seed: B0 122, B1 111, B2 283, P 435) | Selector Validity B0/B1 dihitung dari sedikit locator | Dilaporkan di Tabel D, wajib dibahas di Threats to Validity |
| 11 | Cliff's delta dipakai untuk desain berpasangan | Effect size kurang tepat | **Diperbaiki**: rank-biserial berpasangan |

---

## 3. Status klaim naskah

| Klaim | Status |
|---|---|
| P > B0, B1, B2 pada Pass Rate | **Didukung** (signifikan setelah Holm) |
| Konteks (B2) menaikkan Selector Validity dibanding B0 | **Didukung** (Holm p = 0.0025), tetapi lihat masalah #10 |
| Test historis adalah sumber paling berpengaruh (P_no_hist turun 35,7 pp) | **Didukung secara deskriptif**. Kebocoran belum diaudit (masalah #4), jadi pengaruh ini bisa berasal dari kemiripan skrip historis dengan skenario uji |
| Requirement dan DOM tidak berkontribusi signifikan saat sumber lain tersedia | Tidak signifikan (Holm 0.88). Tulis sebagai "tidak terdeteksi", jangan sebagai "tidak berpengaruh" |
| B0 berhalusinasi `getByTestId` karena meniru konvensi populer (§4.2) | **Tidak didukung**: tercampur dengan instruksi prompt (masalah #6) |
| *Context competition* antarsumber (§4.3) | **Tidak didukung**: desain top-k tetap tidak memungkinkan kompetisi, dan ukuran konteks aktual tidak tercatat (masalah #7). Ubah menjadi hipotesis |
| Robustness / fault detection efektif P > baseline | **Didukung** untuk B0–P saja |

---

## 4. Persiapan

### 4.1 Dependensi

```bash
npm install
npx playwright install chromium

python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 4.2 Model lokal

```bash
ollama pull llama3:8b
ollama serve                         # terminal terpisah
curl http://localhost:11434/api/tags # pastikan model tersedia
```

### 4.3 Konfigurasi

`config/experiment.config.json` memuat SUT, kondisi, parameter retrieval/generasi, dan
protokol analisis (`analysis`: outcome primer, Holm, rank-biserial, bootstrap 5000/seed 42,
tujuh perbandingan). Untuk menemukan rute staging:

```bash
node scripts/01-capture-dom.js --discover
```

### 4.4 Knowledge base

| Direktori | Isi | Status di repo |
|---|---|---|
| `kb/requirements/` | Spesifikasi kebutuhan per modul (Markdown, satu `##` per kebutuhan) | Hanya contoh: `CONTOH-modul-ppdb.md` |
| `kb/dom-snapshots/pruned/` | Inventaris elemen per halaman, dari `01-capture-dom.js` | Belum diunggah |
| `kb/historical-tests/` | Skrip Playwright yang ditulis manual sebelum eksperimen | Hanya contoh: `CONTOH-nav-seed.spec.js` |

Untuk setiap skrip historis, catat skenario yang dicakupnya (`kb/historical-tests/mapping.json`,
belum ada). Pemetaan ini diperlukan untuk audit kebocoran dan pembagian skenario *seen/unseen*.

---

## 5. Menjalankan eksperimen

```bash
# 1. DOM dan indeks
node scripts/01-capture-dom.js
python scripts/02-build-index.py

# 2. Generasi (menulis results/03-generation-log.jsonl — WAJIB disimpan)
python scripts/03-generate.py                    # B0, B1, B2, P (5 seed)
python scripts/03-generate.py --ablations         # + P_no_req, P_no_hist, P_no_dom
python scripts/03-generate.py --greedy            # run referensi, dilaporkan terpisah
python scripts/03-generate.py --conditions B0 --prompt-variant neutral   # uji ulang klaim getByTestId

# 3. Analisis statis
node scripts/04-static-validate.js

# 4. Eksekusi — jalankan perturbasi untuk SEMUA kondisi, termasuk ablasi
npm run run:baseline
npm run probe:selectors
npm run run:faults
npm run run:mutations
npm run run:flaky

# 5. Perbaikan (menulis results/07-repair-log.jsonl — WAJIB disimpan)
python scripts/07-repair.py --condition P
python scripts/07-repair.py --condition B0

# 6. Angka untuk naskah
python scripts/09-recompute.py --out results/tables-corrected.md
```

`08-analyze.py` hanya untuk ringkasan cepat. Fault detection dan robustness di skrip itu masih
bersyarat (hanya skrip yang lolos baseline), jadi **jangan dikutip di naskah**.

Varian `--prompt-variant neutral` menulis hasil ke `generated/<kondisi>__neutral/` dan mencatat
`prompt_variant` di log. Bandingkan proporsi `getByTestId` pada `B0__neutral` dengan B0 di Tabel D.

---

## 5b. Uji lanjutan dari audit (10 Nov 2026)

Semua perintah dijalankan dari root repo dengan venv aktif. Keluaran berakhiran `-neutral-ab`
agar hasil 2 Nov tidak tertimpa; `09-recompute.py` menggabungkan berkas bersaudara itu otomatis.

### 5b-1. A/B prompt netral pada B0 (menguji klaim `getByTestId`)

Perbandingan yang sah adalah `B0__rerun` (prompt asli) vs `B0__neutral` (prompt netral), dibuat
**pada hari dan skenario yang sama**. Jangan membandingkan `B0__neutral` langsung dengan B0 2 Nov:
skenarionya berbeda (26 vs 28) dan staging dapat berubah antar tanggal.

```bash
bash scripts/run-neutral-ab.sh check      # prasyarat
bash scripts/run-neutral-ab.sh gen        # B0__rerun, ~1 jam, perlu Ollama
bash scripts/run-neutral-ab.sh static     # statis kedua kondisi
bash scripts/run-neutral-ab.sh baseline   # eksekusi di staging
bash scripts/run-neutral-ab.sh probe      # Selector Validity di staging
bash scripts/run-neutral-ab.sh perturb    # cacat F02,F04,F06,F08,F09,F13 + mutasi M01,M03,M05,M08 (paling lama)
bash scripts/run-neutral-ab.sh report     # menulis Tabel N di results/tables-corrected.md
```

`perturb` boleh dilewati bila hanya ingin Pass Rate dan Selector Validity. Hasilnya muncul di
Tabel N (uji berpasangan per skenario, `B0__rerun` → `B0__neutral`).

### 5b-2. Audit ukuran konteks (menguji klaim *context competition*)

Prasyarat: `kb/index/` hasil `02-build-index.py` dari **KB asli** (requirement, DOM, historis).
Tanpa itu hasilnya tidak berarti.

```bash
python scripts/03-generate.py --retrieval-only --conditions B2 P P_no_req P_no_hist P_no_dom
python scripts/09-recompute.py        # Tabel K
```

Mode ini tidak memanggil Ollama dan tidak menulis skrip. Tabel K menjawab dua hal: apakah budget
12.000 karakter pernah mengikat, dan apakah menghapus satu sumber menggeser jumlah chunk sumber
lain. Bila keduanya "tidak", klaim *context competition* gugur menurut desain. Uji terkontrol
(opsional): `--context-budget 4000` pada P untuk memaksa persaingan; hasilnya diberi akhiran
`__budget4000`.

### 5b-3. Melengkapi perturbasi ablasi

Hanya mungkin bila skrip ablasi asli (`generated/P_no_req`, `P_no_hist`, `P_no_dom`) masih ada.
Menghasilkan ulang dengan LLM **tidak** menghasilkan skrip yang sama.

```bash
node scripts/05-run-suite.js --all --conditions P_no_req,P_no_hist,P_no_dom \
  --perturb perturbations/faults.json --ids F02,F04,F06,F08,F09,F13 \
  --skip-existing results/05-execution-faults.json --tag faults-completion
node scripts/05-run-suite.js --all --conditions P_no_req,P_no_hist,P_no_dom \
  --perturb perturbations/mutations.json --ids M01,M03,M05,M08 \
  --skip-existing results/05-execution-mutations.json --tag mutations-completion
python scripts/09-recompute.py
```

`--skip-existing` melewati kombinasi yang sudah ada, sehingga hanya baris yang kurang
(432/174/542 dari 840 untuk fault) yang dijalankan.

---

## 6. Rancangan eksperimen

### 6.1 Kondisi

| Kode | Konteks ke model | Fungsi |
|---|---|---|
| B0 | Tidak ada | Batas bawah model murni |
| B1 | HTML mentah halaman awal, dipotong pada budget, tanpa retrieval | Memisahkan efek *adanya konteks* dari efek *retrieval* |
| B2 | Retrieval chunk DOM saja (top-k 8) | Kontribusi DOM saja |
| P | Retrieval requirement + DOM + historis (3/4/3 per sumber) | Sistem yang diusulkan |
| P_no_req / P_no_hist / P_no_dom | Ablasi satu sumber | Kontribusi tiap sumber |

Karena top-k bersifat **tetap per sumber**, menghapus satu sumber tidak menambah chunk dari
sumber lain. Ablasi mengukur *ketiadaan* sebuah sumber, bukan realokasi ruang konteks.

### 6.2 Protokol

- **Unit analisis: skenario.** Kelima seed dirata-rata per skenario, sehingga n = 28. Ini
  menghindari pseudo-replikasi.
- **5 seed** untuk semua kondisi. Run greedy (temperature 0) hanya ada untuk B0–P dan
  dilaporkan terpisah.
- **Perturbasi tanpa menyentuh skrip.** Injeksi cacat dan mutasi DOM diterapkan lewat
  `addInitScript` di `harness/hooked.js`, sehingga skrip yang diuji identik byte per byte.
- **Isolasi:** satu konteks peramban per skrip, 1 worker.

### 6.3 Metrik

| Metrik | Definisi | Skrip |
|---|---|---|
| **Pass Rate (primer)** | Semua assertion terpenuhi di baseline | 05 |
| **Selector Validity (ko-primer)** | Selector yang ter-resolve di SUT / total selector | 06 |
| Syntax Validity | Lolos `node --check` | 04 |
| Executable Rate | Selesai tanpa galat runtime | 05 |
| Locator Robustness efektif | Lolos baseline **dan** tetap lolos saat mutasi DOM; skor 0 bila gagal baseline | 05 + 09 |
| Fault Detection efektif | Lolos baseline **dan** gagal saat cacat aktif; skor 0 bila gagal baseline | 05 + 09 |
| Flakiness | Hasil tidak konsisten dalam 10 eksekusi (hanya B0–P) | 05 |
| Assertion Presence, Anti-pattern, Mean Selector Tier | Analisis statis | 04 |
| Repair Success | Skrip gagal yang lolos dalam ≤ 2 iterasi | 07 |
| Latensi, ukuran konteks | Dari log generasi | 03 |

### 6.4 Statistik

- Wilcoxon signed-rank **dua sisi** pada selisih per skenario.
- Koreksi **Holm** atas 7 perbandingan (`analysis.allComparisons`) untuk outcome primer. Metrik
  sekunder memakai Holm per metrik dan dilaporkan sebagai eksploratif.
- Effect size **rank-biserial berpasangan** (Kerby, 2014), dengan ambang |r| < 0,1 diabaikan,
  < 0,3 kecil, < 0,5 sedang, ≥ 0,5 besar. Cliff's delta tidak dipakai karena dirancang untuk
  sampel independen.
- **CI 95% bootstrap berkelompok** per skenario (5000 resample, seed 42) untuk semua efek utama.
- α = 0,05.

---

## 7. Riwayat koreksi

| Tanggal | Perubahan |
|---|---|
| 2 Nov 2026 | Hasil awal dan `tables-corrected.md` v1 (dasar naskah SAUCIS) |
| 10 Nov 2026 (b) | Skrip uji lanjutan: `run-neutral-ab.sh`, `--retrieval-only`, `--context-budget`, `--suffix`, filter `--conditions/--ids/--skip-existing/--out` di skrip 04/05/06, Tabel N dan K di `09-recompute.py` |
| 10 Nov 2026 | Audit: `09-recompute.py` v2 (penyebut 140, protokol 5 seed, Holm, rank-biserial, CI bootstrap, pemeriksaan integritas, cakupan perturbasi, jumlah locator). `08-analyze.py` kini membuang run greedy. `03-generate.py` mendapat `--prompt-variant neutral` serta log `chunks_per_source` dan `chunks_dropped_by_budget`. `config.analysis` memuat protokol statistik. Salinan ganda `09-recompute.py` di root (versi lama) dihapus. `.gitignore` ditambahkan |

---

## 8. Etika dan keamanan

1. **Izin:** simpan persetujuan tertulis pemilik staging (Pesantren PERSIS 27) sebagai lampiran.
   *Belum dikonfirmasi di repo.*
2. **Jangan menguji produksi.** `baseUrl` hanya boleh mengarah ke staging.
3. Skenario formulir pendaftaran tidak menekan tombol kirim, agar basis data staging tidak
   tercemar data palsu.
4. Injeksi cacat hanya terjadi di sisi klien dan selama satu konteks peramban. Kode server
   tidak diubah.
5. Snapshot DOM bisa memuat data pribadi. Periksa sebelum dipublikasikan.
   `kb/dom-snapshots/raw/` sudah masuk `.gitignore`.
6. Kebijakan AI penerbit: nyatakan penggunaan alat AI dalam penulisan dan analisis secara jujur,
   sesuai ketentuan jurnal tujuan.

---

## 9. Pemetaan keluaran ke naskah

| Berkas | Bagian naskah |
|---|---|
| `results/tables-corrected.md` Tabel A | Results: metrik per kondisi (menggantikan Tabel 1/2 lama) |
| `results/tables-corrected.md` Tabel B / B2 | Results: uji primer dan sekunder |
| `results/tables-corrected.md` Tabel C | Results: robustness dan fault detection efektif (menggantikan Tabel 4) |
| `results/tables-corrected.md` Tabel D | Discussion / Threats: jumlah locator, `getByTestId` |
| `results/tables-corrected.md` Tabel G | Results: run referensi greedy |
| `results/tables-corrected.md` Tabel 0 | Threats to Validity: integritas data |
| `results/06-selector-validity.json` (`hallucinated_selectors`) | Discussion: contoh konkret |
| `results/03-generation-log.jsonl` | Method / Discussion: ukuran konteks, latensi, biaya (**belum ada**) |
| `results/07-repair-log.jsonl` | Results: loop perbaikan (**belum ada**) |

---

## 10. Pemeliharaan

- Jika staging berubah, jalankan ulang `01-capture-dom.js` dan `02-build-index.py` sebelum
  generasi. Indeks yang basi akan terbaca sebagai kegagalan RAG.
- Jika `03-generate.py` gagal koneksi, pastikan `ollama serve` masih berjalan.
- Jika banyak `syntax_error`, periksa `generated/`. Pola prosa baru mungkin perlu ditambahkan
  ke `strip_fences`.
- Simpan **seluruh** `results/`, `generated/`, log JSONL, dan berkas skenario yang benar-benar
  dipakai sebagai artefak penelitian.
