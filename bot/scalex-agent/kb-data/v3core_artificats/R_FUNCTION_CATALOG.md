# MaxxBot Function Catalog — v3 for Siva (April Launch)
**Version:** 2.0 (v3 final) | **Date:** 2026-02-26  
**Purpose:** Define what MaxxBot does: **regular capabilities** (table-driven, no custom script) vs **scripted workflows** (custom Botpress flows Siva builds). April launch focuses on **4 scripted workflows**; everything else is normal bot behavior.

---

## How to read this document

- **Regular capability** = User asks in natural language; bot answers from tables/KB. No named "workflow" or custom script. Examples: rate lookup, vendor intel, location comparison, methodology Q&A.
- **Scripted workflow** = User invokes a named function (or bot offers it); bot runs a structured sequence (clarifying questions, data collection, calculation, structured output). Siva builds these as custom flows.
- **Document export** (Word/PDF) = **Output of** a scripted workflow (e.g. redlined Word after contract review, PDF summary after benchmark), not a standalone "export workflow."

---

## 1. Regular MaxxBot capabilities (no custom script)

These work with default bot behavior + tables + KB. Siva does **not** need a custom workflow for them.

| Capability | What the user gets | Tables / KB |
|------------|--------------------|-------------|
| **Rate benchmarking (lookup)** | "What's the rate for X in Y?" → rate range (and optional gap vs current rate). Staff aug vs managed: use TBL-003 only (unblended) or TBL-003 × TBL-017 (blended). Filter **Rate_Unit = 'Per_Hour'** for hourly lookups (see R_MAXXBOT_BOTPRESS_MAPPING). | TBL-003, TBL-004, TBL-005, TBL-007, TBL-010, TBL-015, TBL-017; SLA + Service_Type_SLA if SLA needed |
| **Vendor intelligence** | "Tell me about [vendor]" → profile, capabilities, locations, red flags (where data exists). | TBL-006, TBL-008, TBL-009, TBL-011 |
| **Vendor comparison** | "Compare vendor A vs B" → side-by-side from tables. | TBL-006, TBL-008, TBL-009, TBL-003 |
| **Location analysis** | "Compare Manila vs Bangalore," "Cost index for Poland," "Where should I offshore?" | TBL-005, TBL-003, TBL-008 |
| **Methodology & education** | "How do you calculate savings?", "Managed vs staff aug?", "What SLAs for [service]?" | KB; SLA + Service_Type_SLA for SLA-by-service |
| **Taxonomy navigation** | "What towers does Maxx cover?", "What is RPO?", "What's in IT Infrastructure?" | TBL-001, TBL-002, TBL-004, TBL-007 |

**Document export:** When a scripted workflow produces a deliverable (e.g. contract risk summary, benchmark report), the **same workflow** produces the document (redlined Word, PDF, etc.). There is no separate "conversation-to-document export" workflow; export is an output type of the workflow that ran.

---

## 2. Four scripted workflows for April launch

These are the **custom flows** to build. Rate benchmarking as a **lookup** is regular capability; the **Managed Service Rate Conversion** workflow below is the scripted "walk through and produce blended/PPU" flow.

| # | Workflow | What it does | Why scripted | Primary tables |
|---|----------|--------------|--------------|----------------|
| **1** | **Contract Risk Analysis** | User uploads contract. Bot extracts clauses, flags risks vs TBL-014, assigns severity, generates redline recommendations. **Output:** Risk summary + redlined Word (or in-chat summary). | Document pipeline + clause evaluation. **Siva is already building/testing this.** | TBL-014, TBL-012, TBL-003, TBL-006 |
| **2** | **Managed Service Rate Conversion** | User starts with **unblended frontline hourly rate** (or bot looks it up). Bot walks through workflow details (volume, location, tier, compliance, contract length, etc.) — or uses **example/average assumptions** from table data when user doesn't have all fields. Applies TBL-017 (blended multiplier), TBL-010/TBL-015 (modifiers) per 8-step sequence. **Output:** Blended hourly rate and/or **price per unit** (e.g. per transaction, per FTE) the client can use for budgeting/RFP. | Multi-step data collection + modifier math + optional "fill gaps with table defaults." | TBL-003, TBL-004, TBL-005, TBL-017, TBL-010, TBL-015, TBL-007 |
| **3** | **Risk Assessment** | Maxx walks user through a series of questions **or** provides a template for the client to complete and re-upload. Bot evaluates against TBL-012 (thresholds, severity). **Output:** Risk assessment score for the **workflow** (or vendor/spend scenario) using standard taxonomy and industry metrics the client can bring back to stakeholders/leadership. | Structured intake + threshold evaluation + standardized output. | TBL-012, TBL-006, TBL-008, TBL-003 |
| **4** | **Treatment Recommendation** | User describes spend/contract situation. Bot evaluates TBL-013 rules (negotiate, RFP, consolidate, etc.) and returns recommended actions with **savings estimates** (authoritative rates: e.g. negotiation 8–15%, contract opt 5%, MIMO 3%, VMO 2%). **Output:** Action plan with savings range; optional short report. | Rule engine + savings formula (Spend × Treatment_Rate). | TBL-013, TBL-012, TBL-003, TBL-015 |

**Routing, retrieval, steps:** See **R_MAXXBOT_BOTPRESS_MAPPING.md** for WF-01 (rate lookup), WF-06 (contract), and **R_DATABASE_SCHEMA** for table/column specs.

---

## 3. Not in April priority

| Item | Note |
|------|------|
| **Proposal comparison** (upload 2 proposals → side-by-side) | Deferred; not in the 4 scripted workflows for April. |
| **Standalone "export conversation" workflow** | Export is an **output** of the above workflows (e.g. Word after contract review, PDF after benchmark), not a separate workflow. |

---

## 4. Future workflows (post–April launch)

Kept as a log for later scope. Do **not** build for April.

| Workflow | Description |
|----------|-------------|
| Spend classification & intake | Upload spend; classify to taxonomy; benchmark overlay. |
| Savings business case builder | Multi-step conversation → benchmark + treatments → downloadable report. |
| Proposal comparison | Upload proposals; extract pricing/SLAs; normalize; benchmark; side-by-side doc. |

---

## 5. Topic codes (for gap detection)

Use for "user asked about X, no answer" classification:

| Topic_Code | Topic_Name |
|------------|------------|
| RATE | Rate benchmarking (lookup, gap-to-benchmark, staff aug vs managed) |
| VENDOR | Vendor intelligence |
| VENDOR_COMPARE | Vendor comparison |
| LOCATION | Location analysis |
| RISK | Risk assessment (scripted workflow) |
| TREATMENT | Treatment recommendation (scripted workflow) |
| CONTRACT | Contract risk / clause analysis (scripted workflow) |
| MANAGED_RATE | Managed service rate conversion (scripted workflow) |
| METHODOLOGY | Methodology & education |
| TAXONOMY | Taxonomy navigation |
| PROPOSAL | Proposal comparison (future) |
| SPEND_INTAKE | Spend classification (future) |
| BUSINESS_CASE | Savings business case (future) |

---

## 6. Workflow-to-data mapping (summary)

| Workflow | Type | Tables |
|----------|------|--------|
| Rate lookup (regular) | Table-driven | TBL-003, TBL-004, TBL-005, TBL-007, TBL-010, TBL-015, TBL-017; SLA + Service_Type_SLA |
| Contract Risk Analysis | Scripted | TBL-014, TBL-012, TBL-003, TBL-006 |
| Managed Service Rate Conversion | Scripted | TBL-003, TBL-004, TBL-005, TBL-017, TBL-010, TBL-015, TBL-007 |
| Risk Assessment | Scripted | TBL-012, TBL-006, TBL-008, TBL-003 |
| Treatment Recommendation | Scripted | TBL-013, TBL-012, TBL-003, TBL-015 |
| Vendor intel / comparison | Table-driven | TBL-006, TBL-008, TBL-009, TBL-011 |
| Location analysis | Table-driven | TBL-005, TBL-003, TBL-008 |
| Methodology / taxonomy | KB + table-driven | KB; TBL-001, TBL-002, TBL-004, TBL-007 |

---

## 7. Table numbering (v3 — 19 files)

v3 package has **19 table files**: 17 base tables (TBL-001 through TBL-017) plus **2 SLA tables**. The SLA tables are **not** named TBL-018/TBL-019; they are:

| File # | Table name | File name | Purpose |
|:------:|------------|-----------|---------|
| 18 | SLA (master) | **SLA.csv** | Master list of SLA types (Timeliness, Quality, etc.) |
| 19 | Service Type × SLA (junction) | **Service_Type_SLA.csv** | Links each service type to its SLA(s); use for SLA-by-service (not TBL-004). |

Row counts (v3 final, 2026-02-26): TBL-001 (20), TBL-002 (94), TBL-003 (1,105), TBL-004 (414), TBL-005 (398), TBL-006 (1,741), TBL-007 (1,065), TBL-008 (939), TBL-009 (644), TBL-010 (39), TBL-011 (1,741), TBL-012 (50), TBL-013 (30), TBL-014 (20), TBL-015 (61), TBL-016 (88), TBL-017 (3), SLA (11), Service_Type_SLA (828).

---

## 8. Data dependencies (readiness)

| Table | Purpose | Scripted workflows that use it |
|-------|---------|--------------------------------|
| TBL-003 | Base rates | Rate lookup, Managed Service Rate Conversion, Risk/Treatment context |
| TBL-004 | Service types, Frontline_Agent_Type, Managed_Service_Load | Rate lookup, Managed Service Rate Conversion |
| TBL-005 | Locations, Cost_Index | Rate lookup, Location analysis, Managed Service Rate Conversion |
| TBL-007 | Aliases → Service_Type_ID | Rate lookup, Managed Service Rate Conversion |
| TBL-010, TBL-015 | Modifiers and adjustments | Rate lookup, Managed Service Rate Conversion |
| TBL-017 | Blended multiplier (Light/Standard/Premium) | Rate lookup, Managed Service Rate Conversion |
| TBL-012 | Risk rules, thresholds | Risk Assessment, Contract Risk Analysis |
| TBL-013 | Treatment rules, savings rates | Treatment Recommendation |
| TBL-014 | Contract clause benchmarks | Contract Risk Analysis |
| SLA + Service_Type_SLA | SLA by service type | Rate lookup (optional), methodology Q&A |

**Note:** TBL-011 = Vendor ID Mapping (vendor name → Vendor_ID). TBL-015 = Modifier Adjustments (quantified modifier values). Do not confuse with other tables.

---

*End of function catalog. Use with R_MAXXBOT_BOTPRESS_MAPPING.md and R_DATABASE_SCHEMA for implementation.*
