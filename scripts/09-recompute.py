#!/usr/bin/env python3
"""
09-recompute.py  (v2 — revisi audit 10 Nov 2026)

Satu-satunya sumber angka untuk manuskrip. Hanya membaca results/*.json yang sudah ada;
tidak menjalankan ulang eksperimen dan tidak mengarang nilai.

Perubahan dari v1 (lihat README §7 "Riwayat koreksi"):
  1. PROTOKOL SERAGAM. Semua tabel utama hanya memakai run 5 seed (temperature 0,2).
     Run greedy (temperature 0) dilaporkan terpisah di Tabel G. v1 mencampur greedy ke
     B0/B1/B2/P (6 run) sementara ablasi hanya punya 5 seed.
  2. PENYEBUT METRIK EFEKTIF. Fault detection & locator robustness efektif dihitung per
     skrip (0 bila gagal baseline), dirata-rata per skenario, lalu antar skenario, dengan
     penyebut = skrip yang benar-benar diperturbasi (5 seed x 28 skenario = 140).
     v1 membagi dengan 168 (termasuk greedy yang tidak pernah diperturbasi), sehingga
     Tabel 4 naskah terlalu rendah sekitar 1/6.
  3. CAKUPAN PERTURBASI. Kondisi yang barisnya tidak lengkap (ablasi) TIDAK diberi angka
     efektif; hanya dilaporkan cakupannya.
  4. STATISTIK. Wilcoxon signed-rank dua sisi per skenario (n = jumlah skenario),
     koreksi Holm atas 7 perbandingan untuk outcome primer (Pass Rate), effect size
     rank-biserial berpasangan (bukan Cliff's delta, yang untuk sampel independen),
     dan CI 95% bootstrap berkelompok per skenario (5000 resample, seed 42).
  5. INTEGRITAS DATA. Mencocokkan ID skenario di results/ dengan scenarios/scenarios.json,
     menghitung locator per kondisi dan getByTestId, serta ukuran konteks bila
     results/03-generation-log.jsonl tersedia.

Pemakaian:
  python scripts/09-recompute.py
  python scripts/09-recompute.py --out results/tables-corrected.md
  python scripts/09-recompute.py --faults-relevance perturbations/fault-relevance.json
"""

import argparse
import json
import statistics as st
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
RESULTS = ROOT / "results"
CONFIG = json.loads((ROOT / "config/experiment.config.json").read_text())
AN = CONFIG["analysis"]
ALPHA = AN["alpha"]
B_BOOT = AN.get("bootstrapResamples", 5000)
RNG_SEED = AN.get("bootstrapSeed", 42)

CONDITIONS = ["B0", "B1", "B2", "P", "P_no_req", "P_no_hist", "P_no_dom"]
# Kondisi tambahan (uji prompt netral, 10 Nov 2026). TIDAK masuk tabel utama karena skenario & tanggalnya berbeda.
EXTRA_CONDITIONS = ["B0__rerun", "B0__neutral"]
COMPARISONS = [tuple(x) for x in AN["allComparisons"]]
PRIMARY = AN.get("primaryOutcome", "passed")

# Angka naskah SAUCIS versi 2 Nov 2026 — hanya untuk kolom pembanding "naskah lama".
MANUSCRIPT_T4 = {
    "robustness": {"B0": 11.9, "B1": 17.4, "B2": 21.3, "P": 44.0},
    "fault": {"B0": 2.4, "B1": 3.9, "B2": 3.0, "P": 9.1},
}


def is_seed(run):
    return str(run).startswith("seed")


def load(name):
    """Muat results/<name>. Berkas bersaudara berawalan sama (mis. 05-execution-faults-neutral.json,
    05-execution-faults-completion.json) ikut digabung dan baris duplikat dibuang, sehingga hasil
    run tambahan (subset kondisi / pelengkapan cakupan) tidak perlu menimpa berkas utama."""
    stem = name[:-5] if name.endswith(".json") else name
    files = sorted(RESULTS.glob(stem + "*.json"), key=lambda f: (f.name != name, f.name))
    files = [f for f in files if f.name == name or f.name.startswith(stem + "-")]
    if not files:
        print(f"  [lewati] {name} tidak ditemukan")
        return None
    merged, seen = None, set()
    for f in files:
        d = json.loads(f.read_text())
        if merged is None:
            merged = {k: v for k, v in d.items() if k != "rows"}
            merged["rows"] = []
        if f.name != name:
            print(f"  [gabung] {f.name} ({len(d['rows'])} baris)")
        for r in d["rows"]:
            k = (r.get("condition"), r.get("run"), r.get("scenario_id"), r.get("perturbation_id"))
            if k in seen:
                continue
            seen.add(k)
            merged["rows"].append(r)
    return merged


def load_jsonl(name):
    p = RESULTS / name
    if not p.exists():
        return []
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


# ------------------------------------------------------------------ #
#  Pengumpulan metrik per (kondisi, skenario, run)                   #
# ------------------------------------------------------------------ #
def collect(run_filter):
    m = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))

    static = load("04-static-validation.json")
    if static:
        for r in static["rows"]:
            if not run_filter(r["run"]):
                continue
            c = m[r["condition"]][r["scenario_id"]][r["run"]]
            c["syntax_valid"] = 1 if r["syntaxValid"] else 0
            c["has_assertion"] = 1 if r["hasAssertion"] else 0
            c["antipatterns"] = r["antipatternCount"]
            c["stability_tier"] = r.get("meanStabilityTier")

    base = load("05-execution-baseline.json")
    if base:
        for r in base["rows"]:
            if r.get("perturbation_id") or not run_filter(r["run"]):
                continue
            c = m[r["condition"]][r["scenario_id"]][r["run"]]
            c["executable"] = 1 if r["final_outcome"] in ("passed", "failed") else 0
            c["passed"] = 1 if r["final_outcome"] == "passed" else 0

    flaky = load("05-execution-flakiness.json")
    if flaky:
        for r in flaky["rows"]:
            if run_filter(r["run"]):
                m[r["condition"]][r["scenario_id"]][r["run"]]["flaky"] = 1 if r["flaky"] else 0

    sel = load("06-selector-validity.json")
    old = [f.name for f in RESULTS.glob("06-selector-validity*.json")
           if json.loads(f.read_text()).get("extractor") != "v2"]
    if old:
        print(f"  [PERINGATAN] {', '.join(old)} dibuat dengan ekstraktor v1 (selector berisi tanda kutip "
              "terpotong). Selector Validity dari berkas ini TIDAK sahih; jalankan scripts/run-probe-v2.sh.")
    if sel:
        for r in sel["rows"]:
            if run_filter(r["run"]) and r.get("selector_validity") is not None:
                m[r["condition"]][r["scenario_id"]][r["run"]]["selector_validity"] = r["selector_validity"]

    for rec in load_jsonl("03-generation-log.jsonl"):
        run = f"seed{rec['seed']}" if rec.get("temperature", 0.2) > 0 else f"greedy{rec['seed']}"
        if rec.get("status") == "ok" and run_filter(run):
            c = m[rec["condition"]][rec["scenario_id"]][run]
            c["generation_latency_s"] = rec["generation_latency_s"]
            c["context_chars"] = rec.get("context_chars")

    return m, base, static


def scenario_means(m, cond, key):
    out = {}
    for sid, runs in m.get(cond, {}).items():
        vals = [s[key] for s in runs.values() if s.get(key) is not None]
        if vals:
            out[sid] = st.mean(vals)
    return out


def grand(m, cond, key):
    vals = list(scenario_means(m, cond, key).values())
    if not vals:
        return None, None, 0
    return st.mean(vals), (st.stdev(vals) if len(vals) > 1 else 0.0), len(vals)


# ------------------------------------------------------------------ #
#  Statistik                                                         #
# ------------------------------------------------------------------ #
def paired_rank_biserial(diffs):
    """Rank-biserial berpasangan (Kerby 2014): (R+ - R-) / (R+ + R-), selisih nol dibuang."""
    from scipy.stats import rankdata
    d = np.array([x for x in diffs if x != 0])
    if d.size == 0:
        return 0.0
    ranks = rankdata(np.abs(d))
    rp, rn = ranks[d > 0].sum(), ranks[d < 0].sum()
    return float((rp - rn) / (rp + rn))


def boot_mean_ci(values, B=B_BOOT, seed=RNG_SEED):
    """CI 95% persentil, resample skenario (bootstrap berkelompok)."""
    v = np.asarray(values, dtype=float)
    rng = np.random.default_rng(seed)
    idx = rng.integers(0, v.size, size=(B, v.size))
    means = v[idx].mean(axis=1)
    return float(np.percentile(means, 2.5)), float(np.percentile(means, 97.5))


def holm(pvals):
    """Holm step-down. pvals: dict key->p. Kembalikan dict key->p_adj."""
    items = sorted(pvals.items(), key=lambda kv: kv[1])
    k = len(items)
    adj, running = {}, 0.0
    for i, (key, p) in enumerate(items):
        running = max(running, min(1.0, (k - i) * p))
        adj[key] = running
    return adj


def paired_test(m, ca, cb, key):
    from scipy.stats import wilcoxon
    a_map, b_map = scenario_means(m, ca, key), scenario_means(m, cb, key)
    common = sorted(set(a_map) & set(b_map))
    diffs = [b_map[s] - a_map[s] for s in common]
    if len([d for d in diffs if d != 0]) < 5:
        return None
    w = wilcoxon(diffs, alternative="two-sided", zero_method="wilcox")
    p = float(w.pvalue)
    lo, hi = boot_mean_ci(diffs)
    return {"n": len(common), "n_nonzero": len([d for d in diffs if d != 0]), "W": float(w.statistic),
            "diff": st.mean(diffs), "ci": (lo, hi), "p": p,
            "rrb": paired_rank_biserial(diffs)}


def magnitude(r):
    a = abs(r)
    return "diabaikan" if a < 0.1 else "kecil" if a < 0.3 else "sedang" if a < 0.5 else "besar"


# ------------------------------------------------------------------ #
#  Metrik efektif tak bersyarat                                      #
# ------------------------------------------------------------------ #
def perturbation_ids(fname):
    p = ROOT / "perturbations" / fname
    if not p.exists():
        return None
    data = json.loads(p.read_text())
    items = data if isinstance(data, list) else data.get("perturbations", [])
    return [x.get("id") for x in items if isinstance(x, dict)]


def effective(base, perturb_rows, kind, n_perturb, conds=None):
    """
    Skor per skrip = 0 bila gagal baseline; bila lolos baseline = proporsi perturbasi yang
    terdeteksi (fault: gagal) atau bertahan (mutasi: tetap lolos). Rata-rata per skenario
    lintas 5 seed, lalu antar skenario. CI = bootstrap berkelompok per skenario.
    """
    seed_base = {(r["condition"], r["run"], r["scenario_id"]): r["final_outcome"] == "passed"
                 for r in base["rows"] if not r.get("perturbation_id") and is_seed(r["run"])}
    hits = defaultdict(lambda: [0, 0])
    harness = defaultdict(int)
    for r in perturb_rows:
        if not is_seed(r["run"]):
            continue
        k = (r["condition"], r["run"], r["scenario_id"])
        if r["final_outcome"] == "harness_error":   # bukan hasil skrip: jangan dihitung 'terdeteksi'
            harness[k] += 1
            continue
        hits[k][1] += 1
        ok = (r["final_outcome"] != "passed") if kind == "fault" else (r["final_outcome"] == "passed")
        hits[k][0] += 1 if ok else 0

    out = {}
    for c in (conds or CONDITIONS):
        scripts = [k for k in seed_base if k[0] == c]
        if not scripts:
            continue
        expected = len(scripts) * n_perturb if n_perturb else None
        observed = sum(hits[k][1] + harness[k] for k in scripts if k in hits or k in harness)
        complete = expected is not None and observed == expected
        per_scen = defaultdict(list)
        cond_rates = []
        for k in scripts:
            if not seed_base[k]:
                per_scen[k[2]].append(0.0)
                continue
            h, t = hits.get(k, (0, 0))
            rate = h / t if t else 0.0
            per_scen[k[2]].append(rate)
            if t:
                cond_rates.append(rate)
        scen_vals = [st.mean(v) for v in per_scen.values()]
        res = {"n_scripts": len(scripts), "observed": observed, "expected": expected,
               "complete": complete,
               "baseline_pass": st.mean(1.0 if seed_base[k] else 0.0 for k in scripts),
               "conditional": st.mean(cond_rates) if cond_rates else None}
        if complete:
            res["scen"] = {sid: st.mean(v) for sid, v in per_scen.items()}
            res["effective"] = st.mean(scen_vals)
            res["ci"] = boot_mean_ci(scen_vals)
        out[c] = res
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
    ("context_chars", "Ukuran konteks (karakter)", "n"),
]
LABEL = {k: l for k, l, _ in METRICS}
UNIT = {k: u for k, _, u in METRICS}


def fmt(v, unit, sd=None):
    if v is None:
        return "–"
    if unit == "%":
        return f"{v*100:.1f}" + (f" ± {sd*100:.1f}" if sd is not None else "")
    return f"{v:.2f}" + (f" ± {sd:.2f}" if sd is not None else "")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="results/tables-corrected.md")
    ap.add_argument("--faults-relevance", default=None,
                    help="JSON {scenario_id: [fault_id,...]} untuk fault detection yang relevan")
    args = ap.parse_args()

    print("Membaca results/ ...")
    m, base, static = collect(is_seed)
    g, _, _ = collect(lambda r: str(r).startswith("greedy"))
    if not m:
        raise SystemExit("Tidak ada data di results/.")
    present = [c for c in CONDITIONS if c in m]

    L = []
    add = L.append
    add("# Hasil Terkoreksi — 09-recompute.py v2\n")
    add("Protokol utama: **5 seed (temperature 0,2) saja**. Unit analisis: **skenario** "
        "(nilai per skenario = rata-rata 5 seed). Run greedy dilaporkan terpisah (Tabel G). "
        f"CI 95% = bootstrap berkelompok per skenario, {B_BOOT} resample, seed {RNG_SEED}.\n")

    # ---- Tabel 0: integritas data ----
    add("## Tabel 0. Integritas data\n")
    res_ids = sorted({r["scenario_id"] for r in base["rows"]}) if base else []
    sc_path = ROOT / "scenarios/scenarios.json"
    repo_ids = [s["id"] for s in json.loads(sc_path.read_text())["scenarios"]] if sc_path.exists() else []
    only_res = sorted(set(res_ids) - set(repo_ids))
    only_repo = sorted(set(repo_ids) - set(res_ids))
    add(f"- Skenario di results/: **{len(res_ids)}**; di scenarios/scenarios.json: **{len(repo_ids)}**.")
    add(f"- Ada di results/ tetapi tidak di repo ({len(only_res)}): {', '.join(only_res) or '–'}")
    add(f"- Ada di repo tetapi tidak pernah dieksekusi ({len(only_repo)}): {', '.join(only_repo) or '–'}")
    prefixes = Counter("".join(ch for ch in s if ch.isalpha()) for s in res_ids)
    add("- Prefiks kategori di results/: " + ", ".join(f"{k} {v}" for k, v in sorted(prefixes.items())))
    if only_res or only_repo:
        add("- **STATUS: TIDAK COCOK.** scenarios.json yang benar-benar dipakai harus diunggah "
            "sebelum hasil dapat direplikasi.")
    gl = load_jsonl("03-generation-log.jsonl")
    add(f"- results/03-generation-log.jsonl: {'ada (' + str(len(gl)) + ' baris)' if gl else '**TIDAK ADA** (ukuran konteks & latensi tidak dapat diverifikasi)'}")
    he = 0
    for fn in ("05-execution-baseline.json", "05-execution-faults.json", "05-execution-mutations.json"):
        dd = load(fn)
        he += sum(1 for r in dd["rows"] if r["final_outcome"] == "harness_error") if dd else 0
    add(f"- Baris `harness_error` (Playwright gagal start, sintaks valid; dikecualikan dari fault/robustness, "
        f"dihitung tidak-executable di baseline): **{he}**" + (" — jalankan ulang baris itu." if he else ""))
    add(f"- results/07-repair-log.jsonl: {'ada' if (RESULTS/'07-repair-log.jsonl').exists() else '**TIDAK ADA**'}")
    add("")

    # ---- Tabel A ----
    add("## Tabel A. Metrik per kondisi (5 seed; mean ± SD antar skenario)\n")
    add("| Metrik | " + " | ".join(present) + " |")
    add("|" + "---|" * (len(present) + 1))
    for key, label, unit in METRICS:
        cells = []
        for c in present:
            mean, sd, _ = grand(m, c, key)
            cells.append(fmt(mean, unit, sd))
        if any(x != "–" for x in cells):
            suf = " (%)" if unit == "%" else (" (s)" if unit == "s" else "")
            add(f"| {label}{suf} | " + " | ".join(cells) + " |")
    add("")

    # ---- Tabel B: outcome primer + Holm ----
    add(f"## Tabel B. Outcome primer: {LABEL[PRIMARY]} — Wilcoxon dua sisi, Holm atas {len(COMPARISONS)} uji\n")
    add("Selisih = kondisi kedua − kondisi pertama (pp), rata-rata antar skenario. "
        "r_rb = rank-biserial berpasangan (|r| <0,1 diabaikan; <0,3 kecil; <0,5 sedang; ≥0,5 besar).\n")
    add("| Perbandingan | n skenario | n selisih ≠ 0 | W | Selisih (pp) [CI 95%] | p | p Holm | Sig (Holm) | r_rb |")
    add("|---|---|---|---|---|---|---|---|---|")
    prim = {}
    for ca, cb in COMPARISONS:
        if ca in m and cb in m:
            t = paired_test(m, ca, cb, PRIMARY)
            if t:
                prim[(ca, cb)] = t
    padj = holm({k: v["p"] for k, v in prim.items()})
    for (ca, cb), t in prim.items():
        add(f"| {ca} vs {cb} | {t['n']} | {t['n_nonzero']} | {t['W']:.1f} | {t['diff']*100:+.1f} [{t['ci'][0]*100:+.1f}, {t['ci'][1]*100:+.1f}] "
            f"| {t['p']:.5f} | {padj[(ca, cb)]:.4f} | {'ya' if padj[(ca, cb)] < ALPHA else 'tidak'} "
            f"| {t['rrb']:+.2f} ({magnitude(t['rrb'])}) |")
    add("")

    # ---- Tabel B2: sekunder ----
    add("## Tabel B2. Metrik sekunder (eksploratif; Holm per metrik atas perbandingan yang dapat diuji)\n")
    add("| Metrik | Perbandingan | n | Selisih [CI 95%] | p | p Holm | r_rb |")
    add("|---|---|---|---|---|---|---|")
    for key, label, unit in METRICS:
        if key == PRIMARY:
            continue
        tests = {}
        for ca, cb in COMPARISONS:
            if ca in m and cb in m:
                t = paired_test(m, ca, cb, key)
                if t:
                    tests[(ca, cb)] = t
        if not tests:
            continue
        adj = holm({k: v["p"] for k, v in tests.items()})
        for (ca, cb), t in tests.items():
            sc = 100 if unit == "%" else 1
            add(f"| {label} | {ca} vs {cb} | {t['n']} | {t['diff']*sc:+.2f} [{t['ci'][0]*sc:+.2f}, {t['ci'][1]*sc:+.2f}] "
                f"| {t['p']:.4f} | {adj[(ca, cb)]:.4f} | {t['rrb']:+.2f} |")
    add("")

    # ---- Tabel C: efektif ----
    add("## Tabel C. Fault detection & locator robustness EFEKTIF (menggantikan Tabel 4 naskah)\n")
    add("Skor skrip = 0 bila gagal baseline. Penyebut = skrip 5 seed yang diperturbasi. "
        "Angka hanya diberikan untuk kondisi dengan cakupan perturbasi lengkap.\n")
    faults, muts = load("05-execution-faults.json"), load("05-execution-mutations.json")
    f_def, u_def = perturbation_ids("faults.json") or [], perturbation_ids("mutations.json") or []
    f_run = sorted({r["perturbation_id"] for r in faults["rows"]}) if faults else []
    u_run = sorted({r["perturbation_id"] for r in muts["rows"]}) if muts else []
    n_f, n_u = len(f_run) or None, len(u_run) or None
    add(f"Cacat yang dieksekusi: {len(f_run)} dari {len(f_def)} yang didefinisikan di perturbations/faults.json "
        f"({', '.join(f_run)}). Mutasi yang dieksekusi: {len(u_run)} dari {len(u_def)} ({', '.join(u_run)}). "
        "Naskah wajib menyebut subset ini dan alasan pemilihannya.\n")
    fe = effective(base, faults["rows"], "fault", n_f) if faults and base else {}
    ue = effective(base, muts["rows"], "mutation", n_u) if muts and base else {}
    add("| Kondisi | Skrip | Baseline pass | Robustness efektif [CI 95%] | (naskah 2 Nov) | "
        "Fault detect efektif [CI 95%] | (naskah 2 Nov) | Cakupan baris fault / mutasi |")
    add("|---|---|---|---|---|---|---|---|")
    for c in present:
        f, u = fe.get(c), ue.get(c)
        if not f and not u:
            continue
        x = f or u

        def cell(d):
            if not d:
                return "–"
            if "effective" not in d:
                return "_tidak sahih (cakupan tidak lengkap)_"
            return f"**{d['effective']*100:.1f}** [{d['ci'][0]*100:.1f}–{d['ci'][1]*100:.1f}]"

        cov = (f"{f['observed']}/{f['expected']}" if f else "–") + " ; " + \
              (f"{u['observed']}/{u['expected']}" if u else "–")
        add(f"| {c} | {x['n_scripts']} | {x['baseline_pass']*100:.1f}% | {cell(u)} | "
            f"{MANUSCRIPT_T4['robustness'].get(c, '–')} | {cell(f)} | {MANUSCRIPT_T4['fault'].get(c, '–')} | {cov} |")
    add("")
    if "P" in ue and "B0" in ue and "effective" in ue["P"] and "effective" in ue["B0"]:
        add(f"Rasio robustness efektif P/B0 = {ue['P']['effective']/ue['B0']['effective']:.2f}x.\n")

    # ---- Tabel C2: uji berpasangan metrik efektif ----
    def eff_test(d, ca, cb):
        from scipy.stats import wilcoxon
        if "scen" not in d.get(ca, {}) or "scen" not in d.get(cb, {}):
            return None
        common = sorted(set(d[ca]["scen"]) & set(d[cb]["scen"]))
        diffs = [d[cb]["scen"][x] - d[ca]["scen"][x] for x in common]
        if len([x for x in diffs if x != 0]) < 5:
            return None
        lo, hi = boot_mean_ci(diffs)
        return {"n": len(common), "diff": st.mean(diffs), "ci": (lo, hi),
                "p": float(wilcoxon(diffs, alternative="two-sided").pvalue), "rrb": paired_rank_biserial(diffs)}

    add("## Tabel C2. Uji berpasangan metrik efektif (per skenario; Holm atas 3 perbandingan per metrik)\n")
    add("| Metrik | Perbandingan | n | Selisih (pp) [CI 95%] | p | p Holm | r_rb | Bersyarat (kond. pertama → kedua) |")
    add("|---|---|---|---|---|---|---|---|")
    for lab, d in (("Robustness efektif", ue), ("Fault detection efektif", fe)):
        tests = {}
        for ca in ("B0", "B1", "B2"):
            t = eff_test(d, ca, "P")
            if t:
                tests[(ca, "P")] = t
        adj = holm({k: v["p"] for k, v in tests.items()})
        for (ca, cb), t in tests.items():
            cond = f"{d[ca]['conditional']*100:.1f}% → {d[cb]['conditional']*100:.1f}%"
            add(f"| {lab} | {ca} vs {cb} | {t['n']} | {t['diff']*100:+.1f} [{t['ci'][0]*100:+.1f}, {t['ci'][1]*100:+.1f}] "
                f"| {t['p']:.4f} | {adj[(ca, cb)]:.4f} | {t['rrb']:+.2f} | {cond} |")
    add("")

    # ---- Tabel D: locator & getByTestId ----
    if static:
        add("## Tabel D. Jumlah locator dan getByTestId per kondisi (5 seed)\n")
        add("Selector Validity B0/B1 dihitung dari jumlah locator yang jauh lebih kecil — tafsirkan hati-hati. "
            "Catatan: SYSTEM_PROMPT di 03-generate.py menempatkan getByTestId sebagai preferensi pertama, "
            "sehingga getByTestId pada B0 tidak dapat dipisahkan dari efek instruksi prompt.\n")
        add("| Kondisi | Skrip (5 seed) | Locator | getByTestId | % | Skrip (semua run, + greedy) | Locator | getByTestId | % |")
        add("|---|---|---|---|---|---|---|---|---|")

        def cnt(rows):
            tot = sum(r.get("totalSelectors") or 0 for r in rows)
            tid = sum((r.get("selectors") or {}).get("getByTestId", 0) for r in rows)
            return f"{len(rows)} | {tot} | {tid} | " + (f"{tid/tot*100:.1f}%" if tot else "–")

        for c in present + [x for x in EXTRA_CONDITIONS if x in m]:
            allr = [r for r in static["rows"] if r["condition"] == c]
            add(f"| {c} | {cnt([r for r in allr if is_seed(r['run'])])} | {cnt(allr)} |")
        add("")

    # ---- Tabel N: uji prompt netral (B0 prompt asli vs B0 prompt netral, hari & skenario sama) ----
    extra = [c for c in EXTRA_CONDITIONS if c in m]
    if extra:
        add("## Tabel N. Uji prompt netral pada B0 (menguji klaim 'halusinasi getByTestId')\n")
        add("Kondisi `B0__rerun` = prompt asli, `B0__neutral` = tanpa urutan preferensi locator. Keduanya "
            "dihasilkan dan dieksekusi dengan skenario (`scenarios.json` saat ini) dan tanggal yang sama, "
            "sehingga selisihnya hanya berasal dari prompt. Baris `B0` (2 Nov, 28 skenario) hanya rujukan, "
            "**tidak untuk dibandingkan langsung**: skenarionya berbeda dan staging dapat berubah.\n")
        cols = (["B0"] if "B0" in m else []) + extra
        add("| Metrik | " + " | ".join(cols) + " |")
        add("|" + "---|" * (len(cols) + 1))
        for key, label, unit in METRICS:
            if key in ("flaky", "generation_latency_s", "context_chars"):
                continue
            cells = [(lambda t: fmt(t[0], unit, t[1]))(grand(m, c, key)) for c in cols]
            if any(x != "–" for x in cells):
                add(f"| {label}{' (%)' if unit == '%' else ''} | " + " | ".join(cells) + " |")
        n_sc = {c: len(scenario_means(m, c, "syntax_valid")) for c in cols}
        add("| n skenario | " + " | ".join(str(n_sc[c]) for c in cols) + " |")
        add("")
        if "B0__rerun" in m and "B0__neutral" in m:
            add("Uji berpasangan per skenario (`B0__rerun` → `B0__neutral`), Wilcoxon dua sisi. "
                "Outcome primer: Pass Rate; lainnya eksploratif (Holm atas metrik sekunder).\n")
            add("| Metrik | n | Selisih [CI 95%] | p | p Holm (sekunder) | r_rb |")
            add("|---|---|---|---|---|---|")
            res = {}
            for key, label, unit in METRICS:
                if key in ("flaky", "generation_latency_s", "context_chars"):
                    continue
                t = paired_test(m, "B0__rerun", "B0__neutral", key)
                if t:
                    res[key] = t
            sec = holm({k: v["p"] for k, v in res.items() if k != PRIMARY})
            for key, t in res.items():
                sc = 100 if UNIT[key] == "%" else 1
                ph = "primer" if key == PRIMARY else f"{sec[key]:.4f}"
                add(f"| {LABEL[key]} | {t['n']} | {t['diff']*sc:+.2f} [{t['ci'][0]*sc:+.2f}, {t['ci'][1]*sc:+.2f}] "
                    f"| {t['p']:.4f} | {ph} | {t['rrb']:+.2f} |")
            add("")
        if faults and base:
            fe_x = effective(base, [r for r in faults["rows"] if r["condition"] in extra], "fault",
                             len({r["perturbation_id"] for r in faults["rows"] if r["condition"] in extra}) or None, extra)
            ue_x = effective(base, [r for r in muts["rows"] if r["condition"] in extra], "mutation",
                             len({r["perturbation_id"] for r in muts["rows"] if r["condition"] in extra}) or None, extra) if muts else {}
            if any("effective" in v for v in list(fe_x.values()) + list(ue_x.values())):
                add("| Kondisi | Baseline pass | Robustness efektif [CI 95%] | Fault detect efektif [CI 95%] |")
                add("|---|---|---|---|")
                for c in extra:
                    f, u = fe_x.get(c), ue_x.get(c)
                    cc = lambda d: (f"{d['effective']*100:.1f} [{d['ci'][0]*100:.1f}–{d['ci'][1]*100:.1f}]"
                                    if d and "effective" in d else "–")
                    add(f"| {c} | {((f or u or {}).get('baseline_pass', 0))*100:.1f}% | {cc(u)} | {cc(f)} |")
                add("")

    # ---- Tabel K: audit konteks (klaim 'context competition') ----
    audit = load_jsonl("03-retrieval-audit.jsonl")
    if audit:
        add("## Tabel K. Audit ukuran konteks dan chunk per sumber (retrieval-only)\n")
        add("Menguji dua prasyarat klaim *context competition*: (1) budget karakter benar-benar mengikat; "
            "(2) menghapus satu sumber menggeser jumlah chunk sumber lain.\n")
        by = defaultdict(list)
        for a in audit:
            by[a["condition"]].append(a)
        srcs = sorted({k for a in audit for k in a["per_source_retrieved"]})
        add("| Kondisi | n skenario | Budget | Konteks mean / maks | % skenario ada chunk terbuang | "
            + " | ".join(f"chunk {x} (mean)" for x in srcs) + " | Chunk terpanjang (char) |")
        add("|---|---|---|---|---|" + "---|" * len(srcs) + "---|")
        for c, rows_ in sorted(by.items()):
            chars = [r["context_chars"] for r in rows_]
            drop = sum(1 for r in rows_ if r["chunks_dropped_by_budget"] > 0) / len(rows_)
            per = [st.mean(r["per_source_retrieved"].get(x, 0) for r in rows_) for x in srcs]
            mx = max((max(r["chunk_chars"]) for r in rows_ if r["chunk_chars"]), default=0)
            add(f"| {c} | {len(rows_)} | {rows_[0]['context_budget']} | {st.mean(chars):.0f} / {max(chars)} | "
                f"{drop*100:.0f}% | " + " | ".join(f"{x:.2f}" for x in per) + f" | {mx} |")
        add("")
        binding = any(r["chunks_dropped_by_budget"] > 0 for r in audit)
        add(f"**Budget mengikat?** {'YA, ada chunk terbuang pada sebagian skenario.' if binding else 'TIDAK: tidak ada chunk yang terbuang pada kondisi mana pun.'}\n")

    # ---- Tabel G: greedy terpisah ----
    gp = [c for c in CONDITIONS if c in g]
    if gp:
        add("## Tabel G. Run referensi greedy (temperature 0, 1 run) — dilaporkan terpisah\n")
        add("| Metrik | " + " | ".join(gp) + " |")
        add("|" + "---|" * (len(gp) + 1))
        for key in ["syntax_valid", "executable", "passed", "selector_validity"]:
            add(f"| {LABEL[key]} (%) | " + " | ".join(fmt(grand(g, c, key)[0], '%') for c in gp) + " |")
        add("")

    # ---- Tabel R: relevansi cacat (opsional) ----
    if args.faults_relevance and faults and base:
        rel = json.loads(Path(args.faults_relevance).read_text())
        add("## Tabel R. Fault detection dengan matriks relevansi cacat-skenario\n")
        bp = {(r["condition"], r["run"], r["scenario_id"]) for r in base["rows"]
              if r["final_outcome"] == "passed" and not r.get("perturbation_id") and is_seed(r["run"])}
        det = defaultdict(lambda: [0, 0])
        for r in faults["rows"]:
            if r.get("perturbation_id") not in rel.get(r["scenario_id"], []):
                continue
            if (r["condition"], r["run"], r["scenario_id"]) not in bp:
                continue
            det[r["condition"]][1] += 1
            det[r["condition"]][0] += 1 if r["final_outcome"] != "passed" else 0
        add("| Kondisi | Terdeteksi | Relevan diuji | Fault Detection (relevan, bersyarat) |")
        add("|---|---|---|---|")
        for c in present:
            h, t = det.get(c, [0, 0])
            add(f"| {c} | {h} | {t} | {h/t*100:.1f}% |" if t else f"| {c} | 0 | 0 | – |")
        add("")

    out_path = ROOT / args.out
    out_path.write_text("\n".join(L) + "\n", encoding="utf-8")
    print("\n".join(L))
    print(f"\n---\nTersimpan: {out_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
