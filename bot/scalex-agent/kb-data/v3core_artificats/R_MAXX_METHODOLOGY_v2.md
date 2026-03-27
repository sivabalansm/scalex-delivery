# R_MAXX_METHODOLOGY_v2.md
## Maxx Outsourced Services Pricing & Classification Methodology

**Project:** R (Maxx Taxonomy Standards & MaxxBot Intelligence Architecture)  
**Version:** 2.0 | **Table alignment (v3):** 2026-02-23  
**Created:** 2026-02-10  
**Status:** CONSOLIDATED — Single source of truth for methodology; governs all Maxx platform products and Botpress table narrative  
**Supersedes:** R_MAXX_METHODOLOGY_v1.md  
**Incorporates:** Option A consolidation — content from KB_METHODOLOGY, KB_VENDOR_EVALUATION, KB_OFFSHORING_LOCATIONS (now narrative sections M, N, O); §E updated per R_MOD (39 modifiers); RB5 addendum items in §L; Treatment Tables (TBL-012–016) narrative; Workflow as cornerstone.

**v3 table alignment:** TBL-004 **Benchmark_Unit** = Pricing Unit (Q in P×Q); **Service_Unit_Name** = outcome unit name; **Service_Unit_Definition** = TEXT outcome description. SLA by service type: **SLA** + **Service_Type_SLA** (junction-only; TBL-004 SLA columns removed). TBL-005 **Date_of_FX** = FX snapshot date; **ITO_Market_Maturity** for tech talent. Modifier math: when TBL-015.Adjustment_Type = PERCENTAGE and TBL-010.Application_Type = MULTIPLICATIVE, use **multiplier = 1 + (Adjustment_Pct/100)**.

---

## Document Purpose

This is the authoritative methodology reference for the Maxx platform. All Maxx products — Assessment, MIMO, Contracting Office, Sourcing Accelerator, MaxxBot, and Refresh — consume this methodology. It also serves as the **narrative source of truth for what the Botpress tables (TBL-001 through TBL-017) are supposed to do**. Changes require operator approval and trigger re-validation of dependent deliverables.

**Related deliverables (do not duplicate):**
- **Function-to-table mapping:** R_WORKFLOW_CATALOG.md (MaxxBot function catalog) + field-level crosswalk (to be created).
- **Golden question scoring:** R_GOLDEN_QUESTION_ANSWERS_v2.md — each answer should cite Function + Table/field per this methodology.
- **Modifier specification:** R_MOD_MODIFIER_FRAMEWORK_SPEC_v1.md — full 39-modifier catalog and interaction model.

**Sections in this document:**  
A: Taxonomy | B: Core Concepts (incl. Workflow as cornerstone) | C: Assumption Stack & Data Quality | D: Pricing & Conversion | E: Modifier Framework (39) | F: Location Cost Index | G: Forcing Function Logic | H: Product Integration | I: Governance | J: Range Engine | K: Data Refresh | L: Marketing Statistics & Claims (+ RB5 addendum) | **Treatment Tables (TBL-012–016)** | M: Savings, Treatments & Benchmarking (narrative) | N: Vendor Evaluation (narrative) | O: Offshoring & Location (narrative) | Table Field Alignment | Locked Decisions | References

---

## Section A: Taxonomy Structure & Hierarchy

### A.1 Four-Level Classification Model

- **Level 1: TOWER** — market-facing service domain. **v3 Botpress (TBL-001):** 20 towers (legacy + ENG, CNAS, MK, RC).  
- **Level 2: CATEGORY** — functional grouping with distinct vendor landscape and benchmarking. **v3 Botpress (TBL-002):** 94 categories.  
- **Level 3: SERVICE TYPE** — commercial unit; each has attributes in TBL-004: delivery channel, pricing model, benchmark unit, frontline agent type, tier structure, AHT default, SLA targets. **v3 Botpress (TBL-004):** 414 service types (taxonomy locked from N GPT run v6.1).  
- **Level 4: WORKFLOW INSTANCE** — client-specific (vendor + service type + BU + location + contract). Created per engagement.

Subcategory is not a formal level; it remains an optional display label. Canonical taxonomy: Botpress TBL-001 (towers), TBL-002 (categories), TBL-004 (service types). Crosswalks (e.g. TBL-016) map external systems to Maxx codes.

### A.2 IT Taxonomy (Reconciled)

9 IT categories: CAT-IT-001 Application Development & Support through CAT-IT-009 Enterprise Software & Platforms. CAT-IT-003 End-User Services, CAT-IT-007 IT Consulting & Advisory, CAT-IT-008 Network & Telecommunications. Hardware Mfg is subcategory under CAT-IT-002.

### A.3 Industry Framework Alignment

Market-facing (how services are bought/sold). APQC PCF, TBM, Hackett GBS, ISG/Everest — crosswalks maintained; Botpress tables are authoritative.

---

## Section B: Core Concepts

### B.0 Workflow as the Maxx/MaxxBot Cornerstone

**Workflow** is the proprietary Maxx/MaxxBot concept: the set of **operational, commercial, legal, and technical fields** that, when combined, define a **service workflow** — not just a role or rate. A workflow is what we benchmark, classify, and optimize.

**Workflow fields** (the variables that define a workflow instance) include:

| Category | Examples |
|----------|----------|
| **Taxonomy** | Tower_Code, Category_Code, Service_Type_ID (with identified Frontline_Agent_Type) |
| **Commercial** | Rate (hourly/blended/PPU), Rate_Type (Direct_Labor / Blended / Fully_Loaded), **Pricing_Model** (dropdown of researched options: price per unit, price per hour, fixed monthly, fixed monthly with true-up, outcome-based, gainshare, etc.), **Pricing_Unit** (what gets billed on the invoice — the Q in P×Q), **Service_Unit** (outcome of the workflow, e.g. completed case, processed invoice), Volume, AHT |
| **Operational** | SLA type and targets (e.g. time to first response, quality %, first call resolution), service level targets by service type, typical volume range, delivery location, language, shift |
| **Quality / maturity** | Complexity tier, documentation maturity, system where work is performed (e.g. is AHT/volume recorded?) |
| **Vendor / contract** | Vendor(s) strong in this service type, contract benchmarks (term, termination, liability), standard targets for outsourced contracts |

Not all workflow fields are required for every interaction. The more detail the user provides, the more accurate the response. The **sweet spot** (which fields to require vs optional, and how deep to go) is driven by **actual use cases** — what users will ask and what **functions** need to be pre-scripted. See **R_WORKFLOW_CATALOG.md** (function inventory): it defines the 12 MaxxBot functions (WF-01–WF-12), which are scripted vs table-driven, what inputs each needs, and how the bot uses the tables. That catalog, plus the field-level crosswalk (function → tables → columns → query/return), is how this intelligence gets programmed: required and optional workflow fields per function, then table-driven behavior and custom scripts per use case.

The **database (TBL-001 through TBL-017)** exists to populate and query these fields so that users get accurate, comparable benchmarks and insights without deep consulting or custom contract reviews. This is the Maxx differentiator: we create the framework by defining industry taxonomy (tower → category → service type) and Maxx commercial workflow fields; we build the database around these parameters.

### B.1 The Workflow (Instance)

A **workflow instance** is the atomic unit of analysis: one vendor delivering one service type to one part of the client's organization. Everything in Maxx resolves to a workflow. Workflow = Taxonomy position + Client context (vendor, BU, location, contract terms).

### B.2 Service Unit vs Pricing Unit (and the P×Q on the invoice)

- **Service unit** (outcome of the workflow / service) = the *thing that gets done*: completed cases, documents reviewed and classified, invoices processed, application maintenance enhancement executed, resolved tickets, etc. This is the **outcome** we care about for quality and volume.
- **Pricing unit** = what **actually gets billed** on the invoice — the **Q** in P×Q in a straightforward sense. It is often, but not always, the same as the service unit. Examples where they differ: customer service billed per **contact** (pricing unit) vs per **completed case** (service unit); or fixed monthly where **Q = 1** and **rate = total monthly fee**. Some deals are **fixed monthly based on set volume** (e.g. fixed fee for up to X transactions). The world of possibilities is large; there is no single "best" pricing model — it depends on what the client wants (e.g. total control over their operation → pricing unit at a lower level like "contact"; or managed at a higher level → price per completed case). **Workflow maturity** often dictates what is possible: e.g. is the work performed in a system where AHT or volume per service unit is recorded? If not, outcome-based or per-unit pricing may not be feasible.
- **Pricing model** = how the deal is structured. It should be presented as a **dropdown or list of researched options**, e.g.: price per unit, price per hour (T&M), blended hourly, fixed monthly, fixed monthly with true-up, outcome-based, gainshare. Tables (TBL-003, TBL-004) hold **Primary_Pricing_Model** / **Pricing_Model** and **Benchmark_Unit** / **Rate_Unit**; these support both "what is typical for this service type" and "what did the user choose" in a given workflow instance.

**Resource Unit** (internal term) / **Service Unit** (external term) in legacy text refers to the outcome unit; when we need to be precise we distinguish **service unit** (outcome) from **pricing unit** (billed Q). Every pricing model can be normalized to cost per service unit via the frontline agent anchor (blended hourly × AHT = price per unit of outcome).

### B.3 Frontline Agent Anchoring

The **frontline agent** is the central pricing anchor. Every outsourced service resolves to people performing work. The **blended** hourly rate for the frontline agent profile (by service type, tier, location) is the benchmark anchor for commercial comparisons. **Conversion chain:**

- Blended Hourly Rate × (AHT in hours) = Price Per Resource Unit  
- Price Per Unit × Volume = Monthly Cost → × 12 = Annual Contract Value  

**Unblended vs blended in tables:** TBL-003 stores **unblended (Direct_Labor)** rates only. Blended rate is **derived**: Unblended × Managed_Service_Multiplier. The multiplier comes from **TBL-017 (Managed Service Load)** by service type’s **Managed_Service_Load** tier (Light / Standard / Premium) in TBL-004. See R_11E_BLENDED_MANAGED_SERVICE_SPEC.md. Optional **seat cost** (vendor provides facility, GOVO): add ~$3.12/hr (location-only; $500/month/head at 160 productive hrs). TBL-004 has Frontline_Agent_Type, Managed_Service_Load, Default_AHT_Minutes, Primary_Pricing_Model.

### B.4 Staff Augmentation vs. Managed Service

- **Staff aug (T&M, blended):** Buying time; client bears productivity risk.  
- **Managed (PPU, outcome, fixed, gainshare):** Buying results; vendor bears productivity risk.  

TBL-004 has Primary_Pricing_Model (canonical); TBL-003 does not store pricing model. Values in TBL-004 should be standardized to the six canonical models. Transformation from staff aug to managed is a high-value play (15–30% cost improvement when volume and quality are measurable).

### B.5 Nielsen HR Validation

562 workflows; treatment-level savings: Negotiation 8–15%, Contract 5%, MIMO 3%, VMO 2%. Total identified $33M on $152M (25.9%). Locked values per AUTHORITATIVE_VALUES.md.

---

## Section C: Assumption Stack & Data Quality

Tier 1 (Client actual) through Tier 5 (Category default). Confidence formula: Source_Weight×0.40 + Recency×0.25 + Corroboration×0.20 + Specificity×0.15. Labels: HIGH 80–100, MEDIUM 60–79, LOW 40–59, INSUFFICIENT <40. Workflow completeness drives accuracy; every product interaction should collect workflow fields. See v1 §C for full formula and product-tier mapping.

---

## Section D: Pricing & Conversion Methodology

Frontline agent = universal anchor. **Per-Resource-Unit Cost = Blended Hourly Rate × (AHT_minutes ÷ 60).** **Building blended rate:** In table terms, Blended = Unblended (TBL-003) × Multiplier from TBL-017 (by TBL-004.Managed_Service_Load: Light 1.20, Standard 1.45, Premium 1.65). Conceptually: base compensation + benefits + facilities + support overhead (ratios) + vendor margin, ÷ productive hours. Optional seat cost when vendor provides facility (GOVO): ~$3.12/hr location-only. Productive hours ≈ 2,080 × (1 − shrinkage); shrinkage 30–35%. Reverse conversion: Implied Hourly Rate = Price Per Unit ÷ (AHT in hours). Pricing model normalization: Rate × Unit × Quantity = Total Cost applies universally; all models resolve to cost per productive minute. See v1 §D for worked examples by tower.

---

## Section E: Modifier Framework (39 Modifiers)

**Authority:** R_MOD_MODIFIER_FRAMEWORK_SPEC_v1.md defines the full catalog, interaction model, and 8-step application sequence.

**Table roles:**
- **TBL-010 (Modifiers):** Modifier *definitions* — one row per modifier concept (code, name, question text, value type, triggers, priority). **Current state:** 8 rows. **Target:** 39 rows aligned with R_MOD.
- **TBL-015 (Modifier Rate Adjustments):** *Quantified* adjustments — one row per modifier value/tier (Adjustment_Low/High/Median %, multiplier, towers). **Current state:** 32 rows. TBL-010 and TBL-015 are complementary, not duplicative.

**39 modifiers (summary):**  
Category A — Location & labor arbitrage (5): LOC_PREMIUM, LOC_US_REF, CITY_TIER, ONSHORE_PREMIUM, NEARSHORE_PREMIUM.  
Category B — Specialization & complexity (10): CLINICAL_SPEC, AI_ML_SPEC, CYBERSEC_SPEC, LEGAL_SPEC, MULTI_LANG, NIGHT_SHIFT, SEC_CLEARANCE, FINANCIAL_SPEC, HEALTHCARE_SPEC, GOV_SPEC, COMPLEXITY_ADJ.  
Category C — Volume & scale (4): VOLUME_DISCOUNT, RAMP_PREMIUM, CONTRACT_TERM, DEDICATED_RESOURCE.  
Category D — Quality & SLA (3): SLA_PREMIUM, OUTCOME_RISK, QUALITY_TIER.  
Category E — Regulatory & compliance (7): GDPR, HIPAA, PCI_DSS, SOX, FEDRAMP, DATA_RESIDENCY, STATE_REG.  
Category F — Technology & automation (3): AUTOMATION_DISC, TOOL_PROVISION, PLATFORM_FEE.  
Category G — Contract structure (6): TRANSITION_PREMIUM, GOVERNANCE_OVERHEAD, RETAINED_ORG, PRICING_MODEL_CONV, EXCLUSIVITY_PREMIUM, INNOVATION_FUND.

**8-step application sequence:** (1) Base rate from TBL-003; (2) Location (multiplicative); (3) Specialization (multiplicative); (4) Complexity (multiplicative); (5) Regulatory (additive); (6) Volume/term + quality/SLA (additive); (7) Automation (additive); (8) Contract structure (additive). Steps 2–4 multiply; 5–8 add to post–Step 4 result. See R_MOD for formulas and stacking rules.

---

## Section F: Location Cost Index

Base: India (Bangalore) = 100. TBL-005 (Locations) holds Cost_Index, rebased to India=100 per D5. US_Reference_Index = Cost_Index × 7.3 / 100. Maintenance: biannual core cities, quarterly high-inflation, annual full refresh. Benefit burden and BPO_Market_Maturity in TBL-005. See v1 §F for mandatory benefit rates and coverage.

---

## Section G: Forcing Function Logic

Iterative Q&A that routes users through taxonomy and collects workflow fields. Steps: Tower (alias → TBL-007) → Category → Service Type (→ Frontline_Agent_Type, AHT, pricing model) → Modifier collection → Pricing assembly. Confidence thresholds and data-quality feedback loop (alias expansion, AHT refinement, rate validation) in v1 §G.

---

## Section H: Product Integration Map

Assessment, MaxxBot, MIMO, Contracting Office, Sourcing Accelerator, Refresh — each consumes same taxonomy and methodology. Refresh tier: between Assessment and MIMO; retroactive monthly ingestion, variance reporting, no pre-payment validation. Treatment-level vs granular analysis is a function of workflow completeness %. See v1 §H for full product narrative flow.

---

## Section I: Methodology Governance

Semantic versioning (MAJOR.MINOR). Source register: taxonomy TBL-001/002/004; rates TBL-003; locations TBL-005; modifiers R_MOD + TBL-010/015. Row-level provenance (confidence, source type, last updated). Reproducibility rule: same inputs → same outputs; no undocumented judgment. See v1 §I.

---

## Section J: Range Engine Specification

Output: P25/P50/P75 ranges. Spread floor by confidence. "Not enough data" when <3 rate points, or confidence <40, or excessive extrapolation. See v1 §J.

---

## Section K: Data Refresh Pipeline

Cadences and trigger events for TBL-003, location indices, AHT, modifiers, vendor profiles. DB source-of-truth contract: which table is canonical, who can update. See v1 §K.

---

## Section L: Marketing Statistics & Claims Policy

**Hard statistics (client-facing):** Nielsen taxonomy validation, treatment-level savings 8–15%, total opportunity 20–26%, non-PO spend 40–55%, etc. **Soft statistics:** with "industry research suggests" framing. **Claims policy:** by context (deliverables, sales, marketing, MaxxBot). See v1 §L.3.

### L.4 RB5 Addendum (from RA4 feedback; never folded into v1)

The following items were identified post-RA3 and are incorporated here:

- **Managed spend:** Use "managed spend" or "spend under management" where relevant for MIMO/VMO scope.
- **Savings realized:** Distinguish "savings identified" (assessment) from "savings realized" (tracked post-implementation).
- **Semantic overlay:** Positioning of Maxx taxonomy as a semantic overlay on client data (classification layer).
- **Legal–procurement triage:** When to route contract questions to legal vs procurement (guidance for CO/MaxxBot).
- **WorldCC 11%:** World Commerce & Contracting benchmark (e.g. 11% savings from contract optimization) — use with citation if adopted.
- **Hackett 61% realization gap:** Hackett finding that a portion of negotiated savings is not realized — use with citation for MIMO/value-sustain narrative.
- **MIMO invoice processing costs:** MIMO cost ≈ 3% of managed spend; self-funding from errors caught (narrative in §M).
- **ISG managed services structures:** ISG structures for outcome-based/managed services — reference for pricing model and contract benchmarks.
- **Enterprise procurement benchmarks:** General enterprise benchmarks (e.g. systems count, top-3 concentration) — cite source in §L when used.

---

## Treatment Tables (TBL-012 through TBL-016)

These tables inject **rules and structure** that tie the Maxx taxonomy, methodology, and **workflow** concept into the bot. They are not raw reference data; they define how findings map to actions and how the bot should reason.

| Table | Purpose | Key content |
|-------|---------|-------------|
| **TBL-012** Risk Rules | Risk assessment rules for the scoring engine. Rule_ID, condition type, Condition_Config (JSON), severity, recommended treatment. Flat columns Threshold_Metric, Threshold_Operator, Threshold_Value support deterministic evaluation. | 50 seed rows. Used by WF-03 (risk assessment). |
| **TBL-013** Treatment Recommendations | Finding type → recommended product/treatment, savings range, implementation timeline. Condition_Metric/Operator/Value link to when a treatment applies. | 30 seed rows. Used by WF-04 (treatment recommendation). |
| **TBL-014** Contract Benchmarks | Market standards for contract terms (Clause_ID, Clause_Type, benchmark low/median/high, unit, Risk_Level). Standard_Language, Red_Flags, Negotiation_Points support contract guidance. | 20 seed rows. Used by WF-05, WF-06. |
| **TBL-015** Modifier Rate Adjustments | Quantitative adjustment values by modifier (see §E). Links modifier concepts (TBL-010) to numeric impact. | 32 rows. Used by WF-01 (rate benchmarking). |
| **TBL-016** Taxonomy Crosswalks | External system → Maxx taxonomy mapping (e.g. Nielsen L2 → Tower_Code). Enables ingestion of client data classified under other standards. | 27 seed rows (e.g. Nielsen). Used by WF-07 (spend classification). |

**Narrative for Siva/Botpress:** These tables encode the methodology’s treatment logic, risk logic, contract standards, and modifier math. The methodology document (this file) is the narrative for what they mean; the function catalog maps which functions read which tables and fields.

---

## Section M: Savings, Treatments, and Rate Benchmarking (Narrative)

*Consolidated from former KB_METHODOLOGY content. Use for "how" and "why" answers in MaxxBot.*

### M.1 How Procurement Savings Are Calculated

**Future Spend = Baseline × (1 − Negotiation Rate) × (1 − Contract Rate) × (1 − MIMO Rate) × (1 − VMO Rate).**

- **Rate Negotiation (8–15%):** Competitive RFP, benchmarking, renegotiation.  
- **Contract Optimization (5%):** Terms, clauses, payment terms, SLAs.  
- **MIMO (3%):** Pre-payment invoice validation; catches billing errors, rate violations, duplicates.  
- **VMO (2%):** Ongoing governance, QBRs, SLA enforcement.  

Rates compound; e.g. $1M → ~$205K savings (20.5% compound), not 23% additive.

### M.2 Treatment Types

Each workflow receives one treatment: **Rate Renegotiation / Retain & Align**, **Consolidated Out**, **Eliminated**, **Reclassified**, **No Action**. Definitions and when each applies are in v1 and in TBL-013 narrative.

### M.3 Managed Services vs. Staff Augmentation

Staff aug = buying time (T&M); managed = buying results (outcome-based). Conversion to managed typically yields 15–30% cost improvement when output is definable and measurable.

### M.4 How Rates Are Benchmarked

(1) Service classification (taxonomy); (2) Base rate lookup (TBL-003, location, tier); (3) Apply modifiers (TBL-010/015); (4) Rate type: TBL-003 stores Direct_Labor (unblended) only; blended is derived via TBL-017 multiplier; Fully_Loaded is not stored as a base rate and must be explicitly defined if used; (5) Confidence assessment.

### M.5 Data Sources for Benchmarks

Tier 1 Client data, Tier 2 Analyst reports, Tier 3 Maxx database, Tier 4 Derived estimates. Cite confidence in bot responses.

### M.6 Prioritizing Cost Reduction (Wave Approach)

Wave 0 (immediate), Wave 1 (0–90 days, renegotiation), Wave 2 (sourcing/contract modernization), Wave 3 (service model transformation), Wave 4 (technology/automation). Early waves deliver 40–50% of total savings.

### M.7 MIMO and VMO (Definitions)

MIMO: pre-payment invoice validation; typically 3% of managed spend; self-funding from errors caught. VMO: QBRs, SLA monitoring, contract admin, risk monitoring; ~2% of managed spend. Retained org 5–10%.

---

## Section N: Vendor Evaluation Guidance (Narrative)

*Consolidated from former KB_VENDOR_EVALUATION content.*

Financial health: revenue trajectory, profitability, debt, client concentration, employee metrics. Maxx Financial Health Score A–D. Due diligence: financial, operational, relationship, contract. Red flags: financial (decline, B/D score, PE/debt), operational (single site, attrition, incidents), relationship (no references, turnover), contract (auto-renewal, no termination for convenience, no SLA penalties). M&A impact: key person risk, integration disruption, contract change-of-control; protect with termination rights and baseline documentation. Vendor tiering: Strategic (Tier 1), Important (Tier 2), Transactional (Tier 3); consolidation candidates. Competitive benchmarking: market rates, TCO, alternative vendors, benchmark leverage framing. See full narrative in legacy KB_VENDOR_EVALUATION.md if needed.

---

## Section O: Offshoring and Location Intelligence (Narrative)

*Consolidated from former KB_OFFSHORING_LOCATIONS content.*

Onshore vs nearshore vs offshore: trade-off cost vs complexity. Key factors: cost (index India=100), talent quality, language, time zone overlap, infrastructure, risk profile, vendor ecosystem. Major locations: India (88–103, Bangalore 100), Philippines (160–200), Mexico (333–387), Colombia (300–320), Poland (633–733), Romania (453–467). Governance overhead: VMO 2–5%, retained org 5–10%, transition 10–25% one-time, quality/rework 2–8%. Transition phases: assessment, knowledge transfer, parallel run, cutover, stabilization (6–10 months). BCP: geographic redundancy, knowledge distribution, technology resilience, contractual RTO/RPO. Cultural/operational notes by region. See full narrative in legacy KB_OFFSHORING_LOCATIONS.md if needed.

---

## Table Field Alignment (Current vs Planned)

| Area | Implemented | Planned / gap |
|------|-------------|----------------|
| TBL-003 Rate_Type | Yes (Direct_Labor only; blended derived via TBL-017) | Fully_Loaded not stored; define in methodology if used |
| TBL-004 Resource_Unit_Name | Column exists | Population (B2) — outcome / service unit |
| Pricing_Model (workflow) | TBL-004 Primary_Pricing_Model only (TBL-003 does not store) | Dropdown/list of researched options (PPU, T&M, fixed monthly, fixed monthly with true-up, outcome, gainshare, etc.) — see §B.2 |
| Pricing_Unit vs Service_Unit | Methodology §B.2; TBL-004 Benchmark_Unit, Rate_Unit | Service unit = outcome; pricing unit = what is billed (Q in P×Q); may differ (e.g. contact vs completed case); fixed monthly can be Q=1 |
| TBL-004 Default_AHT_Minutes | Column exists; ~53% populated | 428 gaps (B3) |
| TBL-004 Typical_Volume_Low/High | Columns exist | Population |
| TBL-005 Cost_Index India=100 | Yes (D5 applied) | — |
| TBL-010 Modifiers | 8 rows | Expand to 39 definitions (R_MOD) |
| TBL-015 Modifier Adjustments | 32 rows | Verify coverage for all 39 modifier codes |
| TBL-012/013/014 | Structure and seed rows | RWF2 amendments applied (flat threshold, condition, SOW columns) |
| Support ratios (TL, QA, etc.) | In methodology text only | Optional lookup table or KB |

---

## Locked Decisions (Carried Forward)

External term for resource unit: "Service Unit". Location base: India = 100. Treatment rates: Negotiation 8–15%, Contract 5%, MIMO 3%, VMO 2%. Taxonomy levels: 4 (Tower → Category → Service Type → Workflow Instance). Frontline agent anchoring: central pricing concept. Taxonomy authority: Botpress tables. See v1 end for full locked decisions list.

---

## Appendix: Location benefit burden and productive hours (Round 2 research)

*Source: Perplexity + Claude Prompt 7 (2026-02-25). Use for TBL-005–driven rate and capacity models; treat as planning ranges, not legal minimums.*

**Benefit burden (% of base salary):** India 20–30%, Philippines 15–30%, Poland 20–40%, Romania 15–30%, Mexico 25–45%, Colombia 25–45%, United States 20–40%. Apply by country to TBL-005 location rows (e.g. IN-BLR, PH-MNL, PL-WAW, RO-BUC, MX-MEX, CO-BOG, US-PHX).

**Productive hours per month:** India/Philippines/Mexico/Colombia 168–176; Poland/Romania/United States 160–168. Global default 168 hours/month is defensible for most CX and back-office BPO; use local exception only where vendor proposes a different basis.

**High-inflation / FX-volatile (2024–2025):** Argentina, Turkey, Egypt (elevated inflation and FX devaluations). Romania, Colombia, Mexico may be flagged as elevated FX risk in some frameworks. India, Philippines, Poland, United States typically treated as standard inflation risk.

---

## Appendix: Modifier benchmark ranges (Round 2 research)

*Source: Claude Prompt 6 (2026-02-25). Synthesized from MSPAA, ISG, Gartner, Accelerance, practitioner sources; granular ISG/Everest/Gartner data remains behind paywalls. Use to validate or populate TBL-010/TBL-015 bands.*

**Regulatory compliance:** HIPAA +15–30%, GDPR +10–25%, SOX +10–22%, PCI DSS +10–20%, GxP +5–30%, FedRAMP +5–40% (ongoing or front-loaded). **Volume discounts:** 50–200 FTE −3 to −8%; 200–500 FTE −6 to −12%; 500+ FTE −10 to −18%; 1000+ FTE −12 to −25%+. **Specialization:** Clinical/GxP +15–50%, AI/ML +20–60%, Cybersecurity +20–60%. **SLA tiers:** Enhanced (99.95%) +8–25%; Premium/Mission-critical (99.99%) +20–50%; Ultra (99.999%) +35–100%+. **Location vs India (index 100):** LATAM +15–80%, Eastern Europe +30–130%, US onshore +200–400%, UK +180–350%, Philippines −5 to +30%.

---

## References

- **Function catalog and table mapping:** R_WORKFLOW_CATALOG.md (projects/R_methodology/outputs/). Section 3 maps workflows to tables/fields; Section 4.2 to KBs. Update Section 3 to use current column names (post–task 10).
- **Golden Question Answer Key:** R_GOLDEN_QUESTION_ANSWERS_v2.md. Each answer should cite **Function** (e.g. WF-01) and **Table/field** source per this methodology.
- **Field-level crosswalk:** To be created — function → tables (with current CSV/column names) → what bot queries → what bot returns. Single source for Siva build.
- **Modifier specification:** R_MOD_MODIFIER_FRAMEWORK_SPEC_v1.md — full 39-modifier catalog, 8-step sequence, stacking rules.
- **Authoritative values:** shared/authoritative/AUTHORITATIVE_VALUES.md — locked numbers; do not change without approval.

---

**END OF R_MAXX_METHODOLOGY_v2.md**
