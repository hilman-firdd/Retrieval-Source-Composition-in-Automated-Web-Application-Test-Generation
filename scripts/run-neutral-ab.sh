#!/usr/bin/env bash
# run-neutral-ab.sh — uji A/B prompt netral pada B0 (audit 10 Nov 2026, Critical #4)
#
# Membandingkan, pada skenario & hari yang SAMA:
#   B0__rerun   = prompt asli  (getByTestId disebut sebagai preferensi pertama)
#   B0__neutral = prompt netral (tanpa urutan preferensi locator)
#
# Semua keluaran ditulis ke berkas BERAKHIRAN "-neutral-ab" sehingga hasil 2 Nov tidak tertimpa.
# 09-recompute.py menggabungkan berkas bersaudara itu otomatis (Tabel N).
#
# Pemakaian (dari root repo, venv aktif, `ollama serve` berjalan):
#   bash scripts/run-neutral-ab.sh check      # periksa prasyarat, tidak mengubah apa pun
#   bash scripts/run-neutral-ab.sh gen        # generasi B0__rerun (B0__neutral sudah ada)   ~1 jam
#   bash scripts/run-neutral-ab.sh static     # analisis statis kedua kondisi                ~1 menit
#   bash scripts/run-neutral-ab.sh baseline   # eksekusi baseline di staging                 ~1-2 jam
#   bash scripts/run-neutral-ab.sh probe      # Selector Validity di staging                 ~10 menit
#   bash scripts/run-neutral-ab.sh perturb    # cacat + mutasi (subset yang sama dgn 2 Nov)  ~4-8 jam
#   bash scripts/run-neutral-ab.sh report     # hitung ulang tabel
#
# Pakai staging SAJA, dengan izin tertulis pemilik. Jangan arahkan ke produksi.

set -euo pipefail
cd "$(dirname "$0")/.."

CONDS="B0__rerun,B0__neutral"
TAG="neutral-ab"
FAULT_IDS="F02,F04,F06,F08,F09,F13"   # subset yang dieksekusi pada 2 Nov (README §2 #8)
MUT_IDS="M01,M03,M05,M08"

backup_results() {
  local b="results-backup-$(date +%Y%m%d)"
  [ -d "$b" ] || { cp -r results "$b"; echo "Backup: $b"; }
}

case "${1:-}" in
  check)
    echo "== Prasyarat =="
    [ -d generated/B0__neutral ] && echo "ok   generated/B0__neutral ($(ls generated/B0__neutral/seed11 | wc -l | tr -d ' ') skrip/seed)" \
                                 || echo "GAGAL generated/B0__neutral tidak ada"
    [ -d generated/B0__rerun ]   && echo "ok   generated/B0__rerun"  || echo "belum generated/B0__rerun  -> jalankan: gen"
    python3 - <<'EOF'
import json
sc=json.load(open("scenarios/scenarios.json"))["scenarios"]
print(f"info scenarios.json = {len(sc)} skenario (hasil 2 Nov memakai 28 -> lihat README §2 #3)")
EOF
    curl -s -o /dev/null -w "ollama: HTTP %{http_code}\n" http://localhost:11434/api/tags || echo "GAGAL ollama tidak berjalan"
    URL=$(python3 -c "import json;print(json.load(open('config/experiment.config.json'))['sut']['baseUrl'])")
    curl -s -o /dev/null -w "staging $URL: HTTP %{http_code}\n" "$URL" || echo "GAGAL staging tidak terjangkau"
    npx playwright --version >/dev/null 2>&1 && echo "ok   playwright terpasang" || echo "GAGAL playwright: npm install && npx playwright install chromium"
    ;;
  gen)
    python scripts/03-generate.py --conditions B0 --suffix __rerun
    ;;
  static)
    node scripts/04-static-validate.js --conditions "$CONDS" --out "results/04-static-validation-$TAG.json"
    ;;
  baseline)
    backup_results
    node scripts/05-run-suite.js --all --conditions "$CONDS" --tag "baseline-$TAG" --resume
    ;;
  probe)
    backup_results
    node scripts/06-selector-probe.js --all --conditions "$CONDS" --out "results/06-selector-validity-$TAG.json"
    ;;
  perturb)
    backup_results
    node scripts/05-run-suite.js --all --conditions "$CONDS" --perturb perturbations/faults.json \
         --ids "$FAULT_IDS" --tag "faults-$TAG" --resume
    node scripts/05-run-suite.js --all --conditions "$CONDS" --perturb perturbations/mutations.json \
         --ids "$MUT_IDS" --tag "mutations-$TAG" --resume
    ;;
  report)
    python scripts/09-recompute.py --out results/tables-corrected.md
    sed -n '/## Tabel N/,/## Tabel G/p' results/tables-corrected.md
    ;;
  *)
    sed -n '2,22p' "$0"
    exit 1
    ;;
esac
