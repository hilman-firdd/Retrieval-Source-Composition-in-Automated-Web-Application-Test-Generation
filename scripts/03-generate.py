#!/usr/bin/env python3
"""
03-generate.py

Menghasilkan skrip Playwright untuk setiap skenario, di bawah setiap kondisi eksperimen,
diulang untuk setiap seed. Ini adalah inti perbandingan B0 / B1 / B2 / P beserta ablasinya.

Keluaran:
  generated/<kondisi>/seed<k>/<scenario_id>.spec.js
  results/03-generation-log.jsonl   satu baris per pemanggilan model (latency, konteks, retrieval)

Pemakaian:
  python scripts/03-generate.py                          # semua kondisi utama
  python scripts/03-generate.py --conditions B0 P        # subset
  python scripts/03-generate.py --ablations              # sertakan kondisi ablasi
  python scripts/03-generate.py --greedy                 # run referensi deterministik (temperature 0)
"""

import argparse
import json
import re
import sys
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
CONFIG = json.loads((ROOT / "config/experiment.config.json").read_text())
GEN = CONFIG["generation"]
RET = CONFIG["retrieval"]

SYSTEM_PROMPT = """You are a senior QA automation engineer. You write Playwright end-to-end tests in JavaScript.

Output contract — follow exactly:
- Emit ONE complete test file and nothing else. No markdown fences, no prose, no explanation.
- Use CommonJS: const { test, expect } = require('@playwright/test');
- Wrap tests in a single test.describe block.
- Prefer stable locators in this order: getByTestId, locator('#id'), getByLabel, getByPlaceholder,
  getByRole with an accessible name. Use CSS class selectors or XPath only as a last resort.
- Never use page.waitForTimeout. Rely on Playwright auto-waiting and web-first assertions
  such as await expect(locator).toBeVisible().
- Every test must contain at least one meaningful assertion about application state.
- Use only locators and routes that appear in the provided context. If the context does not
  contain an element you need, choose the closest element that IS in the context.
- Do not invent data-testid attributes that are not present in the context."""


def load_index():
    import faiss
    from sentence_transformers import SentenceTransformer

    idx_dir = ROOT / "kb/index"
    if not (idx_dir / "faiss.index").exists():
        sys.exit("Indeks belum ada. Jalankan scripts/02-build-index.py lebih dulu.")
    index = faiss.read_index(str(idx_dir / "faiss.index"))
    chunks = [json.loads(l) for l in (idx_dir / "chunks.jsonl").read_text(encoding="utf-8").splitlines()]
    model = SentenceTransformer(CONFIG["embedding"]["model"])
    return index, chunks, model


def retrieve(query, index, chunks, model, sources, per_source_k, single_k):
    """Retrieval berimbang per source_type agar setiap modalitas benar-benar terwakili.

    Retrieval global akan didominasi chunk DOM (jumlahnya paling banyak), sehingga
    ablasi tidak akan mengukur apa pun. Karena itu top-k diambil per source_type.
    """
    import numpy as np

    q = model.encode([query], normalize_embeddings=True, convert_to_numpy=True).astype("float32")
    # ambil kandidat luas sekali jalan, lalu saring per source_type
    n_probe = min(len(chunks), 200)
    scores, ids = index.search(q, n_probe)

    picked, per_type_count = [], {s: 0 for s in sources}
    for score, cid in zip(scores[0], ids[0]):
        if cid < 0 or score < RET["minScore"]:
            continue
        rec = chunks[cid]
        st = rec["source_type"]
        if st not in sources:
            continue
        limit = per_source_k.get(st, single_k) if len(sources) > 1 else single_k
        if per_type_count[st] >= limit:
            continue
        per_type_count[st] += 1
        picked.append({"score": float(score), **rec})
    return picked


def build_context(retrieved, budget):
    blocks, used = [], 0
    for r in retrieved:
        block = f"--- [{r['source_type']}] {r['source_file']} (similarity={r['score']:.3f}) ---\n{r['text']}\n"
        if used + len(block) > budget:
            continue
        blocks.append(block)
        used += len(block)
    return "\n".join(blocks), used


def raw_dom_context(scenario, budget):
    """Kondisi B1: HTML mentah dipotong keras pada batas budget, tanpa retrieval."""
    route_id = scenario.get("start_route", "home")
    f = ROOT / f"kb/dom-snapshots/raw/{route_id}.html"
    if not f.exists():
        return "", 0
    html = f.read_text(encoding="utf-8", errors="ignore")
    truncated = html[:budget]
    return f"--- [raw HTML] {route_id}.html (dipotong pada {budget} karakter) ---\n{truncated}\n", len(truncated)


def build_prompt(scenario, context, base_url):
    parts = [f"Base URL of the application under test: {base_url}", ""]
    if context:
        parts += ["CONTEXT RETRIEVED FROM THE PROJECT KNOWLEDGE BASE:", "", context, ""]
    else:
        parts += ["No additional context is available. Rely on general web testing knowledge.", ""]
    parts += [
        "TEST SCENARIO TO IMPLEMENT",
        f"  id:          {scenario['id']}",
        f"  title:       {scenario['title']}",
        f"  category:    {scenario.get('category', '-')}",
        f"  start route: {scenario.get('start_path', '/')}",
        f"  description: {scenario['description']}",
        "",
        "Expected behaviour to assert:",
    ]
    for e in scenario.get("expected", []):
        parts.append(f"  - {e}")
    parts += ["", "Now emit the complete Playwright test file."]
    return "\n".join(parts)


def strip_fences(text):
    """Model kerap tetap membungkus keluaran dengan pagar markdown meski dilarang."""
    text = text.strip()
    m = re.search(r"```(?:javascript|js)?\s*\n(.*?)```", text, re.S)
    if m:
        text = m.group(1)
    text = re.sub(r"^```(?:javascript|js)?\s*", "", text)
    text = re.sub(r"```\s*$", "", text)
    # buang prosa sebelum baris require/import pertama
    lines = text.split("\n")
    for i, ln in enumerate(lines):
        if ln.strip().startswith(("const ", "import ", "// ", "/*")):
            return "\n".join(lines[i:]).strip() + "\n"
    return text.strip() + "\n"


def call_ollama(prompt, temperature, seed):
    payload = {
        "model": GEN["model"],
        "prompt": prompt,
        "system": SYSTEM_PROMPT,
        "stream": False,
        "options": {
            "temperature": temperature,
            "top_p": GEN["topP"],
            "seed": seed,
            "num_ctx": GEN["numCtx"],
            "num_predict": GEN["numPredict"],
        },
    }
    t0 = time.time()
    r = requests.post(GEN["endpoint"], json=payload, timeout=GEN["timeoutSeconds"])
    r.raise_for_status()
    data = r.json()
    return data.get("response", ""), time.time() - t0, data


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--conditions", nargs="*", default=None)
    ap.add_argument("--ablations", action="store_true")
    ap.add_argument("--greedy", action="store_true", help="run referensi deterministik temperature=0")
    ap.add_argument("--limit", type=int, default=None, help="batasi jumlah skenario (untuk uji coba)")
    args = ap.parse_args()

    scenarios = json.loads((ROOT / "scenarios/scenarios.json").read_text())["scenarios"]
    if args.limit:
        scenarios = scenarios[: args.limit]

    all_conditions = CONFIG["conditions"]
    if args.conditions:
        names = args.conditions
    else:
        names = [k for k, v in all_conditions.items() if args.ablations or not v.get("ablation")]

    needs_retrieval = any(all_conditions[n]["retrieval"] for n in names)
    index = chunks = model = None
    if needs_retrieval:
        print("Memuat indeks FAISS dan model embedding ...")
        index, chunks, model = load_index()

    seeds = [GEN["greedyReferenceRun"]["seed"]] if args.greedy else GEN["seeds"]
    temperature = GEN["greedyReferenceRun"]["temperature"] if args.greedy else GEN["temperature"]
    tag = "greedy" if args.greedy else "seed"

    base_url = CONFIG["sut"]["baseUrl"]
    log_path = ROOT / "results/03-generation-log.jsonl"
    log_path.parent.mkdir(parents=True, exist_ok=True)
    log = log_path.open("a", encoding="utf-8")

    total = len(names) * len(seeds) * len(scenarios)
    done = 0
    print(f"\nAkan menghasilkan {total} skrip "
          f"({len(names)} kondisi x {len(seeds)} seed x {len(scenarios)} skenario)\n")

    for cond_name in names:
        cond = all_conditions[cond_name]
        for seed in seeds:
            out_dir = ROOT / "generated" / cond_name / f"{tag}{seed}"
            out_dir.mkdir(parents=True, exist_ok=True)
            for sc in scenarios:
                done += 1
                head = f"[{done}/{total}] {cond_name}/{tag}{seed}/{sc['id']}"

                query = f"{sc['title']}. {sc['description']} {' '.join(sc.get('expected', []))}"
                retrieved, ctx_chars = [], 0
                if cond["retrieval"]:
                    retrieved = retrieve(query, index, chunks, model, cond["sources"],
                                         RET["topKPerSource"], RET["topKSingleSource"])
                    context, ctx_chars = build_context(retrieved, RET["contextCharBudget"])
                elif cond.get("rawDom"):
                    context, ctx_chars = raw_dom_context(sc, RET["contextCharBudget"])
                else:
                    context = ""

                prompt = build_prompt(sc, context, base_url)
                try:
                    raw, latency, meta = call_ollama(prompt, temperature, seed)
                    code = strip_fences(raw)
                    (out_dir / f"{sc['id']}.spec.js").write_text(code, encoding="utf-8")
                    status = "ok"
                    err = None
                except Exception as e:
                    latency, code, status, err, meta = 0.0, "", "error", str(e), {}
                    print(f"{head} GAGAL: {e}")

                log.write(json.dumps({
                    "condition": cond_name,
                    "seed": seed,
                    "temperature": temperature,
                    "scenario_id": sc["id"],
                    "status": status,
                    "error": err,
                    "generation_latency_s": round(latency, 3),
                    "prompt_chars": len(prompt),
                    "context_chars": ctx_chars,
                    "output_chars": len(code),
                    "retrieved": [
                        {"source_type": r["source_type"], "source_file": r["source_file"],
                         "score": round(r["score"], 4)} for r in retrieved
                    ],
                    "eval_count": meta.get("eval_count"),
                    "total_duration_ns": meta.get("total_duration"),
                }, ensure_ascii=False) + "\n")
                log.flush()

                if status == "ok":
                    print(f"{head} ok  {latency:6.1f}s  konteks={ctx_chars:>6} char  keluaran={len(code):>5} char")

    log.close()
    print(f"\nSelesai. Skrip ada di generated/, catatan lengkap di {log_path}")


if __name__ == "__main__":
    main()
