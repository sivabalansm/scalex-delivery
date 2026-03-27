# v2 → v3 detailed changes (for Siva)

**Date:** 2026-02-26  
**Purpose:** Single reference for what changed from the v2 package (sent Feb 12–13) to the v3 final package. Use this to update scripts, ingestion, and bot logic.

---

## 1. Table set: 17 → 19 files

| v2 | v3 |
|----|-----|
| 17 CSV files (TBL-001 through TBL-017) | **19 files:** same 17 base tables + **SLA.csv** + **Service_Type_SLA.csv** |

**Naming:** The two new tables are **not** TBL-018 and TBL-019. They are named **SLA** (master) and **Service_Type_SLA** (junction). File names: **SLA.csv**, **Service_Type_SLA.csv**. Use these names in schema/mapping and ingestion.

---

## 2. Schema and column changes (existing 17 tables)

| Table | v2 | v3 | Siva impact |
|-------|-----|-----|-------------|
| **TBL-004** | Had Resource_Unit_Name; 4 SLA columns (SLA_Timeliness_Type, SLA_Timeliness_Default, SLA_Quality_Type, SLA_Quality_Default) | **Service_Unit_Name** (rename); **Service_Unit_Definition** (new); **4 SLA columns removed** — SLA data only in SLA + Service_Type_SLA. **Frontline_Agent_Type** populated for 244 rows (170 NULL for ENG/FR/MK/RC). | Drop SLA columns from TBL-004 in scripts. Use SLA + Service_Type_SLA for SLA-by-service. Join TBL-004 → TBL-003 via Frontline_Agent_Type for rate lookup. |
| **TBL-005** | No Date_of_FX, no ITO_Market_Maturity | **Date_of_FX**, **ITO_Market_Maturity** added | New columns; allow in ingestion. |
| **TBL-006** | Column `deliveryLocations` | Rename → **deliveryRegions** (same semantics) | One column rename in schema/scripts. |
| **TBL-001** | Stale Service_Type_Count, Vendor_Count | **Refreshed** from actual TBL-004 and TBL-008 (sum Service_Type_Count = 414) | Use for display/counts. |
| **TBL-007** | 1,462 rows; many Service_Type_IDs from old 917 taxonomy (orphaned after TBL-004 rebuild) | **Rebuilt:** 1,065 rows; every Service_Type_ID in TBL-004 has ≥1 alias; no orphan ST_IDs | Re-ingest TBL-007; alias resolution now aligns with 414 service types. |
| **TBL-008** | 4,692 rows; many Service_Type_IDs orphaned | **Filtered:** 939 rows; only Service_Type_IDs that exist in TBL-004 | Re-ingest TBL-008; vendor–service map now valid for current taxonomy. |

---

## 3. Rate lookup (WF-01 / regular capability)

| v2 | v3 |
|----|-----|
| Filter TBL-003 by Rate_Type = 'Direct_Labor' | Add **Rate_Unit = 'Per_Hour'** for **hourly** rate lookups. Omit Rate_Unit filter when user asks for per-month, per-hire, or other unit. |
| TBL-004 had SLA columns for SLA-by-service | Use **SLA.csv** + **Service_Type_SLA.csv** for SLA by service type. |

See **R_MAXXBOT_BOTPRESS_MAPPING.md** WF-01 Step 4 for exact filter wording.

---

## 4. Taxonomy and row counts (v3 final)

| Table | v2 (approx) | v3 final |
|-------|-------------|----------|
| TBL-001 | 16 | 20 |
| TBL-002 | 120 | 94 |
| TBL-003 | 1,051 | 1,105 |
| TBL-004 | 925 | **414** |
| TBL-007 | 1,462 | **1,065** |
| TBL-008 | 4,692 | **939** |
| TBL-016 | 27 | 88 |
| SLA | — | 11 (new) |
| Service_Type_SLA | — | 828 (new) |

TBL-004 was rebuilt from N taxonomy (414 service types). TBL-007 and TBL-008 were rebuilt/filtered to match.

---

## 5. Tower coverage (PS, CL, ME, EN, MO; ENG, FR, MK, RC)

- **PS, CL, ME, EN, MO:** Tower rows exist in TBL-001; categories/service types were **rehomed** (e.g. into SC, RC) or **retired** (PS). Rate lookup for these tower codes uses Tower_Code + Frontline_Agent_Type only (no TBL-004 path). See **TOWER_COVERAGE_STATUS.md**.
- **ENG, FR, MK, RC:** Have categories and service types in TBL-002/TBL-004 but **no rate rows** in TBL-003 in v3. TBL-004.Frontline_Agent_Type is NULL for these towers. Rate lookup will return no rows until TBL-003 is populated.

---

## 6. Function catalog (what to build)

| v2 framing | v3 framing |
|------------|------------|
| 12 functions; ~3 scripted (Rate Benchmark, Contract Risk, Proposal or Export) | **Regular capabilities** (rate lookup, vendor intel, location, methodology, taxonomy) + **4 scripted workflows:** (1) Contract Risk Analysis, (2) Managed Service Rate Conversion, (3) Risk Assessment, (4) Treatment Recommendation. |
| Rate Benchmark = scripted | Rate **lookup** = regular (table-driven). **Managed Service Rate Conversion** = scripted (unblended → blended/PPU with modifier walk-through). |
| WF-12 Export = scripted | Document export = **output** of scripted workflows (e.g. redlined Word from contract review), not a standalone workflow. |
| Proposal Comparison in scope | **Not** in April priority. |

See **R_FUNCTION_CATALOG.md** v2.0 for full list and table mapping.

---

## 7. One-liner for Siva

**“v3 adds 2 tables (SLA.csv, Service_Type_SLA.csv), renames 2 columns (TBL-004 Service_Unit_Name, TBL-006 deliveryRegions), adds 2 columns to TBL-005 (Date_of_FX, ITO_Market_Maturity), removes 4 SLA columns from TBL-004, and rebuilds TBL-007/TBL-008 to match 414 service types. Rate lookup uses Rate_Unit = 'Per_Hour' for hourly. Four scripted workflows for April: Contract Risk Analysis, Managed Service Rate Conversion, Risk Assessment, Treatment Recommendation. This is the last schema change before launch.”**

---

*Per R_BOTPRESS_DELIVERABLE_RULES: version + date in doc.*
