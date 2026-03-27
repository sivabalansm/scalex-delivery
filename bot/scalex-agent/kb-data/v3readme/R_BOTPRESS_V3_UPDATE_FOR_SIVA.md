# Botpress Tables — v3 Update for Siva and Team

**Version:** 1.1 | **Date:** 2026-02-23  
**Purpose:** Status of Botpress tables and what v3 changes vs v2 (for Monday sync and v3 handoff).

**Update (2026-02-23):** Round 1 applied; canonical = v3; package **for siva v3** is ready. See **for siva v3/R_BOTPRESS_V3_UPDATE_FOR_SIVA.md** for the Siva-facing one-pager.

---

## 1. Current status (as of Feb 23, 2026)

| Item | Status |
|------|--------|
| **What Siva has** | v2 package sent Feb 12–13: 17 tables (TBL-001–TBL-017), schema, mapping, function catalog, methodology, golden questions. |
| **Canonical tables** | **v3** at `shared/data/botpress_tables/` — 19 files. Round 1 applied (build_v3_canonical_tables.py). |
| **v2 archive** | `shared/data/botpress_tables/archive_v2/` — 17 files for reference. |
| **Ready to share v3?** | **Yes.** Package **for siva v3** = 19 CSVs + schema, mapping, methodology, golden answers, function catalog. |
| **Monday sync** | Feb 24 afternoon (Siva to arrange): finalize scope, v2 vs v3 delta, updated project plan. |

---

## 2. v2 → v3 delta (Siva impact)

v3 is the **last structural change** we will make before launch; after v3 we only do data fills (no new columns or tables).

| Area | v2 (current at Botpress) | v3 | Siva impact |
|------|---------------------------|-----|-------------|
| **TBL-004** | Resource_Unit_Name; 4 SLA columns | **Service_Unit_Name**; **Service_Unit_Definition**; 4 SLA columns **removed** (use SLA + Service_Type_SLA) | Schema/scripts: drop SLA cols; add Service_Unit_Definition |
| **TBL-005** | No Date_of_FX, no ITO_Market_Maturity | **New columns:** `Date_of_FX`, `ITO_Market_Maturity` | New columns; scripts referencing TBL-005 may need to allow for them |
| **TBL-006** | Column `deliveryLocations` | Rename → **deliveryRegions** (same data) | One column rename in schema/scripts |
| **New tables** | None beyond TBL-001–017 | **SLA** (master), **Service_Type_SLA** (junction) | Two new tables to ingest and (if used) query |

**Summary:** 2 column renames, 2 new columns in TBL-005, 2 new tables. No row-count changes in the existing 17 tables.

---

## 3. What we will send for v3 (after Feb 27)

- **19 table files:** 17 updated CSVs (with renames and new columns) + **SLA.csv** + **Service_Type_SLA.csv**
- **Updated schema** (R_DATABASE_SCHEMA) reflecting v3
- **Updated mapping** (R_MAXXBOT_BOTPRESS_MAPPING) including clarifications and guardrails (e.g. delivery model first for rate lookup)
- **Structured change list** (this delta table + any one-page summary we agree Monday)

---

## 4. One-liner for Siva/team

**“v3 is the last schema change: 2 renames (TBL-004 Service_Unit_Name, TBL-006 deliveryRegions), 2 new columns in TBL-005 (Date_of_FX, ITO_Market_Maturity), and 2 new tables (SLA, Service_Type_SLA). We lock v3 Feb 27 and will send the full v3 package right after. Monday sync we’ll align on scope and project plan.”**

---

*Per R_BOTPRESS_DELIVERABLE_RULES: version + date in doc.*
