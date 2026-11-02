#!/usr/bin/env python3
"""
07-repair.py

Loop validasi tertutup. Skrip yang gagal dikembalikan ke model bersama pesan galat
eksekusi dan konteks hasil retrieval, lalu diminta diperbaiki. Maksimum dua iterasi.

Inilah yang memberi isi pada kata "Validation" di judul penelitian: sistem tidak hanya
menghasilkan lalu menjalankan, tetapi memakai hasil eksekusi sebagai umpan balik.

Prasyarat:
  results/05-execution-baseline.json sudah ada (jalankan 05-run-suite.js lebih dulu)

Keluaran:
  generated/<kondisi>_repaired/<run>/<scenario_id>.spec.js
  results/07-repair-log.jsonl

Pemakaian:
  python scripts/07-repair.py --condition P
  python scripts/07-repair.py --condition P --run seed11
"""

import argparse
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

CONFIG = json.loads((ROOT / "config/experiment.config.json").read_text())
GEN = CONFIG["generation"]
RET = CONFIG["retrieval"]
MAX_ITER = CONFIG["execution"]["repairMaxIterations"]

import importlib.util

_spec = importlib.util.spec_from_file_location("gen03", ROOT / "scripts/03-generate.py")
gen03 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(gen03)

REPAIR_SYSTEM = gen03.SYSTEM_PROMPT + """

You are now repairing a test that failed. Rules for repair:
- Keep the same test intent. Do not weaken assertions to force a pass.
- Do not delete a failing assertion unless the context proves the expectation itself was wrong.
- If a locator did not resolve, replace it with one that appears verbatim in the provided context.
- Emit the complete corrected file, not a diff."""


def build_repair_prompt(scenario, context, base_url, previous_code, errors, outcome):
    parts = [
        f"Base URL: {base_url}",
        "",
        "CONTEXT FROM THE PROJECT KNOWLEDGE BASE:",
        "",
        context or "(no context available)",
        "",
        "SCENARIO:",
        f"  {scenario['title']}",
        f"  {scenario['description']}",
        "Expected behaviour to assert:",
    ]
    parts += [f"  - {e}" for e in scenario.get("expected", [])]
    parts += [
        "",
        "THE PREVIOUS TEST FILE:",
        "",
        previous_code,
        "",
        f"EXECUTION OUTCOME: {outcome}",
        "ERROR OUTPUT:",
        "",
        "\n".join(errors[:3]) if errors else "(no error message captured)",
        "",
        "Emit the corrected complete test file.",
    ]
    return "\n".join(parts)


def run_single_spec(spec_path: Path):
    """Jalankan satu skrip lewat 05-run-suite.js dan kembalikan hasilnya."""
    tmp_dir = spec_path.parent
    cmd = ["node", str(ROOT / "scripts/05-run-suite.js"), "--dir", str(tmp_dir),
           "--tag", "repair-probe"]
    subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=600)
    res_file = ROOT / "results/05-execution-repair-probe.json"
    if not res_file.exists():
        return "runtime_error", []
    rows = json.loads(res_file.read_text())["rows"]
    match = [r for r in rows if r["scenario_id"] == spec_path.stem.replace(".spec", "")]
    if not match:
        return "runtime_error", []
    return match[0]["final_outcome"], match[0].get("first_errors", [])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--condition", required=True)
    ap.add_argument("--run", default=None, help="mis. seed11; default semua run kondisi tersebut")
    ap.add_argument("--baseline", default="results/05-execution-baseline.json")
    args = ap.parse_args()

    baseline_path = ROOT / args.baseline
    if not baseline_path.exists():
        sys.exit(f"Belum ada hasil eksekusi di {baseline_path}. Jalankan 05-run-suite.js lebih dulu.")

    rows = json.loads(baseline_path.read_text())["rows"]
    failing = [
        r for r in rows
        if r["condition"] == args.condition
        and (args.run is None or r["run"] == args.run)
        and r["final_outcome"] not in ("passed",)
        and r["perturbation_id"] is None
    ]
    if not failing:
        print("Tidak ada skrip gagal untuk diperbaiki pada kondisi ini.")
        return

    print(f"{len(failing)} skrip gagal akan dicoba diperbaiki (maks {MAX_ITER} iterasi per skrip)\n")

    scenarios = {s["id"]: s for s in json.loads((ROOT / "scenarios/scenarios.json").read_text())["scenarios"]}
    cond = CONFIG["conditions"][args.condition]
    base_url = CONFIG["sut"]["baseUrl"]

    index = chunks = model = None
    if cond["retrieval"]:
        index, chunks, model = gen03.load_index()

    log = (ROOT / "results/07-repair-log.jsonl").open("a", encoding="utf-8")
    repaired_count = 0

    for r in failing:
        sc = scenarios.get(r["scenario_id"])
        if not sc:
            continue

        src_file = ROOT / "generated" / r["condition"] / r["run"] / f"{r['scenario_id']}.spec.js"
        out_dir = ROOT / "generated" / f"{r['condition']}_repaired" / r["run"]
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / f"{r['scenario_id']}.spec.js"

        code = src_file.read_text(encoding="utf-8")
        outcome, errors = r["final_outcome"], r.get("first_errors", [])

        context = ""
        if cond["retrieval"]:
            query = f"{sc['title']}. {sc['description']} {' '.join(sc.get('expected', []))} {' '.join(errors[:1])}"
            retrieved = gen03.retrieve(query, index, chunks, model, cond["sources"],
                                       RET["topKPerSource"], RET["topKSingleSource"])
            context, _ = gen03.build_context(retrieved, RET["contextCharBudget"])

        history = [{"iteration": 0, "outcome": outcome}]
        success = False

        for it in range(1, MAX_ITER + 1):
            prompt = build_repair_prompt(sc, context, base_url, code, errors, outcome)
            saved_system = gen03.SYSTEM_PROMPT
            gen03.SYSTEM_PROMPT = REPAIR_SYSTEM
            try:
                raw, latency, _ = gen03.call_ollama(prompt, GEN["temperature"], GEN["seeds"][0])
            finally:
                gen03.SYSTEM_PROMPT = saved_system

            code = gen03.strip_fences(raw)
            out_file.write_text(code, encoding="utf-8")

            outcome, errors = run_single_spec(out_file)
            history.append({"iteration": it, "outcome": outcome, "latency_s": round(latency, 2)})
            print(f"  {r['scenario_id']} iterasi {it}: {outcome}")

            if outcome == "passed":
                success = True
                repaired_count += 1
                break

        log.write(json.dumps({
            "condition": r["condition"],
            "run": r["run"],
            "scenario_id": r["scenario_id"],
            "initial_outcome": r["final_outcome"],
            "final_outcome": outcome,
            "repaired": success,
            "iterations_used": len(history) - 1,
            "history": history,
        }, ensure_ascii=False) + "\n")
        log.flush()

    log.close()
    rate = repaired_count / len(failing) * 100
    print(f"\nRepair Success Rate: {repaired_count}/{len(failing)} = {rate:.1f}%")
    print("Catatan lengkap: results/07-repair-log.jsonl")


if __name__ == "__main__":
    main()
