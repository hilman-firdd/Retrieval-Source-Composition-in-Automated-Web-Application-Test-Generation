# Analisis sensitivitas (10-sensitivity.py)

Data: results/05-execution-baseline.json, 5 seed, 28 skenario, 980 skrip.

## 1. Pass rate: macro (per skenario) vs micro (gabungan) dan variasi antar seed

| Kondisi | Chunk | Macro (%) | Micro (%) | Skrip lolos / total | Per seed: mean [min–maks] (%) |
|---|---|---|---|---|---|
| B0 | 0 | 15.0 | 15.0 | 21/140 | 15.0 [10.7–17.9] |
| B1 | raw | 23.6 | 23.6 | 33/140 | 23.6 [17.9–28.6] |
| B2 | 8 | 26.4 | 26.4 | 37/140 | 26.4 [25.0–28.6] |
| P | 10 | 56.4 | 56.4 | 79/140 | 56.4 [53.6–60.7] |
| P_no_req | 7 | 51.4 | 51.4 | 72/140 | 51.4 [50.0–53.6] |
| P_no_hist | 7 | 20.7 | 20.7 | 29/140 | 20.7 [17.9–21.4] |
| P_no_dom | 6 | 62.1 | 62.1 | 87/140 | 62.1 [57.1–67.9] |

Macro = micro bila setiap skenario punya jumlah skrip sama (5 per kondisi); selisih kecil hanya muncul bila ada skrip yang hilang.

## 2. Regresi logistik GEE level skrip (klaster = skenario, exchangeable)

| Perbandingan | OR [CI 95% robust] | p (GEE, tanpa koreksi) |
|---|---|---|
| B0 → P | 7.34 [2.81, 19.14] | 0.0000 |
| B1 → P | 4.20 [1.54, 11.45] | 0.0050 |
| B2 → P | 3.61 [1.74, 7.46] | 0.0006 |
| B0 → B2 | 2.04 [0.68, 6.05] | 0.2010 |
| P_no_req → P | 1.22 [0.67, 2.22] | 0.5074 |
| P_no_hist → P | 4.96 [2.32, 10.60] | 0.0000 |
| P_no_dom → P | 0.79 [0.36, 1.75] | 0.5602 |

OR > 1 berarti kondisi kedua lebih mungkin lolos. Ini analisis sensitivitas, bukan pengganti uji Wilcoxon + Holm di naskah.

## 3. Volume konteks: P-req vs P-hist (sama-sama 7 chunk)

Pass rate P-req − P-hist = +30.7 pp per skenario (Wilcoxon dua sisi p = 0.0033, n = 28). Kedua kondisi memakai jumlah chunk sama, jadi selisih ini tidak dapat dijelaskan oleh jumlah chunk. Jumlah KARAKTER/token aktual tidak tercatat di run utama, sehingga volume dalam token belum terkendali.

