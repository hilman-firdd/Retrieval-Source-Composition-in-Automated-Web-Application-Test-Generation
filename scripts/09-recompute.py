#!/usr/bin/env python3
"""
09-recompute.py

Memperbaiki dua kelemahan analisis di 08-analyze.py, tanpa menjalankan ulang eksperimen:

  1. SEL `fill` DI NASKAH. Mencetak nilai exact per-kondisi untuk semua metrik yang
     belum terisi di tabel manuskrip (Syntax Validity, Executable Rate, Assertion
     Presence, Anti-pattern, dll.), langsung dari results/*.json.

  2. STATISTIK YANG BENAR. Mengganti uji level (seed x skenario) dengan:
       - agregasi level SKENARIO (n = jumlah skenario, bukan 5x), lalu Wilcoxon
         berpasangan per skenario -> menghindari pseudo-replikasi;
       - risk difference + CI 95% bootstrap BERKELOMPOK per skenario;
       - odds ratio untuk metrik biner (lebih mudah ditafsirkan dari Cliff's delta);
       - metrik EFEKTIF tak bersyarat untuk Fault Detection & Locator Robustness
         (penyebut = semua skrip, bukan hanya yang lolos baseline) -> menghapus
         bias survivorship yang membuat B0 tampak setara P.

Tidak mengarang apa pun: hanya membaca berkas hasil yang sudah ada. Metrik yang
berkasnya tidak ada akan dilewati dengan pesan jelas.

Pemakaian:
  python scripts/09-recompute.py
  python scripts/09-recompute.py --out results/tables-corrected.md
  python scripts/09-recompute.py --faults-relevance perturbations/fault-relevance.json
"""

import argparse
import json
import math
import random
import statistics as st
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESULTS = ROOT / "results"
random.seed(42)

CONDITIONS = ["B0", "B1", "B2", "P", "P_no_req", "P_no_hist", "P_no_dom"]


def load(name):
    p = RESULTS / name
    if not p.exists():
        print(f"  [lewati] {name} tidak ditemukan")
        return None
    return json.loads(p.read_text())


def load_jsonl(name):
    p = RESULTS / name
    if not p.exists():
        return []
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


# ------------------------------------------------------------------ #
#  Kumpulkan metrik per (kondisi, seed, skenario)                    #
# ------------------------------------------------------------------ #
def collect():
    # m[cond][scenario][seed] = {metric: value}
    m = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))

    static = load("04-static-validation.json")
    if static:
        for r in static["rows"]:
            c = m[r["condition"]][r["scenario_id"]][r["run"]]
            c["syntax_valid"] = 1 if r["syntaxValid"] else 0
            c["has_assertion"] = 1 if r["hasAssertion"] else 0
            c["antipatterns"] = r["antipatternCount"]
            c["stability_tier"] = r.get("meanStabilityTier")

    base = load("05-execution-baseline.json")
    if base:
        for r in base["rows"]:
            if r.get("perturbation_id"):
                continue
            c = m[r["condition"]][r["scenario_id"]][r["run"]]
            c["executable"] = 1 if r["final_outcome"] in ("passed", "failed") else 0
            c["passed"] = 1 if r["final_outcome"] == "passed" else 0

    flaky = load("05-execution-flakiness.json")
    if flaky:
        for r in flaky["rows"]:
            m[r["condition"]][r["scenario_id"]][r["run"]]["flaky"] = 1 if r["flaky"] else 0

    sel = load("06-selector-validity.json")
    if sel:
        for r in sel["rows"]:
            if r.get("selector_validity") is not None:
                m[r["condition"]][r["scenario_id"]][r["run"]]["selector_validity"] = r["selector_validity"]

    for rec in load_jsonl("03-generation-log.jsonl"):
        if rec.get("status") == "ok":
            c = m[rec["condition"]][rec["scenario_id"]][f"seed{rec['seed']}"]
            c["generation_latency_s"] = rec["generation_latency_s"]

    return m, base


# per-skenario rata-rata lintas seed -> satu nilai per skenario
def scenario_means(m, cond, key):
    out = {}
    for sid, seeds in m.get(cond, {}).items():
        vals = [s[key] for s in seeds.values() if key in s and s[key] is not None]
        if vals:
            out[sid] = st.mean(vals)
    return out


def grand(m, cond, key):
    sm = scenario_means(m, cond, key)
    if not sm:
        return None, None, 0
    vals = list(sm.values())
    sd = st.stdev(vals) if len(vals) > 1 else 0.0
    return st.mean(vals), sd, len(vals)


# ------------------------------------------------------------------ #
#  Uji statistik                                                     #
# ------------------------------------------------------------------ #
def wilcoxon_scenario(m, ca, cb, key):
    a_map, b_map = scenario_means(m, ca, key), scenario_means(m, cb, key)
    common = sorted(set(a_map) & set(b_map))
    a = [a_map[s] for s in common]
    b = [b_map[s] for s in common]
    try:
        from scipy.stats import wilcoxon
    except ImportError:
        return None, None, len(common)
    diffs = [(x, y) for x, y in zip(a, b) if x != y]
    if len(diffs) < 5:
        return None, None, len(common)
    stat, p = wilcoxon([x for x, _ in diffs], [y for _, y in diffs])
    return round(float(stat), 3), round(float(p), 6), len(common)


def cliffs_delta(a, b):
    if not a or not b:
        return None, "n/a"
    gt = sum(1 for x in b for y in a if x > y)
    lt = sum(1 for x in b for y in a if x < y)
    d = (gt - lt) / (len(a) * len(b))
    mg = abs(d)
    lab = "diabaikan" if mg < 0.147 else "kecil" if mg < 0.33 else "sedang" if mg < 0.474 else "besar"
    return round(d, 4), lab


def risk_difference_boot(m, ca, cb, key, B=5000):
    """Risk difference (cb - ca) untuk metrik biner, dengan CI bootstrap berkelompok per skenario."""
    a_map, b_map = scenario_means(m, ca, key), scenario_means(m, cb, key)
    common = sorted(set(a_map) & set(b_map))
    if not common:
        return None
    pa = st.mean([a_map[s] for s in common])
    pb = st.mean([b_map[s] for s in common])
    rd = pb - pa
    boots = []
    n = len(common)
    for _ in range(B):
        samp = [common[random.randrange(n)] for _ in range(n)]
        boots.append(st.mean([b_map[s] for s in samp]) - st.mean([a_map[s] for s in samp]))
    boots.sort()
    lo = boots[int(0.025 * B)]
    hi = boots[int(0.975 * B)]
    return {"pa": pa, "pb": pb, "rd": rd, "ci": (lo, hi)}


def odds_ratio(m, ca, cb, key):
    """OR dari proporsi rata-rata per kondisi (metrik biner)."""
    pa, _, _ = grand(m, ca, key)
    pb, _, _ = grand(m, cb, key)
    if pa is None or pb is None:
        return None
    # Bila salah satu proporsi di lantai 0 atau langit-langit 1, OR meledak dan
    # tidak bermakna (mis. flakiness 0% vs 5%). Laporkan risk difference saja.
    if pa <= 1e-9 or pb <= 1e-9 or pa >= 1 - 1e-9 or pb >= 1 - 1e-9:
        return None
    return (pb / (1 - pb)) / (pa / (1 - pa))


# ------------------------------------------------------------------ #
#  Metrik efektif tak bersyarat (menghapus bias survivorship)        #
# ------------------------------------------------------------------ #
def effective_unconditional(base, perturb_file, metric_name):
    """
    Effective = P(lolos baseline DAN memenuhi kriteria perturbasi), penyebut = semua skrip.
    Untuk fault: 'memenuhi' = gagal saat cacat aktif (mendeteksi).
    Untuk mutasi: 'memenuhi' = tetap lolos saat mutasi aktif (robust).
    """
    data = load(perturb_file)
    if not base or not data:
        return {}
    baseline_pass = {
        (r["condition"], r["run"], r["scenario_id"])
        for r in base["rows"] if r["final_outcome"] == "passed" and not r.get("perturbation_id")
    }
    total = defaultdict(int)       # semua skrip per kondisi (dari baseline rows)
    for r in base["rows"]:
        if not r.get("perturbation_id"):
            total[r["condition"]] += 1

    good = defaultdict(int)        # skrip yang lolos baseline DAN memenuhi kriteria
    seen = defaultdict(set)        # hitung tiap skrip sekali: butuh lolos di SEMUA perturbasi? -> rata-rata
    per_script = defaultdict(lambda: [0, 0])  # (key)-> [hit, trials]
    for r in data["rows"]:
        key = (r["condition"], r["run"], r["scenario_id"])
        if key not in baseline_pass:
            continue
        per_script[key][1] += 1
        if metric_name == "fault":
            if r["final_outcome"] != "passed":
                per_script[key][0] += 1
        else:  # mutation
            if r["final_outcome"] == "passed":
                per_script[key][0] += 1

    # rata-rata rate per skrip, lalu kalikan proporsi skrip yang lolos baseline
    out = {}
    cond_scripts = defaultdict(list)
    for (c, run, sid), (hit, trials) in per_script.items():
        if trials:
            cond_scripts[c].append(hit / trials)
    perturbed_conds = {r["condition"] for r in data["rows"]}
    for c in total:
        if c not in perturbed_conds:   # kondisi tak dijalankan pada berkas perturbasi -> bukan 0%
            continue
        passing = len(cond_scripts[c])
        mean_rate = st.mean(cond_scripts[c]) if cond_scripts[c] else 0.0
        # effective = (proporsi skrip lolos baseline) x (rata-rata rate bersyarat)
        eff = (passing / total[c]) * mean_rate if total[c] else 0.0
        cond_pass = {(x["condition"], x["run"], x["scenario_id"]) for x in base["rows"]
                     if x["final_outcome"] == "passed" and not x.get("perturbation_id") and x["condition"] == c}
        out[c] = {
            "effective": eff,
            "conditional_mean": mean_rate,
            "baseline_pass_rate": passing / total[c] if total[c] else 0,
            "n_total": total[c],
            "n_passing": passing,
        }
    return out


# ------------------------------------------------------------------ #
METRICS = [
    ("syntax_valid", "Syntax Validity Rate", "%"),
    ("executable", "Executable Rate", "%"),
    ("passed", "Pass Rate", "%"),
    ("selector_validity", "Selector Validity", "%"),
    ("has_assertion", "Assertion Presence", "%"),
    ("flaky", "Flakiness Rate", "%"),
    ("antipatterns", "Anti-pattern per skrip", "n"),
    ("stability_tier", "Mean Selector Tier", "n"),
    ("generation_latency_s", "Generation Latency", "s"),
]
BINARY = {"syntax_valid", "executable", "passed", "has_assertion", "flaky"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="results/tables-corrected.md")
    ap.add_argument("--faults-relevance", default=None,
                    help="JSON opsional: {scenario_id: [fault_id,...]} untuk fault detection yang relevan")
    args = ap.parse_args()

    print("Membaca results/ ...")
    m, base = collect()
    if not m:
        raise SystemExit("Tidak ada data di results/. Jalankan pipeline (skrip 03-07) lebih dulu.")

    present = [c for c in CONDITIONS if c in m]
    L = []
    add = L.append
    add("# Hasil Terkoreksi (09-recompute.py)\n")

    # ---- Tabel A: nilai exact untuk sel fill ----
    add("## Tabel A. Nilai exact per kondisi (isi langsung ke sel `fill` di naskah)\n")
    add("| Metrik | " + " | ".join(present) + " |")
    add("|" + "---|" * (len(present) + 1))
    for key, label, unit in METRICS:
        cells = []
        has = False
        for c in present:
            mean, sd, n = grand(m, c, key)
            if mean is None:
                cells.append("–")
                continue
            has = True
            if unit == "%":
                cells.append(f"{mean*100:.1f} ± {sd*100:.1f}")
            else:
                cells.append(f"{mean:.2f} ± {sd:.2f}")
        if has:
            suf = " (%)" if unit == "%" else (" (s)" if unit == "s" else "")
            add(f"| {label}{suf} | " + " | ".join(cells) + " |")
    add("")

    # ---- Tabel B: statistik level skenario yang benar ----
    add("## Tabel B. Uji berpasangan per SKENARIO (bukan per seed-skenario)\n")
    add("Mengganti n≈140 (pseudo-replikasi) dengan n = jumlah skenario. Risk difference + CI")
    add("bootstrap berkelompok untuk metrik biner; Wilcoxon + Cliff's δ untuk semua.\n")
    add("| Perbandingan | Metrik | n skenario | Wilcoxon p | Sig | Cliff's δ | Risk diff (CI 95%) | Odds ratio |")
    add("|---|---|---|---|---|---|---|---|")
    comparisons = [("B0", "P"), ("B1", "P"), ("B2", "P"), ("B0", "B2"),
                   ("P_no_req", "P"), ("P_no_hist", "P"), ("P_no_dom", "P")]
    for ca, cb in comparisons:
        if ca not in m or cb not in m:
            continue
        for key, label, unit in METRICS:
            stat, p, n = wilcoxon_scenario(m, ca, cb, key)
            if p is None:
                continue
            a_map, b_map = scenario_means(m, ca, key), scenario_means(m, cb, key)
            common = sorted(set(a_map) & set(b_map))
            d, mag = cliffs_delta([a_map[s] for s in common], [b_map[s] for s in common])
            rd_str, or_str = "–", "–"
            if key in BINARY:
                rd = risk_difference_boot(m, ca, cb, key)
                if rd:
                    rd_str = f"{rd['rd']*100:+.1f} pp [{rd['ci'][0]*100:+.1f}, {rd['ci'][1]*100:+.1f}]"
                orr = odds_ratio(m, ca, cb, key)
                if orr:
                    or_str = f"{orr:.2f}"
            sig = "ya" if p < 0.05 else "tidak"
            add(f"| {ca} vs {cb} | {label} | {n} | {p:.5f} | {sig} | {d} ({mag}) | {rd_str} | {or_str} |")
    add("")

    # ---- Tabel C: metrik efektif tak bersyarat ----
    add("## Tabel C. Fault Detection & Locator Robustness EFEKTIF (tak bersyarat)\n")
    add("Penyebut = SEMUA skrip, bukan hanya yang lolos baseline. Menghapus bias survivorship")
    add("yang membuat B0 tampak setara P pada versi bersyarat.\n")
    fault_eff = effective_unconditional(base, "05-execution-faults.json", "fault")
    mut_eff = effective_unconditional(base, "05-execution-mutations.json", "mutation")
    if fault_eff or mut_eff:
        add("| Kondisi | Baseline pass | Fault detect (bersyarat) | **Fault detect EFEKTIF** | Robustness (bersyarat) | **Robustness EFEKTIF** |")
        add("|---|---|---|---|---|---|")
        for c in present:
            f = fault_eff.get(c, {})
            u = mut_eff.get(c, {})
            bp = f.get("baseline_pass_rate", u.get("baseline_pass_rate"))
            row = [
                c,
                f"{bp*100:.1f}%" if bp is not None else "–",
                f"{f.get('conditional_mean',0)*100:.1f}%" if f else "–",
                f"**{f.get('effective',0)*100:.1f}%**" if f else "–",
                f"{u.get('conditional_mean',0)*100:.1f}%" if u else "–",
                f"**{u.get('effective',0)*100:.1f}%**" if u else "–",
            ]
            add("| " + " | ".join(row) + " |")
        add("")
    else:
        add("_Berkas 05-execution-faults.json / 05-execution-mutations.json tidak ada — lewati._\n")

    # ---- Tabel D: fault detection dengan matriks relevansi (opsional) ----
    if args.faults_relevance:
        rel = json.loads(Path(args.faults_relevance).read_text())
        add("## Tabel D. Fault Detection dengan matriks relevansi cacat-skenario\n")
        add("Hanya menghitung pasangan (skenario, cacat) yang memang relevan.\n")
        faults = load("05-execution-faults.json")
        if faults and base:
            baseline_pass = {
                (r["condition"], r["run"], r["scenario_id"])
                for r in base["rows"] if r["final_outcome"] == "passed" and not r.get("perturbation_id")
            }
            det = defaultdict(lambda: [0, 0])
            for r in faults["rows"]:
                sid, fid = r["scenario_id"], r.get("perturbation_id")
                if fid not in rel.get(sid, []):
                    continue
                key = (r["condition"], r["run"], r["scenario_id"])
                if key not in baseline_pass:
                    continue
                det[r["condition"]][1] += 1
                if r["final_outcome"] != "passed":
                    det[r["condition"]][0] += 1
            add("| Kondisi | Terdeteksi | Relevan diuji | Fault Detection (relevan) |")
            add("|---|---|---|---|")
            for c in present:
                hit, tot = det.get(c, [0, 0])
                add(f"| {c} | {hit} | {tot} | {hit/tot*100:.1f}% |" if tot else f"| {c} | 0 | 0 | – |")
            add("")

    out_path = ROOT / args.out
    out_path.write_text("\n".join(L), encoding="utf-8")
    print("\n".join(L))
    print(f"\n---\nTersimpan: {out_path.relative_to(ROOT)}")
    print("\nSalin Tabel A ke sel `fill` di naskah; Tabel B & C menggantikan Tabel 2 & 4.")


if __name__ == "__main__":
    main()
