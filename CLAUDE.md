# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Idea2Paper** (AlphaAGI_01) is a research agent framework that transforms underspecified research ideas into structured academic paper stories using a Knowledge Graph built from ICLR 2025 data (8,285 papers, 124 patterns, 98 domains). It works entirely offline — no internet search is performed.

## Common Commands

```bash
# Install dependencies
pip install -r Paper-KG-Pipeline/requirements.txt

# Run the pipeline (main entry point)
python Paper-KG-Pipeline/scripts/idea2story_pipeline.py "your research idea"

# Run with project venv
venv/bin/python Paper-KG-Pipeline/scripts/idea2story_pipeline.py "your idea"

# Test LLM connectivity
python Paper-KG-Pipeline/scripts/tools/llm_smoke_test.py

# Build indexes manually (normally auto-built on first run)
python Paper-KG-Pipeline/scripts/tools/build_novelty_index.py
python Paper-KG-Pipeline/scripts/tools/build_recall_index.py
python Paper-KG-Pipeline/scripts/tools/build_subdomain_taxonomy.py

# Start the web frontend
python frontend/server/app.py --host 127.0.0.1 --port 8080
```

## Configuration

Config priority: shell env → `.env` → `i2p_config.json` → code defaults.

- `.env` — secrets (API keys). Copy from `.env.example`.
- `i2p_config.json` — non-sensitive pipeline settings.
- Key settings: `LLM_API_KEY`, `LLM_PROVIDER`, `LLM_MODEL`, `EMBEDDING_MODEL`.
- Supported providers: `openai_compatible_chat`, `anthropic`, `gemini`.
- **Use gpt-4o** (not gpt-4o-mini) — mini fails on the blind judge critic phase.
- Recommended critic settings: `I2P_CRITIC_STRICT_JSON=0`, `I2P_CRITIC_JSON_RETRIES=5`.

## Architecture

The pipeline has 4 phases:

1. **Pattern Selection** — 3-way recall (idea similarity, domain relevance, paper similarity) retrieves relevant patterns from the KG
2. **Story Generation** — LLM generates structured paper story (title, abstract, problem, method, contributions, experiments)
3. **Multi-Agent Review & Refinement** — 3 reviewers (Methodology, Novelty, Storyteller) with blind judging, τ-calibrated scoring, up to 3 refinement iterations
4. **Novelty Check** — embedding similarity against all papers, collision detection with optional pivot

Key source layout:
- `Paper-KG-Pipeline/src/idea2paper/` — core library
  - `config.py` — unified config loader
  - `recall/recall_system.py` — 3-way retrieval system
  - `application/pipeline/manager.py` — pipeline orchestrator
  - `application/review/` — multi-agent critic (critic.py, blind_judge.py, coach.py)
  - `application/novelty/` — novelty detection
  - `infra/` — LLM client, embeddings, logging
- `Paper-KG-Pipeline/scripts/` — entry points and tools
- `Paper-KG-Pipeline/output/` — pre-built KG data (~148 MB), indexes, pipeline outputs
- `frontend/` — Flask backend + React/TypeScript web UI

## Environment Notes

- Requires Python 3.10+ (code uses PEP 604 `X | None` syntax).
- On ARM/aarch64, deadsnakes PPA is unavailable — compile Python from source.
- First run builds novelty + recall indexes (~8 min). Subsequent runs are much faster.
- Dependencies: `networkx`, `numpy`, `scikit-learn`, `requests`, `tqdm`.
