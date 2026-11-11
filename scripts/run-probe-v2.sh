#!/usr/bin/env bash
# run-probe-v2.sh — ulangi pengukuran Selector Validity dengan ekstraktor v2 (audit 11 Nov 2026).
#
# Ekstraktor v1 memotong selector yang berisi tanda kutip (mis. input[name="email"] -> input[name=),
# sehingga selector itu selalu terhitung tidak valid. Skrip hasil generasi TIDAK diubah;
# hanya probe (pembacaan locator + pengecekan ke staging) yang diulang.
#
#   bash scripts/run-probe-v2.sh check   # uji ekstraktor tanpa jaringan + cek staging
#   bash scripts/run-probe-v2.sh run     # probe semua kondisi (~1-2 jam), hasil lama dipindah
#   bash scripts/run-probe-v2.sh report  # hitung ulang tabel
#
# Staging saja, dengan izin tertulis pemilik.
set -euo pipefail
cd "$(dirname "$0")/.."

MAIN="B0,B1,B2,P,P_no_req,P_no_hist,P_no_dom"
AB="B0__rerun,B0__neutral"
OLD="results/_probe-v1"

case "${1:-}" in
  check)
    node scripts/06b-selector-extract-check.js
    URL=$(python3 -c "import json;print(json.load(open('config/experiment.config.json'))['sut']['baseUrl'])")
    curl -s -o /dev/null -w "staging $URL: HTTP %{http_code}\n" "$URL"
    ;;
  run)
    mkdir -p "$OLD"
    for f in results/06-selector-validity*.json; do
      [ -e "$f" ] || continue
      python3 -c "import json,sys;sys.exit(0 if json.load(open('$f')).get('extractor')=='v2' else 1)" \
        || { mv "$f" "$OLD/"; echo "dipindah ke $OLD: $f"; }
    done
    [ -f results/06-selector-validity.json ] || \
      node scripts/06-selector-probe.js --all --conditions "$MAIN" --out results/06-selector-validity.json
    [ -f results/06-selector-validity-neutral-ab.json ] || \
      node scripts/06-selector-probe.js --all --conditions "$AB" --out results/06-selector-validity-neutral-ab.json
    ;;
  report)
    python scripts/09-recompute.py --out results/tables-corrected.md
    ;;
  *) sed -n '2,12p' "$0"; exit 1 ;;
esac
