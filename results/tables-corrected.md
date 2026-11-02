# Hasil Terkoreksi (09-recompute.py)

## Tabel A. Nilai exact per kondisi (isi langsung ke sel `fill` di naskah)

| Metrik | B0 | B1 | B2 | P | P_no_req | P_no_hist | P_no_dom |
|---|---|---|---|---|---|---|---|
| Syntax Validity Rate (%) | 98.8 ± 4.4 | 98.2 ± 9.4 | 97.6 ± 9.8 | 98.2 ± 6.9 | 100.0 ± 0.0 | 94.3 ± 14.3 | 92.1 ± 24.5 |
| Executable Rate (%) | 96.4 ± 13.1 | 97.0 ± 10.2 | 97.6 ± 9.8 | 98.2 ± 6.9 | 98.6 ± 7.6 | 94.3 ± 14.3 | 84.3 ± 35.0 |
| Pass Rate (%) | 15.5 ± 32.4 | 23.2 ± 35.8 | 26.8 ± 42.9 | 56.5 ± 46.6 | 51.4 ± 47.9 | 20.7 ± 37.9 | 62.1 ± 45.3 |
| Selector Validity (%) | 49.3 ± 38.5 | 77.1 ± 31.6 | 86.4 ± 22.8 | 89.2 ± 18.9 | 88.9 ± 19.7 | 85.7 ± 24.2 | 84.2 ± 28.5 |
| Assertion Presence (%) | 99.4 ± 3.1 | 100.0 ± 0.0 | 100.0 ± 0.0 | 100.0 ± 0.0 | 100.0 ± 0.0 | 100.0 ± 0.0 | 100.0 ± 0.0 |
| Flakiness Rate (%) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 5.7 ± 19.5 | – | – | – |
| Anti-pattern per skrip | 0.26 ± 0.74 | 0.61 ± 1.57 | 0.05 ± 0.16 | 0.43 ± 0.57 | 0.41 ± 0.64 | 0.09 ± 0.38 | 0.39 ± 0.61 |
| Mean Selector Tier | 2.42 ± 1.22 | 2.68 ± 1.18 | 2.56 ± 0.50 | 2.14 ± 0.54 | 2.22 ± 0.54 | 2.47 ± 0.56 | 2.04 ± 0.42 |

## Tabel B. Uji berpasangan per SKENARIO (bukan per seed-skenario)

Mengganti n≈140 (pseudo-replikasi) dengan n = jumlah skenario. Risk difference + CI
bootstrap berkelompok untuk metrik biner; Wilcoxon + Cliff's δ untuk semua.

| Perbandingan | Metrik | n skenario | Wilcoxon p | Sig | Cliff's δ | Risk diff (CI 95%) | Odds ratio |
|---|---|---|---|---|---|---|---|
| B0 vs P | Pass Rate | 28 | 0.00052 | ya | 0.5077 (besar) | +41.1 pp [+23.8, +58.9] | 7.11 |
| B0 vs P | Selector Validity | 28 | 0.00048 | ya | 0.5893 (besar) | – | – |
| B0 vs P | Anti-pattern per skrip | 28 | 0.22705 | tidak | 0.2551 (kecil) | – | – |
| B0 vs P | Mean Selector Tier | 11 | 0.06055 | tidak | -0.2314 (kecil) | – | – |
| B1 vs P | Pass Rate | 28 | 0.00797 | ya | 0.3878 (sedang) | +33.3 pp [+11.3, +54.2] | 4.30 |
| B1 vs P | Selector Validity | 28 | 0.10708 | tidak | 0.2207 (kecil) | – | – |
| B1 vs P | Anti-pattern per skrip | 28 | 0.75122 | tidak | 0.1097 (diabaikan) | – | – |
| B1 vs P | Mean Selector Tier | 13 | 0.02002 | ya | -0.3254 (kecil) | – | – |
| B2 vs P | Pass Rate | 28 | 0.00073 | ya | 0.3597 (sedang) | +29.8 pp [+14.9, +45.8] | 3.56 |
| B2 vs P | Selector Validity | 28 | 0.67877 | tidak | 0.0765 (diabaikan) | – | – |
| B2 vs P | Anti-pattern per skrip | 28 | 0.00260 | ya | 0.361 (sedang) | – | – |
| B2 vs P | Mean Selector Tier | 25 | 0.00204 | ya | -0.4384 (sedang) | – | – |
| B0 vs B2 | Executable Rate | 28 | 0.81250 | tidak | 0.0357 (diabaikan) | +1.2 pp [-4.8, +7.7] | 1.52 |
| B0 vs B2 | Pass Rate | 28 | 0.22754 | tidak | 0.1276 (diabaikan) | +11.3 pp [-6.5, +29.8] | 2.00 |
| B0 vs B2 | Selector Validity | 28 | 0.00035 | ya | 0.5523 (besar) | – | – |
| B0 vs B2 | Anti-pattern per skrip | 28 | 0.31250 | tidak | -0.0472 (diabaikan) | – | – |
| B0 vs B2 | Mean Selector Tier | 9 | 0.71094 | tidak | -0.0123 (diabaikan) | – | – |
| P_no_req vs P | Pass Rate | 28 | 0.39941 | tidak | 0.0982 (diabaikan) | +5.1 pp [-9.9, +20.6] | 1.23 |
| P_no_req vs P | Selector Validity | 28 | 0.93750 | tidak | 0.0013 (diabaikan) | – | – |
| P_no_req vs P | Anti-pattern per skrip | 28 | 0.91406 | tidak | 0.0497 (diabaikan) | – | – |
| P_no_req vs P | Mean Selector Tier | 27 | 0.03223 | ya | -0.0905 (diabaikan) | – | – |
| P_no_hist vs P | Syntax Validity Rate | 28 | 0.21875 | tidak | 0.1122 (diabaikan) | +3.9 pp [-1.7, +10.2] | 3.33 |
| P_no_hist vs P | Executable Rate | 28 | 0.21875 | tidak | 0.1122 (diabaikan) | +3.9 pp [-1.7, +10.2] | 3.33 |
| P_no_hist vs P | Pass Rate | 28 | 0.00038 | ya | 0.4643 (sedang) | +35.8 pp [+21.3, +51.7] | 4.98 |
| P_no_hist vs P | Selector Validity | 28 | 0.39570 | tidak | 0.1173 (diabaikan) | – | – |
| P_no_hist vs P | Anti-pattern per skrip | 28 | 0.01172 | ya | 0.3329 (sedang) | – | – |
| P_no_hist vs P | Mean Selector Tier | 22 | 0.01987 | ya | -0.2934 (kecil) | – | – |
| P_no_dom vs P | Executable Rate | 28 | 0.06250 | tidak | 0.1199 (diabaikan) | +13.9 pp [+3.6, +26.1] | 10.25 |
| P_no_dom vs P | Pass Rate | 28 | 0.54745 | tidak | -0.0702 (diabaikan) | -5.6 pp [-25.4, +14.5] | 0.79 |
| P_no_dom vs P | Selector Validity | 28 | 0.57031 | tidak | 0.0038 (diabaikan) | – | – |
| P_no_dom vs P | Anti-pattern per skrip | 28 | 0.43164 | tidak | 0.0408 (diabaikan) | – | – |
| P_no_dom vs P | Mean Selector Tier | 27 | 0.11148 | tidak | 0.1413 (diabaikan) | – | – |

## Tabel C. Fault Detection & Locator Robustness EFEKTIF (tak bersyarat)

Penyebut = SEMUA skrip, bukan hanya yang lolos baseline. Menghapus bias survivorship
yang membuat B0 tampak setara P pada versi bersyarat.

| Kondisi | Baseline pass | Fault detect (bersyarat) | **Fault detect EFEKTIF** | Robustness (bersyarat) | **Robustness EFEKTIF** |
|---|---|---|---|---|---|
| B0 | 12.5% | 19.0% | **2.4%** | 95.2% | **11.9%** |
| B1 | 19.6% | 19.7% | **3.9%** | 88.6% | **17.4%** |
| B2 | 22.0% | 13.5% | **3.0%** | 96.6% | **21.3%** |
| P | 47.0% | 19.4% | **9.1%** | 93.7% | **44.0%** |
| P_no_req | 51.4% | 15.3% | **7.9%** | 92.7% | **47.7%** |
| P_no_hist | 20.7% | 28.7% | **6.0%** | 77.6% | **16.1%** |
| P_no_dom | 62.1% | 17.0% | **10.6%** | 94.3% | **58.6%** |
