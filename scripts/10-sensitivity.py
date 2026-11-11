#!/usr/bin/env python3
"""
10-sensitivity.py — analisis sensitivitas untuk audit rev10nov (F3).

Hanya membaca results/*.json (5 seed). Tidak menjalankan ulang eksperimen.

  1. Macro vs micro: pass rate rata-rata per skenario (macro, dipakai di naskah)
     vs pass rate gabungan semua skrip (micro).
  2. Model level-skrip: regresi logistik GEE (binomial, korelasi exchangeable,
     klaster = skenario) untuk pass ~ kondisi. Seed tetap tersarang dalam skenario,
     sehingga variasi antar-seed tidak dibuang seperti pada rata-rata per skenario.
     Dilaporkan odds ratio + CI 95% robust dan p (tanpa koreksi; sensitivitas saja).
  3. Variasi antar seed: pass rate per seed per kondisi (mean, min, maks).
  4. Pemeriksaan volume konteks: pasangan ablasi dengan JUMLAH CHUNK SAMA
     (P-req dan P-hist sama-sama 7 chunk) -> beda pass rate di antara keduanya
     tidak dapat dijelaskan oleh jumlah chunk.

Pemakaian:  python scripts/10-sensitivity.py   -> results/sensitivity.md
"""
import json
import statistics as st
from collections import defaultdict
from pathlib import Path

import numpy as np
import pandas as pd
import statsmodels.api as sm
import statsmodels.formula.api as smf

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / "results"
CONDS = ["B0", "B1", "B2", "P", "P_no_req", "P_no_hist", "P_no_dom"]
CHUNKS = {"B0": 0, "B1": None, "B2": 8, "P": 10, "P_no_req": 7, "P_no_hist": 7, "P_no_dom": 6}

base = json.loads((RES / "05-execution-baseline.json").read_text())["rows"]
rows = [dict(condition=r["condition"], run=r["run"], scenario=r["scenario_id"],
             passed=int(r["final_outcome"] == "passed"))
        for r in base if not r.get("perturbation_id") and str(r["run"]).startswith("seed")
        and r["condition"] in CONDS]
df = pd.DataFrame(rows)

L = ["# Analisis sensitivitas (10-sensitivity.py)\n",
     f"Data: results/05-execution-baseline.json, 5 seed, {df.scenario.nunique()} skenario, "
     f"{len(df)} skrip.\n"]

# 1. macro vs micro + 3. seed variation
L += ["## 1. Pass rate: macro (per skenario) vs micro (gabungan) dan variasi antar seed\n",
      "| Kondisi | Chunk | Macro (%) | Micro (%) | Skrip lolos / total | Per seed: mean [min–maks] (%) |",
      "|---|---|---|---|---|---|"]
for c in CONDS:
    d = df[df.condition == c]
    macro = d.groupby("scenario").passed.mean().mean() * 100
    micro = d.passed.mean() * 100
    per_seed = d.groupby("run").passed.mean() * 100
    ch = "raw" if CHUNKS[c] is None else CHUNKS[c]
    L.append(f"| {c} | {ch} | {macro:.1f} | {micro:.1f} | {d.passed.sum()}/{len(d)} | "
             f"{per_seed.mean():.1f} [{per_seed.min():.1f}–{per_seed.max():.1f}] |")
L.append("\nMacro = micro bila setiap skenario punya jumlah skrip sama (5 per kondisi); "
         "selisih kecil hanya muncul bila ada skrip yang hilang.\n")

# 2. GEE
L += ["## 2. Regresi logistik GEE level skrip (klaster = skenario, exchangeable)\n",
      "| Perbandingan | OR [CI 95% robust] | p (GEE, tanpa koreksi) |", "|---|---|---|"]
pairs = [("B0", "P"), ("B1", "P"), ("B2", "P"), ("B0", "B2"),
         ("P_no_req", "P"), ("P_no_hist", "P"), ("P_no_dom", "P")]
for a, b in pairs:
    d = df[df.condition.isin([a, b])].copy()
    d["treat"] = (d.condition == b).astype(int)
    # skenario yang semuanya lolos/gagal di kedua kondisi tetap disertakan (GEE menanganinya)
    try:
        m = smf.gee("passed ~ treat", groups="scenario", data=d,
                    family=sm.families.Binomial(), cov_struct=sm.cov_struct.Exchangeable()).fit()
        orr = np.exp(m.params["treat"])
        lo, hi = np.exp(m.conf_int().loc["treat"])
        L.append(f"| {a} → {b} | {orr:.2f} [{lo:.2f}, {hi:.2f}] | {m.pvalues['treat']:.4f} |")
    except Exception as e:  # noqa: BLE001
        L.append(f"| {a} → {b} | gagal: {e} | – |")
L.append("\nOR > 1 berarti kondisi kedua lebih mungkin lolos. Ini analisis sensitivitas, "
         "bukan pengganti uji Wilcoxon + Holm di naskah.\n")

# 4. volume check
d = df[df.condition.isin(["P_no_req", "P_no_hist"])]
sm_ = d.groupby(["condition", "scenario"]).passed.mean().unstack(0)
diff = (sm_["P_no_req"] - sm_["P_no_hist"]).dropna()
from scipy.stats import wilcoxon  # noqa: E402
p = wilcoxon(diff).pvalue
L += ["## 3. Volume konteks: P-req vs P-hist (sama-sama 7 chunk)\n",
      f"Pass rate P-req − P-hist = {diff.mean()*100:+.1f} pp per skenario "
      f"(Wilcoxon dua sisi p = {p:.4f}, n = {len(diff)}). Kedua kondisi memakai jumlah chunk sama, "
      "jadi selisih ini tidak dapat dijelaskan oleh jumlah chunk. Jumlah KARAKTER/token aktual "
      "tidak tercatat di run utama, sehingga volume dalam token belum terkendali.\n"]

out = RES / "sensitivity.md"
out.write_text("\n".join(L) + "\n", encoding="utf-8")
print("\n".join(L))
