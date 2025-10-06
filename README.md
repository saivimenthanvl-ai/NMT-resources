# (NMT) Agent for Low‑Resource Languages

<p align="center">
  <img alt="NMT" src="https://img.shields.io/badge/NMT-Low%20Resource-blue" />
  <img alt="Python" src="https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white" />
  <img alt="PyTorch" src="https://img.shields.io/badge/PyTorch-2.x-EE4C2C?logo=pytorch&logoColor=white" />
  <img alt="Transformers" src="https://img.shields.io/badge/HF-Transformers-FFD21E?logo=huggingface&logoColor=black" />
  <img alt="CUDA" src="https://img.shields.io/badge/CUDA-ready-76B900?logo=nvidia&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green" />
  <img alt="PRs" src="https://img.shields.io/badge/PRs-welcome-brightgreen" />
</p>

> 🗣️ **Goal**: A production‑leaning Neural Machine Translation (NMT) agent that **prioritizes low‑resource languages (LRLs)** through smart data curation, transfer learning, few‑shot prompting, and quality estimation.

---

## 🔥 Highlights (Recruiter‑friendly)

* 📈 **SOTA‑inspired pipeline**: Encoder‑decoder Transformers (Marian/ByT5/mBART), adapters (LoRA/PEFT), and retrieval‑augmented glossaries.
* 🧠 **Agentic loop**: Translate → Assess with QE → Self‑refine → Finalize.
* 🌍 **LRL‑first design**: Tokenization, domain adaptation, and script handling for Indic and other LRLs.
* 🛡️ **Responsible AI**: Bias, toxicity/regard checks, and cultural sensitivity prompts baked‑in.
* ⚙️ **Deployable**: CLI + REST stub, batch mode, and reproducible training.

---

## 🧩 Architecture

```
┌───────────┐     ┌────────────┐     ┌────────────┐     ┌─────────────┐
│   Input   │ ─▶  │  Translator│ ─▶  │  QE/COMET  │ ─▶  │ Self‑Refine │
│ (src.txt) │     │ (HF model) │     │  + Heur.   │     │ (prompting) │
└───────────┘     └────────────┘     └────────────┘     └─────┬───────┘
                                                                │
                                                     ┌──────────▼─────────┐
                                                     │  Final Translation │
                                                     └─────────────────────┘
```

**Modules**

* `translator_hf.py` — wraps Hugging Face models (Marian/mBART/ByT5/Qwen‑VL‑text‑only) with LoRA/PEFT hooks.
* `qe_comet.py` — quality estimation via COMET/BLEURT + regex/domain heuristics.
* `tm_glossary.py` — terminology memory + dictionary constraints.
* `app.py` — CLI/REST entrypoint and agentic loop orchestration.

---

## 📦 Quick Start

### 1) Setup

```bash
# clone
git clone https://github.com/<your‑id>/(NMT)_Agent_for_Low_Resource_Languages.git
cd (NMT)_Agent_for_Low_Resource_Languages

# env
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -U pip wheel
pip install -r requirements.txt
```

### 2) Minimal Inference

```bash
python app.py \
  --src_path data/sample.src.txt \
  --out_path runs/sample.hyp.txt \
  --model_name Helsinki-NLP/opus-mt-en-ta \
  --qe comet \
  --refine 1
```

### 3) Training (Adapter/LoRA)

```bash
python translator_hf.py train \
  --base_model facebook/mbart-large-50 \
  --train_file data/train.jsonl \
  --valid_file data/valid.jsonl \
  --target_lang ta \
  --peft lora \
  --epochs 3 --lr 2e-5 --batch_size 8
```

---

## 🗂️ Repository Layout

```
.
├── app.py                 # CLI/REST agent
├── translator_hf.py       # HF models + PEFT/LoRA
├── qe_comet.py            # COMET/BLEURT/heuristics
├── tm_glossary.py         # term memory + constraints
├── data/                  # samples + scripts to build datasets
├── configs/               # yaml configs per language/domain
├── runs/                  # outputs, logs, checkpoints
├── notebooks/             # analysis & experiments
└── README.md
```

---

## 📚 Data & Tokenization (LRL‑centric)

* **Sources**: OPUS, JW300, FLORES‑200, Wiki, domain corpora (health, agri, legal).
* **Cleaning**: de‑dup, language‑ID (fastText), length/ratio filters, Unicode normalization, punctuation/script checks.
* **Tokenization**: SentencePiece (unigram/BPE) with shared vocab, fallback byte‑level for noisy LRLs.
* **Terminology**: glossary CSVs; enforce via constrained decoding or post‑edit rules.

> 💡 *Tip:* Start with multilingual base (mBART‑50), then **adapter‑tune** per LRL domain to avoid catastrophic forgetting.

---

## 🧪 Evaluation

* **Automatic**: BLEU, chrF, COMET (QE), TER.
* **Human**: adequacy/fluency/terminology accuracy (Likert 1–5), cultural fit checklist.
* **Bias/Safety**: regard sentiment, stereotype probes (StereoSet‑style), toxicity lexicons.

```bash
python qe_comet.py eval \
  --src data/test.src.txt --ref data/test.ref.txt --hyp runs/sample.hyp.txt \
  --metrics bleu chrf comet ter
```

---

## 🛡️ Responsible AI & Safety

* ⚖️ **Bias**: assess with stereotype probes, measure **regard**, apply prompt‑level counter‑bias patterns.
* 🔐 **Privacy**: strip PII; optional hashing for IDs.
* 🧯 **Hallucination control**: domain constraints, glossary locking, QE‑gated self‑refine.
* 🌏 **Cultural sensitivity**: reviewer checklist; avoid literalism when idioms exist.

---

## 🚀 Deployment

* **Batch**: process files via CLI (CPU/GPU).
* **Service**: `uvicorn app:api` (FastAPI stub) for HTTP translation.
* **Artifacts**: save `tokenizer.json`, `adapter.safetensors`, `config.yaml` for reproducibility.

---

## 🗺️ Roadmap

* [ ] Better COMET‑QE finetuning for LRLs
* [ ] RAG‑style context retrieval for domain phrases
* [ ] Mixed‑precision + int8 quantization for edge GPUs
* [ ] Active‑learning loop with human feedback

---

## 👩‍💻 Example Config (YAML)

```yaml
model: facebook/mbart-large-50
lang_pair: en-ta
peft:
  type: lora
  r: 16
  alpha: 32
  dropout: 0.05
train:
  epochs: 3
  batch_size: 8
  lr: 2.0e-5
  max_len: 256
```

---

## 📝 Citation

If you use this repo, please cite or reference it in your work.

```bibtex
@software{nmt_agent_lrl,
  title  = {An Agentic NMT Pipeline for Low-Resource Languages},
  author = {Mieradilijiang Maimaiti, Yang Liu, Huanbo Luan, Maosong Sun},
  year   = {2025},
  url    = {https://github.com/saivimenthanvl-ai/(NMT)_Agent_for_Low_Resource_Languages}
}
```

---

## 🤝 Contributing

PRs are welcome! Please open an issue with details on language/domain and attach small reproducible samples.

---

## 📄 License

MIT — see `LICENSE`.

---

### 🎯 Recruiter Notes

* Built for **Indic LRLs** (e.g., Tamil, English) with **adapter‑tuning** for cost‑efficient training.
* Demonstrates **end‑to‑end ownership**: data → modeling → evaluation → deployment → safety.
* Clear **ablation hooks** (with/without glossary/QE/refinement) for research‑ready results.
