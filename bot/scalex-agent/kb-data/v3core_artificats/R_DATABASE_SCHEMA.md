# R_DATABASE_SCHEMA
## Maxx Database v3.0 — Complete Schema Specification

**Project:** R (Maxx Database — Taxonomy, Methodology & Platform Data Architecture)
**Step:** RB1
**Version:** 3.0
**Created:** 2026-02-05 | **Updated (v3):** 2026-02-23
**Status:** ENGINEERING SPECIFICATION — Hand to Botpress team + populate via Cursor
**Governing Document:** R_MAXX_METHODOLOGY_v2.md (RA3 FINAL)

**v3 changes (Round 1 agreed):** TBL-004: Resource_Unit_Name → Service_Unit_Name; added Service_Unit_Definition; **dropped** SLA_Timeliness_Type, SLA_Timeliness_Default, SLA_Quality_Type, SLA_Quality_Default — SLA data now in **SLA** + **Service_Type_SLA**. TBL-005: Date_of_FX, ITO_Market_Maturity. TBL-006: deliveryLocations → deliveryRegions. TBL-015: PLATFORM_FEE rows (ADJ-060, ADJ-061). New tables: **SLA.csv**, **Service_Type_SLA.csv**. **Modifier math:** When TBL-015.Adjustment_Type = PERCENTAGE and TBL-010.Application_Type = MULTIPLICATIVE, use **multiplier = 1 + (Adjustment_Pct/100)**.

---

## How to Read This Document

This is the build specification for Maxx Database v2.0. It covers every table, every column, every relationship, and every data quality rule. Two audiences:

**Botpress Engineering (David's team):** Build the table structures, enforce constraints, implement FK relationships, build the query APIs. Focus on Parts 1-4.

**Maxx Data Team (Alex via Cursor):** Populate data — AHT values, rate points, modifiers, vendor profiles. Focus on Part 1 (gap columns) and Part 4 (population priorities).

**Managed By** column in every table spec indicates who owns each field:
- **BOTPRESS** = Engineering builds the column, enforces constraints, provides API
- **MAXX** = Alex populates via Cursor CSV uploads or manual entry
- **SYSTEM** = Auto-generated (timestamps, IDs, computed fields)
- **CLIENT** = Populated per-engagement from client data (RB2 scope)

---

## Table of Contents

1. [Existing Table Enhancements (TBL-001 through TBL-011)](#part-1-existing-table-enhancements)
2. [New Tables (TBL-012 through TBL-017)](#part-2-new-tables)
3. [Table Relationship Map](#part-3-table-relationship-map)
4. [Column-Level Specification (All Tables)](#part-4-column-level-specification)
5. [Methodology-to-Schema Traceability](#part-5-methodology-to-schema-traceability)

---

## Table Numbering Convention (v3 Canonical)

v3 canonical: **17 base tables** (TBL-001 through TBL-017) + **2 SLA tables** = **19 files**. The SLA tables are **not** numbered TBL-018/TBL-019; they are named **SLA** and **Service_Type_SLA** (files **SLA.csv** and **Service_Type_SLA.csv**). Row counts as of 2026-02-26:

| ID | Table Name | File Name | Row Count |
|----|-------------|-----------|:---------:|
| TBL-001 | Towers | TBL-001_TOWERS_v4.csv | 20 |
| TBL-002 | Categories | TBL-002_CATEGORIES_COMPLETE.csv | 94 |
| TBL-003 | Base Rates | TBL-003_BaseRates_v7_AMENDED.csv | 1,105 |
| TBL-004 | Service Types | TBL-004_SERVICE_TYPES_v2.csv | 414 |
| TBL-005 | Locations | TBL-005_LOCATIONS_v4.csv | 398 |
| TBL-006 | Vendors | TBL-006_VENDORS_BOTPRESS_FINAL_v4.csv | 1,741 |
| TBL-007 | Service Name Aliases | TBL-007_SERVICE_NAME_ALIASES_v3.csv | 1,065 |
| TBL-008 | Service-Vendor Map | TBL-008_SERVICE_VENDOR_MAP_v4.csv | 939 |
| TBL-009 | Vendor Locations | TBL-009_VENDOR_LOCATIONS_VALIDATED.csv | 644 |
| TBL-010 | Modifiers | TBL-010_MODIFIERS.csv | 39 |
| TBL-011 | Vendor ID Mapping | TBL-011_VENDORID_MAPPING.csv | 1,741 |
| TBL-012 | Risk Assessment Rules | TBL-012_RISK_RULES_v2.csv | 50 |
| TBL-013 | Treatment Recommendations | TBL-013_TREATMENT_RECOMMENDATIONS_v2.csv | 30 |
| TBL-014 | Contract Benchmarks | TBL-014_CONTRACT_BENCHMARKS_v2.csv | 20 |
| TBL-015 | Modifier Adjustments | TBL-015_MODIFIER_ADJUSTMENTS.csv | 61 |
| TBL-016 | Taxonomy Crosswalks | TBL-016_TAXONOMY_CROSSWALKS.csv | 88 |
| TBL-017 | Managed Service Load | TBL-017_MANAGED_SERVICE_LOAD.csv | 3 |
| — | SLA (master) — file 18 | SLA.csv | 11 |
| — | Service Type SLA (junction) — file 19 | Service_Type_SLA.csv | 828 |

---

# Part 1: Existing Table Enhancements

## TBL-001: Towers

### Current State
- **Rows:** 14 (13 active + 1 "Industry Verticals" placeholder)
- **RA1 Health Score:** HIGH — structure is clean, operator-defined
- **Columns:** Tower_Code, Tower_Name, Description, Status, Service_Type_Count, Vendor_Count

### Required Changes

| Change | Column(s) | Action | Methodology Reference |
|--------|----------|--------|----------------------|
| Add display order | Sort_Order (INT) | ADD | UI presentation |
| Add icon/color for UI | Icon_Key (VARCHAR 50) | ADD | Botpress UI |
| Add APQC crosswalk reference | APQC_Process_Group (VARCHAR 100) | ADD | §A.4 — APQC as context |
| Normalize Service_Type_Count | — | COMPUTE, not stored | Derive from TBL-004 COUNT |
| Normalize Vendor_Count | — | COMPUTE, not stored | Derive from TBL-008 DISTINCT |

### Why
- Service_Type_Count and Vendor_Count are currently static columns that can drift out of sync. They should be derived from live table relationships. Keep them as cached/denormalized values but add a refresh trigger when TBL-004 or TBL-008 changes.
- APQC_Process_Group supports the canonical + crosswalk architecture (Methodology §A.4) — Maxx tower is authoritative, APQC mapping is reference.
- Sort_Order enables consistent UI display across Botpress and web interfaces.

### Data Quality Rules
- Tower_Code: UNIQUE, NOT NULL, format `[A-Z]{2,3}` (2-3 uppercase letters)
- Tower_Name: UNIQUE, NOT NULL, max 50 chars
- Status: ENUM('Active', 'Inactive', 'Placeholder')
- Service_Type_Count / Vendor_Count: Non-negative integers, refreshed on TBL-004/008 change

### Relationships
- Tower_Code → TBL-002.Tower_Code (1:many — tower has many categories)
- Tower_Code → TBL-003.Tower_Code (1:many — tower has many rate points)
- Tower_Code → TBL-006.primaryTower (1:many — tower has many vendors)

---

## TBL-002: Categories

### Current State
- **Rows:** 119 across 14 towers
- **RA1 Health Score:** GOOD — structure clean but IT needs reconciliation
- **Columns:** Category_Code, Tower_Code, Category_Name, Description

### Required Changes

| Change | Column(s) | Action | Methodology Reference |
|--------|----------|--------|----------------------|
| Add CAT-IT-009 (Enterprise Software & Platforms) | New row | ADD ROW | §A.3 — RA3 Decision #5 |
| Rename CAT-IT-003 | Service Desk → End-User Services | UPDATE | §A.3 — RA3 Decision #6 |
| Rename CAT-IT-007 | IT Consulting → IT Consulting & Advisory | UPDATE | §A.3 — RA3 Decision #6 |
| Rename CAT-IT-008 | Network & Communications → Network & Telecommunications | UPDATE | §A.3 — RA3 Decision #6 |
| Add APQC crosswalk | APQC_Category_Ref (VARCHAR 100) | ADD COLUMN | §A.4 |
| Add Framework Bible crosswalk | FB_Category_Ref (VARCHAR 50) | ADD COLUMN | RA2 canonical + crosswalks |
| Add Falcon crosswalk (IT only) | Falcon_Category_Ref (VARCHAR 50) | ADD COLUMN | RA2 IT reconciliation |
| Add sort order | Sort_Order (INT) | ADD COLUMN | UI consistency |
| Add validation flag | Validated_By_Assessment (BOOLEAN) | ADD COLUMN | §I — data provenance |

### Why
- IT category updates implement the 4 approved RA3 decisions. Category count goes from 119 → 120 (one new IT category).
- Crosswalk columns implement the "canonical + mapped" architecture (RA2, Methodology §A.3). Botpress categories are authoritative; other systems' categories map to them.
- Validated_By_Assessment tracks which categories have been tested in real client work (currently only HR + partial IT).

### Data Quality Rules
- Category_Code: UNIQUE, NOT NULL, format `CAT-[A-Z]{2,3}-\d{3}` (e.g., CAT-HR-001)
- Tower_Code: FK to TBL-001, NOT NULL
- Category_Name: NOT NULL, max 100 chars, no duplicates within same tower
- Validated_By_Assessment: Default FALSE — set TRUE when used in a client assessment

### Relationships
- Category_Code → TBL-004.SubCategory_Code (1:many — category has many service types). **NOTE:** TBL-004's column is named `SubCategory_Code` from legacy 5-level taxonomy. In v2.0, this IS the Category reference (4-level model). Rename to `Category_Code` is recommended.
- Tower_Code → TBL-001.Tower_Code (many:1 — FK)

---

## TBL-003: Base Rates

### Current State
- **Rows:** 1,054 rate points
- **RA1 Health Score:** STRUCTURALLY INCOMPLETE — T&M only, no outcome-based columns
- **Columns:** Rate_ID, Tower_Code, Agent_Type, Tier, Location_Code, Rate_Low_USD, Rate_High_USD, Rate_Median_USD, Currency_Local, Rate_Low_Local, Rate_High_Local, Rate_Unit, Pricing_Model, Effective_Date, Source, Confidence, Last_Updated
- **Key Issues:** Mixed-case Confidence values, 987/1,054 are T&M only, "OT" Tower_Code not in TBL-001

### Required Changes

| Change | Column(s) | Action | Methodology Reference |
|--------|----------|--------|----------------------|
| Add outcome-based pricing | Rate_Per_Unit_Low_USD, Rate_Per_Unit_High_USD, Rate_Per_Unit_Median_USD (DECIMAL) | ADD 3 COLUMNS | §D.1 — frontline agent conversion chain |
| Add resource unit type | Resource_Unit_Type (VARCHAR 50) | ADD | §B.2 — Q in P×Q |
| Add AHT used for conversion | AHT_Minutes_Used (DECIMAL) | ADD | §D.1 — conversion chain |
| Add confidence score (numeric) | Confidence_Score (INT 0-100) | ADD | §C.3 — deterministic formula |
| Add source type enum | Source_Type (ENUM) | ADD | §I.3 — row-level provenance |
| Normalize Confidence to uppercase | Confidence | UPDATE all rows | RA1 finding — mixed case |
| Add percentile labels | Rate_Percentile (ENUM P25/P50/P75) | ADD | §J.1 — range engine |
| Remove/remap "OT" tower code | Tower_Code = 'OT' (35 rows) | REMAP or ADD OT to TBL-001 | RA1 finding — orphaned FK |
| Add methodology version | Methodology_Version (VARCHAR 10) | ADD | §I — governance |

### Why
- **Outcome-based columns are the #1 structural gap.** The methodology (§D.1) establishes that all pricing converts between hourly and per-unit using the frontline agent anchoring chain: `Blended Hourly Rate × AHT = Price Per Resource Unit`. Currently, 987/1,054 rows store only hourly rates. Adding per-unit columns enables MaxxBot to quote per-transaction prices directly.
- **Numeric confidence score** replaces qualitative labels with the deterministic formula from §C.3. The text label (HIGH/MEDIUM/LOW) is derived from the score, not the other way around.
- **"OT" tower code** (35 rows) has no parent in TBL-001. Decision needed: remap to the closest valid tower or add "OT" (Other/Unclassified) to TBL-001.

### Data Quality Rules
- Rate_ID: UNIQUE, NOT NULL, format `RATE-[A-Z]{2,3}-[A-Z0-9]+-T\d-[A-Z]{2}-[A-Z]{3}`
- Tower_Code: FK to TBL-001, NOT NULL
- Location_Code: FK to TBL-005, NOT NULL
- Rate_Low_USD ≤ Rate_Median_USD ≤ Rate_High_USD (range integrity)
- Rate_Per_Unit columns: computed from hourly × AHT, NULL if AHT unknown
- Confidence: ENUM('HIGH', 'MEDIUM', 'LOW') — uppercase only
- Confidence_Score: INT 0-100, derived from §C.3 formula
- Source_Type: ENUM('client_actual', 'analyst_report', 'compensation_data', 'maxx_derived', 'industry_survey', 'estimated', 'default_assumption')
- Effective_Date: NOT NULL, format YYYY-MM-DD

### Relationships
- Tower_Code → TBL-001.Tower_Code
- Location_Code → TBL-005.Location_Code
- **Frontline_Agent_Type** → TBL-004.Frontline_Agent_Type (join for rate lookup; use this column for WF-01). **Agent_Type** retained as source/legacy; many values normalized to Frontline_Agent_Type via R_AGENT_TYPE_TO_FRONTLINE_MAPPING.csv (task 11c).

---

## TBL-004: Service Types

### Current State (v3)
- **Rows:** 414 service types (v3 final; N taxonomy)
- **Columns:** Service_Type_ID, Category_Code, Parent_Category_Code, Service_Type_Name, Description, Delivery_Channel, Primary_Pricing_Model, **Benchmark_Unit**, Frontline_Agent_Type, Managed_Service_Load, Tier_Structure, Default_AHT_Minutes, Required_Modifiers, Optional_Modifiers, Typical_Vendors, Confidence, AHT_Data_Tier, AHT_Source, Complexity_Tier, **Service_Unit_Name**, **Service_Unit_Definition**, Typical_Volume_Low, Typical_Volume_High, Confidence_Score
- **v3:** SLA columns **removed** — SLA data is in **SLA** + **Service_Type_SLA** (junction-only). **Benchmark_Unit** = Pricing Unit (Q in P×Q); **Service_Unit_Name** = outcome unit name; **Service_Unit_Definition** = TEXT description of outcome (e.g. "processed employee enrollment").
- **Key Issues:** AHT gaps remain; data population in separate workstream.

### Required Changes

| Change | Column(s) | Action | Methodology Reference |
|--------|----------|--------|----------------------|
| Rename SubCategory_Code → Category_Code | SubCategory_Code | RENAME | §A.1 — 4-level taxonomy (no subcategory level) |
| Add AHT data tier | AHT_Data_Tier (ENUM) | ADD | §C.1 — assumption tier tracking |
| Add AHT source | AHT_Source (VARCHAR 200) | ADD | §I.3 — provenance |
| Add complexity tier | Complexity_Tier (ENUM) | ADD | §E.2 Cat B — COMPLEXITY_ADJ |
| Add resource unit name | Resource_Unit_Name (VARCHAR 100) | ADD | §B.2 — Q in P×Q |
| Add typical volume range | Typical_Volume_Low, Typical_Volume_High (INT) | ADD 2 | Pricing estimation support |
| Add IT service types for CAT-IT-009 | 8-12 new rows | ADD ROWS | RA3 Decision #5 |
| Normalize Confidence | Confidence | STANDARDIZE | Same as TBL-003 issue |
| Add numeric confidence | Confidence_Score (INT 0-100) | ADD | §C.3 |

### Why
- **Renaming SubCategory_Code** is the single most important structural change. The 4-level taxonomy (RA3 Decision #1) eliminates "subcategory" as a formal level. This column IS the category reference. Current values like `CAT-HR-007-01` are category codes despite the column name — this rename aligns naming with reality.
- **AHT_Data_Tier** tracks whether the AHT value is Tier 1 (client-provided actual), Tier 2 (contract-derived), Tier 3 (published benchmark), Tier 4 (workflow assumption), or Tier 5 (treatment-level default). Critical for transparency.
- **Resource_Unit_Name** stores what the Q is for this service type (e.g., "processed payroll", "resolved ticket", "completed call"). This is the unit that gets multiplied by price per unit.
- **Complexity_Tier** enables the COMPLEXITY_ADJ modifier (Simple 0.8x, Standard 1.0x, Complex 1.3x, Highly Complex 1.6x).

### Data Quality Rules
- Service_Type_ID: UNIQUE, NOT NULL, format `ST-[A-Z]{2,3}-\d{3}-\d{2}-\d{2}`
- Category_Code (renamed): FK to TBL-002.Category_Code, NOT NULL
- Default_AHT_Minutes: DECIMAL ≥ 0, NULL allowed (means "unknown — use Tier 5 default")
- AHT_Data_Tier: ENUM('T1_CLIENT_ACTUAL', 'T2_CONTRACT_DERIVED', 'T3_PUBLISHED_BENCHMARK', 'T4_WORKFLOW_ASSUMPTION', 'T5_TREATMENT_DEFAULT', 'UNKNOWN')
- Complexity_Tier: ENUM('Simple', 'Standard', 'Complex', 'Highly_Complex'), default 'Standard'
- Frontline_Agent_Type: NOT NULL — every service type must have a defined frontline agent
- **SLA:** Use **SLA** + **Service_Type_SLA** tables for SLA by service type (v3 junction-only; do not use TBL-004 SLA columns — removed).

### Relationships
- Category_Code → TBL-002.Category_Code (many:1) — **use Category_Code for FK** (not Parent_Category_Code) in WF-01 and queries
- **Managed_Service_Load** → TBL-017.Load_Level (many:1 — used to derive blended rate from unblended)
- Service_Type_ID → **Service_Type_SLA** (1:many — SLA targets per service type)
- Service_Type_ID → TBL-007.Service_Type_ID (1:many — service type has many aliases)
- Service_Type_ID → TBL-008.Service_Type_ID (1:many — service type has many vendor mappings)
- Service_Type_ID → TBL-003 via Frontline_Agent_Type + Tower lookup (implicit rate linkage)
- Service_Type_ID → TBL-015 modifier applicability via TBL-010

---

## SLA: SLA Master (v3)

### Purpose
Master list of SLA types (Timeliness, Quality, etc.). Botpress uses **SLA** + **Service_Type_SLA** for SLA by service type; TBL-004 no longer holds SLA columns.

### Schema
| Column | Data Type | Description |
|--------|-----------|-------------|
| SLA_ID | VARCHAR(20) | PK (e.g. SLA-001) |
| SLA_Name | VARCHAR(100) | Type name (e.g. Processing, Accuracy) |
| SLA_Type | VARCHAR(20) | Timeliness | Quality |
| Default_Target | VARCHAR(200) | Optional default target text |
| Unit | VARCHAR(20) | percent | hours |
| Description | TEXT | Optional |

### Relationships
- SLA_ID → Service_Type_SLA.SLA_ID (1:many)

---

## Service_Type_SLA: Service Type × SLA Junction (v3)

### Purpose
Links each service type to its SLA(s) with optional target override. **Use this table** (not TBL-004) for SLA retrieval in Botpress.

### Schema
| Column | Data Type | Description |
|--------|-----------|-------------|
| Service_Type_SLA_ID | VARCHAR(20) | PK (e.g. STSLA-00001) |
| Service_Type_ID | VARCHAR(30) | FK to TBL-004 |
| SLA_ID | VARCHAR(20) | FK to SLA |
| Target_Override | VARCHAR(200) | Service-type-specific target (from legacy TBL-004 SLA_*_Default) |
| Display_Order | INT | Order for UI |

### Relationships
- Service_Type_ID → TBL-004.Service_Type_ID (many:1)
- SLA_ID → SLA.SLA_ID (many:1)

---

## TBL-005: Locations

### Current State (v3)
- **Rows:** 398 locations
- **Columns:** Location_Code, Country, City, Region, Currency_Code, USD_FX_Rate, **Date_of_FX**, Cost_Index, **US_Reference_Index**, Timezone, Labor_Market_Tier, Notes, BPO_Market_Maturity, **ITO_Market_Maturity**, Benefit_Burden_Pct, Index_Source, Index_Confidence, Last_Calibrated, High_Inflation_Flag, Change_Notes
- **v3:** **Date_of_FX** = snapshot date for FX (e.g. 2026-02-01). **ITO_Market_Maturity** = ITO/tech talent maturity (empty for now). India (IN-BLR) Cost_Index = 100.

### Required Changes

| Change | Column(s) | Action | Methodology Reference |
|--------|----------|--------|----------------------|
| Recalibrate Cost_Index to India=100 | Cost_Index | RECALCULATE all values | §F.1 — India base index (Locked Decision #10) |
| Add US reference index | US_Reference_Index (DECIMAL) | ADD | §F.1 — dual expression |
| Add mandatory benefit burden % | Benefit_Burden_Pct (DECIMAL) | ADD | §F.3 — burden rates built into index |
| Add index source/confidence | Index_Source (VARCHAR 100), Index_Confidence (ENUM) | ADD 2 | §I — provenance |
| Add last calibration date | Last_Calibrated (DATE) | ADD | §F.4 — maintenance cadence |
| Add inflation risk flag | High_Inflation_Flag (BOOLEAN) | ADD | §F.4 — quarterly refresh for high-inflation markets |
| Rename CL_Strength_Rating | BPO_Market_Maturity (INT 1-5) | RENAME | Clearer semantics |

### Why
- **India=100 recalibration is Locked Decision #10.** The current Cost_Index uses a US-centric scale (~100 = US). The methodology requires India (Bangalore) = 100 as the base, with US as secondary reference (~1,370). Every location's index must be recalculated. Formula: `New_Index = (Current_Index / India_Current) × 100`.
- **US_Reference_Index** provides the dual expression needed for C-level business cases (§F.1): "Manila is 2x India cost but 85% cheaper than US."
- **Benefit_Burden_Pct** documents the employer burden rates built into the cost index — critical for transparency (§F.3: Brazil 65-80%, India 20-25%, Philippines 15-22%).
- **High_Inflation_Flag** triggers quarterly refresh cadence for markets like Argentina, Turkey, Egypt, Nigeria (§F.4).

### Data Quality Rules
- Location_Code: UNIQUE, NOT NULL, format `[A-Z]{2}-[A-Z]{3}` (country-city)
- Country: NOT NULL
- Cost_Index: INT > 0, India (Bangalore) = 100 reference
- US_Reference_Index: DECIMAL, computed as (Cost_Index × 7.3) / 100
- USD_FX_Rate: DECIMAL > 0, updated per maintenance cadence
- Labor_Market_Tier: ENUM('1', '2', '3') per §F city tier model
- Last_Calibrated: NOT NULL, must be within maintenance cadence window

### Relationships
- Location_Code → TBL-003.Location_Code (1:many — location has many rate points)
- Location_Code → TBL-009.Location_Code (1:many — location has many vendor sites)

---

## TBL-006: Vendors (Botpress Profiles)

### Current State
- **Rows:** 1,741 vendor profiles
- **RA1 Health Score:** GOOD for basic profiles, sparse on structured data
- **Columns:** vendorId, vendorName, primaryTower, secondaryTowers, hqCountry, ownership, revenueUsd, employeeCount, deliveryCenterCount, deliveryLocations, certifications, keyClients, serviceCapabilities, competitivePosition, strengths, weaknesses, redFlags, pricingModel, financialHealthScore, batch

### Required Changes

| Change | Column(s) | Action | Methodology Reference |
|--------|----------|--------|----------------------|
| Standardize column naming | All columns | RENAME to snake_case | Engineering standards |
| Add Maxx vendor tier | Maxx_Vendor_Tier (ENUM) | ADD | Assessment risk scoring |
| Add last researched date | Last_Researched (DATE) | ADD | §K — data refresh pipeline |
| Add data completeness score | Profile_Completeness_Pct (INT) | ADD | §I — data quality |
| Add contract risk indicators | Risk_Score (INT 1-100) | ADD | TBL-012 linkage |
| Normalize revenue to numeric | Revenue_USD_Numeric (BIGINT) | ADD | Current revenueUsd is string with "$" and "M" |
| Normalize employee count | Employee_Count_Numeric (INT) | ADD | Current employeeCount has "," and "+" chars |

### Why
- **Column naming standardization** — current columns use camelCase (vendorId, vendorName) unlike all other tables which use PascalCase or snake_case. Align to consistent convention.
- **Profile_Completeness_Pct** tracks what % of the 20 profile fields are populated. RA1 identified that many vendor profiles have sparse structured data.
- **Numeric revenue/employee columns** enable sorting and filtering. Current string values like "$64900M" or "774000.0" need normalization.
- **Maxx_Vendor_Tier** (Strategic/Preferred/Approved/Conditional/Not_Assessed) supports assessment risk scoring and RFP vendor shortlisting.

### Data Quality Rules
- Vendor_ID: UNIQUE, NOT NULL, format `VND-\d{4}`
- Vendor_Name: NOT NULL, max 200 chars
- Primary_Tower: FK to TBL-001.Tower_Code, NOT NULL
- Financial_Health_Score: ENUM('A', 'B', 'C', 'D', 'F', 'NR'), default 'NR' (Not Rated)
- Profile_Completeness_Pct: INT 0-100, auto-computed from non-null field count
- Revenue_USD_Numeric: BIGINT, NULL allowed (not all vendors disclose)

### Relationships
- Vendor_ID → TBL-008.Vendor_ID (1:many — vendor mapped to many service types)
- Vendor_ID → TBL-009.Vendor_ID (1:many — vendor has many delivery locations)
- Vendor_ID → TBL-011.Vendor_ID (1:1 — vendor has one search key mapping)
- Primary_Tower → TBL-001.Tower_Code (many:1)

---

## TBL-007: Service Name Aliases

### Current State
- **Rows:** 1,065 aliases; every TBL-004 Service_Type_ID has ≥1 alias (v3 final)
- **RA1 Health Score:** EXCELLENT — full coverage, serves as NLP routing layer
- **Columns:** Alias_ID, User_Term, Service_Type_ID, Service_Type_Name, Confidence

### Required Changes

| Change | Column(s) | Action | Methodology Reference |
|--------|----------|--------|----------------------|
| Add alias source | Source (ENUM) | ADD | §G.4 — feedback loop tracks where aliases come from |
| Add usage count | Usage_Count (INT) | ADD | §G.4 — track which aliases are actually used |
| Add created date | Created_Date (DATE) | ADD | §K — refresh pipeline |
| Add active flag | Is_Active (BOOLEAN) | ADD | Support deprecation without deletion |
| Add tower shortcut | Tower_Code (VARCHAR 3) | ADD (denormalized) | §G.2 — Step 1 Tower ID uses aliases directly |

### Why
- **Alias source tracking** supports the feedback loop (§G.4): aliases can come from initial population ("SEED"), user interaction ("USER_GENERATED"), assessment work ("ASSESSMENT_DERIVED"), or research ("RESEARCH").
- **Usage_Count** enables prioritization — heavily-used aliases should have higher confidence; unused aliases may be candidates for review.
- **Tower_Code denormalization** speeds up Step 1 (Tower Identification) of the forcing function — instead of joining through Service_Type → Category → Tower, the alias directly provides the tower.

### Data Quality Rules
- Alias_ID: UNIQUE, NOT NULL, format `ALI-\d{5}`
- User_Term: NOT NULL, max 200 chars, lowercase normalized
- Service_Type_ID: FK to TBL-004.Service_Type_ID, NOT NULL
- Confidence: ENUM('HIGH', 'MEDIUM', 'LOW')
- No duplicate User_Term values (each term maps to exactly one service type)

### Relationships
- Service_Type_ID → TBL-004.Service_Type_ID (many:1)
- Tower_Code → TBL-001.Tower_Code (denormalized, many:1)

---

## TBL-008: Service-Vendor Map

### Current State
- **Rows:** 939 mappings; only Service_Type_IDs that exist in TBL-004 (v3 final)
- **RA1 Health Score:** GOOD — comprehensive coverage
- **Columns:** Service_Type_ID, Vendor_ID, Vendor_Name, Analyst_Ranking, Analyst_Source, Ranking_Tier, Vendor_Type, Founded_Year, Confidence, As_Of_Date, Source_Type, Notes

### Required Changes

| Change | Column(s) | Action | Methodology Reference |
|--------|----------|--------|----------------------|
| Add composite PK | Mapping_ID (VARCHAR 20) | ADD | Engineering — need unique row identifier |
| Add Maxx recommendation tier | Maxx_Rec_Tier (ENUM) | ADD | Assessment vendor shortlisting |
| Add price competitiveness | Price_Position (ENUM) | ADD | §D — pricing context |
| Add delivery location link | Typical_Delivery_Location (VARCHAR 10) | ADD | Links to TBL-005 for location-aware vendor recs |

### Why
- **Composite PK** — currently the table has no single unique identifier. Service_Type_ID + Vendor_ID should be unique but a synthetic Mapping_ID simplifies references.
- **Maxx_Rec_Tier** (Leader/Strong/Competitive/Niche/Not_Recommended) provides Maxx's own vendor assessment layered on top of analyst rankings.
- **Price_Position** (Below_Market/Market/Above_Market/Premium) helps MaxxBot contextualize vendor recommendations with pricing expectations.

### Data Quality Rules
- Mapping_ID: UNIQUE, NOT NULL, auto-generated
- Service_Type_ID: FK to TBL-004, NOT NULL
- Vendor_ID: FK to TBL-006.Vendor_ID, NOT NULL
- (Service_Type_ID, Vendor_ID): UNIQUE constraint — no duplicate mappings
- Analyst_Ranking: nullable (not all mappings have analyst coverage)
- Ranking_Tier: DECIMAL, nullable

### Relationships
- Service_Type_ID → TBL-004.Service_Type_ID (many:1)
- Vendor_ID → TBL-006.Vendor_ID (many:1)
- Typical_Delivery_Location → TBL-005.Location_Code (many:1, nullable)

---

## TBL-009: Vendor Locations

### Current State
- **Rows:** 644 location records for ~35 vendors
- **RA1 Health Score:** CRITICAL GAP — only 2% vendor coverage (35/1,741)
- **Columns:** VendorLocation_ID, Vendor_ID, Vendor_Name, Location_Code, City, Country, Site_Type, Headcount_Range, Services_Offered, Source, Last_Verified

### Required Changes

| Change | Column(s) | Action | Methodology Reference |
|--------|----------|--------|----------------------|
| Add location tier | Location_Tier (ENUM) | ADD | §F — city tier differential |
| Add capacity indicator | Capacity_Status (ENUM) | ADD | Vendor selection context |
| Add delivery model | Delivery_Model (ENUM) | ADD | Onshore/nearshore/offshore classification |
| Expand coverage | Target: 200+ vendors (top by spend) | ADD ROWS via RD3 | RA1 gap — 98% missing |

### Why
- **2% coverage is a critical gap** — MaxxBot cannot recommend location-specific vendors without knowing where vendors deliver from. RD3 targets expanding to at least 200 vendors (the top vendors by service coverage across all towers).
- **Delivery_Model** (Onshore/Nearshore/Offshore/Hybrid) enables the location arbitrage modifiers (§E.2 Category A) — client asks for a service type, MaxxBot recommends vendors with delivery options at different cost tiers.

### Data Quality Rules
- VendorLocation_ID: UNIQUE, NOT NULL, format `VL-\d{4}`
- Vendor_ID: FK to TBL-006.Vendor_ID, NOT NULL
- Location_Code: FK to TBL-005.Location_Code, NOT NULL
- Site_Type: ENUM('HQ', 'Delivery_Center', 'Sales_Office', 'Innovation_Hub', 'Shared_Services')
- Delivery_Model: ENUM('Onshore', 'Nearshore', 'Offshore', 'Hybrid')
- Last_Verified: DATE, NOT NULL — triggers re-research when >12 months old

### Relationships
- Vendor_ID → TBL-006.Vendor_ID (many:1)
- Location_Code → TBL-005.Location_Code (many:1)

---

## TBL-010: Modifiers

### Current State
- **Rows:** 8 qualitative modifiers
- **RA1 Health Score:** CRITICALLY INCOMPLETE — need 36+ with quantitative adjustments
- **Columns:** Modifier_Code, Modifier_Name, Question_Text, Value_Type, Common_Values, Triggers_For, Priority, Required_By_Default

### Required Changes

| Change | Column(s) | Action | Methodology Reference |
|--------|----------|--------|----------------------|
| Expand from 8 → 36+ modifiers | All columns | ADD 28+ ROWS | §E.1-E.2 — full modifier framework |
| Add modifier category | Modifier_Category (ENUM) | ADD | §E.2 — 7 categories (A-G) |
| Add application type | Application_Type (ENUM) | ADD | §E.3 — multiplicative vs additive |
| Add sequence step | Application_Step (INT 1-8) | ADD | §E.3 — 8-step application sequence |
| Add scope/tower applicability | Applies_To_Towers (VARCHAR 100) | ADD | Not all modifiers apply to all towers |
| Link to quantitative values | → TBL-015 (new table) | FK REFERENCE | Separates modifier definition from rate values |

### Why
- **This is the #2 structural gap after outcome-based rates.** The methodology (§E) defines 36+ modifiers in 7 categories (Location, Specialization, Volume, Quality, Regulatory, Technology, Contract Structure), each with validated quantitative ranges. The current 8 qualitative selectors cannot apply pricing adjustments.
- **TBL-015 (new)** stores the actual rate adjustment values per modifier — separating definition (TBL-010) from quantification (TBL-015) follows normalization best practices. TBL-010 defines WHAT modifiers exist; TBL-015 defines HOW MUCH they adjust.
- **Application_Step** enforces the 8-step sequence from §E.3: Steps 2-4 multiplicative, Steps 5-8 additive.

### Data Quality Rules
- Modifier_Code: UNIQUE, NOT NULL, format `[A-Z_]+` (e.g., LOC_PREMIUM, CLINICAL_SPEC)
- Modifier_Category: ENUM('A_LOCATION', 'B_SPECIALIZATION', 'C_VOLUME', 'D_QUALITY', 'E_REGULATORY', 'F_TECHNOLOGY', 'G_CONTRACT')
- Application_Type: ENUM('MULTIPLICATIVE', 'ADDITIVE')
- Application_Step: INT 1-8, NOT NULL
- Priority: INT 1-10, used for ordering modifier questions within a category

### Relationships
- Modifier_Code → TBL-015.Modifier_Code (1:many — modifier has many rate adjustment values)
- Triggers_For references TBL-001.Tower_Code values (comma-separated → normalize to junction table or use Applies_To_Towers)

---

## TBL-011: Vendor ID Mapping

### Current State
- **Rows:** 1,741 (1:1 with TBL-006)
- **RA1 Health Score:** EXCELLENT — clean 1:1 mapping, no orphans
- **Columns:** Vendor_Name, Vendor_ID, Search_Key

### Required Changes

| Change | Column(s) | Action | Methodology Reference |
|--------|----------|--------|----------------------|
| Add alternative names | Alt_Names (TEXT) | ADD | Vendors have multiple legal entities, DBAs |
| Add parent company | Parent_Vendor_ID (VARCHAR 10) | ADD | Vendor consolidation for assessment work |
| Add active flag | Is_Active (BOOLEAN) | ADD | Support vendor lifecycle management |

### Why
- **Alt_Names** supports NLP matching — "Accenture" may appear in client data as "Accenture LLP", "Accenture PLC", "Accenture Federal Services", etc. The search_key provides one normalized form; Alt_Names allows fuzzy matching against multiple.
- **Parent_Vendor_ID** enables vendor consolidation analysis (e.g., all UHG subsidiaries roll up to one parent in assessment work). This is critical for the assessment product — Nielsen HR identified UHG concentration risk only after manual vendor grouping.

### Data Quality Rules
- Vendor_ID: UNIQUE, NOT NULL, FK to TBL-006.Vendor_ID, 1:1
- Vendor_Name: NOT NULL, exact match to TBL-006.Vendor_Name
- Search_Key: NOT NULL, lowercase, no special characters
- Parent_Vendor_ID: FK to self (TBL-011.Vendor_ID), nullable — NULL means vendor IS the parent

### Relationships
- Vendor_ID → TBL-006.Vendor_ID (1:1)
- Parent_Vendor_ID → TBL-011.Vendor_ID (self-referential, many:1 — many subsidiaries to one parent)

---

# Part 2: New Tables

## TBL-012: Risk Assessment Rules

### Purpose
Stores the rules engine that drives risk scoring in the Assessment product. When client data is ingested, each spend line is evaluated against these rules to produce risk flags and severity scores.

### Design Rationale (Methodology §H)
The Assessment product identifies risk by comparing client data patterns against known risk indicators. Currently these rules are embedded in Python scripts (~9,500 lines). Externalizing them to a database table makes the risk engine configurable without code changes, and allows Botpress to query risk rules for MaxxBot advisory.

### Schema

| Column | Data Type | Constraints | Default | Managed By | Methodology Ref |
|--------|-----------|-------------|---------|------------|----------------|
| Rule_ID | VARCHAR(20) | PK, NOT NULL | — | SYSTEM | §H |
| Rule_Name | VARCHAR(200) | NOT NULL | — | MAXX | §H |
| Rule_Category | ENUM | NOT NULL | — | MAXX | §H |
| Applicable_Towers | VARCHAR(100) | — | 'ALL' | MAXX | §A.1 |
| Condition_Type | ENUM | NOT NULL | — | MAXX | — |
| Condition_Config | JSON | NOT NULL | — | MAXX | — |
| Severity_Weight | DECIMAL(3,1) | NOT NULL, 1.0-5.0 | 3.0 | MAXX | — |
| Recommended_Treatment | VARCHAR(50) | — | — | MAXX | §H — product map |
| Description | TEXT | — | — | MAXX | — |
| Mitigation_Text | TEXT | — | — | MAXX | User-facing mitigation narrative (Gemini/GPT review) |
| Is_Active | BOOLEAN | NOT NULL | TRUE | MAXX | — |
| Created_Date | DATE | NOT NULL | CURRENT_DATE | SYSTEM | — |
| Last_Updated | DATE | NOT NULL | CURRENT_DATE | SYSTEM | — |

**Rule_Category values:** 'SPEND_CONCENTRATION', 'VENDOR_RISK', 'CONTRACT_WEAKNESS', 'RATE_ANOMALY', 'COMPLIANCE_GAP', 'GOVERNANCE_GAP', 'MARKET_RISK'

**Condition_Type values:** 'THRESHOLD' (spend > X), 'RATIO' (vendor % > Y), 'PATTERN' (non-PO rate > Z%), 'MISSING_DATA' (contract absent), 'BENCHMARK_DEVIATION' (rate > P75 + margin)

**Condition_Config example (JSON):**
```json
{
  "field": "vendor_spend_pct",
  "operator": ">",
  "value": 0.40,
  "scope": "category",
  "description": "Single vendor >40% of category spend"
}
```

### Estimated Initial Rows: 50-75 rules

### Relationships
- Applicable_Towers references TBL-001.Tower_Code values
- Recommended_Treatment references Maxx product codes (Assessment, MIMO, CO, SA)

---

## TBL-013: Treatment Recommendations

### Purpose
Maps assessment findings (risk flags, savings opportunities) to specific Maxx product recommendations with estimated impact ranges. This is the "so what" table — it answers "you found this problem, here's what to do about it."

### Design Rationale (Methodology §H)
The product integration map (§H) shows how each product addresses different types of findings. This table formalizes that mapping so Assessment reports can automatically generate product recommendations with estimated savings ranges.

### Schema

| Column | Data Type | Constraints | Default | Managed By | Methodology Ref |
|--------|-----------|-------------|---------|------------|----------------|
| Treatment_ID | VARCHAR(20) | PK, NOT NULL | — | SYSTEM | §H |
| Finding_Type | ENUM | NOT NULL | — | MAXX | §H |
| Recommended_Product | ENUM | NOT NULL | — | MAXX | §H |
| Treatment_Level | ENUM | NOT NULL | — | MAXX | §D — treatment vs granular |
| Savings_Rate_Low_Pct | DECIMAL(4,1) | — | — | MAXX | Locked Decision #11 |
| Savings_Rate_High_Pct | DECIMAL(4,1) | — | — | MAXX | Locked Decision #11 |
| Implementation_Timeline | VARCHAR(50) | — | — | MAXX | §H |
| Prerequisites | TEXT | — | — | MAXX | — |
| Applicable_Towers | VARCHAR(100) | — | 'ALL' | MAXX | §A.1 |
| Priority_Level | ENUM | NOT NULL | 'MEDIUM' | MAXX | — |
| Description | TEXT | — | — | MAXX | — |

**Finding_Type values:** 'RATE_ABOVE_BENCHMARK', 'CONTRACT_EXPIRING', 'NON_PO_SPEND', 'VENDOR_CONCENTRATION', 'ROGUE_SPEND', 'SLA_UNDERPERFORMANCE', 'COMPLIANCE_GAP', 'VOLUME_OPPORTUNITY', 'CONSOLIDATION_OPPORTUNITY'

**Recommended_Product values:** 'ASSESSMENT', 'MIMO', 'CONTRACTING_OFFICE', 'SOURCING_ACCELERATOR', 'MAXXBOT', 'REFRESH'

**Treatment_Level values:** 'TREATMENT' (percentage-based, Locked Decision #11), 'GRANULAR' (service-type-level rate comparison), 'HYBRID'

**Priority_Level values:** 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'

### Seed Data (from Locked Decision #11)

| Finding | Product | Savings Low | Savings High | Source |
|---------|---------|:----------:|:-----------:|--------|
| Rate above benchmark | Sourcing Accelerator | 8% | 15% | Negotiation treatment |
| Contract weakness | Contracting Office | 3% | 5% | Contract optimization treatment |
| Invoice anomaly | MIMO | 2% | 3% | Invoice management treatment |
| Governance gap | VMO/Assessment | 1% | 2% | Vendor management treatment |

### Estimated Initial Rows: 30-50 treatment mappings

### Relationships
- Finding_Type ← TBL-012.Rule_Category (conceptual link — rules identify findings, treatments address them)
- Recommended_Product references Maxx product codes

---

## TBL-014: Contract Benchmarks

### Purpose
Stores benchmark contract terms (not just pricing) for comparison during contract review. Covers term length, auto-renewal, termination provisions, SLA structures, liability caps, and governance requirements by service type.

### Design Rationale (Methodology §E.2 Category G + §H CO product)
The Contracting Office product needs to compare client contract terms against market benchmarks. Currently this knowledge is in the methodology narrative — it needs to be queryable data.

### Schema

| Column | Data Type | Constraints | Default | Managed By | Methodology Ref |
|--------|-----------|-------------|---------|------------|----------------|
| Benchmark_ID | VARCHAR(20) | PK, NOT NULL | — | SYSTEM | — |
| Tower_Code | VARCHAR(3) | FK, NOT NULL | — | MAXX | §A.1 |
| Category_Code | VARCHAR(15) | FK | — | MAXX | §A.1 |
| Term_Element | ENUM | NOT NULL | — | MAXX | §E.2 Cat G |
| Benchmark_Low | VARCHAR(100) | — | — | MAXX | — |
| Benchmark_Median | VARCHAR(100) | — | — | MAXX | — |
| Benchmark_High | VARCHAR(100) | — | — | MAXX | — |
| Unit | VARCHAR(50) | — | — | MAXX | — |
| Risk_If_Outside_Range | ENUM | — | 'MEDIUM' | MAXX | — |
| Source | VARCHAR(200) | — | — | MAXX | §I.2 |
| Confidence | ENUM | — | 'MEDIUM' | MAXX | §C.3 |
| Last_Updated | DATE | — | CURRENT_DATE | SYSTEM | — |

**Term_Element values:** 'CONTRACT_DURATION', 'AUTO_RENEWAL_PERIOD', 'TERMINATION_NOTICE', 'TERMINATION_FEE', 'SLA_PENALTY_RANGE', 'SLA_EARN_BACK', 'LIABILITY_CAP', 'INDEMNIFICATION', 'GOVERNANCE_CADENCE', 'RATE_ESCALATION', 'VOLUME_COMMITMENT', 'EXCLUSIVITY_CLAUSE', 'DATA_PROTECTION', 'IP_OWNERSHIP', 'TRANSITION_ASSISTANCE'

### Example Data

| Tower | Element | Low | Median | High | Unit |
|-------|---------|-----|--------|------|------|
| HR | CONTRACT_DURATION | 12 | 36 | 60 | months |
| IT | TERMINATION_NOTICE | 30 | 90 | 180 | days |
| CO | SLA_PENALTY_RANGE | 3 | 5 | 10 | % of monthly fees |
| ALL | RATE_ESCALATION | 0 | 2 | 4 | % annual |

### Estimated Initial Rows: 100-200 benchmarks (15 elements × ~14 towers)

### Relationships
- Tower_Code → TBL-001.Tower_Code
- Category_Code → TBL-002.Category_Code (nullable — some benchmarks are tower-level)

---

## TBL-015: Modifier Rate Adjustments

### Purpose
Stores the quantitative adjustment values for each modifier. Separates modifier DEFINITION (TBL-010) from modifier QUANTIFICATION (TBL-015). This is where the validated ranges from §E.2 live as queryable data.

### Design Rationale (Methodology §E.2-E.3)
The modifier framework defines 36+ modifiers with specific quantitative ranges (e.g., CLINICAL_SPEC: +15-40%, VOLUME_DISCOUNT: -5-15%). These values must be stored as data (not hardcoded) so they can be updated independently and applied programmatically in the Range Engine (§J).

### Schema

| Column | Data Type | Constraints | Default | Managed By | Methodology Ref |
|--------|-----------|-------------|---------|------------|----------------|
| Adjustment_ID | VARCHAR(20) | PK, NOT NULL | — | SYSTEM | — |
| Modifier_Code | VARCHAR(30) | FK to TBL-010, NOT NULL | — | MAXX | §E.2 |
| Modifier_Value | VARCHAR(100) | NOT NULL | — | MAXX | §E.2 |
| Adjustment_Low | DECIMAL(5,2) | — | — | MAXX | §E.2 |
| Adjustment_High | DECIMAL(5,2) | — | — | MAXX | §E.2 |
| Adjustment_Median | DECIMAL(5,2) | — | — | MAXX | §E.2 |
| Adjustment_Type | ENUM | NOT NULL | — | MAXX | §E.3 |
| Applies_To_Towers | VARCHAR(100) | — | 'ALL' | MAXX | — |
| Applies_To_Tiers | VARCHAR(20) | — | 'ALL' | MAXX | — |
| Source | VARCHAR(200) | — | — | MAXX | §I.2 |
| Confidence | ENUM | — | 'MEDIUM' | MAXX | §C.3 |
| Last_Updated | DATE | — | CURRENT_DATE | SYSTEM | — |

**Adjustment_Type values:** 'PERCENTAGE' (e.g., +15%), 'MULTIPLIER' (e.g., 1.3x), 'FLAT_USD' (e.g., +$5/hr), 'ONE_TIME_PCT' (e.g., +10% amortized)

**PERCENTAGE → multiplier (Botpress):** When TBL-015.Adjustment_Type = PERCENTAGE and TBL-010.Application_Type = MULTIPLICATIVE, apply as **multiplier = 1 + (Adjustment_Pct / 100)**. E.g. +15% → 1.15. Document in mapping and methodology; use in WF-01 modifier application.

### Seed Data (from Methodology §E.2)

| Modifier | Value | Low | High | Type | Source |
|----------|-------|:---:|:----:|------|--------|
| CLINICAL_SPEC | GxP regulated | +15% | +40% | PERCENTAGE | Everest, ISG |
| AI_ML_SPEC | AI/ML engineering | +15% | +30% | PERCENTAGE | Developer rate comparisons |
| CYBERSEC_SPEC | Security specialized | +25% | +50% | PERCENTAGE | MSSP pricing |
| GDPR | GDPR compliance | +10% | +20% | PERCENTAGE | EU requirements |
| HIPAA | HIPAA compliance | +15% | +25% | PERCENTAGE | US healthcare |
| VOLUME_DISCOUNT | High volume | -5% | -15% | PERCENTAGE | Standard procurement |
| COMPLEXITY_ADJ | Simple | — | — | MULTIPLIER (0.8x) | AHT analysis |
| COMPLEXITY_ADJ | Standard | — | — | MULTIPLIER (1.0x) | AHT analysis |
| COMPLEXITY_ADJ | Complex | — | — | MULTIPLIER (1.3x) | AHT analysis |
| COMPLEXITY_ADJ | Highly_Complex | — | — | MULTIPLIER (1.6x) | AHT analysis |
| AUTOMATION_DISC | AI-augmented | -20% | -80% | PERCENTAGE | Process maturity |

### Estimated Initial Rows: 80-120 adjustment values (36 modifiers × 2-3 values each)

### Relationships
- Modifier_Code → TBL-010.Modifier_Code (many:1 — each modifier has multiple adjustment values for different conditions)

---

## TBL-016: Taxonomy Crosswalks

### Purpose
Stores mappings between Maxx's canonical taxonomy and external classification systems (APQC, SAP, Falcon, Framework Bible, client-specific). Implements the "canonical + mapped crosswalks" architecture from RA2.

### Design Rationale (Methodology §A.3, RA2 IT Reconciliation)
Locked Decision #9 establishes Botpress as canonical taxonomy authority. But clients arrive with SAP codes, APQC classifications, or their own internal categories. This table maps ANY external system to the Maxx canonical hierarchy, enabling automated ingestion regardless of source system.

### Schema

| Column | Data Type | Constraints | Default | Managed By | Methodology Ref |
|--------|-----------|-------------|---------|------------|----------------|
| Crosswalk_ID | VARCHAR(20) | PK, NOT NULL | — | SYSTEM | §A.3 |
| External_System | ENUM | NOT NULL | — | MAXX | §A.3 |
| External_Code | VARCHAR(100) | NOT NULL | — | MAXX | — |
| External_Name | VARCHAR(200) | NOT NULL | — | MAXX | — |
| Maxx_Level | ENUM | NOT NULL | — | MAXX | §A.1 |
| Maxx_Code | VARCHAR(20) | NOT NULL | — | MAXX | §A.1 |
| Maxx_Name | VARCHAR(200) | NOT NULL | — | MAXX | — |
| Mapping_Confidence | ENUM | — | 'MEDIUM' | MAXX | §C.3 |
| Mapping_Notes | TEXT | — | — | MAXX | — |
| Created_By | VARCHAR(50) | — | — | MAXX | — |
| Created_Date | DATE | NOT NULL | CURRENT_DATE | SYSTEM | — |

**External_System values:** 'SAP', 'APQC_PCF', 'FALCON', 'FRAMEWORK_BIBLE', 'NIELSEN', 'CLIENT_CUSTOM', 'ISG', 'GARTNER', 'ITSM_ITIL', 'TBM'

**Maxx_Level values:** 'TOWER', 'CATEGORY', 'SERVICE_TYPE'

### Seed Data Priorities
1. **SAP → Maxx** (highest priority — client data arrives in SAP taxonomy; SAP is ~92% inaccurate per assessment experience)
2. **APQC_PCF → Maxx** (reference framework alignment)
3. **Falcon → Maxx IT** (10 Falcon IT categories → 9 Maxx IT categories, per RA2)
4. **Nielsen → Maxx HR** (10 Nielsen HR categories → 10 Maxx HR categories, per RA1)

### Estimated Initial Rows: 200-500 crosswalk entries

### Relationships
- Maxx_Code references TBL-001.Tower_Code, TBL-002.Category_Code, or TBL-004.Service_Type_ID depending on Maxx_Level

---

## TBL-017: Managed Service Load

### Purpose
Defines the multiplier used to derive **blended** (managed-service) hourly rate from **unblended** (direct labor) rate. TBL-003 stores unblended only; WF-01 (and any rate benchmark) looks up TBL-004.Managed_Service_Load → TBL-017 to get Multiplier_Median, then Blended = Unblended × Multiplier_Median.

### Schema (canonical: TBL-017_MANAGED_SERVICE_LOAD.csv)

| Column | Data Type | Constraints | Managed By | Notes |
|--------|-----------|-------------|------------|-------|
| Load_Level | VARCHAR(20) | PK, NOT NULL, UNIQUE | MAXX | Light, Standard, Premium |
| Multiplier_Median | DECIMAL(4,2) | NOT NULL, > 0 | MAXX | e.g. 1.20, 1.45, 1.65 |
| Description | TEXT | — | MAXX | Rubric text for bot/UI |

### Seed Data (3 rows)
- **Light** (1.20): Lower support labor and/or client provides more scope; high-skill/niche.
- **Standard** (1.45): Typical managed-service delivery; default for most service types.
- **Premium** (1.65): Heavy support and/or vendor provides full scope; e.g. L1 customer service.

### Relationships
- Load_Level ← TBL-004.Managed_Service_Load (1:many — many service types share one load level)

---

# Part 3: Table Relationship Map

## 3.1 Entity Relationship Overview

```
TBL-001: TOWERS
  │
  ├──< TBL-002: CATEGORIES (Tower_Code)
  │      │
  │      ├──< TBL-004: SERVICE TYPES (Category_Code)
  │      │      │
  │      │      ├──> TBL-017: MANAGED SERVICE LOAD (Managed_Service_Load = Load_Level)
  │      │      │
  │      │      ├──< TBL-007: ALIASES (Service_Type_ID)
  │      │      │
  │      │      ├──< TBL-008: SERVICE-VENDOR MAP (Service_Type_ID)
  │      │      │      │
  │      │      │      └──> TBL-006: VENDORS (Vendor_ID)
  │      │      │             │
  │      │      │             ├──< TBL-009: VENDOR LOCATIONS (Vendor_ID)
  │      │      │             │      │
  │      │      │             │      └──> TBL-005: LOCATIONS (Location_Code)
  │      │      │             │
  │      │      │             └──< TBL-011: VENDOR ID MAP (Vendor_ID, 1:1)
  │      │      │
  │      │      └──< TBL-015: MODIFIER ADJUSTMENTS (via Service_Type applicability)
  │      │
  │      └──< TBL-014: CONTRACT BENCHMARKS (Category_Code, nullable)
  │
  ├──< TBL-003: BASE RATES (Tower_Code)
  │      │
  │      └──> TBL-005: LOCATIONS (Location_Code)
  │
  ├──< TBL-012: RISK RULES (Applicable_Towers)
  │
  ├──< TBL-013: TREATMENTS (Applicable_Towers)
  │
  ├──< TBL-014: CONTRACT BENCHMARKS (Tower_Code)
  │
  └──< TBL-016: CROSSWALKS (Maxx_Code, when Maxx_Level = TOWER)

TBL-010: MODIFIERS (standalone definitions)
  │
  └──< TBL-015: MODIFIER ADJUSTMENTS (Modifier_Code)

TBL-017: MANAGED SERVICE LOAD (standalone lookup)
  └──< TBL-004.Managed_Service_Load (FK Load_Level)

TBL-016: CROSSWALKS (links external systems to any Maxx taxonomy level)
```

## 3.2 Common Query Patterns

### Pattern 1: Rate Lookup (MaxxBot Primary Use Case)
**Botpress:** Resolve **delivery model** first (staff aug vs managed). Staff aug = TBL-003 only (unblended). Managed = TBL-003 + TBL-004.Managed_Service_Load → TBL-017; Blended = Unblended × Multiplier_Median. Use **Category_Code** (not Parent_Category_Code) for FK to TBL-002.
```
Flow: User input → TBL-007 (alias match) → TBL-004 (service type + Frontline_Agent_Type + Managed_Service_Load + AHT; Category_Code for FK)
     → TBL-002 (category) → TBL-001 (tower)
     → TBL-003 (filter by: Tower + Frontline_Agent_Type + Location + Tier) — unblended rates
     → TBL-017 (lookup Multiplier_Median by TBL-004.Managed_Service_Load) — Blended = Unblended × Multiplier_Median [managed only]
     → TBL-010/015 (apply modifier adjustments; PERCENTAGE → multiplier = 1 + pct/100 when Application_Type = MULTIPLICATIVE)
     → Range Engine (§J) → Output: P25/P50/P75 unblended and blended pricing range

Query (unblended + blended):
  SELECT r.Rate_Low_USD, r.Rate_Median_USD, r.Rate_High_USD,
         st.Default_AHT_Minutes, st.Frontline_Agent_Type, st.Managed_Service_Load,
         m.Multiplier_Median
  FROM TBL-003 r
  JOIN TBL-004 st ON r.Tower_Code = (SELECT c.Tower_Code FROM TBL-002 c WHERE c.Category_Code = st.Category_Code)
  AND r.Frontline_Agent_Type = st.Frontline_Agent_Type
  LEFT JOIN TBL-017 m ON m.Load_Level = st.Managed_Service_Load
  WHERE r.Location_Code = :location AND r.Tower_Code = :tower AND r.Tier = :tier;
  -- Blended_Low/Median/High = Rate_*_USD × Multiplier_Median
```

### Pattern 2: Vendor Comparison (Assessment + Sourcing)
```
Flow: Service Type → TBL-008 (vendor mappings) → TBL-006 (vendor profiles)
     → TBL-009 (vendor locations, filter by client geography)
     → TBL-003 (rates for vendor delivery locations)
     → Comparison matrix

Query:
  SELECT v.Vendor_Name, v.Maxx_Vendor_Tier, svm.Analyst_Ranking,
         vl.City, vl.Country, vl.Delivery_Model,
         r.Rate_Median_USD
  FROM TBL-008 svm
  JOIN TBL-006 v ON svm.Vendor_ID = v.Vendor_ID
  LEFT JOIN TBL-009 vl ON v.Vendor_ID = vl.Vendor_ID
  LEFT JOIN TBL-003 r ON r.Location_Code = vl.Location_Code
    AND r.Tower_Code = :tower AND r.Agent_Type = :agent_type
  WHERE svm.Service_Type_ID = :service_type_id
  ORDER BY svm.Ranking_Tier ASC, r.Rate_Median_USD ASC
```

### Pattern 3: Assessment Workflow (Client Data → Risk → Treatment)
```
Flow: Client invoice data → TBL-016 (crosswalk SAP → Maxx taxonomy)
     → TBL-002/004 (classify spend by category/service type)
     → TBL-012 (evaluate risk rules against spend patterns)
     → TBL-013 (map findings to treatment recommendations)
     → TBL-003 (benchmark rates for identified savings)
     → Assessment report generation

Sequence:
  1. Ingest client data, classify via TBL-016 crosswalks
  2. For each spend line: lookup TBL-012 risk rules, score severity
  3. For each finding: lookup TBL-013 treatment recommendations
  4. For rate comparisons: lookup TBL-003 benchmarks by tower/location
  5. Apply TBL-013 savings rates to calculate opportunity size
```

### Pattern 4: Modifier Application (Full 8-Step Sequence)
```
Flow: Base rate from TBL-003
     → TBL-010 (which modifiers apply to this service type?)
     → TBL-015 (what are the adjustment values?)
     → Apply in sequence (§E.3):
        Step 1: Base rate
        Step 2: Location adjustment (MULTIPLICATIVE)
        Step 3: Specialization premium (MULTIPLICATIVE)
        Step 4: Complexity adjustment (MULTIPLICATIVE)
        Step 5: Regulatory premium (ADDITIVE)
        Step 6: Volume/term adjustment (ADDITIVE)
        Step 7: Automation discount (ADDITIVE)
        Step 8: Outcome-based risk buffer (ADDITIVE)
     → Adjusted rate range
```

### Pattern 5: Forcing Function Classification (MaxxBot Step-by-Step)
```
Flow: Natural language input
     → TBL-007: Alias match (confidence threshold 0.7 for tower)
     → TBL-004: Service type narrowing (confidence threshold 0.8)
     → TBL-010: Which modifiers to ask about?
     → TBL-005: Location selection
     → TBL-003 + TBL-015: Rate lookup with modifiers
     → Output: Pricing range with confidence indicator

If alias match fails:
     → TBL-016: Check crosswalk mappings for external terminology
     → If still no match: ask clarifying question, log unmatched term for alias expansion (§G.4)
```

## 3.3 Data Flow: Assessment Product (End-to-End)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT DATA INGESTION                         │
│  Raw invoices (CSV/ERP export) → 96K+ rows typical              │
│  Fields: Vendor, Amount, Category (SAP), Location, Date         │
└───────────────┬─────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│              TAXONOMY CLASSIFICATION (TBL-016, TBL-002, TBL-004)│
│  SAP categories → Maxx crosswalk → Tower/Category assignment     │
│  Vendor names → TBL-011 fuzzy match → Vendor_ID assignment       │
│  Result: Every spend line tagged with Maxx taxonomy              │
└───────────────┬─────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│              RISK ASSESSMENT (TBL-012)                           │
│  Apply risk rules to classified data                             │
│  Output: Risk scores, severity flags per vendor/category         │
└───────────────┬─────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│              BENCHMARKING (TBL-003, TBL-005, TBL-010/015)       │
│  Treatment-level: Apply savings rates from TBL-013               │
│  Granular (if data available): Compare rates to TBL-003          │
└───────────────┬─────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│              REPORT GENERATION                                   │
│  Risk findings → TBL-013 treatment recommendations               │
│  Savings calculations → implementation roadmap                   │
│  Output: Detail Doc + Executive Summary + Risk Assessment        │
└─────────────────────────────────────────────────────────────────┘
```

---

# Part 4: Column-Level Specification (All Tables)

## 4.1 Existing Tables — Current vs. v2.0 Column Inventory

### TBL-001: Towers (14 rows)

| # | Column | v1 | v2 | Data Type | Constraints | Default | Managed By |
|:-:|--------|:--:|:--:|-----------|-------------|---------|------------|
| 1 | Tower_Code | ✅ | ✅ | VARCHAR(3) | PK, NOT NULL, UNIQUE | — | MAXX |
| 2 | Tower_Name | ✅ | ✅ | VARCHAR(50) | NOT NULL, UNIQUE | — | MAXX |
| 3 | Description | ✅ | ✅ | TEXT | — | — | MAXX |
| 4 | Status | ✅ | ✅ | ENUM('Active','Inactive','Placeholder') | NOT NULL | 'Active' | MAXX |
| 5 | Service_Type_Count | ✅ | ✅ | INT | ≥ 0 | 0 | SYSTEM (cached) |
| 6 | Vendor_Count | ✅ | ✅ | INT | ≥ 0 | 0 | SYSTEM (cached) |
| 7 | Sort_Order | — | **NEW** | INT | NOT NULL | 0 | MAXX |
| 8 | Icon_Key | — | **NEW** | VARCHAR(50) | — | NULL | BOTPRESS |
| 9 | APQC_Process_Group | — | **NEW** | VARCHAR(100) | — | NULL | MAXX |

### TBL-002: Categories (119 → 120 rows)

| # | Column | v1 | v2 | Data Type | Constraints | Default | Managed By |
|:-:|--------|:--:|:--:|-----------|-------------|---------|------------|
| 1 | Category_Code | ✅ | ✅ | VARCHAR(15) | PK, NOT NULL, UNIQUE | — | MAXX |
| 2 | Tower_Code | ✅ | ✅ | VARCHAR(3) | FK→TBL-001, NOT NULL | — | MAXX |
| 3 | Category_Name | ✅ | ✅ | VARCHAR(100) | NOT NULL | — | MAXX |
| 4 | Description | ✅ | ✅ | TEXT | — | — | MAXX |
| 5 | APQC_Category_Ref | — | **NEW** | VARCHAR(100) | — | NULL | MAXX |
| 6 | FB_Category_Ref | — | **NEW** | VARCHAR(50) | — | NULL | MAXX |
| 7 | Falcon_Category_Ref | — | **NEW** | VARCHAR(50) | — | NULL | MAXX |
| 8 | Sort_Order | — | **NEW** | INT | NOT NULL | 0 | MAXX |
| 9 | Validated_By_Assessment | — | **NEW** | BOOLEAN | NOT NULL | FALSE | MAXX |

### TBL-003: Base Rates (1,054+ rows)

| # | Column | v1 | v2 | Data Type | Constraints | Default | Managed By |
|:-:|--------|:--:|:--:|-----------|-------------|---------|------------|
| 1 | Rate_ID | ✅ | ✅ | VARCHAR(40) | PK, NOT NULL, UNIQUE | — | MAXX |
| 2 | Tower_Code | ✅ | ✅ | VARCHAR(3) | FK→TBL-001, NOT NULL | — | MAXX |
| 3 | Agent_Type | ✅ | ✅ | VARCHAR(50) | NOT NULL (legacy/source) | — | MAXX |
| 3b | Frontline_Agent_Type | — | ✅ 11c | VARCHAR(50) | NOT NULL | — | MAXX |
| 4 | Tier | ✅ | ✅ | VARCHAR(5) | NOT NULL | — | MAXX |
| 5 | Location_Code | ✅ | ✅ | VARCHAR(10) | FK→TBL-005, NOT NULL | — | MAXX |
| 6 | Rate_Low_USD | ✅ | ✅ | DECIMAL(8,2) | NOT NULL, ≥ 0 | — | MAXX |
| 7 | Rate_High_USD | ✅ | ✅ | DECIMAL(8,2) | NOT NULL, ≥ Rate_Low | — | MAXX |
| 8 | Rate_Median_USD | ✅ | ✅ | DECIMAL(8,2) | NOT NULL, between Low-High | — | MAXX |
| 9 | Currency_Local | ✅ | ✅ | VARCHAR(3) | — | 'USD' | MAXX |
| 10 | Rate_Low_Local | ✅ | ✅ | DECIMAL(10,2) | — | — | MAXX |
| 11 | Rate_High_Local | ✅ | ✅ | DECIMAL(10,2) | — | — | MAXX |
| 12 | Rate_Unit | ✅ | ✅ | VARCHAR(20) | NOT NULL | 'Per_Hour' | MAXX |
| 13 | Pricing_Model | ✅ | ✅ | VARCHAR(20) | NOT NULL | 'T&M' | MAXX |
| 14 | Effective_Date | ✅ | ✅ | DATE | NOT NULL | — | MAXX |
| 15 | Source | ✅ | ✅ | VARCHAR(200) | — | — | MAXX |
| 16 | Confidence | ✅ | ✅ | ENUM('HIGH','MEDIUM','LOW') | NOT NULL | 'MEDIUM' | MAXX |
| 17 | Last_Updated | ✅ | ✅ | DATE | NOT NULL | — | MAXX |
| 18 | Rate_Per_Unit_Low_USD | — | **NEW** | DECIMAL(8,2) | — | NULL | SYSTEM (computed) |
| 19 | Rate_Per_Unit_High_USD | — | **NEW** | DECIMAL(8,2) | — | NULL | SYSTEM (computed) |
| 20 | Rate_Per_Unit_Median_USD | — | **NEW** | DECIMAL(8,2) | — | NULL | SYSTEM (computed) |
| 21 | Resource_Unit_Type | — | **NEW** | VARCHAR(50) | — | NULL | MAXX |
| 22 | AHT_Minutes_Used | — | **NEW** | DECIMAL(6,1) | — | NULL | SYSTEM (from TBL-004) |
| 23 | Confidence_Score | — | **NEW** | INT | 0-100 | NULL | SYSTEM (computed §C.3) |
| 24 | Source_Type | — | **NEW** | ENUM(7 values) | — | 'estimated' | MAXX |
| 25 | Methodology_Version | — | **NEW** | VARCHAR(10) | — | '2.0' | SYSTEM |

**Computed column logic:**
- Rate_Per_Unit_Low_USD = Rate_Low_USD × (AHT_Minutes_Used / 60) — NULL if AHT unknown
- Confidence_Score = formula from §C.3 (Source_Weight×0.40 + Recency_Weight×0.25 + Corroboration_Weight×0.20 + Specificity_Weight×0.15)

### TBL-004: Service Types (v3: 414 rows)

| # | Column | v1 | v2 | Data Type | Constraints | Default | Managed By |
|:-:|--------|:--:|:--:|-----------|-------------|---------|------------|
| 1 | Service_Type_ID | ✅ | ✅ | VARCHAR(20) | PK, NOT NULL, UNIQUE | — | MAXX |
| 2 | SubCategory_Code → **Category_Code** | ✅ | **RENAME** | VARCHAR(15) | FK→TBL-002, NOT NULL | — | MAXX |
| 3 | Service_Type_Name | ✅ | ✅ | VARCHAR(200) | NOT NULL | — | MAXX |
| 4 | Description | ✅ | ✅ | TEXT | — | — | MAXX |
| 5 | Delivery_Channel | ✅ | ✅ | VARCHAR(20) | — | — | MAXX |
| 6 | Primary_Pricing_Model | ✅ | ✅ | VARCHAR(20) | — | — | MAXX |
| 7 | Benchmark_Unit | ✅ | ✅ | VARCHAR(50) | — | — | MAXX |
| 8 | Frontline_Agent_Type | ✅ | ✅ | VARCHAR(50) | NOT NULL | — | MAXX |
| 9 | **Managed_Service_Load** | — | **NEW** | VARCHAR(20) | FK→TBL-017.Load_Level, NOT NULL | 'Standard' | MAXX |
| 10 | Tier_Structure | ✅ | ✅ | VARCHAR(20) | — | 'None' | MAXX |
| 11 | Default_AHT_Minutes | ✅ | ✅ | DECIMAL(6,1) | ≥ 0 | NULL | MAXX |
| 12 | SLA_Timeliness_Type | ✅ | ✅ | VARCHAR(50) | NOT NULL | — | MAXX |
| 13 | SLA_Timeliness_Default | ✅ | ✅ | VARCHAR(200) | NOT NULL | — | MAXX |
| 14 | SLA_Quality_Type | ✅ | ✅ | VARCHAR(50) | NOT NULL | — | MAXX |
| 15 | SLA_Quality_Default | ✅ | ✅ | VARCHAR(200) | NOT NULL | — | MAXX |
| 16 | Required_Modifiers | ✅ | ✅ | TEXT | — | NULL | MAXX |
| 17 | Optional_Modifiers | ✅ | ✅ | TEXT | — | NULL | MAXX |
| 18 | Typical_Vendors | ✅ | ✅ | TEXT | — | — | MAXX |
| 19 | Confidence | ✅ | ✅ | ENUM('HIGH','MEDIUM','LOW') | — | 'MEDIUM' | MAXX |
| 20 | AHT_Data_Tier | — | **NEW** | ENUM(6 values) | — | 'UNKNOWN' | MAXX |
| 21 | AHT_Source | — | **NEW** | VARCHAR(200) | — | NULL | MAXX |
| 22 | Complexity_Tier | — | **NEW** | ENUM(4 values) | — | 'Standard' | MAXX |
| 23 | Resource_Unit_Name | — | **NEW** | VARCHAR(100) | — | NULL | MAXX |
| 24 | Typical_Volume_Low | — | **NEW** | INT | ≥ 0 | NULL | MAXX |
| 25 | Typical_Volume_High | — | **NEW** | INT | ≥ Typical_Volume_Low | NULL | MAXX |
| 26 | Confidence_Score | — | **NEW** | INT | 0-100 | NULL | SYSTEM |

### TBL-005: Locations (185 rows)

| # | Column | v1 | v2 | Data Type | Constraints | Default | Managed By |
|:-:|--------|:--:|:--:|-----------|-------------|---------|------------|
| 1 | Location_Code | ✅ | ✅ | VARCHAR(10) | PK, NOT NULL, UNIQUE | — | MAXX |
| 2 | Country | ✅ | ✅ | VARCHAR(50) | NOT NULL | — | MAXX |
| 3 | City | ✅ | ✅ | VARCHAR(50) | NOT NULL | — | MAXX |
| 4 | Region | ✅ | ✅ | VARCHAR(50) | — | NULL | MAXX |
| 5 | Currency_Code | ✅ | ✅ | VARCHAR(3) | NOT NULL | — | MAXX |
| 6 | USD_FX_Rate | ✅ | ✅ | DECIMAL(10,4) | NOT NULL, > 0 | — | MAXX |
| 7 | Cost_Index | ✅ | ✅ | INT | NOT NULL, > 0 | — | MAXX |
| 8 | Timezone | ✅ | ✅ | VARCHAR(50) | — | — | MAXX |
| 9 | Labor_Market_Tier | ✅ | ✅ | ENUM('1','2','3') | — | — | MAXX |
| 10 | Notes | ✅ | ✅ | TEXT | — | — | MAXX |
| 11 | CL_Strength_Rating → **BPO_Market_Maturity** | ✅ | **RENAME** | INT | 1-5 | NULL | MAXX |
| 12 | US_Reference_Index | — | **NEW** | DECIMAL(6,1) | — | NULL | SYSTEM (computed) |
| 13 | Benefit_Burden_Pct | — | **NEW** | DECIMAL(4,1) | 0-100 | NULL | MAXX |
| 14 | Index_Source | — | **NEW** | VARCHAR(100) | — | NULL | MAXX |
| 15 | Index_Confidence | — | **NEW** | ENUM('HIGH','MEDIUM','LOW') | — | 'MEDIUM' | MAXX |
| 16 | Last_Calibrated | — | **NEW** | DATE | NOT NULL | CURRENT_DATE | MAXX |
| 17 | High_Inflation_Flag | — | **NEW** | BOOLEAN | NOT NULL | FALSE | MAXX |

### TBL-006: Vendors (1,741 rows)

| # | Column | v1 Name | v2 Name | Data Type | Managed By |
|:-:|--------|---------|---------|-----------|------------|
| 1 | vendorId | vendorId | **Vendor_ID** | VARCHAR(10) | MAXX |
| 2 | vendorName | vendorName | **Vendor_Name** | VARCHAR(200) | MAXX |
| 3 | primaryTower | primaryTower | **Primary_Tower** | VARCHAR(3) FK | MAXX |
| 4 | secondaryTowers | secondaryTowers | **Secondary_Towers** | TEXT | MAXX |
| 5 | hqCountry | hqCountry | **HQ_Country** | VARCHAR(50) | MAXX |
| 6 | ownership | ownership | **Ownership** | VARCHAR(50) | MAXX |
| 7 | revenueUsd | revenueUsd | **Revenue_USD** | VARCHAR(50) | MAXX |
| 8 | employeeCount | employeeCount | **Employee_Count** | VARCHAR(50) | MAXX |
| 9 | deliveryCenterCount | deliveryCenterCount | **Delivery_Center_Count** | VARCHAR(10) | MAXX |
| 10 | deliveryLocations | deliveryLocations | **Delivery_Locations** | TEXT | MAXX |
| 11 | certifications | certifications | **Certifications** | TEXT | MAXX |
| 12 | keyClients | keyClients | **Key_Clients** | TEXT | MAXX |
| 13 | serviceCapabilities | serviceCapabilities | **Service_Capabilities** | TEXT | MAXX |
| 14 | competitivePosition | competitivePosition | **Competitive_Position** | TEXT | MAXX |
| 15 | strengths | strengths | **Strengths** | TEXT | MAXX |
| 16 | weaknesses | weaknesses | **Weaknesses** | TEXT | MAXX |
| 17 | redFlags | redFlags | **Red_Flags** | TEXT | MAXX |
| 18 | pricingModel | pricingModel | **Pricing_Model** | VARCHAR(100) | MAXX |
| 19 | financialHealthScore | financialHealthScore | **Financial_Health_Score** | ENUM | MAXX |
| 20 | batch | batch | **Batch** | VARCHAR(10) | MAXX |
| 21 | — | — | **Maxx_Vendor_Tier** (NEW) | ENUM | MAXX |
| 22 | — | — | **Last_Researched** (NEW) | DATE | MAXX |
| 23 | — | — | **Profile_Completeness_Pct** (NEW) | INT | SYSTEM |
| 24 | — | — | **Risk_Score** (NEW) | INT 1-100 | SYSTEM |
| 25 | — | — | **Revenue_USD_Numeric** (NEW) | BIGINT | SYSTEM |
| 26 | — | — | **Employee_Count_Numeric** (NEW) | INT | SYSTEM |

### TBL-007 through TBL-011: Column counts

| Table | v1 Columns | New Columns | v2 Total | Key New Additions |
|-------|:----------:|:-----------:|:--------:|-------------------|
| TBL-007 Aliases | 5 | 5 | 10 | Source, Usage_Count, Tower_Code (denorm) |
| TBL-008 Svc-Vendor Map | 12 | 4 | 16 | Mapping_ID (PK), Maxx_Rec_Tier, Price_Position |
| TBL-009 Vendor Locations | 11 | 3 | 14 | Location_Tier, Capacity_Status, Delivery_Model |
| TBL-010 Modifiers | 8 | 5 | 13 | Modifier_Category, Application_Type, Application_Step |
| TBL-011 Vendor ID Map | 3 | 3 | 6 | Alt_Names, Parent_Vendor_ID, Is_Active |

## 4.2 New Tables — Column Counts

| Table | Columns | Estimated Rows | Primary Consumer |
|-------|:-------:|:--------------:|-----------------|
| TBL-012 Risk Rules | 12 | 50-75 | Assessment engine |
| TBL-013 Treatments | 11 | 30-50 | Assessment reports |
| TBL-014 Contract Benchmarks | 13 | 100-200 | Contracting Office |
| TBL-015 Modifier Adjustments | 12 | 80-120 | Range Engine, MaxxBot |
| TBL-016 Crosswalks | 11 | 200-500 | Data ingestion, classification |

## 4.3 Total Database Footprint (v2.0)

| Metric | v1.0 | v2.0 | Change |
|--------|:----:|:----:|:------:|
| Tables | 11 | 16 | +5 |
| Total columns | 142 | ~220 | +~78 |
| Total rows | ~12,606 | ~13,500+ | +~900 (new tables + IT service types) |
| Row data points | ~1.8M cells | ~3.0M cells | +67% |
| FK relationships | ~8 | ~20 | +150% |

---

# Part 5: Methodology-to-Schema Traceability

Every concept in R_MAXX_METHODOLOGY_v1.md must resolve to specific database columns. This matrix ensures nothing is left as narrative-only.

## 5.1 Core Concepts Traceability

| # | Methodology Concept | Section | Implementing Table(s) | Implementing Column(s) | Status |
|:-:|--------------------|---------|-----------------------|----------------------|:------:|
| 1 | 4-level taxonomy (Tower→Category→Service Type→Workflow) | §A.1 | TBL-001, 002, 004 | Tower_Code, Category_Code, Service_Type_ID | ✅ Existing |
| 2 | Workflow Instance (Level 4) | §A.1, §B.1 | CLIENT tables (RB2 scope) | Per-engagement, not in taxonomy DB | ⬜ RB2 |
| 3 | Resource Unit (Q in P×Q) | §B.2 | TBL-004, TBL-003 | Resource_Unit_Name (TBL-004), Resource_Unit_Type (TBL-003) | **NEW** |
| 4 | Frontline Agent Anchoring | §B.3 | TBL-004, TBL-003 | Frontline_Agent_Type (TBL-004), Frontline_Agent_Type (TBL-003) — join for rate lookup; Agent_Type = legacy (task 11c) | ✅ 11c |
| 5 | Unblended rate in TBL-003; blended derived via TBL-017 | §B.3, §D.1 | TBL-003, TBL-004, TBL-017 | Rate_*_USD (unblended); Managed_Service_Load → Multiplier_Median; Blended = Unblended × Multiplier | ✅ 11e |
| 6 | Conversion chain (hourly → per-unit) | §D.1 | TBL-003, TBL-004 | Rate_Per_Unit columns (NEW) + AHT_Minutes_Used | **NEW** |
| 7 | AHT as bridge metric | §D.1 | TBL-004 | Default_AHT_Minutes, AHT_Data_Tier, AHT_Source | ✅+**NEW** |
| 8 | 5-tier assumption stack | §C.1 | TBL-004, TBL-003 | AHT_Data_Tier (TBL-004), Source_Type (TBL-003) | **NEW** |
| 9 | Deterministic confidence formula | §C.3 | TBL-003, TBL-004 | Confidence_Score (INT 0-100) | **NEW** |
| 10 | Range-based pricing (P25/P50/P75) | §J.1 | TBL-003 | Rate_Low (≈P25), Rate_Median (≈P50), Rate_High (≈P75) | ✅ Existing |
| 11 | Spread floor by confidence | §J.2 | Implemented in Range Engine logic | Confidence_Score drives spread minimum | Logic, not column |
| 12 | "Not enough data" threshold | §J.3 | Range Engine logic | Confidence_Score < 40 → suppress output | Logic, not column |
| 13 | India = base 100 location index | §F.1 | TBL-005 | Cost_Index (recalibrated) | ✅ RECALIBRATE |
| 14 | Dual expression (India + US reference) | §F.1 | TBL-005 | Cost_Index, US_Reference_Index | **NEW** |
| 15 | Mandatory benefit burden | §F.3 | TBL-005 | Benefit_Burden_Pct | **NEW** |
| 16 | Location maintenance cadence | §F.4 | TBL-005 | Last_Calibrated, High_Inflation_Flag | **NEW** |
| 17 | Modifier framework (7 categories, 36+) | §E.1-E.2 | TBL-010, TBL-015 | Full modifier schema + rate adjustments | **NEW** (expand + new table) |
| 18 | 8-step modifier application sequence | §E.3 | TBL-010 | Application_Step, Application_Type | **NEW** |
| 19 | 4-factor MaxxBot model | §E.4 | TBL-003 query | Tower × Category × Agent Type × Location | Query pattern |
| 20 | 5th factor (contract structure) | §E.4 | TBL-015 | Category G modifiers | **NEW** |
| 21 | Forcing function (NLP → taxonomy) | §G.1-G.3 | TBL-007, TBL-004, TBL-010 | Alias match → service type → modifier collection | ✅ Existing + enhanced |
| 22 | Alias feedback loop | §G.4 | TBL-007 | Source, Usage_Count | **NEW** |
| 23 | Progressive workflow field collection | §G.5 | CLIENT tables (RB2 scope) | Fields filled per product interaction | ⬜ RB2 |
| 24 | Product integration map (6 products) | §H | TBL-012, 013 | Risk rules → treatment recommendations | **NEW** |
| 25 | Treatment-level savings rates | §H, Locked #11 | TBL-013 | Savings_Rate_Low/High_Pct | **NEW** |
| 26 | Canonical + crosswalk architecture | §A.3, RA2 | TBL-016 | External_System → Maxx_Code mappings | **NEW** |
| 27 | IT taxonomy (9 categories) | §A.3, RA3 | TBL-002 | CAT-IT-001 through CAT-IT-009 | ✅ UPDATE |
| 28 | Row-level provenance | §I.3 | TBL-003 | Source, Source_Type, Confidence_Score, Last_Updated | ✅+**NEW** |
| 29 | Reproducibility rule | §I.4 | All tables | Methodology_Version column + locked schemas | Governance |
| 30 | Data refresh pipeline | §K | TBL-005, TBL-006 | Last_Calibrated, Last_Researched | **NEW** |
| 31 | Pricing model normalization | §D.3 | TBL-003, TBL-004 | Primary_Pricing_Model + conversion via AHT | ✅ Existing |
| 32 | Contract benchmarks | §E.2 Cat G | TBL-014 | Full contract benchmark table | **NEW** |
| 33 | Risk assessment rules | §H | TBL-012 | Full risk rules table | **NEW** |
| 34 | Complexity tiers | §E.2 Cat B | TBL-004 | Complexity_Tier | **NEW** |
| 35 | Best practice pricing model guidance | §B.4 | TBL-004 | Primary_Pricing_Model (existing, maps to guidance) | ✅ Existing |

## 5.2 Traceability Summary

| Category | Total Concepts | Already in v1 | New in v2 | RB2 Scope | Logic Only |
|----------|:--------------:|:-------------:|:---------:|:---------:|:----------:|
| Taxonomy | 5 | 3 | 1 | 1 | — |
| Pricing | 8 | 3 | 4 | — | 1 |
| Location | 4 | 1 | 3 | — | — |
| Modifiers | 4 | — | 4 | — | — |
| Data Quality | 5 | 1 | 3 | — | 1 |
| Products | 4 | — | 3 | 1 | — |
| Governance | 3 | 1 | 1 | — | 1 |
| Classification | 2 | 1 | 1 | — | — |
| **TOTAL** | **35** | **10** | **20** | **2** | **3** |

Every methodology concept now has a database home. The 2 items deferred to RB2 (Workflow Instance fields, Progressive field collection) are client-specific tables not part of the shared taxonomy database. The 3 logic-only items are Range Engine behaviors implemented in application code, not stored data.

---

# Part 6: RA1 Gap Resolution Map

Every gap identified in R_TABLE_GAP_ANALYSIS_v1.md must have a resolution path in this spec.

| RA1 Gap | Severity | Resolution in v2.0 | Resolving Element |
|---------|:--------:|--------------------|--------------------|
| 428 missing AHT values (46.7%) | 🔴 CRITICAL | AHT_Data_Tier column tracks gap status; RD1 populates via research | TBL-004 new columns + RD1 data work |
| Only 8 modifiers (need 36+) | 🔴 CRITICAL | TBL-010 expanded to 36+ rows; TBL-015 stores quantitative values | TBL-010 expansion + TBL-015 new table |
| No outcome-based rate columns | 🔴 CRITICAL | Rate_Per_Unit columns added to TBL-003; computed from hourly × AHT | TBL-003 new columns |
| India NOT base index | 🟡 HIGH | Cost_Index recalibrated to India=100; US_Reference_Index added | TBL-005 recalibration + new column |
| Only 2% vendor location coverage | 🟡 HIGH | TBL-009 schema ready; RD3 populates top 200+ vendors | TBL-009 + RD3 data work |
| Mixed-case Confidence values | 🟡 MEDIUM | ENUM constraint enforces uppercase; Confidence_Score (numeric) added | TBL-003, TBL-004 normalization |
| "OT" tower code in TBL-003 (35 rows) | 🟡 MEDIUM | **DECISION NEEDED:** remap to valid towers or add OT to TBL-001 | TBL-003/TBL-001 |
| IT taxonomy conflict (8 vs 9 vs 10) | 🟡 MEDIUM | Resolved: 9 categories (RA3 approved), crosswalks in TBL-016 | TBL-002 update + TBL-016 |
| Nielsen HR category name mismatches | 🟢 LOW | TBL-016 crosswalk maps Nielsen → Maxx HR categories | TBL-016 seed data |
| FA (16 vendors) and CO (14 vendors) under-populated | 🟢 LOW | Flag for future research batches; Maxx_Vendor_Tier tracks coverage | TBL-006, TBL-008 |
| TBL-003 "OT" tower code duplicates | 🟡 MEDIUM | Remap 35 "OT" rows to correct towers during data cleanup | RD scope |
| Vendor profile data sparseness | 🟢 LOW | Profile_Completeness_Pct auto-computed; Last_Researched tracks staleness | TBL-006 new columns |

---

# Part 7: Decisions Needed

| # | Decision | Options | Impact | Recommend |
|:-:|----------|---------|--------|-----------|
| 1 | "OT" tower code (35 rate rows) | A: Add "OT" to TBL-001 as "Other Services" tower / B: Remap 35 rows to correct towers / C: Delete | B affects 35 rate rows; A adds a catch-all tower | **B (remap)** — these rates should be classified to their correct towers |
| 2 | IV tower (0 service types, 8 vendors) | A: Populate with industry vertical service types / B: Mark as Placeholder / C: Remove | A is significant work; B preserves for future | **B (placeholder)** — keep for future but don't populate now |
| 3 | TBL-006 column naming | A: Rename all to snake_case now / B: Keep camelCase for backward compatibility / C: Add snake_case aliases | A is a breaking change for Botpress APIs | **Botpress team decides** — flag in RC1 engineering brief |
| 4 | SubCategory_Code rename in TBL-004 | A: Rename to Category_Code immediately / B: Add Category_Code as alias, keep SubCategory_Code / C: Defer | A is the cleanest but may break Botpress queries | **A preferred, confirm with Botpress** |
| 5 | TBL-015 vs. expanding TBL-010 | A: Separate table for modifier values (normalized) / B: Add value columns directly to TBL-010 | A is cleaner but adds a JOIN; B is simpler | **A (separate table)** — better normalization, easier to update values without touching definitions |

---

# Part 8: Implementation Priority

## Phase 1: Critical Path (Before March 31 Botpress Delivery)

| Priority | Table | Change | Effort | Blocker For |
|:--------:|-------|--------|:------:|-------------|
| P0 | TBL-003 | Add outcome-based columns | LOW (schema) | MaxxBot per-unit pricing |
| P0 | TBL-004 | Rename SubCategory_Code → Category_Code | LOW (rename) | 4-level taxonomy enforcement |
| P0 | TBL-005 | Recalibrate Cost_Index to India=100 | MEDIUM (recalculate 185 rows) | Location pricing accuracy |
| P0 | TBL-002 | Add CAT-IT-009 + 3 renames | LOW (4 row changes) | IT tower assessment |
| P1 | TBL-010 | Expand from 8 → 36+ modifiers | MEDIUM (add rows + columns) | Modifier-adjusted pricing |
| P1 | TBL-015 | Create new table + seed data | MEDIUM (new table + ~100 rows) | Quantitative modifier application |
| P1 | TBL-016 | Create new table + seed crosswalks | LOW (new table + ~200 rows) | Client data ingestion automation |

## Phase 2: Assessment Engine (April — pre-IAOP OWS26)

| Priority | Table | Change | Effort | Blocker For |
|:--------:|-------|--------|:------:|-------------|
| P2 | TBL-012 | Create risk rules table | MEDIUM | Automated risk scoring |
| P2 | TBL-013 | Create treatment recommendations | LOW | Assessment report automation |
| P2 | TBL-004 | Add IT service types for CAT-IT-009 | MEDIUM (8-12 new rows + research) | IT tower assessment |

## Phase 3: Data Population (Parallel with Phases 1-2, via Cursor)

| Priority | Table | Change | Effort | Blocker For |
|:--------:|-------|--------|:------:|-------------|
| P3 | TBL-004 | Populate 428 missing AHT values | HIGH (research + population) | Per-unit pricing accuracy |
| P3 | TBL-009 | Expand vendor locations to 200+ vendors | HIGH (research) | Location-aware vendor recs |
| P3 | TBL-003 | Normalize Confidence to uppercase | LOW (data cleanup) | Query consistency |
| P3 | TBL-003 | Remap "OT" rows | LOW (35 rows) | FK integrity |

## Phase 4: Enhanced Features (Post-IAOP)

| Priority | Table | Change | Effort |
|:--------:|-------|--------|:------:|
| P4 | TBL-014 | Create contract benchmarks table | MEDIUM |
| P4 | TBL-006 | Add numeric revenue/employee columns | LOW |
| P4 | TBL-011 | Add Parent_Vendor_ID (vendor consolidation) | MEDIUM (requires research) |
| P4 | All | Add Methodology_Version to all tables | LOW |

---

**END OF R_DATABASE_SCHEMA_v2.md**

⬆️ ALEX: ADD TO PK as `R_DATABASE_SCHEMA_v2.md`
