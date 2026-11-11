# Hasil Terkoreksi — 09-recompute.py v2

Protokol utama: **5 seed (temperature 0,2) saja**. Unit analisis: **skenario** (nilai per skenario = rata-rata 5 seed). Run greedy dilaporkan terpisah (Tabel G). CI 95% = bootstrap berkelompok per skenario, 5000 resample, seed 42.

## Tabel 0. Integritas data

- Skenario di results/: **28**; di scenarios/scenarios.json: **26**.
- Ada di results/ tetapi tidak di repo (15): ARTC01, ARTC02, ARTC03, ARTC04, AUTH01, AUTH02, AUTH03, AUTH04, NEWS01, NEWS02, NEWS03, NEWS04, NEWS05, NEWS06, RES02
- Ada di repo tetapi tidak pernah dieksekusi (13): INF03, INF04, INF05, NWS01, NWS02, NWS03, NWS04, NWS05, NWS06, REG03, REG04, REG05, REG06
- Prefiks kategori di results/: ARTC 4, AUTH 4, INF 2, NAV 8, NEWS 6, REG 2, RES 2
- **STATUS: TIDAK COCOK.** scenarios.json yang benar-benar dipakai harus diunggah sebelum hasil dapat direplikasi.
- results/03-generation-log.jsonl: ada (130 baris)
- results/07-repair-log.jsonl: **TIDAK ADA**

## Tabel A. Metrik per kondisi (5 seed; mean ± SD antar skenario)

| Metrik | B0 | B1 | B2 | P | P_no_req | P_no_hist | P_no_dom |
|---|---|---|---|---|---|---|---|
| Syntax Validity Rate (%) | 98.6 ± 5.2 | 98.6 ± 7.6 | 97.9 ± 8.3 | 97.9 ± 8.3 | 100.0 ± 0.0 | 94.3 ± 14.3 | 92.1 ± 24.5 |
| Executable Rate (%) | 96.4 ± 12.2 | 97.1 ± 9.0 | 97.9 ± 8.3 | 97.9 ± 8.3 | 98.6 ± 7.6 | 94.3 ± 14.3 | 84.3 ± 35.0 |
| Pass Rate (%) | 15.0 ± 31.6 | 23.6 ± 35.7 | 26.4 ± 42.5 | 56.4 ± 46.2 | 51.4 ± 47.9 | 20.7 ± 37.9 | 62.1 ± 45.3 |
| Selector Validity (%) | 49.2 ± 38.2 | 76.1 ± 31.9 | 85.8 ± 23.2 | 88.9 ± 19.0 | 88.9 ± 19.7 | 85.7 ± 24.2 | 84.2 ± 28.5 |
| Assertion Presence (%) | 99.3 ± 3.8 | 100.0 ± 0.0 | 100.0 ± 0.0 | 100.0 ± 0.0 | 100.0 ± 0.0 | 100.0 ± 0.0 | 100.0 ± 0.0 |
| Flakiness Rate (%) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 5.7 ± 19.5 | – | – | – |
| Anti-pattern per skrip | 0.24 ± 0.71 | 0.67 ± 1.76 | 0.06 ± 0.19 | 0.44 ± 0.57 | 0.41 ± 0.64 | 0.09 ± 0.38 | 0.39 ± 0.61 |
| Mean Selector Tier | 2.41 ± 1.20 | 2.68 ± 1.18 | 2.57 ± 0.50 | 2.14 ± 0.54 | 2.22 ± 0.54 | 2.47 ± 0.56 | 2.04 ± 0.42 |

## Tabel B. Outcome primer: Pass Rate — Wilcoxon dua sisi, Holm atas 7 uji

Selisih = kondisi kedua − kondisi pertama (pp), rata-rata antar skenario. r_rb = rank-biserial berpasangan (|r| <0,1 diabaikan; <0,3 kecil; <0,5 sedang; ≥0,5 besar).

| Perbandingan | n skenario | Selisih (pp) [CI 95%] | p | p Holm | Sig (Holm) | r_rb |
|---|---|---|---|---|---|---|
| B0 vs P | 28 | +41.4 [+25.0, +59.3] | 0.00056 | 0.0034 | ya | +0.91 (besar) |
| B1 vs P | 28 | +32.9 [+10.7, +53.6] | 0.00873 | 0.0349 | ya | +0.63 (besar) |
| B2 vs P | 28 | +30.0 [+15.0, +45.7] | 0.00173 | 0.0086 | ya | +0.97 (besar) |
| B0 vs B2 | 28 | +11.4 [-5.0, +29.3] | 0.20498 | 0.6149 | tidak | +0.42 (sedang) |
| P_no_req vs P | 28 | +5.0 [-9.3, +20.7] | 0.43925 | 0.8785 | tidak | +0.29 (kecil) |
| P_no_hist vs P | 28 | +35.7 [+21.4, +51.4] | 0.00038 | 0.0026 | ya | +1.00 (besar) |
| P_no_dom vs P | 28 | -5.7 [-25.0, +12.9] | 0.54725 | 0.8785 | tidak | -0.18 (kecil) |

## Tabel B2. Metrik sekunder (eksploratif; Holm per metrik atas perbandingan yang dapat diuji)

| Metrik | Perbandingan | n | Selisih [CI 95%] | p | p Holm | r_rb |
|---|---|---|---|---|---|---|
| Syntax Validity Rate | P_no_hist vs P | 28 | +3.57 [-2.14, +10.00] | 0.3008 | 0.3008 | +0.43 |
| Executable Rate | B0 vs B2 | 28 | +1.43 [-3.57, +7.86] | 0.6803 | 0.6803 | +0.20 |
| Executable Rate | P_no_hist vs P | 28 | +3.57 [-2.14, +10.00] | 0.3008 | 0.6016 | +0.43 |
| Executable Rate | P_no_dom vs P | 28 | +13.57 [+3.57, +25.71] | 0.0422 | 0.1265 | +1.00 |
| Selector Validity | B0 vs P | 28 | +39.68 [+22.86, +56.07] | 0.0004 | 0.0026 | +0.82 |
| Selector Validity | B1 vs P | 28 | +12.80 [-0.48, +26.73] | 0.1308 | 0.6542 | +0.39 |
| Selector Validity | B2 vs P | 28 | +3.11 [-6.61, +13.75] | 0.6909 | 1.0000 | +0.12 |
| Selector Validity | B0 vs B2 | 28 | +36.57 [+21.57, +51.88] | 0.0004 | 0.0025 | +0.83 |
| Selector Validity | P_no_req vs P | 28 | -0.05 [-2.72, +2.86] | 0.9165 | 1.0000 | +0.05 |
| Selector Validity | P_no_hist vs P | 28 | +3.20 [-6.15, +13.16] | 0.4590 | 1.0000 | +0.20 |
| Selector Validity | P_no_dom vs P | 28 | +4.64 [-2.56, +12.86] | 0.5940 | 1.0000 | +0.20 |
| Anti-pattern per skrip | B0 vs P | 28 | +0.19 [-0.06, +0.42] | 0.2052 | 1.0000 | +0.41 |
| Anti-pattern per skrip | B1 vs P | 28 | -0.24 [-0.87, +0.26] | 0.6592 | 1.0000 | +0.13 |
| Anti-pattern per skrip | B2 vs P | 28 | +0.38 [+0.16, +0.61] | 0.0030 | 0.0213 | +0.89 |
| Anti-pattern per skrip | B0 vs B2 | 28 | -0.19 [-0.49, +0.05] | 0.2489 | 1.0000 | -0.52 |
| Anti-pattern per skrip | P_no_req vs P | 28 | +0.02 [-0.10, +0.14] | 0.7344 | 1.0000 | +0.14 |
| Anti-pattern per skrip | P_no_hist vs P | 28 | +0.34 [+0.14, +0.56] | 0.0103 | 0.0615 | +0.82 |
| Anti-pattern per skrip | P_no_dom vs P | 28 | +0.04 [-0.08, +0.16] | 0.4049 | 1.0000 | +0.31 |
| Mean Selector Tier | B0 vs P | 11 | -0.52 [-1.00, -0.06] | 0.0605 | 0.1816 | -0.67 |
| Mean Selector Tier | B1 vs P | 13 | -0.70 [-1.16, -0.27] | 0.0200 | 0.1192 | -0.74 |
| Mean Selector Tier | B2 vs P | 25 | -0.41 [-0.60, -0.22] | 0.0020 | 0.0143 | -0.79 |
| Mean Selector Tier | B0 vs B2 | 9 | -0.14 [-0.79, +0.54] | 0.7109 | 0.7109 | -0.16 |
| Mean Selector Tier | P_no_req vs P | 27 | -0.06 [-0.13, -0.01] | 0.0367 | 0.1466 | -0.75 |
| Mean Selector Tier | P_no_hist vs P | 22 | -0.28 [-0.49, -0.08] | 0.0199 | 0.1192 | -0.66 |
| Mean Selector Tier | P_no_dom vs P | 27 | +0.12 [-0.02, +0.28] | 0.1115 | 0.2230 | +0.47 |

## Tabel C. Fault detection & locator robustness EFEKTIF (menggantikan Tabel 4 naskah)

Skor skrip = 0 bila gagal baseline. Penyebut = skrip 5 seed yang diperturbasi. Angka hanya diberikan untuk kondisi dengan cakupan perturbasi lengkap.

Cacat yang dieksekusi: 6 dari 15 yang didefinisikan di perturbations/faults.json (F02, F04, F06, F08, F09, F13). Mutasi yang dieksekusi: 4 dari 8 (M01, M03, M05, M08). Naskah wajib menyebut subset ini dan alasan pemilihannya.

| Kondisi | Skrip | Baseline pass | Robustness efektif [CI 95%] | (naskah 2 Nov) | Fault detect efektif [CI 95%] | (naskah 2 Nov) | Cakupan baris fault / mutasi |
|---|---|---|---|---|---|---|---|
| B0 | 140 | 15.0% | **14.3** [4.3–25.0] | 11.9 | **2.9** [0.6–5.7] | 2.4 | 840/840 ; 560/560 |
| B1 | 140 | 23.6% | **20.9** [9.3–33.9] | 17.4 | **4.6** [1.8–8.0] | 3.9 | 840/840 ; 560/560 |
| B2 | 140 | 26.4% | **25.5** [11.4–41.2] | 21.3 | **3.6** [0.6–7.4] | 3.0 | 840/840 ; 560/560 |
| P | 140 | 56.4% | **52.9** [36.1–69.3] | 44.0 | **11.0** [5.6–17.9] | 9.1 | 840/840 ; 560/560 |
| P_no_req | 140 | 51.4% | _tidak sahih (cakupan tidak lengkap)_ | – | _tidak sahih (cakupan tidak lengkap)_ | – | 432/840 ; 288/560 |
| P_no_hist | 140 | 20.7% | _tidak sahih (cakupan tidak lengkap)_ | – | _tidak sahih (cakupan tidak lengkap)_ | – | 174/840 ; 116/560 |
| P_no_dom | 140 | 62.1% | _tidak sahih (cakupan tidak lengkap)_ | – | _tidak sahih (cakupan tidak lengkap)_ | – | 542/840 ; 348/560 |

Rasio robustness efektif P/B0 = 3.70x.

## Tabel D. Jumlah locator dan getByTestId per kondisi (5 seed)

Selector Validity B0/B1 dihitung dari jumlah locator yang jauh lebih kecil — tafsirkan hati-hati. Catatan: SYSTEM_PROMPT di 03-generate.py menempatkan getByTestId sebagai preferensi pertama, sehingga getByTestId pada B0 tidak dapat dipisahkan dari efek instruksi prompt.

| Kondisi | Skrip (5 seed) | Locator | getByTestId | % | Skrip (semua run, + greedy) | Locator | getByTestId | % |
|---|---|---|---|---|---|---|---|---|
| B0 | 140 | 122 | 25 | 20.5% | 168 | 139 | 30 | 21.6% |
| B1 | 140 | 111 | 0 | 0.0% | 168 | 132 | 0 | 0.0% |
| B2 | 140 | 283 | 0 | 0.0% | 168 | 357 | 0 | 0.0% |
| P | 140 | 435 | 0 | 0.0% | 168 | 524 | 0 | 0.0% |
| P_no_req | 140 | 365 | 0 | 0.0% | 140 | 365 | 0 | 0.0% |
| P_no_hist | 140 | 294 | 0 | 0.0% | 140 | 294 | 0 | 0.0% |
| P_no_dom | 140 | 351 | 0 | 0.0% | 140 | 351 | 0 | 0.0% |
| B0__neutral | 130 | 192 | 0 | 0.0% | 130 | 192 | 0 | 0.0% |

## Tabel N. Uji prompt netral pada B0 (menguji klaim 'halusinasi getByTestId')

Kondisi `B0__rerun` = prompt asli, `B0__neutral` = tanpa urutan preferensi locator. Keduanya dihasilkan dan dieksekusi dengan skenario (`scenarios.json` saat ini) dan tanggal yang sama, sehingga selisihnya hanya berasal dari prompt. Baris `B0` (2 Nov, 28 skenario) hanya rujukan, **tidak untuk dibandingkan langsung**: skenarionya berbeda dan staging dapat berubah.

| Metrik | B0 | B0__neutral |
|---|---|---|
| Syntax Validity Rate (%) | 98.6 ± 5.2 | 97.7 ± 8.6 |
| Executable Rate (%) | 96.4 ± 12.2 | – |
| Pass Rate (%) | 15.0 ± 31.6 | – |
| Selector Validity (%) | 49.2 ± 38.2 | – |
| Assertion Presence (%) | 99.3 ± 3.8 | 100.0 ± 0.0 |
| Anti-pattern per skrip | 0.24 ± 0.71 | 0.89 ± 3.95 |
| Mean Selector Tier | 2.41 ± 1.20 | 2.38 ± 0.76 |
| n skenario | 28 | 26 |

## Tabel G. Run referensi greedy (temperature 0, 1 run) — dilaporkan terpisah

| Metrik | B0 | B1 | B2 | P |
|---|---|---|---|---|
| Syntax Validity Rate (%) | 100.0 | 96.4 | 96.4 | 100.0 |
| Executable Rate (%) | 96.4 | 96.4 | 96.4 | 100.0 |
| Pass Rate (%) | 17.9 | 21.4 | 28.6 | 57.1 |
| Selector Validity (%) | 49.7 | 82.1 | 89.9 | 91.1 |

