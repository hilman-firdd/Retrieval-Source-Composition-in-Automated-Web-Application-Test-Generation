# Audit tumpang-tindih skrip historis (kelas dikonfirmasi manual)

| Kelas | n skenario | B0 (%) | B2 (%) | P (%) | P tanpa historis (%) | P − P tanpa historis (pp) |
|---|---|---|---|---|---|---|
| exact | 15 | 22.7 | 32.0 | 69.3 | 29.3 | +40.0 |
| partial | 8 | 10.0 | 5.0 | 42.5 | 17.5 | +25.0 |
| none | 5 | 0.0 | 44.0 | 40.0 | 0.0 | +40.0 |

Jumlah skenario per kelas kecil; laporkan sebagai deskriptif, tanpa uji signifikansi per kelas.

## Kemiripan skrip hasil generasi dengan skrip historis (5 seed)

Near-copy = kemiripan >= 0,80 dengan salah satu skrip historis.

| Kondisi | Skrip | Median kemiripan | Near-copy | Near-copy pada kelas exact / partial / none | Lolos: near-copy | Lolos: lainnya |
|---|---|---|---|---|---|---|
| B0 | 140 | 0.61 | 5 (3.6%) | 7% / 0% / 0% | 0/5 (0%) | 21/135 (16%) |
| B2 | 140 | 0.62 | 0 (0.0%) | 0% / 0% / 0% | 0/0 | 37/140 (26%) |
| P | 140 | 0.78 | 59 (42.1%) | 71% / 15% / 0% | 46/59 (78%) | 33/81 (41%) |
| P_no_hist | 140 | 0.63 | 0 (0.0%) | 0% / 0% / 0% | 0/0 | 29/140 (21%) |
| P_no_req | 140 | 0.80 | 70 (50.0%) | 73% / 38% / 0% | 50/70 (71%) | 22/70 (31%) |
| P_no_dom | 140 | 0.80 | 70 (50.0%) | 72% / 40% / 0% | 56/70 (80%) | 31/70 (44%) |

## Sensitivitas ambang near-copy (jumlah skrip dari 140)

| Kondisi | >= 0,70 | >= 0,80 | >= 0,90 |
|---|---|---|---|
| B0 | 22 | 5 | 0 |
| B2 | 31 | 0 | 0 |
| P | 94 | 59 | 47 |
| P_no_hist | 31 | 0 | 0 |
| P_no_req | 107 | 70 | 39 |
| P_no_dom | 110 | 70 | 44 |
