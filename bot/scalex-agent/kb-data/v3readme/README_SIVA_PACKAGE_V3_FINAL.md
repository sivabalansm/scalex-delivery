# Botpress v3 — Final package (26 Feb 2026)

**Version:** 3.3 Final | **Date:** 2026-02-26  
**Purpose:** Complete v3 deliverable for Botpress (Siva). **Taxonomy locked from N External AI GPT run (v6.1):** 20 towers (incl. ENG, CNAS, MK, RC), 94 categories, 414 service types. **Round 2 applied:** methodology (TBL-017 scope, §B.4/§M.4, Table Field Alignment), TBL-016 taxonomy crosswalks (88 rows: 27 Nielsen + 61 APQC). **Post-validation fixes (2026-02-26):** TBL-004 Frontline_Agent_Type populated (244 rows; ENG/FR/MK/RC NULL), TBL-007 rebuilt (every ST has ≥1 alias), TBL-008 kept only rows for current 414 STs, TBL-001 counts refreshed. WF-01 rate lookup filter: **Rate_Unit = 'Per_Hour'** for hourly lookups (see R_MAXXBOT_BOTPRESS_MAPPING). Tower coverage: **TOWER_COVERAGE_STATUS.md** (analysis/).

---

## What’s in this folder

### 1. Table files (19 CSVs) — v3 canonical, N taxonomy applied 2026-02-25

| File | Description |
|------|-------------|
| TBL-001_TOWERS_v4.csv through TBL-017_MANAGED_SERVICE_LOAD.csv | 17 base tables (v3 structure) |
| **SLA.csv** | SLA master (11 rows) |
| **Service_Type_SLA.csv** | Service type × SLA junction (828 rows — 2 SLAs per ST; all Service_Type_IDs valid in TBL-004) |

**Taxonomy (N→R handoff applied 2026-02-25; locked source: N GPT run v6.1):**  
- **TBL-001:** 20 towers (added ENG, CNAS, MK, RC as needed).  
- **TBL-002:** 94 categories from N_TAXONOMY_V3_MASTER (MAXX_Taxonomy_LOCKED_V3_2026-02-25).  
- **TBL-004:** 414 service types from N master; definitions from locked v6.1; defaults for Delivery_Channel, Primary_Pricing_Model, Managed_Service_Load.  
- **TBL-016:** 88 rows (27 Nielsen + 61 APQC crosswalk from Round 2).  
- **Service_Type_SLA:** Rebuilt so every row references a current TBL-004 Service_Type_ID (seed: 2 SLAs per ST).  
- **TBL-007 / TBL-008:** Rebuilt 2026-02-26: all Service_Type_IDs reference current TBL-004 (414 STs). Every TBL-004 ST has ≥1 alias in TBL-007.

**v3 structure (already in place):**  
- TBL-004: Service_Unit_Name, Service_Unit_Definition; no SLA columns (use SLA + Service_Type_SLA).  
- TBL-005: Date_of_FX, ITO_Market_Maturity.  
- TBL-006: deliveryRegions.  
- TBL-015: PLATFORM_FEE rows (ADJ-060, ADJ-061).

### 2. Field definitions (for Siva)

- **R_TABLE_FIELD_DEFINITIONS.md** — Every table and column defined; includes **SLA** and **Service_Type_SLA** (files 18–19; not TBL-018/TBL-019).  
- **R_Table_Definitions_And_Data.xlsx** — Single Excel: one tab per table with Data + Def (row1=header, row2=definition). Covers all 19 tables.  
- **R_Table_Field_Definitions.xlsx** — Optional: Field_Definitions, Table_Purpose_Why, Review_Findings (all 19 tables).

### 3. Documentation (use in this order)

| Document | Use |
|----------|-----|
| **R_DATABASE_SCHEMA.md** | Table definitions, column specs, relationships, query patterns (Pattern 1; PERCENTAGE→multiplier; SLA + Service_Type_SLA). |
| **R_MAXXBOT_BOTPRESS_MAPPING.md** | Routing, RETRIEVE, STEPS, PROCESS; delivery model; Category_Code; modifier math. |
| **R_FUNCTION_CATALOG.md** | Regular capabilities vs **4 scripted workflows** (Contract Risk Analysis, Managed Service Rate Conversion, Risk Assessment, Treatment Recommendation). Rate lookup = regular; document export = output of workflows. |
| **R_MAXX_METHODOLOGY_v2.md** | Methodology; v3 table alignment. |
| **R_GOLDEN_QUESTION_ANSWERS_v2.md** | Golden question answer key (v3.0) + supplemental v3 ecosystem questions (S-V3.1–S-V3.6). |

### 4. Reference and one-pager

- **AUTHORITATIVE_VALUES.md** (if included) — Locked figures; do not change without approval.  
- **R_BOTPRESS_V3_UPDATE_FOR_SIVA.md** — Short v3 update one-pager for Siva (status, v2→v3 delta).  
- **R_BOTPRESS_V2_TO_V3_SUMMARY_OVERVIEW.html** — Summary overview for team (open in browser): v2→v3 changes, what’s finalized, what’s excluded, what the team needs to know.

---

## Not in this package (researched table updates)

Applied later in a separate data workstream; **no schema change**:

- AHT (Default_AHT_Minutes) population (428 gaps).  
- Rate validation (TBL-003 sample vs benchmarks; FD6 provenance).  
- Modifier quantification (TBL-015 ranges beyond current seed).  
- Service_Unit_Name / Service_Unit_Definition population.  
- Vendor/location enrichment (TBL-006, TBL-009).  
- Contract benchmark data (TBL-014).

See **projects/R_methodology/analysis/R_TAXONOMY_FINALIZED_FOR_V3.md** for what “taxonomy finalized” means and what remains data-only.

---

## Build and canonical

- **Canonical tables:** `shared/data/botpress_tables/` (19 files).  
- **This package:** Copy of canonical + docs as of 2026-02-26. Refresh with: `python3 projects/R_methodology/analysis/refresh_siva_v3_final_package.py` (run from repo root).

---

*Per R_BOTPRESS_DELIVERABLE_RULES: version + date in doc.*
