# R: Table Field Definitions — Every Field, Every Table

**Version:** 1.2  
**Date:** 2026-02-25  
**Purpose:** Single reference for what each field means, whether it is a dropdown/selection, what the options are, and where options come from (same table, other table, or new reference table). Supports correct population, no duplicate logic, and structured data.  
**Source:** Alex Table feedback ("create definitions for every field in every table"); R_DATABASE_SCHEMA.md; current CSV headers; R_ALEX_FEEDBACK_WORKFLOW_AND_RATES.md (workflow/rate building blocks).

**v3 (2026-02-25):** All 19 tables (17 TBL + **SLA** + **Service_Type_SLA**). TBL-004: Service_Unit_Name (renamed from Resource_Unit_Name); SLA_* columns removed — use SLA + Service_Type_SLA for SLA lookup.

**Excel versions:**  
- **R_Table_Field_Definitions.xlsx** — sheet **Field_Definitions** (all tables/columns), **Table_Purpose_Why**, **Review_Findings**. Regenerate with `build_field_definitions_excel.py`.  
- **R_Table_Definitions_And_Data.xlsx** — one tab per table: **[TBL-XXX] Data** (actual CSV data) and **[TBL-XXX] Def** (row 1 = column header, row 2 = definition, row 3 = part of field). Includes proposed **SLA** and **Service_Type_SLA** tables. Use for side-by-side review of data and definitions. Regenerate with `build_definitions_and_data_excel.py`.

**Re-review findings:** After creating definitions, a full re-review against schema, mapping, and Alex's workflow feedback is in **R_TABLE_AND_FIELD_REVIEW_FINDINGS.md** (what doesn't make sense, should tweak, data accuracy).

**How to use:** For each table, columns are listed with **Definition**, **Type/Format**, **Options** (if constrained set or dropdown), and **Source** (if values come from another table). **Dropdown table?** = whether we need a separate reference/dropdown table.

---

## TBL-001: Towers

| Column | Definition | Type/Format | Options | Source / Dropdown table? |
|--------|------------|-------------|---------|---------------------------|
| Tower_Code | Unique 2–3 letter code for the tower | VARCHAR(2-3), PK | e.g. HR, IT, CO, FA | None — master list in this table |
| Tower_Name | Display name of the tower | VARCHAR(50) | e.g. Human Resources, Information Technology | None |
| Description | What this tower covers (scope) | TEXT | Free text | None |
| Status | Whether tower is in use | ENUM | Active, Inactive, Placeholder | Dropdown: fixed set |
| Service_Type_Count | Number of service types in this tower (cached) | INT ≥ 0 | — | Computed from TBL-004 (or same table denormalized) |
| Vendor_Count | Number of vendors mapped to this tower (cached) | INT ≥ 0 | — | Computed from TBL-008 (or same table denormalized) |
| Sort_Order | Display order in UI | INT | — | None |
| Icon_Key | UI icon/color key | VARCHAR(50) | — | Optional; could be dropdown table |
| APQC_Process_Group | APQC PCF process group reference | VARCHAR(100) | — | Crosswalk; could come from TBL-016 when External_System=APQC_PCF |

---

## TBL-002: Categories

| Column | Definition | Type/Format | Options | Source / Dropdown table? |
|--------|------------|-------------|---------|---------------------------|
| Category_Code | Unique code for the category | VARCHAR(15), PK | Format CAT-{Tower}-{NNN} e.g. CAT-HR-001 | None — master list here |
| Tower_Code | Tower this category belongs to | VARCHAR(3), FK | — | **TBL-001.Tower_Code** |
| Category_Name | Display name of the category | VARCHAR(100) | — | None |
| Description | Formal definition / scope of the category | TEXT | — | None |
| APQC_Category_Ref | APQC PCF category reference | VARCHAR(100) | — | Crosswalk; empty until populated |
| FB_Category_Ref | Framework Bible category reference | VARCHAR(50) | — | Crosswalk; empty until populated |
| Falcon_Category_Ref | Falcon (B) IT category reference | VARCHAR(50) | — | Crosswalk for B 10→9; empty for non-IT |
| Sort_Order | Display order within tower | INT | — | None |
| Validated_By_Assessment | Whether category has been used in a client assessment | BOOLEAN | TRUE, FALSE | Dropdown: fixed set |

---

## TBL-003: Base Rates

| Column | Definition | Type/Format | Options | Source / Dropdown table? |
|--------|------------|-------------|---------|---------------------------|
| Rate_ID | Unique identifier for the rate row | VARCHAR(40), PK | Format RATE-{Tower}-{Agent}-T{n}-{Loc} | None |
| Tower_Code | Tower this rate belongs to | VARCHAR(3), FK | — | **TBL-001.Tower_Code** |
| Frontline_Agent_Type | **Primary** agent type used for rate lookup (join to TBL-004) | VARCHAR(50) | — | **TBL-004.Frontline_Agent_Type** (canonical list) |
| Tier | **Skillset/commercial** tier (T1/T2/T3 = junior/mid/senior); not process L1/L2/L3 | VARCHAR(5) | T1, T2, T3 (or similar) | Dropdown: fixed or from methodology; document in methodology |
| Location_Code | Where this rate applies | VARCHAR(10), FK | — | **TBL-005.Location_Code** |
| Rate_Low_USD | Low end of rate range (USD) | DECIMAL(8,2) | — | None |
| Rate_High_USD | High end of rate range (USD) | DECIMAL(8,2) | — | None |
| Rate_Median_USD | Median of rate range (USD) | DECIMAL(8,2) | — | None |
| Currency_Local | Local currency code for the location | VARCHAR(3) | ISO 4217 e.g. INR, PHP | **TBL-005.Currency_Code** or fixed list |
| Rate_Low_Local | Low rate in local currency | DECIMAL(10,2) | — | None (currently unreliable per gap analysis) |
| Rate_High_Local | High rate in local currency | DECIMAL(10,2) | — | None (currently unreliable) |
| Rate_Per_Unit_Low_USD | Per-unit rate low (outcome-based); = hourly × AHT/60 when populated | DECIMAL(8,2) | — | Computed or manual; NULL until AHT available |
| Rate_Per_Unit_High_USD | Per-unit rate high | DECIMAL(8,2) | — | Same |
| Rate_Per_Unit_Median_USD | Per-unit rate median | DECIMAL(8,2) | — | Same |
| Resource_Unit_Type | Type of **service unit** (e.g. per transaction, per case). **Recommend rename:** Service_Unit_Type. | VARCHAR(50) | — | Could align with TBL-004.Service_Unit_Name (recommend rename from Resource_Unit_Name) |
| AHT_Minutes_Used | AHT (minutes) used to convert hourly to per-unit | DECIMAL(6,1) | — | Typically from TBL-004.Default_AHT_Minutes |
| Rate_Unit | Unit for this rate row | VARCHAR(20) | Per_Hour (only value in current data for TBL-003) | Dropdown: Per_Hour for unblended; methodology defines others |
| Pricing_Model | Commercial model for this rate row | VARCHAR(20) | T&M, Blended, PPU, Fixed_Monthly, Outcome, Gainshare | Dropdown; TBL-003 currently T&M only |
| Effective_Date | Date from which rate is valid | DATE | YYYY-MM-DD | None |
| Source | Provenance (e.g. research, client) | VARCHAR(200) | Free text | None |
| Confidence | Qualitative data confidence | ENUM | HIGH, MEDIUM, LOW | Dropdown: fixed set |
| Confidence_Score | Numeric confidence 0–100 (for formula) | INT 0-100 | — | Computed per §C.3 or manual |
| Source_Type | Type of source | ENUM | client_actual, analyst_report, compensation_data, maxx_derived, industry_survey, estimated, default_assumption | Dropdown: fixed set |
| Methodology_Version | Version of methodology used | VARCHAR(10) | e.g. 2.0 | None |
| Last_Updated | Last change date | DATE | — | None |
| Change_Notes | Notes for the change | TEXT | — | None |
| Rate_Type | Type of rate | VARCHAR(20) | Direct_Labor (only value in current data) | Dropdown: Direct_Labor for unblended |
| Agent_Type | **Legacy/source** agent type label (kept for continuity) | VARCHAR(50) | — | Retained; **Frontline_Agent_Type** is used for join |

---

## TBL-004: Service Types

| Column | Definition | Type/Format | Options | Source / Dropdown table? |
|--------|------------|-------------|---------|---------------------------|
| Service_Type_ID | Unique identifier for the service type | VARCHAR(20), PK | Format ST-{Tower}-{Cat}-{nn}-{nn} | None |
| Category_Code | Category this service type belongs to | VARCHAR(15), FK | — | **TBL-002.Category_Code** |
| Parent_Category_Code | Parent category (legacy/granular) | VARCHAR(15) | — | TBL-002 or same table |
| Service_Type_Name | Display name | VARCHAR(200) | — | None |
| Description | What this service type is / scope | TEXT | — | None |
| Delivery_Channel | How the service is delivered | VARCHAR(20) | Voice, Async, etc. | Dropdown: define fixed set (e.g. Voice, Chat, Email, Async, Hybrid) |
| Primary_Pricing_Model | Main commercial model for this service type | VARCHAR(20) | T&M, Blended, Fixed_Monthly, PPU, Outcome, Gainshare | **Dropdown: canonical set** (AUTHORITATIVE_VALUES / methodology) |
| Benchmark_Unit | Unit for benchmarking (Month, Case, Hour, etc.) | VARCHAR(50) | — | Dropdown: define set (Hour, Month, Case, Transaction, etc.) |
| Frontline_Agent_Type | Primary agent role for this service type (links to TBL-003) | VARCHAR(50) | — | Canonical list (could be reference table); join key to TBL-003 |
| Managed_Service_Load | Load tier for blended derivation | VARCHAR(20), FK | Light, Standard, Premium | **TBL-017.Load_Level** |
| Tier_Structure | Whether service has tier structure (e.g. L1/L2) | VARCHAR(20) | None, T1-T3, L1-L3, etc. | Dropdown: define set |
| Default_AHT_Minutes | Average handle time (minutes) for conversion to per-unit | DECIMAL(6,1) | — | None |
| SLA_* (legacy) | **v3: removed from TBL-004.** Use **SLA** + **Service_Type_SLA** tables for SLA-by-service-type. | — | — | See SLA, Service_Type_SLA below |
| Required_Modifiers | Modifiers that must be applied | TEXT | Comma-separated or list | **TBL-010.Modifier_Code** (multiple) |
| Optional_Modifiers | Modifiers that can be applied | TEXT | Same | **TBL-010.Modifier_Code** |
| Typical_Vendors | Example vendors (display) | TEXT | — | None |
| Confidence | Data confidence | ENUM | HIGH, MEDIUM, LOW | Dropdown: fixed set |
| AHT_Data_Tier | Provenance tier for AHT | ENUM | T1_CLIENT_ACTUAL, T2_CONTRACT_DERIVED, T3_PUBLISHED_BENCHMARK, T4_WORKFLOW_ASSUMPTION, T5_TREATMENT_DEFAULT, UNKNOWN | Dropdown: fixed set |
| AHT_Source | Source of AHT value | VARCHAR(200) | — | None |
| Complexity_Tier | Complexity for modifier | ENUM | Simple, Standard, Complex, Highly_Complex | Dropdown: fixed set |
| Resource_Unit_Name | *(Legacy)* Name of the service unit. **v3:** Use Service_Unit_Name. | VARCHAR(100) | — | None |
| Service_Unit_Name | Name of the **service unit** (outcome) — the Q in P×Q (e.g. completed interaction, processed invoice). v3 rename from Resource_Unit_Name. | VARCHAR(100) | — | None |
| Typical_Volume_Low | Typical annual volume low | INT | — | None |
| Typical_Volume_High | Typical annual volume high | INT | — | None |
| Confidence_Score | Numeric confidence 0–100 | INT | — | None |

---

## TBL-005: Locations

| Column | Definition | Type/Format | Options | Source / Dropdown table? |
|--------|------------|-------------|---------|---------------------------|
| Location_Code | Unique code (country-city) | VARCHAR(10), PK | e.g. IN-BLR, PH-MNL | None |
| Country | Country name | VARCHAR(50) | — | None |
| City | City name | VARCHAR(50) | — | None |
| Region | Region (LATAM, EMEA, APAC, etc.) | VARCHAR(50) | — | Dropdown: define set |
| Currency_Code | ISO currency | VARCHAR(3) | — | Fixed list (ISO 4217) |
| USD_FX_Rate | Exchange rate to USD | DECIMAL(10,4) | — | None |
| Cost_Index | Labor cost index (India Bangalore = 100) | INT | — | None |
| US_Reference_Index | US reference index | DECIMAL(6,1) | — | Computed or manual |
| Timezone | IANA timezone | VARCHAR(50) | — | None |
| Labor_Market_Tier | Tier 1/2/3 | ENUM | 1, 2, 3 | Dropdown: fixed set |
| Notes | Free notes | TEXT | — | None |
| BPO_Market_Maturity | Market maturity 1–5 | INT 1-5 | — | Dropdown: 1–5 |
| Benefit_Burden_Pct | Employer benefit burden % | DECIMAL(4,1) | — | None |
| Index_Source | Source of cost index | VARCHAR(100) | — | None |
| Index_Confidence | Confidence in index | ENUM | HIGH, MEDIUM, LOW | Dropdown: fixed set |
| Last_Calibrated | Date index last calibrated | DATE | — | None |
| High_Inflation_Flag | Whether market has high inflation risk | BOOLEAN | TRUE, FALSE | Dropdown: fixed set |
| Change_Notes | Notes for changes | TEXT | — | None |

---

## TBL-006 through TBL-017 (summary)

**TBL-006 (Vendors):** vendorId, vendorName, primaryTower (→ TBL-001), secondaryTowers, hqCountry, ownership, revenueUsd, employeeCount, deliveryCenterCount, deliveryLocations, certifications, keyClients, serviceCapabilities, competitivePosition, strengths, weaknesses, redFlags, pricingModel, financialHealthScore, batch, plus Maxx_Vendor_Tier, Last_Researched, Profile_Completeness_Pct, Risk_Score, Revenue_USD_Numeric, Employee_Count_Numeric. **primaryTower** = dropdown from TBL-001.Tower_Code. **financialHealthScore** = ENUM (e.g. A,B,C,D,F,NR). **Maxx_Vendor_Tier** = ENUM (Strategic, Preferred, Approved, Conditional, Not_Assessed).

**TBL-007 (Aliases):** Alias_ID, User_Term, Service_Type_ID (→ TBL-004), Service_Type_Name, Confidence (HIGH/MEDIUM/LOW), Source, Usage_Count, Created_Date, Is_Active, Tower_Code (denorm → TBL-001).

**TBL-008 (Service–Vendor Map):** Mapping_ID, Service_Type_ID (→ TBL-004), Vendor_ID (→ TBL-006), Vendor_Name, Analyst_Ranking, Analyst_Source, Ranking_Tier, Vendor_Type, Founded_Year, Confidence, As_Of_Date, Source_Type, Notes, Maxx_Rec_Tier, Price_Position, Typical_Delivery_Location (→ TBL-005). **Maxx_Rec_Tier** = Leader/Strong/Competitive/Niche/Not_Recommended. **Price_Position** = Below_Market/Market/Above_Market/Premium.

**TBL-009 (Vendor Locations):** VendorLocation_ID, Vendor_ID (→ TBL-006), Vendor_Name, Location_Code (→ TBL-005), City, Country, Site_Type, Headcount_Range, Services_Offered, Source, Last_Verified, Location_Tier, Capacity_Status, Delivery_Model. **Site_Type** = HQ, Delivery_Center, etc. **Delivery_Model** = Onshore, Nearshore, Offshore, Hybrid.

**TBL-010 (Modifiers):** Modifier_Code (PK), Modifier_Name, Question_Text, Value_Type, Common_Values, Triggers_For, Priority, Required_By_Default, Modifier_Category, Application_Type, Application_Step, Max_Adjustment_Pct. **Modifier_Category** = A_LOCATION through G_CONTRACT. **Application_Type** = MULTIPLICATIVE, ADDITIVE.

**TBL-011 (Vendor ID Mapping):** Vendor_Name, Vendor_ID (→ TBL-006), Search_Key, Alt_Names, Parent_Vendor_ID (→ self), Is_Active.

**TBL-012 (Risk Rules):** Rule_ID, Rule_Name, Rule_Category, Applicable_Towers, Condition_Type, Condition_Config, Severity_Weight, Recommended_Treatment, Description, Mitigation_Text, Is_Active, Created_Date, Last_Updated, Threshold_Metric, Threshold_Operator, Threshold_Value. **Rule_Category** = SPEND_CONCENTRATION, VENDOR_RISK, etc. **Condition_Type** = THRESHOLD, RATIO, PATTERN, etc.

**TBL-013 (Treatments):** Treatment_ID, Finding_Type, Recommended_Product, Treatment_Level, Savings_Rate_Low_Pct, Savings_Rate_High_Pct, Implementation_Timeline, Prerequisites, Applicable_Towers, Priority_Level, Description, Condition_Metric, Condition_Operator, Condition_Value. **Finding_Type**, **Recommended_Product**, **Treatment_Level**, **Priority_Level** = fixed enums per schema.

**TBL-014 (Contract Benchmarks):** Clause_ID, Tower_Code (→ TBL-001), Category_Code (→ TBL-002), Clause_Type, Benchmark_Low/Median/High, Unit, Risk_Level, Source, Confidence, Last_Updated, Standard_Language, Red_Flags, Negotiation_Points. **Clause_Type** = CONTRACT_DURATION, AUTO_RENEWAL_PERIOD, etc.

**TBL-015 (Modifier Adjustments):** Adjustment_ID, Modifier_Code (→ TBL-010), Modifier_Value, Adjustment_Low/High/Median, Adjustment_Type, Applies_To_Towers, Applies_To_Tiers, Source, Confidence, Last_Updated. **Adjustment_Type** = PERCENTAGE, MULTIPLIER, FLAT_USD, etc.

**TBL-016 (Taxonomy Crosswalks):** Crosswalk_ID, External_System, External_Code, External_Name, Maxx_Level, Maxx_Code, Maxx_Name, Mapping_Confidence, Mapping_Notes, Created_By, Created_Date. **External_System** = SAP, APQC_PCF, FALCON, etc. **Maxx_Level** = TOWER, CATEGORY, SERVICE_TYPE.

**TBL-017 (Managed Service Load):** Load_Level (PK), Multiplier_Median, Description. **Load_Level** = Light, Standard, Premium (dropdown / master in this table).

---

## SLA: SLA Master (v3)

| Column | Definition | Type/Format | Options | Source / Dropdown table? |
|--------|------------|-------------|---------|---------------------------|
| SLA_ID | Unique identifier for the SLA dimension | VARCHAR(20), PK | e.g. SLA-001 | None |
| SLA_Name | Display name | VARCHAR(50) | — | None |
| SLA_Type | Timeliness or Quality | VARCHAR(20) | Timeliness, Quality | Dropdown: fixed set |
| Default_Target | Default target value (e.g. 24hr, 99%) | VARCHAR(200) | — | None |
| Unit | Unit of measure | VARCHAR(20) | hours, percent | Dropdown: fixed set |
| Description | Scope/definition | TEXT | — | None |

---

## Service_Type_SLA: Service Type × SLA Junction (v3)

| Column | Definition | Type/Format | Options | Source / Dropdown table? |
|--------|------------|-------------|---------|---------------------------|
| Service_Type_SLA_ID | Unique row ID for junction | VARCHAR(30), PK | — | None |
| Service_Type_ID | FK to TBL-004 | VARCHAR(20), FK | — | **TBL-004.Service_Type_ID** |
| SLA_ID | FK to SLA | VARCHAR(20), FK | — | **SLA.SLA_ID** |
| Target_Override | Service-type-specific target (overrides SLA default) | VARCHAR(200) | — | None |
| Display_Order | Order for UI | INT | — | None |

**Note:** After N→R taxonomy apply, TBL-004 has 152 new Service_Type_IDs. Service_Type_SLA rows that reference old ST IDs are orphans until remapped or rebuilt.

---

## Dropdowns that come from another table

| Field | Table | Source table.column |
|-------|-------|---------------------|
| Tower_Code | TBL-002, TBL-003, TBL-006, TBL-012, TBL-013, TBL-014 | TBL-001.Tower_Code |
| Category_Code | TBL-004, TBL-014 | TBL-002.Category_Code |
| Frontline_Agent_Type | TBL-003, TBL-004 | TBL-004 (canonical list); could be reference table |
| Location_Code | TBL-003, TBL-008, TBL-009 | TBL-005.Location_Code |
| Managed_Service_Load | TBL-004 | TBL-017.Load_Level |
| Service_Type_ID | TBL-007, TBL-008 | TBL-004.Service_Type_ID |
| Vendor_ID | TBL-008, TBL-009, TBL-011 | TBL-006 (vendorId) |
| Modifier_Code | TBL-010 (definitions), TBL-015 | TBL-010.Modifier_Code |

---

## Recommended new / reference tables

1. **Tower_Aliases (optional):** Tower_Code, Alias_Term — so clients can say "CX", "Marketing" and we map to correct tower.
2. **Category_Aliases (optional):** Category_Code, Alias_Term — same for categories.
3. **SLA table(s)** — see below.
4. **Frontline_Agent_Type reference (optional):** If we want one canonical list of roles (Agent_Type_Code, Agent_Type_Name, Description) instead of inferring from TBL-004; then TBL-003 and TBL-004 reference it.

---

## SLA table design recommendation

**Requirement:** A service type can have **multiple SLAs**. Multiple service types can **share** the same SLA definition. We need targets (and possibly type) per SLA.

**Option A — SLA master + fixed slots on TBL-004**  
- **SLA** table: SLA_ID, SLA_Name, SLA_Type (Timeliness/Quality/Other), Target_Definition, Unit, Description.  
- TBL-004: add SLA_1_ID, SLA_2_ID, …, SLA_5_ID (FK to SLA), and optionally SLA_1_Target_Override, …, SLA_5_Target_Override.  
- **Pros:** Simple to query; cap of 5 SLAs per service type is explicit. **Cons:** Reusing the same SLA across service types is just repeating the same SLA_ID in slot 1 for many rows; overrides are per-service-type.

**Option B — SLA master + junction table (recommended)**  
- **SLA** table: SLA_ID, SLA_Name, SLA_Type (Timeliness, Quality, CSAT, Accuracy, etc.), Default_Target, Unit, Description. Defines the **library** of SLAs.  
- **Service_Type_SLA** table: Service_Type_ID (FK TBL-004), SLA_ID (FK SLA), Target_Override (nullable; if NULL use SLA.Default_Target), Display_Order (1–5).  
- **Pros:** Many-to-many: one SLA can be used by many service types; one service type can have 1–5 (or more) SLAs; no fixed slot columns on TBL-004; new SLAs added in one place. **Cons:** Extra join for "all SLAs for this service type."  
- **Recommendation:** **Option B.** Cap at 5 SLAs per service type in **application logic** or via constraint (e.g. max 5 rows per Service_Type_ID in Service_Type_SLA) if needed. Migrate current TBL-004 SLA columns into: (1) create SLA rows for each distinct (SLA_Timeliness_Type + SLA_Timeliness_Default) and (SLA_Quality_Type + SLA_Quality_Default); (2) create Service_Type_SLA rows linking each service type to 1–2 SLAs with optional target override.

**Option C — Keep current TBL-004 SLA columns and add more slots**  
- Add SLA_3_Type, SLA_3_Default, SLA_4_Type, SLA_4_Default, SLA_5_Type, SLA_5_Default to TBL-004.  
- **Pros:** No new tables. **Cons:** No reuse of SLA definitions across service types; duplicated definitions; harder to maintain.

**Conclusion:** Implement **Option B** (SLA master table + Service_Type_SLA junction). Deprecate or migrate TBL-004 columns SLA_Timeliness_Type, SLA_Timeliness_Default, SLA_Quality_Type, SLA_Quality_Default into the new structure when ready.

---

*End of R_TABLE_FIELD_DEFINITIONS.md. Re-run export_botpress_tables_to_excel.py after any table structure change so the Excel snapshot stays current.*
