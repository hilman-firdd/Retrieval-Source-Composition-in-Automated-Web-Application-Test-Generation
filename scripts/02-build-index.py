#!/usr/bin/env python3
"""
02-build-index.py

Membangun knowledge base tiga-modal dan mengindeksnya dengan FAISS.

Sumber:
  kb/requirements/*.md              -> source_type = "requirement"
  kb/dom-snapshots/pruned/*.md      -> source_type = "dom"
  kb/historical-tests/*.js|*.md     -> source_type = "historical_test"

Keluaran:
  kb/index/faiss.index      indeks vektor
  kb/index/chunks.jsonl     metadata setiap chunk (id, source_type, source_file, text)
  kb/index/manifest.json    statistik untuk dilaporkan di bagian Research Method

Pemakaian:
  python scripts/02-build-index.py
"""

import json
import os
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = json.loads((ROOT / "config/experiment.config.json").read_text())
EMB = CONFIG["embedding"]

INDEX_DIR = ROOT / "kb/index"
INDEX_DIR.mkdir(parents=True, exist_ok=True)

SOURCES = [
    ("requirement", ROOT / "kb/requirements", ("*.md", "*.txt")),
    ("dom", ROOT / "kb/dom-snapshots/pruned", ("*.md",)),
    ("historical_test", ROOT / "kb/historical-tests", ("*.js", "*.md", "*.txt")),
]


def split_sections(text: str):
    """Pecah berdasarkan heading markdown; jika tidak ada heading, kembalikan utuh."""
    parts = re.split(r"\n(?=#{1,3}\s)", text)
    return [p for p in (s.strip() for s in parts) if p]


def chunk_text(text: str, size: int, overlap: int):
    """Sliding window berbasis baris agar chunk tidak memotong entri elemen di tengah."""
    if len(text) <= size:
        return [text]
    lines = text.split("\n")
    chunks, buf, buf_len = [], [], 0
    for line in lines:
        if buf_len + len(line) + 1 > size and buf:
            chunks.append("\n".join(buf))
            # tarik mundur beberapa baris terakhir sebagai overlap
            back, taken = [], 0
            for prev in reversed(buf):
                if taken + len(prev) > overlap:
                    break
                back.insert(0, prev)
                taken += len(prev) + 1
            buf, buf_len = back, taken
        buf.append(line)
        buf_len += len(line) + 1
    if buf:
        chunks.append("\n".join(buf))
    return chunks


def collect_chunks():
    records = []
    cid = 0
    for source_type, directory, patterns in SOURCES:
        if not directory.exists():
            print(f"  [!] direktori tidak ditemukan, dilewati: {directory}")
            continue
        files = sorted({f for pat in patterns for f in directory.glob(pat)})
        if not files:
            print(f"  [!] tidak ada berkas pada {directory}")
        for f in files:
            raw = f.read_text(encoding="utf-8", errors="ignore")
            if not raw.strip():
                continue
            header = f"[{source_type}] {f.name}"
            for section in split_sections(raw):
                for piece in chunk_text(section, EMB["chunkSize"], EMB["chunkOverlap"]):
                    records.append(
                        {
                            "id": cid,
                            "source_type": source_type,
                            "source_file": str(f.relative_to(ROOT)),
                            "text": f"{header}\n{piece}",
                        }
                    )
                    cid += 1
    return records


def main():
    try:
        import faiss
        import numpy as np
        from sentence_transformers import SentenceTransformer
    except ImportError as e:
        sys.exit(
            f"Dependensi belum terpasang ({e.name}).\n"
            "Jalankan: pip install -r requirements.txt"
        )

    print("Mengumpulkan chunk dari knowledge base ...")
    records = collect_chunks()
    if not records:
        sys.exit("Knowledge base kosong. Isi kb/requirements dan jalankan 01-capture-dom.js lebih dulu.")

    counts = {}
    for r in records:
        counts[r["source_type"]] = counts.get(r["source_type"], 0) + 1
    for k, v in sorted(counts.items()):
        print(f"  {k:<16} {v:>5} chunk")
    print(f"  {'TOTAL':<16} {len(records):>5} chunk")

    print(f"\nMemuat model embedding: {EMB['model']}")
    model = SentenceTransformer(EMB["model"])

    t0 = time.time()
    vectors = model.encode(
        [r["text"] for r in records],
        batch_size=32,
        show_progress_bar=True,
        normalize_embeddings=EMB["normalize"],
        convert_to_numpy=True,
    ).astype("float32")
    elapsed = time.time() - t0

    dim = vectors.shape[1]
    if dim != EMB["dimension"]:
        print(f"  [!] dimensi aktual {dim} berbeda dari konfigurasi {EMB['dimension']}")

    # Vektor sudah dinormalisasi, sehingga inner product setara dengan cosine similarity.
    index = faiss.IndexFlatIP(dim)
    index.add(vectors)
    faiss.write_index(index, str(INDEX_DIR / "faiss.index"))

    with (INDEX_DIR / "chunks.jsonl").open("w", encoding="utf-8") as fh:
        for r in records:
            fh.write(json.dumps(r, ensure_ascii=False) + "\n")

    manifest = {
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "embedding_model": EMB["model"],
        "dimension": dim,
        "normalized": EMB["normalize"],
        "chunk_size": EMB["chunkSize"],
        "chunk_overlap": EMB["chunkOverlap"],
        "index_type": "IndexFlatIP (cosine, exact search)",
        "total_chunks": len(records),
        "chunks_per_source": counts,
        "embedding_time_seconds": round(elapsed, 2),
    }
    (INDEX_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2))

    print(f"\nIndeks tersimpan di {INDEX_DIR}")
    print(f"Waktu embedding: {elapsed:.1f} detik")
    print("Angka pada manifest.json langsung bisa dilaporkan di bagian Research Method.")


if __name__ == "__main__":
    main()
