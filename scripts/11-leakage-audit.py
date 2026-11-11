#!/usr/bin/env python3
"""
11-leakage-audit.py — audit tumpang-tindih skrip historis dengan skenario uji.

Langkah 1 (otomatis): untuk tiap skenario, cari skrip historis yang paling mirip
  (TF-IDF cosine atas judul+deskripsi+expected vs isi skrip) dan tulis
  results/leakage-candidates.csv dengan kelas USULAN:
      exact   >= 0.50   (kemungkinan alur sama)
      partial >= 0.25   (sebagian langkah/assertion mirip)
      none    <  0.25
  Ambang ini hanya penyaring awal. Kelas akhir HARUS diputuskan manusia.

Langkah 2 (manual): salin berkas itu menjadi results/leakage-confirmed.csv, baca skrip
  historis yang ditunjuk, lalu isi kolom confirmed_class (exact / partial / none).

Langkah 3 (otomatis): bila leakage-confirmed.csv ada, skrip ini melaporkan pass rate
  P dan P_no_hist per kelas, sehingga efek skrip historis pada skenario 'none'
  (benar-benar belum pernah terlihat) dapat dilaporkan terpisah.

Juga mencetak statistik knowledge base (jumlah berkas per sumber, chunk per sumber
bila kb/index/manifest.json ada) untuk diisi ke naskah.

Pemakaian:  python scripts/11-leakage-audit.py
"""
import csv
import json
import math
import re
import statistics as st
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / "results"
HIST = ROOT / "kb/historical-tests"


def tokens(text):
    return [t for t in re.findall(r"[a-zA-Z_À-ÿ]{3,}", text.lower())
            if t not in {"await", "page", "test", "expect", "const", "require", "async", "playwright"}]


def tfidf(docs):
    df = Counter(t for d in docs for t in set(d))
    n = len(docs)
    vecs = []
    for d in docs:
        tf = Counter(d)
        v = {t: (1 + math.log(c)) * math.log((1 + n) / (1 + df[t]) + 1) for t, c in tf.items()}
        norm = math.sqrt(sum(x * x for x in v.values())) or 1.0
        vecs.append({t: x / norm for t, x in v.items()})
    return vecs


def cos(a, b):
    if len(a) > len(b):
        a, b = b, a
    return sum(x * b.get(t, 0.0) for t, x in a.items())


def main():
    scen = json.loads((ROOT / "scenarios/scenarios.json").read_text())["scenarios"]
    base = json.loads((RES / "05-execution-baseline.json").read_text())["rows"]
    run_ids = {r["scenario_id"] for r in base}
    missing = sorted(run_ids - {s["id"] for s in scen})
    hist = sorted(p for p in HIST.glob("*") if p.suffix in (".js", ".ts", ".md") and not p.name.startswith("CONTOH"))

    print("== Statistik knowledge base ==")
    for name, d, pat in (("requirement", ROOT / "kb/requirements", "*.md"),
                         ("page structure (pruned)", ROOT / "kb/dom-snapshots/pruned", "*.md"),
                         ("historical scripts", HIST, "*")):
        files = [p for p in d.glob(pat) if not p.name.startswith("CONTOH")] if d.exists() else []
        print(f"  {name:<26} {len(files)} berkas")
    man = ROOT / "kb/index/manifest.json"
    if man.exists():
        print("  chunk per sumber:", json.loads(man.read_text()).get("chunks_per_source"))
    else:
        print("  kb/index/manifest.json tidak ada")

    if missing:
        print(f"\nBERHENTI: {len(missing)} skenario di results/ tidak ada di scenarios.json "
              f"({', '.join(missing[:6])} ...). Taruh dulu berkas 28 skenario yang asli.")
        return
    if not hist:
        print("\nBERHENTI: kb/historical-tests/ hanya berisi berkas CONTOH. Taruh dulu skrip historis asli.")
        return

    scen = [s for s in scen if s["id"] in run_ids]
    s_tok = [tokens(f"{s['title']} {s['description']} {' '.join(s.get('expected', []))}") for s in scen]
    h_tok = [tokens(p.read_text(encoding="utf-8", errors="ignore")) for p in hist]
    vecs = tfidf(s_tok + h_tok)
    sv, hv = vecs[:len(scen)], vecs[len(scen):]

    rows = []
    for s, v in zip(scen, sv):
        sims = sorted(((cos(v, h), p.name) for h, p in zip(hv, hist)), reverse=True)
        best, name = sims[0]
        cls = "exact" if best >= 0.50 else "partial" if best >= 0.25 else "none"
        rows.append({"scenario_id": s["id"], "title": s["title"], "best_historical": name,
                     "similarity": f"{best:.3f}", "second": sims[1][1] if len(sims) > 1 else "",
                     "suggested_class": cls, "confirmed_class": ""})
    out = RES / "leakage-candidates.csv"
    with out.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)
    print(f"\n{len(hist)} skrip historis, {len(scen)} skenario. Usulan kelas:",
          dict(Counter(r["suggested_class"] for r in rows)))
    print(f"Tersimpan: {out.relative_to(ROOT)}")

    conf = RES / "leakage-confirmed.csv"
    if not conf.exists():
        print("\nLangkah berikut: salin menjadi results/leakage-confirmed.csv, periksa tiap baris, "
              "isi confirmed_class, lalu jalankan skrip ini lagi.")
        return
    cls = {r["scenario_id"]: (r["confirmed_class"] or "").strip().lower()
           for r in csv.DictReader(conf.open(encoding="utf-8"))}
    if any(c not in ("exact", "partial", "none") for c in cls.values()):
        print("\nconfirmed_class belum lengkap (isi exact / partial / none di semua baris).")
        return
    rate = defaultdict(lambda: defaultdict(list))
    for r in base:
        if r.get("perturbation_id") or not str(r["run"]).startswith("seed"):
            continue
        if r["condition"] in ("B0", "B2", "P", "P_no_hist"):
            rate[r["condition"]][r["scenario_id"]].append(r["final_outcome"] == "passed")
    L = ["# Audit tumpang-tindih skrip historis (kelas dikonfirmasi manual)\n",
         "| Kelas | n skenario | B0 (%) | B2 (%) | P (%) | P tanpa historis (%) | P − P tanpa historis (pp) |",
         "|---|---|---|---|---|---|---|"]
    for k in ("exact", "partial", "none"):
        ids = [i for i, c in cls.items() if c == k]
        if not ids:
            L.append(f"| {k} | 0 | – | – | – | – | – |")
            continue
        m = {c: st.mean(st.mean(rate[c][i]) for i in ids) * 100 for c in ("B0", "B2", "P", "P_no_hist")}
        L.append(f"| {k} | {len(ids)} | {m['B0']:.1f} | {m['B2']:.1f} | {m['P']:.1f} | {m['P_no_hist']:.1f} | "
                 f"{m['P'] - m['P_no_hist']:+.1f} |")
    L.append("\nJumlah skenario per kelas kecil; laporkan sebagai deskriptif, tanpa uji signifikansi per kelas.")
    # Langkah 4: bukti langsung penyalinan. Kemiripan teks (difflib ratio, spasi & komentar
    # dinormalkan) antara tiap skrip hasil generasi dan skrip historis yang paling mirip.
    import difflib
    norm = lambda x: re.sub(r"\s+", " ", re.sub(r"//.*", "", x)).strip()
    hsrc = [norm(p.read_text(encoding="utf-8", errors="ignore")) for p in hist]
    passed = {(r["condition"], r["run"], r["scenario_id"]): r["final_outcome"] == "passed"
              for r in base if not r.get("perturbation_id")}
    gen = ROOT / "generated"
    if gen.exists():
        L += ["\n## Kemiripan skrip hasil generasi dengan skrip historis (5 seed)\n",
              "Near-copy = kemiripan >= 0,80 dengan salah satu skrip historis.\n",
              "| Kondisi | Skrip | Median kemiripan | Near-copy | Near-copy pada kelas exact / partial / none | "
              "Lolos: near-copy | Lolos: lainnya |", "|---|---|---|---|---|---|---|"]
        sens = []
        for c in ("B0", "B2", "P", "P_no_hist", "P_no_req", "P_no_dom"):
            sims, byc, pc = [], defaultdict(list), {True: [0, 0], False: [0, 0]}
            for f in sorted((gen / c).glob("seed*/*.spec.js")):
                sid = f.name[:-8]
                if sid not in cls:
                    continue
                g = norm(f.read_text(encoding="utf-8", errors="ignore"))
                m = max(difflib.SequenceMatcher(None, g, h, autojunk=False).ratio() for h in hsrc)
                sims.append(m)
                byc[cls[sid]].append(m >= 0.8)
                pc[m >= 0.8][0] += passed.get((c, f.parent.name, sid), False)
                pc[m >= 0.8][1] += 1
            if not sims:
                continue
            sens.append(f"| {c} | " + " | ".join(f"{sum(x >= t for x in sims)}" for t in (0.7, 0.8, 0.9)) + " |")
            share = lambda k: f"{100*sum(byc[k])/len(byc[k]):.0f}%" if byc[k] else "–"
            fr = lambda x: f"{x[0]}/{x[1]}" + (f" ({100*x[0]/x[1]:.0f}%)" if x[1] else "")
            L.append(f"| {c} | {len(sims)} | {st.median(sims):.2f} | {sum(x >= 0.8 for x in sims)} "
                     f"({100*sum(x >= 0.8 for x in sims)/len(sims):.1f}%) | {share('exact')} / {share('partial')} / {share('none')} "
                     f"| {fr(pc[True])} | {fr(pc[False])} |")
    if gen.exists():
        L += ["\n## Sensitivitas ambang near-copy (jumlah skrip dari 140)\n",
              "| Kondisi | >= 0,70 | >= 0,80 | >= 0,90 |", "|---|---|---|---|"] + sens
    (RES / "leakage-audit.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    print("\n" + "\n".join(L))


if __name__ == "__main__":
    main()
