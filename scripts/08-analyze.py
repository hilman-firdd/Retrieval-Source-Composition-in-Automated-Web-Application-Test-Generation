#!/usr/bin/env python3
"""
08-analyze.py

Menggabungkan seluruh berkas hasil menjadi metrik per kondisi per seed, menghitung
mean dan standar deviasi, menjalankan uji signifikansi, dan mencetak tabel siap salin
ke manuskrip.

Uji statistik yang dipakai:
  - Wilcoxon signed-rank, karena data berpasangan per skenario dan tidak diasumsikan normal
  - Cliff's delta sebagai effect size non-parametrik, karena p-value saja tidak menyatakan
    seberapa besar perbedaannya

CATATAN AUDIT (10 Nov 2026): skrip ini dipertahankan sebagai ringkasan cepat saja.
Angka untuk manuskrip WAJIB diambil dari scripts/09-recompute.py (uji per skenario,
Holm, rank-biserial berpasangan, metrik efektif dengan penyebut yang benar).
Fault detection / robustness di sini bersifat BERSYARAT (hanya skrip lolos baseline).

Pemakaian:
  python scripts/08-analyze.py
  python scripts/08-analyze.py --out results/tables.md
"""

import argparse
import json
import statistics as st
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = json.loads((ROOT / "config/experiment.config.json").read_text())
RESULTS = ROOT / "results"
ALPHA = CONFIG["analysis"]["alpha"]


def load(name):
    p = RESULTS / name
    return json.loads(p.read_text()) if p.exists() else None


def load_jsonl(name):
    p = RESULTS / name
    if not p.exists():
        return []
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


def cliffs_delta(a, b):
    """Effect size non-parametrik. Ambang lazim: 0.147 kecil, 0.33 sedang, 0.474 besar."""
    if not a or not b:
        return None, "n/a"
    gt = sum(1 for x in a for y in b if x > y)
    lt = sum(1 for x in a for y in b if x < y)
    d = (gt - lt) / (len(a) * len(b))
    m = abs(d)
    label = "negligible" if m < 0.147 else "small" if m < 0.33 else "medium" if m < 0.474 else "large"
    return round(d, 4), label


def wilcoxon(a, b):
    try:
        from scipy.stats import wilcoxon as w
    except ImportError:
        return None, None
    pairs = [(x, y) for x, y in zip(a, b) if x != y]
    if len(pairs) < 5:
        return None, None
    try:
        stat, p = w([x for x, _ in pairs], [y for _, y in pairs])
        return round(float(stat), 4), round(float(p), 6)
    except ValueError:
        return None, None


def collect_metrics():
    """Bentuk: metrics[condition][seed][scenario_id] = {nama_metrik: nilai}"""
    m = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))

    static = load("04-static-validation.json")
    if static:
        for r in static["rows"]:
            cell = m[r["condition"]][r["run"]][r["scenario_id"]]
            cell["syntax_valid"] = 1 if r["syntaxValid"] else 0
            cell["has_assertion"] = 1 if r["hasAssertion"] else 0
            cell["antipatterns"] = r["antipatternCount"]
            cell["stability_tier"] = r["meanStabilityTier"]
            cell["selectors_total"] = r["totalSelectors"]

    base = load("05-execution-baseline.json")
    if base:
        for r in base["rows"]:
            if r["perturbation_id"]:
                continue
            cell = m[r["condition"]][r["run"]][r["scenario_id"]]
            cell["executable"] = 1 if r["final_outcome"] in ("passed", "failed") else 0
            cell["passed"] = 1 if r["final_outcome"] == "passed" else 0
            cell["duration_ms"] = r["mean_duration_ms"]

    flaky = load("05-execution-flakiness.json")
    if flaky:
        for r in flaky["rows"]:
            m[r["condition"]][r["run"]][r["scenario_id"]]["flaky"] = 1 if r["flaky"] else 0

    sel = load("06-selector-validity.json")
    if sel:
        for r in sel["rows"]:
            if r["selector_validity"] is not None:
                m[r["condition"]][r["run"]][r["scenario_id"]]["selector_validity"] = r["selector_validity"]

    # Fault detection: skrip mendeteksi cacat jika lolos di baseline tapi gagal saat cacat aktif.
    faults = load("05-execution-faults.json")
    if faults and base:
        baseline_pass = {
            (r["condition"], r["run"], r["scenario_id"])
            for r in base["rows"] if r["final_outcome"] == "passed" and not r["perturbation_id"]
        }
        det = defaultdict(lambda: [0, 0])
        for r in faults["rows"]:
            key = (r["condition"], r["run"], r["scenario_id"])
            if key not in baseline_pass:
                continue
            det[key][1] += 1
            if r["final_outcome"] != "passed":
                det[key][0] += 1
        for (c, run, sid), (hit, tot) in det.items():
            if tot:
                m[c][run][sid]["fault_detection"] = round(hit / tot, 4)

    # Locator robustness: skrip yang lolos baseline dan tetap lolos saat DOM dimutasi.
    muts = load("05-execution-mutations.json")
    if muts and base:
        baseline_pass = {
            (r["condition"], r["run"], r["scenario_id"])
            for r in base["rows"] if r["final_outcome"] == "passed" and not r["perturbation_id"]
        }
        rob = defaultdict(lambda: [0, 0])
        for r in muts["rows"]:
            key = (r["condition"], r["run"], r["scenario_id"])
            if key not in baseline_pass:
                continue
            rob[key][1] += 1
            if r["final_outcome"] == "passed":
                rob[key][0] += 1
        for (c, run, sid), (ok, tot) in rob.items():
            if tot:
                m[c][run][sid]["locator_robustness"] = round(ok / tot, 4)

    for rec in load_jsonl("03-generation-log.jsonl"):
        if rec["status"] == "ok":
            cell = m[rec["condition"]][f"seed{rec['seed']}"][rec["scenario_id"]]
            cell["generation_latency_s"] = rec["generation_latency_s"]
            cell["context_chars"] = rec["context_chars"]

    # Protokol utama = 5 seed (temperature 0,2). Run greedy (temperature 0) TIDAK boleh
    # dicampur ke rata-rata/uji, karena kondisi ablasi tidak punya run greedy dan
    # perturbasi tidak dijalankan pada greedy. Greedy dilaporkan terpisah oleh 09-recompute.py.
    for cond in list(m):
        for run in [r for r in m[cond] if not str(r).startswith("seed")]:
            del m[cond][run]

    return m


METRIC_LABELS = [
    ("syntax_valid", "Syntax Validity Rate", "%"),
    ("executable", "Executable Rate", "%"),
    ("passed", "Pass Rate", "%"),
    ("selector_validity", "Selector Validity", "%"),
    ("fault_detection", "Fault Detection Rate", "%"),
    ("locator_robustness", "Locator Robustness", "%"),
    ("flaky", "Flakiness Rate", "%"),
    ("has_assertion", "Assertion Presence", "%"),
    ("antipatterns", "Anti-pattern per skrip", "n"),
    ("stability_tier", "Mean Selector Tier (1 baik - 5 buruk)", "n"),
    ("generation_latency_s", "Generation Latency", "s"),
]


def per_seed_means(metrics, cond, key):
    """Rata-rata metrik pada tiap seed, sehingga tiap seed menjadi satu observasi."""
    out = []
    for seed, scen in sorted(metrics.get(cond, {}).items()):
        vals = [c[key] for c in scen.values() if key in c and c[key] is not None]
        if vals:
            out.append(st.mean(vals))
    return out


def paired_by_scenario(metrics, cond_a, cond_b, key):
    """Pasangan nilai per (seed, scenario) untuk uji Wilcoxon."""
    a, b = [], []
    for seed in metrics.get(cond_a, {}):
        for sid, cell in metrics[cond_a][seed].items():
            other = metrics.get(cond_b, {}).get(seed, {}).get(sid)
            if other and key in cell and key in other and cell[key] is not None and other[key] is not None:
                a.append(cell[key])
                b.append(other[key])
    return a, b


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="results/tables.md")
    args = ap.parse_args()

    metrics = collect_metrics()
    if not metrics:
        raise SystemExit("Belum ada hasil di results/. Jalankan skrip 03 sampai 07 lebih dulu.")

    conditions = [c for c in CONFIG["conditions"] if c in metrics]
    lines = []
    add = lines.append

    add("# Hasil Eksperimen\n")
    add(f"Dihasilkan otomatis oleh 08-analyze.py. Model: `{CONFIG['generation']['model']}`, "
        f"temperature {CONFIG['generation']['temperature']}, seed {CONFIG['generation']['seeds']}.\n")

    # --- Tabel 1: ringkasan metrik utama ---
    add("## Tabel 1. Perbandingan metrik antar kondisi (mean ± SD across seeds)\n")
    header = "| Metrik | " + " | ".join(conditions) + " |"
    add(header)
    add("|" + "---|" * (len(conditions) + 1))
    for key, label, unit in METRIC_LABELS:
        cells = []
        any_data = False
        for c in conditions:
            vals = per_seed_means(metrics, c, key)
            if not vals:
                cells.append("–")
                continue
            any_data = True
            mean = st.mean(vals)
            sd = st.stdev(vals) if len(vals) > 1 else 0.0
            if unit == "%":
                cells.append(f"{mean*100:.1f} ± {sd*100:.1f}")
            else:
                cells.append(f"{mean:.2f} ± {sd:.2f}")
        if any_data:
            suffix = " (%)" if unit == "%" else (" (s)" if unit == "s" else "")
            add(f"| {label}{suffix} | " + " | ".join(cells) + " |")
    add("")

    # --- Tabel 2: uji signifikansi ---
    add("## Tabel 2. Uji signifikansi dan effect size\n")
    add("| Perbandingan | Metrik | n pasangan | Wilcoxon p | Signifikan | Cliff's δ | Besaran |")
    add("|---|---|---|---|---|---|---|")
    for ca, cb in CONFIG["analysis"]["allComparisons"]:
        if ca not in metrics or cb not in metrics:
            continue
        for key, label, unit in METRIC_LABELS:
            a, b = paired_by_scenario(metrics, ca, cb, key)
            if len(a) < 5:
                continue
            stat, p = wilcoxon(a, b)
            d, mag = cliffs_delta(b, a)  # arah: cb relatif terhadap ca
            if p is None:
                continue
            sig = "ya" if p < ALPHA else "tidak"
            add(f"| {ca} vs {cb} | {label} | {len(a)} | {p:.5f} | {sig} | {d} | {mag} |")
    add("")
    add(f"Ambang signifikansi α = {ALPHA}. Cliff's δ positif berarti kondisi kedua lebih tinggi. "
        "Ambang besaran: <0,147 dapat diabaikan; <0,33 kecil; <0,474 sedang; selebihnya besar.\n")

    # --- Tabel 3: ablasi ---
    abl = [c for c in conditions if CONFIG["conditions"][c].get("ablation")]
    if abl and "P" in metrics:
        add("## Tabel 3. Studi ablasi terhadap sumber knowledge base\n")
        add("| Konfigurasi | Pass Rate (%) | Selector Validity (%) | Δ Pass Rate vs P |")
        add("|---|---|---|---|")
        p_pass = per_seed_means(metrics, "P", "passed")
        p_mean = st.mean(p_pass) if p_pass else 0
        for c in ["P"] + abl:
            pv = per_seed_means(metrics, c, "passed")
            sv = per_seed_means(metrics, c, "selector_validity")
            pm = st.mean(pv) if pv else 0
            sm = st.mean(sv) if sv else 0
            delta = "" if c == "P" else f"{(pm - p_mean)*100:+.1f}"
            label = CONFIG["conditions"][c]["label"]
            add(f"| {c} — {label} | {pm*100:.1f} | {sm*100:.1f} | {delta} |")
        add("")

    # --- Tabel 4: perbaikan ---
    repairs = load_jsonl("07-repair-log.jsonl")
    if repairs:
        add("## Tabel 4. Efektivitas loop validasi dan perbaikan\n")
        by_cond = defaultdict(lambda: {"n": 0, "ok": 0, "iters": []})
        for r in repairs:
            b = by_cond[r["condition"]]
            b["n"] += 1
            if r["repaired"]:
                b["ok"] += 1
                b["iters"].append(r["iterations_used"])
        add("| Kondisi | Skrip gagal | Berhasil diperbaiki | Repair Success Rate (%) | Rerata iterasi |")
        add("|---|---|---|---|---|")
        for c, b in by_cond.items():
            it = f"{st.mean(b['iters']):.2f}" if b["iters"] else "–"
            add(f"| {c} | {b['n']} | {b['ok']} | {b['ok']/b['n']*100:.1f} | {it} |")
        add("")

    # --- Tabel 5: distribusi selector ---
    static = load("04-static-validation.json")
    if static:
        add("## Tabel 5. Distribusi jenis selector yang dihasilkan\n")
        kinds = ["getByTestId", "id", "getByLabel", "getByPlaceholder", "getByRole",
                 "attrName", "getByText", "cssClass", "xpath"]
        dist = defaultdict(lambda: defaultdict(int))
        for r in static["rows"]:
            for k, v in r.get("selectors", {}).items():
                dist[r["condition"]][k] += v
        add("| Kondisi | " + " | ".join(kinds) + " |")
        add("|" + "---|" * (len(kinds) + 1))
        for c in conditions:
            tot = sum(dist[c].values()) or 1
            row = [f"{dist[c].get(k,0)/tot*100:.1f}%" for k in kinds]
            add(f"| {c} | " + " | ".join(row) + " |")
        add("")

    out_path = ROOT / args.out
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines), encoding="utf-8")

    print("\n".join(lines))
    print(f"\n---\nTabel tersimpan di {out_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
