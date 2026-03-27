# MaxxBot: Routing, Retrieval, Steps & Processing — Mapping for Botpress

**Purpose:** Single reference for how MaxxBot should (1) **route** the user's query, (2) **retrieve** data from the 17 tables, (3) **follow the steps** with that data, and (4) **process** it before responding. Use this with the Function Catalog, golden question answer key, and **R_DATABASE_SCHEMA**.

**Date:** 2026-02-13 | **Updated (v3):** 2026-02-23 | **Audience:** Botpress build team | **Status:** Final for handoff — send with R_DATABASE_SCHEMA v3 and 19 table files (17 base + SLA.csv + Service_Type_SLA.csv).

---

## How this document relates to R_DATABASE_SCHEMA

This document is the **routing + retrieve + steps + process** spec for the new tables: how MaxxBot should (1) route the query, (2) retrieve the data, (3) do the steps with it, and (4) process it before responding. Use it together with R_DATABASE_SCHEMA.

**R_DATABASE_SCHEMA** contains:
- Table definitions, column specs, data types, and constraints for all 17 tables
- **Purpose (Botpress)** per table: when and how MaxxBot uses each table (which function, which user questions); see each table section (e.g. TBL-010, TBL-011, TBL-012–016).
- **Table Relationship Map** (Part 3): FKs and how tables link (e.g. TBL-004.Managed_Service_Load → TBL-017.Load_Level)
- **Common Query Patterns** (Section 3.2): Pattern 1 (Rate Lookup with pseudo-SQL and flow), Pattern 2 (Vendor Comparison), Pattern 3 (Assessment Workflow), Pattern 4 (Modifier Application 8-step sequence), Pattern 5 (Forcing Function Classification)

**This document adds:**
- **Routing:** Which user intent/query triggers which function (WF-01–WF-12) — not in the schema
- **Retrieve / Steps / Process:** Step-by-step procedures per function (tables, columns, order, formulas) in one place

**Use both:** Schema for structure, relationships, and query patterns; this doc for routing and step-by-step implementation procedures.

---

## How to use this document

- **Section 1 (ROUTING)** — Use the table to decide which function handles the query. One row per intent/trigger → one function.
- **Section 2 (RETRIEVE)** — For each function: which tables to query, in what order, and which columns/keys to use.
- **Section 3 (STEPS)** — For each function: numbered sequence of actions (what to do with the data).
- **Section 4 (PROCESS)** — For each function: formulas and logic (calculations, filters, how to combine data).

All table and column names match v3: 17 base tables + **SLA.csv** + **Service_Type_SLA.csv**. TBL-004 has **Service_Unit_Name**, **Service_Unit_Definition**; no SLA_* columns (use SLA + Service_Type_SLA). TBL-005 has **Date_of_FX**, **ITO_Market_Maturity**. TBL-006 column is **deliveryRegions** (not deliveryLocations).

---

# SECTION 1: ROUTING

**How MaxxBot should route the information query:** match user intent to one function, then run that function's retrieve → steps → process.

| # | User intent / query triggers (examples) | Route to function | Type | Primary tables |
|---|----------------------------------------|--------------------|------|----------------|
| 1 | "What's the rate for…", "How much should I pay…", "Benchmark…", "Am I overpaying?", "Compare rates India vs Philippines", rate, price, hourly rate | **WF-01** Rate Benchmark | Scripted (or table-driven for simple Q) | TBL-003, TBL-004, TBL-005, TBL-007, TBL-010, TBL-015, TBL-017 |
| 2 | "Tell me about [vendor]", "Who are top providers for…", "[Vendor] capabilities", "Red flags for [vendor]", compare two vendors by name | **WF-02** Vendor Intelligence or **WF-08** Vendor Comparison | Table-driven | TBL-006, TBL-008, TBL-009, TBL-011 |
| 3 | "What are my risks?", "Should I worry?", "Sole source", "Concentration", "Contract hasn't been rebid", spend amount + vendor/contract context | **WF-03** Risk Assessment | Hybrid | TBL-012, TBL-006, TBL-008, TBL-003 |
| 4 | "How can I reduce spend?", "What should I do about…", "Negotiate?", "RFP?", "Consolidate?", treatment, savings | **WF-04** Treatment Recommendation | Hybrid | TBL-013, TBL-012, TBL-003, TBL-015 |
| 5 | Compare two proposals (upload), "Is this pricing competitive?" (with doc) | **WF-05** Proposal Comparison | Scripted | TBL-003, TBL-005, TBL-006, TBL-014 |
| 6 | "Review this contract", "MSA risks", upload contract | **WF-06** Contract Risk Analysis | Scripted | TBL-014, TBL-012, TBL-003, TBL-006 |
| 7 | Upload spend data, "Classify my spend", "Map our vendors" | **WF-07** Spend Classification | Scripted (future) | TBL-001, TBL-002, TBL-004, TBL-005, TBL-007, TBL-003 |
| 8 | "Compare [location A] vs [location B]", "Where should I offshore?", "Cost index for…", delivery location | **WF-09** Location Analysis | Table-driven | TBL-005, TBL-003, TBL-008 |
| 9 | "How do you calculate…", "What's the difference between…", methodology, education | **WF-10** Methodology | KB only | KB |
| 10 | "Build a business case", "What savings can I expect?" (scenario) | **WF-11** Business Case | Scripted (future) | TBL-003, TBL-013, TBL-015, TBL-012 |
| 11 | "Export this", "Download as Word/Excel" | **WF-12** Export | Scripted | N/A (conversation state) |

**Routing rule:** If the user explicitly invokes a function by name (e.g. "Rate Benchmark"), route to that function and run its full flow. Otherwise, match the message to the intent column above and route to the listed function.

---

## Clarifications and guardrails (Botpress logic)

**Purpose:** So the bot asks the right questions and uses the right table path before answering. Implement in Botpress flow or code actions; this doc is the spec.

### Rate / benchmark intent (WF-01 or table-driven rate Q)

1. **First clarification — delivery model (required)**  
   Before returning any rate, the bot must know whether the user wants:
   - **Staff augmentation** (staff aug, T&M, per-agent, unblended) = raw direct-labor rate. **Path:** TBL-003 only (Rate_Low_USD, Rate_Median_USD, Rate_High_USD). Do **not** apply TBL-017.
   - **Managed service** (managed, blended, outcome-based, team/service) = rate that includes support, SLAs, vendor scope. **Path:** TBL-003 + TBL-004.Managed_Service_Load → TBL-017; return **Blended = Unblended × Multiplier_Median**.

   **Bot behavior:** If the user has not specified, ask one clarifying question, e.g.:  
   *"Are you looking for a staff augmentation (per-agent, unblended) rate, or a managed service (blended, outcome-oriented) benchmark?"*  
   Then branch: staff aug → unblended path; managed → blended path (Retrieve steps 5–6 in WF-01).

2. **Minimum required inputs for a rate answer**  
   Do not return a rate benchmark without: (a) **service/role** (or alias resolvable to Service_Type_ID), (b) **location** (resolvable to Location_Code), (c) **delivery model** (staff aug vs managed). Tier can default (e.g. Standard) if missing. If any are missing, ask once (or per missing item up to a configured limit, e.g. 1–2 refinements).

3. **"Overpaying" / gap-to-benchmark questions**  
   If the user asks whether they are overpaying or how their rate compares, the bot must collect **current rate** (e.g. "What are you currently paying per hour?") before comparing to the benchmark. Do not return only a raw market range without that context when the intent implies a comparison.

### Vendor / location intent (WF-02, WF-09, table-driven)

- **Vendor:** Need vendor name (or enough to disambiguate via TBL-011). If ambiguous, ask once (e.g. "Which vendor — Accenture US or Accenture UK?").
- **Location comparison:** Need at least two locations or one location + "compare to India/Philippines" etc. If vague, ask once for geography.

### Summary for Botpress

| Intent | Required before answer | First clarification if missing |
|--------|------------------------|----------------------------------|
| Rate / benchmark | Service/role, location, delivery model | Delivery model: staff aug vs managed |
| Overpaying / gap | Service, location, delivery model, **current rate** | Current rate (and delivery model if missing) |
| Vendor intel | Vendor identifier | Disambiguation if multiple matches |
| Location analysis | At least one location (two for compare) | Which locations / geography |

---

# SECTION 2: RETRIEVE

**How MaxxBot retrieves the data:** which tables, in what order, and which columns/keys to use.

## WF-01 Rate Benchmark

**Clarification (do first):** If **delivery model** is not yet known, ask: staff augmentation (unblended per-agent rate) vs managed service (blended, outcome-oriented). Then:
- **Staff aug** → run steps 1–4 only; skip steps 5–6; return unblended rate from TBL-003.
- **Managed** → run steps 1–6; return blended rate = unblended × TBL-017 multiplier.

| Step | Table | Action | Columns / keys to use |
|------|--------|--------|------------------------|
| 1 | TBL-007 (Service Name Aliases) | Match user phrase (service/role) to alias | **User_Term** → **Service_Type_ID** |
| 2 | TBL-004 (Service Types) | Get role and load level for that service | **Service_Type_ID** → **Frontline_Agent_Type**, **Managed_Service_Load**, **Category_Code** (FK to TBL-002; use Category_Code not Parent_Category_Code for FK) |
| 3 | TBL-005 (Locations) | Resolve user location to code | **City** or **Country** → **Location_Code**, Cost_Index (for context) |
| 4 | TBL-003 (Base Rates) | Get unblended rate | Filter: **Frontline_Agent_Type** = step 2, **Location_Code** = step 3, **Tier** = user/default, **Rate_Type** = 'Direct_Labor', **Rate_Unit** = 'Per_Hour' (for hourly rate lookups; omit Rate_Unit filter if user asks for per-month, per-hire, or other unit). Read **Rate_Low_USD, Rate_Median_USD, Rate_High_USD** only (do not use local currency columns). |
| 5 | TBL-004 | Get load level for blended (managed only) | **Managed_Service_Load** (e.g. Standard, Light, Premium) for Service_Type_ID from step 2 — use only when delivery model = managed. |
| 6 | TBL-017 (Managed Service Load) | Get multiplier for blended rate (managed only) | **Load_Level** = step 5 value → **Multiplier_Median** (and Low/High if columns exist). Apply only when delivery model = managed. |
| 7 | TBL-010 (Modifiers) | Optional: which modifiers apply | Modifier_Code, Application_Step, Triggers_For (by tower/service) |
| 8 | TBL-015 (Modifier Adjustments) | Optional: adjustment values | Modifier_Code, **Adjustment_Low, Adjustment_Median, Adjustment_High** (or equivalent) |

**Join / filter summary:** TBL-007.Service_Type_ID → TBL-004.Service_Type_ID. TBL-004.Frontline_Agent_Type + TBL-005.Location_Code + Tier → TBL-003 lookup. When delivery model = managed: TBL-004.Managed_Service_Load → TBL-017.Load_Level. (Aligns with **R_DATABASE_SCHEMA** Pattern 1: Rate Lookup.)

---

## WF-02 Vendor Intelligence

| Step | Table | Action | Columns / keys to use |
|------|--------|--------|------------------------|
| 1 | TBL-011 (VENDORID_MAPPING) | Resolve vendor name to ID | **Vendor_Name**, Search_Key, Alt_Names → **Vendor_ID** |
| 2 | TBL-006 (Vendors) | Get profile | **vendorId** = Vendor_ID → vendorName, primaryTower, strengths, weaknesses, redFlags, financialHealthScore, **deliveryRegions**, serviceCapabilities, competitivePosition, etc. (v3: use deliveryRegions; geo filtering via TBL-009 + TBL-005) |
| 3 | TBL-008 (Service–Vendor Map) | Get service capabilities / rankings | **Vendor_ID** → Service_Type_ID, Analyst_Ranking, Ranking_Tier, Vendor_Type; join to TBL-004 for Service_Type_Name if needed |
| 4 | TBL-009 (Vendor Locations) | Get delivery locations | **Vendor_ID** → Location_Code; join to **TBL-005** for City, Country, Cost_Index, Region |

**Join summary:** TBL-011.Vendor_ID → TBL-006.vendorId. Same Vendor_ID → TBL-008, TBL-009. TBL-009.Location_Code → TBL-005.Location_Code. (Aligns with **R_DATABASE_SCHEMA** Pattern 2: Vendor Comparison.)

---

## WF-03 Risk Assessment

| Step | Table | Action | Columns / keys to use |
|------|--------|--------|------------------------|
| 1 | TBL-012 (Risk Rules) | Get rules and thresholds | **Rule_ID**, Rule_Name, Rule_Category, **Threshold_Metric**, **Threshold_Operator**, **Threshold_Value**, Severity_Weight, Recommended_Treatment, Description, Mitigation_Text. Filter by Applicable_Towers if user context is known. |
| 2 | (User message) | Extract scenario numbers | spend_amount, contract_age_years, vendor_count, concentration_pct (from natural language) |
| 3 | TBL-006, TBL-008 | Optional: vendor context | If user names vendor: Vendor_ID → financial health, delivery count for risk context |

**Join summary:** No join between TBL-012 rows; each row is one rule. Compare user's extracted numbers to Threshold_Value using Threshold_Operator (e.g. >, <, >=).

---

## WF-04 Treatment Recommendation

| Step | Table | Action | Columns / keys to use |
|------|--------|--------|------------------------|
| 1 | TBL-013 (Treatment Recommendations) | Get rules and savings rates | **Treatment_ID**, Finding_Type, Recommended_Product, **Condition_Metric**, **Condition_Operator**, **Condition_Value**, **Savings_Rate_Low_Pct**, **Savings_Rate_High_Pct**, Description. Filter by Applicable_Towers if known. |
| 2 | (User message) | Extract scenario | spend, contract age, vendor count, etc. |
| 3 | TBL-003, TBL-015 | Optional: benchmark context | For savings estimate: use TBL-003 rates and TBL-015 adjustments to contextualize treatment savings |

**Join summary:** Evaluate TBL-013 rows: for each row, check whether user scenario satisfies Condition_Metric + Condition_Operator + Condition_Value. If yes, that treatment applies; use Savings_Rate_Low_Pct / Savings_Rate_High_Pct for range.

---

## WF-08 Vendor Comparison

| Step | Table | Action | Columns / keys to use |
|------|--------|--------|------------------------|
| 1 | TBL-011 | Resolve both vendor names to Vendor_ID | Same as WF-02 step 1, for each vendor |
| 2 | TBL-006 | Get both profiles | Same as WF-02 step 2, for each Vendor_ID |
| 3 | TBL-008 (Service–Vendor Map) | Get rankings for service (if user specified) | Filter by **Service_Type_ID** if "for [service]" → Analyst_Ranking, Ranking_Tier, Vendor_Type |
| 4 | TBL-003, TBL-008 | Rate comparison | TBL-008 links vendors to Service_Type_ID; TBL-003 gives rate ranges by location/tier for that service |
| 5 | TBL-009 + TBL-005 | Delivery locations | Vendor_ID → Location_Code → TBL-005 for City, Country, Cost_Index |

---

## WF-09 Location Analysis

| Step | Table | Action | Columns / keys to use |
|------|--------|--------|------------------------|
| 1 | TBL-005 (Locations) | Get location(s) | **Location_Code**, City, Country, **Cost_Index**, Region, Timezone, Labor_Market_Tier, Currency_Code |
| 2 | TBL-003 | Location-specific rates (if user asked for a service) | Filter by **Location_Code** in (step 1), optionally by Frontline_Agent_Type if service given |
| 3 | TBL-008 / TBL-009 | Vendor presence by location | TBL-009.Location_Code for "who operates here" |

---

# SECTION 3: STEPS

**The steps MaxxBot should do with the data** (in order).

## WF-01 Rate Benchmark

| Step | What to do |
|------|------------|
| 0 | **If delivery model unknown:** Ask user: staff augmentation (unblended per-agent) vs managed service (blended). Branch: staff aug → steps 1–4, 6–8 only; managed → all steps. |
| 1 | Resolve user's service/role phrase to **Service_Type_ID** via TBL-007 (aliases). If no match, search TBL-004.Service_Type_Name or ask user to clarify. |
| 2 | From TBL-004, get **Frontline_Agent_Type** and **Managed_Service_Load** for that Service_Type_ID. |
| 3 | Resolve user's location to **Location_Code** via TBL-005 (City/Country). |
| 4 | Look up TBL-003 row where Frontline_Agent_Type + Location_Code + Tier match. Read only Rate_Low_USD, Rate_Median_USD, Rate_High_USD. If no row, check for RATE-FALLBACK-* row for that Frontline_Agent_Type and Tier (e.g. IN-BLR) and return as fallback. |
| 5 | **Only when delivery model = managed:** Get Managed_Service_Load from TBL-004, then Multiplier_Median from TBL-017 for that Load_Level. Compute blended rate = unblended × multiplier. When delivery model = staff aug, skip this step and return unblended only. |
| 6 | If user provided current rate: compute gap % = (Current_Rate − Rate_Median_USD) / Rate_Median_USD; surface "X% above/below median." For "am I overpaying?" intent, ensure current rate was collected (see Clarifications and guardrails). |
| 7 | Optional: apply modifiers from TBL-010/TBL-015 per 8-step sequence (see methodology and **R_DATABASE_SCHEMA** Pattern 4). |
| 8 | Return: rate range (unblended and/or blended per delivery model), caveat (direct labor vs blended), source/cite (Source, Confidence, Rate_ID from TBL-003). |

---

## WF-02 Vendor Intelligence

| Step | What to do |
|------|------------|
| 1 | Resolve vendor name to **Vendor_ID** via TBL-011. |
| 2 | Load vendor profile from TBL-006 (all relevant columns). |
| 3 | Load service capabilities from TBL-008 (Service_Type_ID, Analyst_Ranking, etc.); join to TBL-004 for service names if needed. |
| 4 | Load delivery locations from TBL-009; join to TBL-005 for City, Country, Cost_Index. |
| 5 | Synthesize into one response: profile summary, strengths, weaknesses, red flags, competitive position, delivery locations. If vendor not found, say so and suggest alternatives. |

---

## WF-03 Risk Assessment

| Step | What to do |
|------|------------|
| 1 | **Table-driven (generic risk):** Return relevant rows from TBL-012 (Rule_Name, Description, Mitigation_Text, Recommended_Treatment) filtered by tower/category if user specified. |
| 2 | **Scripted (scenario):** From user message, extract spend_amount, contract_age_years, vendor_count, concentration_pct. |
| 3 | For each rule in TBL-012 that has Threshold_Metric, Threshold_Operator, Threshold_Value: evaluate whether the extracted value satisfies the condition (e.g. concentration_pct > Threshold_Value). |
| 4 | Return list of rules that fire, with Severity_Weight and Recommended_Treatment, plus Description/Mitigation_Text. |

---

## WF-04 Treatment Recommendation

| Step | What to do |
|------|------------|
| 1 | From user message, extract scenario (spend, contract age, vendor count, etc.). |
| 2 | For each row in TBL-013, evaluate Condition_Metric, Condition_Operator, Condition_Value against the scenario. If condition is true, that treatment applies. |
| 3 | For each applicable treatment, take Savings_Rate_Low_Pct and Savings_Rate_High_Pct; compute savings range = Spend × (Savings_Rate_Low_Pct / 100) to Spend × (Savings_Rate_High_Pct / 100). |
| 4 | Return prioritized list of treatments with savings range and Description. Optionally pull rationale from KB. |

---

# SECTION 4: PROCESS

**How MaxxBot should process the data** (formulas and logic).

## WF-01 Rate Benchmark

| Process | Formula / logic |
|---------|------------------|
| **Unblended rate** | Use Rate_Low_USD, Rate_Median_USD, Rate_High_USD from TBL-003. Do not use Currency_Local, Rate_Low_Local, Rate_High_Local (unreliable). |
| **Blended rate** | **Blended = Unblended × TBL-017.Multiplier_Median** where Load_Level = TBL-004.Managed_Service_Load for the service type. Example: $8/hr × 1.45 = $11.60/hr. |
| **Gap to current rate** | **Gap_pct = (Current_Rate − Rate_Median_USD) / Rate_Median_USD × 100**. Display as "X% above median" or "X% below median." |
| **Modifier stacking** | When applying TBL-010/TBL-015: follow 8-step sequence in R_MOD spec and **R_DATABASE_SCHEMA** Pattern 4; apply adjustments in Application_Step order; respect stacking rules (additive vs multiplicative, caps) per methodology. **PERCENTAGE → multiplier:** When TBL-015.Adjustment_Type = PERCENTAGE and TBL-010.Application_Type = MULTIPLICATIVE, use **multiplier = 1 + (Adjustment_Pct/100)** (e.g. +15% → 1.15). |

---

## WF-03 Risk Assessment

| Process | Formula / logic |
|---------|------------------|
| **Threshold evaluation** | For each TBL-012 row: if Threshold_Metric matches extracted field (e.g. concentration_pct), compare: extracted_value **Threshold_Operator** Threshold_Value (e.g. 45 > 40 → true). If true, rule fires. |
| **Severity ordering** | Sort fired rules by Severity_Weight (e.g. 1.0–5.0); surface highest first. Use Recommended_Treatment and Mitigation_Text in the response. |

---

## WF-04 Treatment Recommendation

| Process | Formula / logic |
|---------|------------------|
| **Condition evaluation** | For each TBL-013 row: compare user's scenario value for Condition_Metric against Condition_Value using Condition_Operator (e.g. spend > 1000000, contract_age >= 3). |
| **Savings range** | **Savings_Low = Spend × (Savings_Rate_Low_Pct / 100)**; **Savings_High = Spend × (Savings_Rate_High_Pct / 100)**. Use authoritative ranges where applicable: Negotiation 8–15%, Contract optimization 5%, MIMO 3%, VMO 2%. |

---

# Quick reference: table → function

| Table | Used by functions | Main use |
|-------|-------------------|----------|
| TBL-001 | WF-07, WF-10 | Towers (list, filter) |
| TBL-002 | WF-07, WF-10 | Categories; join via TBL-004.Parent_Category_Code |
| TBL-003 | WF-01, WF-05, WF-08, WF-09, WF-11 | Base rates: Frontline_Agent_Type, Location_Code, Tier → Rate_Low/USD, Rate_Median_USD, Rate_High_USD |
| TBL-004 | WF-01, WF-02, WF-07, WF-10 | Service types: Service_Type_ID, Frontline_Agent_Type, Managed_Service_Load, **Category_Code** (use for FK to TBL-002), Service_Unit_Name, Service_Unit_Definition; no SLA columns in v3 |
| SLA | (SLA by service type) | Master: SLA_ID, SLA_Name, SLA_Type |
| Service_Type_SLA | (SLA by service type) | Junction: Service_Type_ID, SLA_ID, Target_Override — use for SLA retrieval (not TBL-004) |
| TBL-005 | WF-01, WF-05, WF-07, WF-08, WF-09 | Locations: Location_Code, City, Country, Cost_Index, Region |
| TBL-006 | WF-02, WF-05, WF-06, WF-08 | Vendors: vendorId, profile fields |
| TBL-007 | WF-01, WF-07 | Aliases: User_Term → Service_Type_ID |
| TBL-008 | WF-02, WF-08, WF-09 | Service–Vendor map: Service_Type_ID, Vendor_ID, Analyst_Ranking |
| TBL-009 | WF-02, WF-08, WF-09 | Vendor locations: Vendor_ID, Location_Code |
| TBL-010 | WF-01 | Modifier definitions (what to ask, when) |
| TBL-011 | WF-02, WF-08 | Vendor name → Vendor_ID |
| TBL-012 | WF-03, WF-04, WF-06 | Risk rules: Threshold_Metric, Threshold_Operator, Threshold_Value, Severity_Weight |
| TBL-013 | WF-04, WF-11 | Treatment rules: Condition_*, Savings_Rate_Low_Pct, Savings_Rate_High_Pct |
| TBL-014 | WF-05, WF-06 | Contract benchmarks: Clause_ID, Clause_Type, Risk_Level |
| TBL-015 | WF-01, WF-04, WF-11 | Modifier adjustments: Adjustment_Low/Median/High |
| TBL-016 | WF-07 | Taxonomy crosswalks (future) |
| TBL-017 | WF-01 | Managed Service Load: Load_Level → Multiplier_Median (blended = unblended × multiplier) |

---

*End of mapping document. Use with **R_DATABASE_SCHEMA** v3 (table definitions, relationships, Common Query Patterns) to implement MaxxBot against the 19 table files (17 base + SLA + Service_Type_SLA).*
