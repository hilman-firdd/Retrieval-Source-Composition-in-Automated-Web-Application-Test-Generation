# Retrieval Source Composition in Automated Web Application Test Generation

Experiment harness and replication package for an empirical study of **which retrieval sources
(requirements, DOM snapshots, historical tests) make a local LLM generate more valid Playwright
test scripts** for a web application.

- Generator: Llama 3 8B via Ollama, temperature 0.2, seeds 11, 22, 33, 44, 55 (plus one greedy reference run)
- Embedding and index: `sentence-transformers/all-MiniLM-L6-v2`, FAISS `IndexFlatIP` (cosine, exact)
- Retrieval: fixed top-k per source (requirement 3, DOM 4, historical 3), context budget 12,000 characters
- Execution: Playwright (JavaScript), 1 worker
- System under test: one staging web application (Pesantren PERSIS 27, `https://staging.pesantrenpersis27.com`)

Authors: Hilman Firdaus, Wendy Sarasjati, Dhendra Marutho, Ahmad Ilham
(Magister Programme of Informatics, Universitas Muhammadiyah Semarang, Indonesia).

## How to cite

Use the metadata in [`CITATION.cff`](CITATION.cff) (GitHub's "Cite this repository" button reads it).
Once the Zenodo record exists, cite the version DOI shown on the record.

## Status and known limitations

This package accompanies a manuscript that is still under revision. Read these before reusing any number:

- **Authoritative numbers** are in `results/tables-corrected.md`, produced by `python scripts/09-recompute.py`.
  Numbers from the 2 Nov 2026 manuscript draft are superseded (wrong denominator in the effective
  fault-detection and robustness table; greedy runs mixed with seed runs).
- **Perturbation coverage is incomplete for the ablation conditions** (`P_no_req`, `P_no_hist`, `P_no_dom`).
  Robustness and fault-detection claims are valid for B0, B1, B2 and P only.
- **Leakage:** many scenarios repeat flows of the historical tests in the knowledge base
  (`results/leakage-audit.md`). The effect of the historical-test source should be read with that in mind.
- **Context budget:** the 12,000-character budget was never binding in this design, so the design cannot
  test claims about competition between sources for context space.
- **Not replicable bit-for-bit:** LLM generation is not deterministic across machines, and the staging site
  changes over time. Re-running generation will not reproduce the same scripts. The generated scripts
  that produced the reported results are included under `generated/`.
- The retrieval index (`kb/index/`) and raw DOM snapshots (`kb/dom-snapshots/raw/`) are not included.
  Rebuild the index with `python scripts/02-build-index.py`.

The full audit trail, claim-by-claim status and correction history are in
[`docs/AUDIT-NOTES.md`](docs/AUDIT-NOTES.md) (Indonesian).

## Repository layout

| Path | Contents |
|---|---|
| `scripts/` | Pipeline: `01` DOM capture, `02` index, `03` generation, `04` static validation, `05` execution, `06` selector probe, `07` repair, `08` quick analysis, `09` recomputation of all reported tables, `10` sensitivity, `11` leakage audit; `run-neutral-ab.sh`, `run-probe-v2.sh` |
| `harness/hooked.js` | Fault injection and DOM mutation applied at runtime via `addInitScript` (scripts under test stay byte-identical) |
| `perturbations/` | `faults.json`, `mutations.json` |
| `scenarios/scenarios.json` | The 28 executed scenarios |
| `kb/` | Knowledge base: `requirements/`, `historical-tests/`, `dom-snapshots/pruned/` |
| `generated/` | Generated Playwright scripts per condition and seed |
| `results/` | Raw outputs and `tables-corrected.md` |
| `config/experiment.config.json` | Conditions, retrieval and analysis protocol |
| `docs/AUDIT-NOTES.md` | Detailed audit notes (Indonesian) |

## Requirements

- Node.js and npm (developed with Node.js 20.19, Playwright 1.65; `package.json` requires `^1.49`)
- Python 3 (developed with 3.14; `requirements.txt`: sentence-transformers, faiss-cpu, requests, scipy, numpy)
- [Ollama](https://ollama.com) with `llama3:8b` (only needed to regenerate scripts)
- Network access to the staging site (only needed for DOM capture, execution and selector probing)

```bash
npm install
npx playwright install chromium

python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

ollama pull llama3:8b
ollama serve                       # separate terminal
```

## Reproducing the reported tables (no LLM, no network)

The tables can be recomputed from the stored results alone:

```bash
python scripts/09-recompute.py --out results/tables-corrected.md
```

## Running the full pipeline

```bash
node scripts/01-capture-dom.js
python scripts/02-build-index.py

python scripts/03-generate.py                    # B0, B1, B2, P (5 seeds)
python scripts/03-generate.py --ablations        # + P_no_req, P_no_hist, P_no_dom
python scripts/03-generate.py --greedy           # reference run, reported separately

node scripts/04-static-validate.js
npm run run:baseline
npm run probe:selectors
npm run run:faults
npm run run:mutations
npm run run:flaky

python scripts/07-repair.py --condition P
python scripts/09-recompute.py --out results/tables-corrected.md
```

## Experimental design

| Code | Context given to the model |
|---|---|
| B0 | None |
| B1 | Raw HTML of the start page, truncated to the budget, no retrieval |
| B2 | Retrieved DOM chunks only (top-k 8) |
| P | Requirements + DOM + historical tests (top-k 3 / 4 / 3) |
| P_no_req, P_no_hist, P_no_dom | P with one source removed (ablation) |

Unit of analysis is the **scenario** (n = 28; the five seeds are averaged per scenario). Primary outcome is
Pass Rate; co-primary is Selector Validity. Tests: two-sided Wilcoxon signed-rank with Holm correction over
7 comparisons; paired rank-biserial effect size; clustered bootstrap 95% CI (5000 resamples, seed 42).

## Ethics and data handling

- The staging site must only be tested with the owner's written permission; **do not point `baseUrl` at a production system.**
  <!-- TODO (authors): confirm and record the owner's permission before publishing. -->

- Registration scenarios never press the submit button, so the staging database is not polluted.
- Fault injection happens client-side, within a single browser context; server code is never modified.
- DOM snapshots can contain personal data. Review `kb/dom-snapshots/` before redistributing it.

## License

Released under the [MIT License](LICENSE). The knowledge base is derived from a third-party staging site;
its content is included for replication purposes only.

## AI-use disclosure

Llama 3 8B generated the test scripts that are the object of study. AI assistance was also used in parts of
the analysis and writing of the accompanying manuscript; see the manuscript for the journal's AI statement.
