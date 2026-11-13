# RagwarTech.com — governed website + RAG pilot

Status: **development / NOT production authorized**  
Source: `techragwar/portfolio` (`contentful-portfolio/`)  
Future curated destination: `ragwartech` (name to be finalized at release)  
Workload ID proposed: `ragwartech-website-rag`

## As-built inventory (2026-11-13)
- Next.js 16 / React 19 website at `contentful-portfolio/`; Contentful is installed.
- Existing `/stacks` document UI: upload, search, and document chat.
- FastAPI backend at `contentful-portfolio/backend/`, SQLite document/chunk storage, PDF ingestion, BM25 lexical retrieval, Anthropic generation, and numbered excerpt citations.
- Existing backend unit and API tests. No claim of current passing test results, deployed readiness, or live domain/source binding.
- Current backend is **not safe for public exposure**: no authentication/tenant separation for documents, no rate limit for billable chat, and unrestricted document mutation.

## Target separation
1. **Public website:** source-grounded, read-only Q&A over an explicit allowlist of approved Ragwar Tech pages/articles/project profiles, indexed from a versioned publishing process. No arbitrary public uploads.
2. **Private Stacks workspace:** PDF upload/search/chat permitted only for authenticated, authorized users; private documents never enter the public website index.
3. **Governance:** engineering harness evaluates a checked-out workspace; separate control-plane authorization governs consequential actions. A passing evaluation is not production authorization.

## Proposed workload contract
```yaml
workload_id: ragwartech-website-rag
kind: web-rag
repository: techragwar/portfolio
root: contentful-portfolio
status: development
public_endpoints:
  - website
  - approved-content-search
restricted_actions:
  - upload_document
  - delete_document
  - reindex_content
  - publish_content
  - deploy
required_evidence:
  - lint_and_typecheck
  - frontend_build
  - backend_tests
  - security_scan
  - rag_retrieval_evaluation
  - grounded_answer_evaluation
  - citation_verification
  - human_review
```
This is a **proposed descriptive contract**, not a claim that the harness accepts this YAML or that a workload has been registered. Confirm current CLI syntax/schema before applying.

## Non-negotiable public release gates
- Authenticate and authorize private document APIs; enforce tenant isolation, deny by default, and test cross-user leakage.
- Separate public approved corpus from private Stacks data; prohibit public user uploads and deletion.
- Add rate limits, model-token/cost quotas, request timeouts, and abuse handling.
- Evaluate prompt injection in retrieved documents, exfiltration attempts, unsupported claims, source/citation mismatch, empty corpus and irrelevant queries.
- Never treat retrieved text as instructions; generation only uses permitted context and must abstain when evidence is insufficient.
- Source metadata includes canonical URL, title, publication/update timestamp, content hash, and approval state.
- Evidence report records evaluated source SHA, corpus revision, dataset revision, model/provider version, thresholds, latency and estimated cost.
- Read-only staging smoke test, human approval, deployment/rollback verification and explicit release authorization.

## Next execution in Codespace
```bash
git clone https://github.com/techragwar/portfolio.git
cd portfolio
git switch feat/governed-rag-website-pilot
cd contentful-portfolio
npm ci && npm run lint && npx tsc --noEmit && npm run build
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
pytest -q
# Run these from a trusted environment with the engineering harness available:
harness --root <absolute-path-to-contentful-portfolio> inspect --json
harness --root <absolute-path-to-contentful-portfolio> eval --profile platform --evidence --json
```
Do not commit secrets, production API keys, corpus content containing personal data, or local SQLite data.

## Migration / promotion rule
Keep the working project in `techragwar` through development. After acceptance evidence, migrate to an approved `ragwartech` repository, preserving Git history and tags, with documented source commit, owner change, CI, deploy/rollback and domain cutover. **Do not redirect production deployment merely because code has been copied.**
