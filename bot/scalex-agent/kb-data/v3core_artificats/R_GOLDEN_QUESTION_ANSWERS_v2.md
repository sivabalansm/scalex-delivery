# R_GOLDEN_QUESTION_ANSWERS_v2.md
## Golden Question Answer Key for MaxxBot Calibration

**Purpose:** Scoring key for Siva to calibrate MaxxBot responses  
**Version:** v3.0 — v3 final (19 files: 17 base + **SLA.csv** + **Service_Type_SLA.csv**); use with R_FUNCTION_CATALOG v2.0  
**Date:** 2026-02-26  

---

## Table/schema updates (v3 final — 2026-02-26)

- **TBL-003:** Use **Rate_Low_USD, Rate_Median_USD, Rate_High_USD** only. For **hourly** rate lookups, filter **Rate_Unit = 'Per_Hour'** (see R_MAXXBOT_BOTPRESS_MAPPING). Rate_Type = Direct_Labor on all rows; blended = unblended × TBL-017.
- **TBL-004:** **Frontline_Agent_Type** populated for 244 rows (towers with TBL-003 rates); 170 NULL (ENG, FR, MK, RC — no rates). **Managed_Service_Load** → TBL-017. SLA by service type: use **SLA** + **Service_Type_SLA** (files 18–19; not TBL-018/TBL-019). Service_Unit_Name, Service_Unit_Definition, Category_Code for FK to TBL-002.
- **TBL-005:** India base Cost_Index = 100. Date_of_FX, ITO_Market_Maturity present.
- **TBL-007:** Rebuilt for current 414 service types; every TBL-004 Service_Type_ID has ≥1 alias (1,065 rows).
- **TBL-008:** Only rows where Service_Type_ID exists in TBL-004 (939 rows).
- **TBL-001:** Service_Type_Count and Vendor_Count refreshed (sum Service_Type_Count = 414).
- **TBL-017:** 3 rows (Light 1.20x, Standard 1.45x, Premium 1.65x). Blended = Unblended × multiplier.
- **SLA tables:** **SLA.csv** (master, 11 rows) and **Service_Type_SLA.csv** (junction, 828 rows) — use for SLA-by-service; not in TBL-004.
- **Tower coverage:** PS retired; CL, ME, EN, MO folded into IV/SC. See TOWER_COVERAGE_STATUS.md. For towers with taxonomy but no rates (ENG, FR, MK, RC), rate lookup returns no rows until TBL-003 populated.

---

## Data Quality Notes

1. **Rates:** Use **USD columns only** (Rate_Low_USD, Rate_Median_USD, Rate_High_USD). Local currency columns are not reliable.

2. **Rate_Type:** TBL-003 has Rate_Type = Direct_Labor on all rows. These are direct labor T&M rates; blended/commercial rates = apply TBL-017 multiplier per TBL-004.Managed_Service_Load.

3. **"FD6 Validated Research" Source:** Internal project code; USD values are directionally accurate. Being replaced with verifiable sources in later release.

4. **Vendor Red Flags/Weaknesses:** redFlags and weaknesses columns often empty or templated. GQ-2.3 (Conduent red flags) may not be answerable from table data.

5. **Alias Disambiguation:** TBL-007 has broad aliases. Use clarifying questions when the user query is ambiguous.

**Bottom line for Siva:** The answers below are the CORRECT answers. Where table data supports them, the bot should match. Where it can't, the gap reason tells Siva what's needed.

---

## How MaxxBot functions work (simple Q vs. named function)

**Two ways users get value:**

1. **Simple question → direct answer**  
   User asks in natural language (e.g. "What's the hourly rate for customer service in Manila?"). Bot looks up tables and returns the answer. No structured sequence; table-driven.

2. **Scripted workflow**  
   For **Contract Risk Analysis**, **Managed Service Rate Conversion**, **Risk Assessment**, or **Treatment Recommendation**, user can invoke the named workflow; bot runs the structured sequence and (where applicable) produces a document. See R_FUNCTION_CATALOG for the 4 scripted workflows. Rate lookup itself is a **regular capability** (table-driven); the **Managed Service Rate Conversion** workflow walks from unblended rate + inputs (or table defaults) to blended/PPU.

**Intent:** The golden questions below show the **correct answer** for each question. For rate benchmarking, some questions have both:
- **Level 1:** Simple Q → simple A (what the bot should return from a direct lookup).
- **Level 2:** If the user wants the **full Rate Benchmark function**, the bot should offer it (e.g. "I can run a full Rate Benchmark with location, tier, and commercial assumptions. Say **Rate Benchmark** or I can ask you a few questions.") and then run the clarifying sequence and return the structured output per the Function Catalog.

---

## Category 1: Rate Benchmarking

### GQ-1.1: "What's the hourly rate for customer service agents in Manila?"

**Answer:** Customer service agents in Manila (PH-MNL) range from **$8–$16/hour USD** depending on tier:
- Tier 1 (entry-level): $8–$12/hr, median $10/hr
- Tier 2 (experienced): $12–$16/hr, median $14/hr

⚠️ These are direct labor T&M rates, not fully-loaded BPO rates. Fully-loaded rates (including facilities, technology, management, margin) are typically 1.5–2.5x higher.

**Source:** TBL-003, RATE-CO-CSA-T1-PH-MNL, RATE-CO-CSA-T2-PH-MNL  
**Confidence:** HIGH — direct lookup  
**Bot Gap:** None for USD lookup. ⚠️ Do NOT use local currency columns.

**Function expansion (Level 2):** If the user wants a full benchmark with commercial assumptions, the bot should offer the **Rate Benchmark** function: "I can run a full Rate Benchmark (location, tier, staff aug vs managed, optional modifiers). Say **Rate Benchmark** or I'll ask a few questions." Then collect: (1) role/service, (2) location, (3) staff aug vs managed, (4) tier, (5) optional: volume, compliance, current rate. Return formatted benchmark in USD + optional gap-to-current; cite source. See R_FUNCTION_CATALOG WF-01.

---

### GQ-1.2: "How much should I pay for a senior software developer in Bangalore?"

**Answer:** Senior developer in Bangalore: **$40–$60/hour USD**, median **$50/hr**.

Additional context the bot SHOULD provide:
- Junior developers: $15–$25/hr (if user wants to explore options)
- Mid-level: $25–$40/hr
- Bangalore Cost_Index = 100 (India base; US locations ~320–375), making it a Tier 2 IT/Tech capital

**Source:** TBL-003, RATE-IT-DEV-SR-IN-BLR. Location context: TBL-005, IN-BLR.  
**Confidence:** HIGH  
**Bot Gap:** MATCHING_ISSUE — "software developer" must resolve to Agent_Type "Developer" via TBL-007 alias. Check if this alias exists; if not, add it.

---

### GQ-1.3: "Compare call center rates: India vs Philippines vs Mexico"

**Answer:**

| | India | Philippines | Mexico |
|---|---|---|---|
| T1 Rate Range | $6–$10/hr | $8–$12/hr | $12–$16/hr |
| T1 Median | $8/hr | $10/hr | $14/hr |
| Cost Index | 100 (BLR, India base) | 114 (MNL) | 171 (MEX) |
| Time Zone (vs. US EST) | +10.5 hrs | +13 hrs | 0 (same) |
| Key Advantage | Lowest cost | English fluency + cost | Nearshore, same TZ |

India is ~43% cheaper than Mexico but has the biggest time zone gap. Philippines offers a middle ground. Mexico is best for US-facing real-time support needing cultural alignment.

**Source:** TBL-003 (CSA-T1 rows for IN-BLR, PH-MNL, MX-MEX) + TBL-005 (location context)  
**Confidence:** HIGH  
**Bot Gap:** MATCHING_ISSUE — "call center" must alias to Customer_Service_Agent. Bot should pick representative city per country. Good bot behavior: show the comparison table, then add the strategic context about time zones and use cases.

---

### GQ-1.4: "What's the daily rate for a management consultant in London?"

**Answer:** Global management consulting daily rates (no London-specific row exists):
- Analyst: $1,500–$2,500/day, median $2,000
- Senior Consultant: $2,500–$4,500/day, median $3,500
- Partner: $5,000–$8,000/day, median $6,500

London context: Cost_Index = 375 (highest in database). London rates should be at the **high end** of these ranges, or 5–10% above global median.

**Ideal bot response:** "I have global consulting benchmarks. London is one of the most expensive markets (Cost Index 375), so expect rates at the upper end: Senior Consultant ~$4,000–$4,500/day, Partner ~$7,000–$8,000/day."

**Source:** TBL-003 (RATE-PS-CON-*-GLOBAL) + TBL-005 (GB-LON, Cost_Index=375)  
**Confidence:** MEDIUM — global rates exist, London-specific don't. Requires cost index reasoning.  
**Bot Gap:** Multi-step reasoning required: (1) find global consulting rates, (2) look up London cost index, (3) explain adjustment. This is a good test of the bot's ability to synthesize across tables.

---

### GQ-1.5: "Show me payroll processing rates in Poland"

**Answer:** No Poland-specific payroll row exists. Best available:

**Global payroll benchmarks:**
- Per-payslip (PPU): $3–$32 depending on company size (enterprise = $3–$6, mid-market = $5–$14, small = $10–$32)
- Per-hour (T&M): $6–$32/hr, median $19/hr

**Poland HR general rates (PL-WAW):**
- Junior: $18–$28/hr | Mid: $28–$40/hr | Senior: $40–$55/hr
- Poland (Warsaw) Cost_Index = 171 (strong nearshore value for EMEA clients)

**Ideal bot response:** "I don't have Poland-specific payroll processing rates, but I can help two ways: (1) global payroll benchmarks suggest $3–$6/payslip for enterprise, and (2) general HR operations rates in Warsaw run $23–$34/hr for mid-level roles. Poland is a major shared services hub with good cost-quality balance (Cost Index 48 vs. India 28, UK 105). Would you like me to go deeper on either?"

**Source:** TBL-003 (RATE-HR-PAY-STD-GLOBAL, PPU-HR-001-004, RATE-HR-613/614/615) + TBL-005 (PL-WAW)  
**Confidence:** MEDIUM — requires combining global payroll + Poland location context  
**Bot Gap:** MATCHING_ISSUE — exact "payroll + Poland" query returns no results. Bot needs to gracefully degrade to available data and explain what it's doing.

---

## Category 2: Vendor Intelligence

### GQ-2.1: "Tell me about Accenture's BPO capabilities"

**Answer:**
- **Revenue:** $64.9B | **Employees:** 774K | **Delivery:** NA, EMEA, APAC, LATAM
- **Services:** Payroll Processing, Application Development, Accounts Payable, Source-to-Pay, Customer Service, Freight Forwarding
- **Analyst Rankings:** Everest MPHRO Leader; ISG Leader; HfS #1 Employee Experience
- **Strengths:** HR transformation, SynOps automation platform, LearnVantage
- **Certifications:** ISO 27001, SOC 1/2, ISAE 3402
- **Financial Health:** A (top tier)

⚠️ **Gemini audit note:** Accenture's redFlags and weaknesses fields are empty. Known industry concerns not in the database include: initiated ~22,000 job cuts in late 2025/early 2026 as part of AI pivot, and organizational complexity typical of $65B conglomerate. TBL-006 enrichment in R-v3 will address this.

**Source:** VENDORS_BOTPRESS_FINAL_v4, VND-0001  
**Confidence:** HIGH for profile data. LOW for risk/weakness assessment.  
**Bot Gap:** None for profile lookup. MISSING_DATA for red flags.

---

### GQ-2.2: "Who are the top IT help desk providers in LATAM?"

**Answer:** IT Service Desk (ST-IT-003) leaders with confirmed LATAM delivery:

1. **Accenture** — Leader (Gartner 2025). LATAM: Mexico City, Monterrey, Querétaro, Mérida+
2. **Cognizant** — Leader (Gartner 2025). LATAM delivery confirmed
3. **Wipro** — Leader (Gartner 2025). LATAM: Guadalajara, Mexico
4. **TCS** — Major Contender (Gartner 2025). LATAM: São Paulo, Rio, Mexico City, Guadalajara, Monterrey
5. **DXC Technology** — Major Contender. LATAM presence

**Source:** TBL-008 (ST-IT-003-01-01) + TBL-009 (LATAM locations cross-referenced)  
**Confidence:** MEDIUM — requires multi-table join  
**Bot Gap:** MATCHING_ISSUE — this is a sophisticated query requiring: (1) map "IT help desk" → ST-IT-003, (2) get ranked vendors, (3) filter by LATAM delivery via TBL-009. Bot likely returns global list without regional filtering today.

---

### GQ-2.3: "What are red flags for Conduent?"

**Answer:** Conduent (VND-0006):

**From database:** Revenue $3.36B, 55K employees, Financial Health Score **B** (not top-tier), only 1 delivery center listed. redFlags and weaknesses fields are **empty**.

**Correct answer (methodology + industry knowledge — not yet in tables):**
- Revenue declined from ~$5.5B at 2017 Xerox spinoff to $3.36B — significant contraction
- Multiple CEO transitions since spinoff
- Government contract attrition (their legacy strength)
- Cybersecurity incidents on record
- Financial Health Score B with declining trajectory signals elevated risk
- Only 1 delivery center = low geographic diversification

**Ideal bot response:** "Conduent has a Financial Health Score of B, which is below average for major BPO providers. I don't have specific risk alerts in my database for Conduent, but the combination of B-rated financial health, declining revenue trend, and limited delivery diversification (1 center) warrants careful due diligence. I'd recommend reviewing their most recent SEC filings and checking for any recent leadership changes or contract losses."

**Source:** VENDORS_BOTPRESS VND-0006 (profile only). Red flags require TBL-012 + enriched TBL-006.  
**Confidence:** LOW for table-based. MEDIUM for methodology-informed.  
**Bot Gap:** MISSING_DATA — redFlags column empty. This is the #1 example of why TBL-006 enrichment (R-v3 Phase) and TBL-012 (Risk Rules) are critical. Until then, bot should use Financial Health Score + delivery center count as proxy risk indicators.

---

### GQ-2.4: "Which RPO providers have strong healthcare experience?"

**Answer:** RPO Leaders (ST-HR-006-02-01):
- **Korn Ferry** — Leader (Everest RPO), 8 consecutive Leader years
- **Randstad Sourceright** — Leader (Everest RPO), 275K+ annual hires

Other RPO vendors: Cielo, PeopleScout, Hudson RPO, Alexander Mann Solutions

**Healthcare-specific:** No RPO vendor has healthcare vertical tagging in current data. Separate healthcare staffing specialists exist (Aya Healthcare, AMN Healthcare, Cross Country Healthcare) but these are clinical/travel nursing, not RPO.

**Ideal bot response:** "Here are the top RPO providers: [list]. I don't currently have healthcare vertical specialization data for RPO firms. For healthcare-specific staffing, you might also consider Aya Healthcare or AMN Healthcare, though these focus on clinical staffing rather than corporate RPO. Would you like me to compare the general RPO leaders, or are you specifically looking for healthcare industry recruiting?"

**Source:** TBL-008 (ST-HR-006-02-01). Healthcare vertical data: not in tables.  
**Confidence:** LOW — RPO list is accurate, healthcare filtering is not possible  
**Bot Gap:** MISSING_DATA — no vertical/industry specialization column on vendor profiles. Future: add Industry_Verticals column to TBL-006 during R-v3 enrichment.

---

### GQ-2.5: "Compare Infosys vs TCS vs Wipro for application development"

**Answer:**

| | Infosys | TCS | Wipro |
|---|---|---|---|
| Revenue | $19.28B | $30.2B | $11.3B |
| Employees | 323,578 | 607,000 | 234,000 |
| App Dev Ranking | Leader (Everest 2024) | Leader (Everest 2024) | Leader (Everest 2024) |
| Financial Health | A | A | A |
| Differentiator | Cobalt cloud, Topaz AI | Cognix platform, BFSI depth | WizHRd, One-Wipro integration |
| Certs | ISO 27001, CMMI-5, SOC 2 | ISO 27001, CMMI-5, SOC 2 | ISO 27001, CMMI-5, SOC 2 |

All three are Everest Leaders for App Dev. TCS is largest (2x Wipro by revenue, 2.6x by headcount). Infosys leads on cloud/AI platform play. Wipro differentiates on integrated delivery.

**Source:** VENDORS_BOTPRESS (VND-0010, VND-0003, VND-0008) + TBL-008 (ST-IT-001-01-01)  
**Confidence:** HIGH  
**Bot Gap:** None — all data available. This is a good success case.

---

## Category 3: Risk Assessment

### GQ-3.1: "We spend $5M with one recruiting firm. What are the risks?"

**Answer:**
1. **Vendor Concentration** — single point of failure; no competitive tension on pricing
2. **Rate Staleness** — large single-vendor relationships go years without benchmarking → 15-30% overpayment risk
3. **Service Complacency** — no competitive pressure to innovate or improve quality
4. **Transition Lock-in** — institutional knowledge trapped with one vendor
5. **Business Continuity** — if vendor has financial issues or key personnel loss, no backup

**What the bot SHOULD do (future state):** Query TBL-012 for rules like `IF Vendor_Count=1 AND Spend>$5M → Risk=CRITICAL` and return a scored risk assessment with specific mitigation steps from TBL-013.

**Source:** Methodology-based. Future: TBL-012 (Risk Rules) + TBL-013 (Treatment Recommendations)  
**Confidence:** LOW — methodology knowledge only  
**Bot Gap:** MISSING_TABLE — TBL-012. Seeded in R-v2 (~50 rows), researched in R-v3.

---

### GQ-3.2: "Our IT contract hasn't been rebid in 7 years. Should I worry?"

**Answer:** Yes. Key risks:
1. **Rate Drift** — IT labor rates shift significantly over 7 years; likely 15-30% above market
2. **Technology Gap** — delivery models have evolved (cloud, AI, automation)
3. **SLA Obsolescence** — 7-year-old SLAs don't reflect current standards
4. **Vendor Lock-in** — switching costs compound annually

**Recommended:** Rate negotiation first (8-15% savings), competitive sourcing event within 6-12 months.

**What the bot SHOULD do (future):** TBL-012 rule: `IF Contract_Age > 5 years → Risk=HIGH`. TBL-013: suggest Rate Negotiation treatment with 8-15% savings estimate + Contract Optimization (5%).

**Source:** Methodology (treatment-level savings rates)  
**Confidence:** LOW  
**Bot Gap:** MISSING_TABLE — TBL-012 + TBL-013

---

### GQ-3.3: "Is it risky to have all our finance operations in India?"

**Answer:** Geographic concentration risks:
1. **Geopolitical** — single-country regulatory/political exposure
2. **Disaster/Pandemic** — all operations affected by regional disruption
3. **Talent Competition** — India SSC hubs face 8-12% annual wage inflation
4. **Time Zone** — 10.5–13.5 hour offset from US

**Mitigation:** Diversify to Poland (Cost_Index 171, EMEA nearshore) or Philippines (Cost_Index 114) for business continuity.

**Source:** Methodology + TBL-005 (location alternatives)  
**Confidence:** LOW  
**Bot Gap:** MISSING_TABLE — TBL-012 needs geographic concentration rules

---

### GQ-3.4: "What risks should I look for in a BPO relationship?"

**Answer:** Key BPO risk categories: financial viability, vendor concentration, contract staleness, SLA gaps, rate card violations, scope creep, transition risk, data security, key person dependency, regulatory compliance.

**Source:** Methodology-based  
**Confidence:** LOW  
**Bot Gap:** MISSING_TABLE + MISSING_KB — TBL-012 for structured checklist, KB for educational content

---

### GQ-3.5: "We're sole-sourced on a critical vendor. How do I mitigate?"

**Answer:** Phased approach: (1) Benchmark rates now, (2) Negotiate contract protections, (3) Qualify 1-2 alternatives, (4) Implement dual-source model. Key insight: having a credible alternative creates negotiating leverage even if you never switch.

**Source:** Methodology (treatment framework)  
**Confidence:** LOW  
**Bot Gap:** MISSING_TABLE — TBL-012 + TBL-013 for structured mitigation playbooks

---

## Category 4: Treatment Recommendations

### GQ-4.1: "How can I reduce my staffing spend?"

**Answer:** Treatment-level savings (validated, Nielsen):
- Rate Negotiation: 8-15%
- Contract Optimization: 5%
- Invoice Management (MIMO): 3%
- Vendor Management (VMO): 2%
- Total addressable: 20-26% across mature program

Plus structural levers: vendor consolidation, onshore-to-offshore migration, outcome-based pricing.

**Source:** Methodology (Locked Decision #11). Future: TBL-013.  
**Confidence:** LOW (no table support yet)  
**Bot Gap:** MISSING_TABLE — TBL-013

---

### GQ-4.2: "What should I do about a stale vendor contract?"

**Answer:** (1) Benchmark rates vs. TBL-003, (2) Assess risk, (3) Negotiate rate reset targeting 8-15%, (4) Modernize terms (annual benchmarking clause, rate caps, T4C), (5) If vendor won't negotiate → competitive RFP.

**Source:** Methodology. Future: TBL-013 + TBL-014.  
**Confidence:** LOW  
**Bot Gap:** MISSING_TABLE — TBL-013 + TBL-014

---

### GQ-4.3: "We have 20 IT vendors. What do you recommend?"

**Answer:** 20 IT vendors = significant fragmentation. Pareto: top 5-7 likely = 70-80% of spend. Consolidation targets: bottom 10-13. Best practice: 5-8 strategic vendors per tower.

**Source:** Methodology (Nielsen: 562 workflows → consolidated)  
**Confidence:** LOW  
**Bot Gap:** MISSING_TABLE — TBL-013

---

### GQ-4.4: "How do I approach renegotiating with an incumbent?"

**Answer:** (1) Benchmark with market data, (2) Frame as "modernization" not ultimatum, (3) Present anonymous benchmarks, (4) Negotiate sequentially: rates → SLAs → terms, (5) Have credible alternative vendor identified. Target: 8-15% improvement.

**Source:** Methodology  
**Confidence:** LOW  
**Bot Gap:** MISSING_TABLE + MISSING_KB — TBL-013 + negotiation playbook KB

---

### GQ-4.5: "What's the best way to consolidate my HR service providers?"

**Answer:** (1) Map vendors to Maxx HR categories, (2) Find overlap (multiple vendors per category), (3) Score on cost/quality/breadth, (4) Target 3-5 strategic HR partners, (5) Consolidate in waves starting with highest-spend categories.

**Source:** Methodology  
**Confidence:** LOW  
**Bot Gap:** MISSING_TABLE — TBL-013

---

## Category 5: Document Analysis

### GQ-5.1: "Compare these two staffing proposals" [upload]

**Answer:** Bot extracts rate cards, SLAs, terms, pricing models from each document, then benchmarks extracted rates against TBL-003.

**Confidence:** N/A — depends on document extraction pipeline  
**Bot Gap:** Requires Botpress document processing + vision model. Rate comparison needs extraction → TBL-007 alias matching → TBL-003 lookup chain.

---

### GQ-5.2: "Review this MSA for risks" [upload]

**Answer:** Bot identifies: missing T4C clause, auto-renewal traps, liability exposure, SLA enforcement gaps, IP issues, data protection gaps, undefined change order pricing.

**Confidence:** N/A  
**Bot Gap:** MISSING_TABLE — TBL-014 (Contract Benchmarks) for structured risk checklist. Per R-WF catalog: this is a scripted "Contract Review" workflow requiring vision model parse → term extraction → TBL-014 comparison.

---

### GQ-5.3: "Is this pricing competitive?" [upload rate card]

**Answer:** Bot extracts rates, classifies by service type + location (via TBL-007 + TBL-004), compares to TBL-003 benchmarks.

**Confidence:** N/A  
**Bot Gap:** Multi-step: extraction → classification → lookup. Alias matching critical.

---

### GQ-5.4: "What should I negotiate in this contract?" [upload]

**Answer:** Rate gaps vs. market, missing SLA teeth, term/renewal protections, volume flexibility, scope clarity.

**Confidence:** N/A  
**Bot Gap:** MISSING_TABLE — TBL-014 + negotiation KB

---

### GQ-5.5: "Analyze the SLAs in this SOW" [upload]

**Answer:** Extract SLA clauses, compare to TBL-004 defaults (SLA_Timeliness_Default, SLA_Quality_Default). Flag below-standard targets and missing enforcement.

**Confidence:** N/A  
**Bot Gap:** Requires document extraction + TBL-004 SLA field matching

---

## Category 6: Methodology

### GQ-6.1: "How do you calculate procurement savings?"

**Answer:** Savings = Baseline Spend × Treatment Discount Rate.

Treatment rates (validated, Nielsen $152M HR): Negotiation 8-15%, Contract Optimization 5%, MIMO 3%, VMO 2%.

Compound: Future_Rate = Current × (1 - Nego) × (1 - Contract) × (1 - MIMO) × (1 - VMO)

Result: $33M savings on $152M = 25.9% savings rate.

**Source:** Methodology (Locked Decision #11)  
**Confidence:** MEDIUM — methodology-sourced, not in tables  
**Bot Gap:** MISSING_KB — needs narrative KB explaining the framework

---

### GQ-6.2: "What data sources do you use for benchmarks?"

**Answer:** 4-tier hierarchy: (1) Client data (95-100 confidence), (2) Analyst reports — ISG, Everest, Gartner, Hackett (80-95), (3) Maxx database — 1,054 rate points, 1,741 vendors (70-85), (4) Derived estimates (60-70).

⚠️ **Gemini audit caveat:** Current "FD6 Validated Research" source on ~400 rate rows is being replaced with verifiable analyst citations in R-v3.

**Source:** Methodology Section C  
**Confidence:** MEDIUM  
**Bot Gap:** MISSING_KB

---

### GQ-6.3: "Explain the rate negotiation process"

**Answer:** 8 steps: Baseline → Benchmark (TBL-003) → Quantify gap → Apply modifiers (TBL-010/015) → Set target → Negotiate → Validate → Monitor (MIMO).

**Source:** Methodology  
**Confidence:** MEDIUM  
**Bot Gap:** MISSING_KB

---

### GQ-6.4: "What's the difference between direct and indirect spend?"

**Answer:** Direct = part of the product (raw materials). Indirect = running the organization (IT, HR, facilities). Maxx focuses exclusively on indirect/outsourced services — the $626B+ market across 14 towers.

**Source:** General procurement + TBL-001  
**Confidence:** HIGH (definition) / MEDIUM (Maxx context)  
**Bot Gap:** MISSING_KB for concept definition

---

### GQ-6.5: "How should I prioritize cost reduction initiatives?"

**Answer:** Wave approach: Wave 1 (0-90 days) = rate negotiation + invoice cleanup. Wave 2 (90-180 days) = competitive sourcing + contract modernization. Wave 3 (6-18 months) = operating model transformation. Prioritize by: spend magnitude (Pareto), savings probability, implementation complexity.

**Source:** Methodology Section H  
**Confidence:** LOW  
**Bot Gap:** MISSING_TABLE + MISSING_KB — TBL-013 with prioritization logic

---

## Category 7: Future State (5 New Golden Questions)

These questions represent where MaxxBot is heading. They test capabilities that require the full R-v4 data stack + scripted workflows + client data templates. They're designed around how a **real procurement professional** would actually use the bot — no Maxx jargon, no forcing them into our taxonomy.

---

### GQ-7.1: "I just got handed our company's IT vendor spend file. Can you tell me what we're overpaying for?"

**Why this matters:** This is the data flywheel entry point. The user doesn't know our taxonomy. They don't know what a "tower" or "service type" is. They have a messy Excel file and want answers. This tests the full chain: document ingestion → taxonomy classification (TBL-016 crosswalks) → rate benchmarking (TBL-003) → gap identification → treatment recommendation (TBL-013).

**Expected Bot Behavior:**
1. Accept upload (CSV/XLSX with vendor, amount, category/description, location)
2. Ask 1-2 clarifying questions: "What time period does this cover?" and "Is this one business unit or company-wide?"
3. Classify each line into Maxx taxonomy using TBL-016 crosswalks + TBL-007 aliases — **without showing the user our internal codes**
4. Benchmark classified spend against TBL-003 rates
5. Return: "Based on your data, here are your top 5 overpayment risks:" with estimated savings ranges
6. Offer: "Want me to generate a downloadable summary report?"

**Answer (example):**
"I've analyzed your spend file. Here's what stands out:

1. **Help desk support** — You're paying ~$18/hr in Bangalore. Market benchmark is $7–$11/hr for this service. Potential savings: $200K–$400K/year.
2. **Application maintenance** — Your top vendor's rates are 22% above market median for mid-level developers in Hyderabad.
3. **You have 14 vendors for IT infrastructure** — industry best practice is 5-8. Consolidation could unlock volume discounts.

I estimate **$1.2M–$2.1M in addressable savings** (15-22% of your $9.5M IT spend). Want me to create a detailed report?"

**Tables Required:** TBL-016 (crosswalks), TBL-003 (rates), TBL-004 (service types), TBL-005 (locations), TBL-007 (aliases), TBL-013 (treatments)  
**Workflow:** R-WF "Spend Assessment Intake" (scripted)  
**Client Template:** R-CT "Invoice Spend Dump"  
**Bot Gap Today:** Cannot do this. Requires: (1) file upload processing, (2) TBL-016 crosswalks, (3) multi-table reasoning chain. This is the v4 capstone capability.

---

### GQ-7.2: "We're renewing our call center contract next quarter. Walk me through what I should be looking at."

**Why this matters:** This tests the bot's ability to be a procurement advisor, not a data lookup tool. The user is at a decision point and needs structured guidance covering rates, contract terms, vendor alternatives, and risks — all synthesized into actionable advice. No Maxx jargon. Just "help me prepare for this renewal."

**Expected Bot Behavior:**
1. Ask targeted questions: "What's the annual spend? Where are they delivering from? How long have you been with this vendor? What's the contract end date?"
2. Based on answers, assemble a multi-dimensional analysis:
   - Rate benchmark (TBL-003 for their service/location)
   - Contract term check (TBL-014 for standard terms vs. what they likely have)
   - Risk flags (TBL-012 for tenure, concentration, geography)
   - Alternative vendors (TBL-008 for ranked alternatives)
   - Treatment plan (TBL-013 for negotiation approach + savings estimate)
3. Deliver as a structured "Renewal Prep Brief" — not a data dump

**Answer (example):**
"Here's your renewal prep checklist:

**Rates:** Your call center in Manila should run $8–$12/hr (T1) or $12–$16/hr (T2). If you're paying above $14/hr for T1, you have negotiation room.

**Contract Terms:** After a 5-year tenure, make sure you have: termination for convenience (90 days), annual rate benchmarking clause, SLA credits with teeth (2-5% of monthly fees at-risk), and a COLA cap (3% or CPI, whichever is lower).

**Red Flags:** If this is your only call center vendor, I'd flag concentration risk. Consider qualifying one backup vendor even if you don't switch.

**Savings Estimate:** Rate negotiation alone could save 8-15% ($400K–$750K on $5M). Adding contract optimization: another 5%.

Want me to generate a renewal negotiation brief you can share with your team?"

**Tables Required:** TBL-003, TBL-005, TBL-008, TBL-012, TBL-013, TBL-014  
**Workflow:** Hybrid — combines rate benchmarking + contract review + risk assessment  
**Bot Gap Today:** Partially possible (rates work), but risk + contract + treatment synthesis requires TBL-012/013/014.

---

### GQ-7.3: "Upload: here's our MSA with Infosys. Tell me what's missing and what I should push on."

**Why this matters:** This is the contract analysis use case from R-WF. Tests document ingestion + comparison against contract benchmarks (TBL-014). The user doesn't need to know about our taxonomy — they upload a contract and get actionable feedback. This also tests the "data flywheel" concept: we learn from the contract structure to improve our benchmarks.

**Expected Bot Behavior:**
1. Parse uploaded MSA using vision model
2. Extract: term length, auto-renewal clause, T4C provisions, SLA framework, pricing model, liability cap, COLA terms, data protection, IP provisions
3. Compare each extracted element against TBL-014 benchmarks for the relevant tower
4. Highlight: what's missing, what's below market standard, what to push on
5. Generate downloadable "Contract Review Summary"

**Answer (example):**
"I've reviewed your Infosys MSA. Here's my assessment:

**⚠️ Missing from your contract:**
- No termination for convenience clause — this locks you in. Market standard is 90-day T4C.
- No annual rate benchmarking provision — without this, rates become stale.
- SLA credits are capped at 2% of monthly fees — best practice is 5-10% at-risk.

**✅ Good:**
- Data protection terms align with current standards
- IP assignment is clearly defined

**📋 Push on these in renewal:**
- Add T4C with 90-day notice
- Negotiate SLA credits to 5% minimum
- Add COLA cap at lesser of CPI or 3%
- Request most-favored-customer pricing clause

Want me to create a negotiation priorities document?"

**Tables Required:** TBL-014 (contract benchmarks), TBL-006 (Infosys profile for context), TBL-003 (rate benchmarks if rate card included)  
**Workflow:** R-WF "Contract Review" (scripted)  
**Bot Gap Today:** Fully blocked — no document processing pipeline, no TBL-014 data.

---

### GQ-7.4: "I'm new to procurement. We outsource a bunch of stuff but I don't even know how to categorize what we're buying. Can you help me make sense of it?"

**Why this matters:** This tests whether Maxx works for the **non-expert** — the person who doesn't have ISG or Gartner, doesn't know BPO terminology, and just inherited a messy vendor portfolio. This is the "Fortune 2000" blue ocean user. The bot can't throw taxonomy codes at this person. It needs to meet them where they are, using their language, and gradually help them understand what they're buying.

**Expected Bot Behavior:**
1. Start with empathy, not jargon: "Let's start simple. Can you tell me your top 5 vendors by spend and roughly what each one does for you?"
2. User says: "Accenture runs our help desk, ADP does payroll, some firm called Cielo does recruiting, we have like 10 IT vendors, and Sodexo handles our cafeteria."
3. Bot maps this to Maxx taxonomy *internally* but presents it in the user's language:
   - "Accenture (help desk) → IT Support services"
   - "ADP (payroll) → HR operations"  
   - "Cielo (recruiting) → Talent acquisition"
   - "10 IT vendors → that's a lot — we should look at consolidation"
   - "Sodexo (cafeteria) → Facilities services"
4. "You're buying across 4 main areas: IT, HR, Talent, and Facilities. Your biggest risk area is probably those 10 IT vendors — want to start there?"

**Answer (example):**
"No problem — let me help you get organized. Outsourced services generally fall into a few major buckets:

- **IT Services** — help desk, application development, cloud infrastructure, cybersecurity
- **HR Services** — payroll, benefits, recruiting, employee administration  
- **Finance** — accounts payable, accounting, tax compliance
- **Facilities** — property management, food services, security

If you can share your vendor list with rough spend amounts, I can map each one to the right category and show you where your biggest optimization opportunities are. You don't need to categorize anything yourself — that's what I'm here for.

What's the easiest way for you to share? A spreadsheet, or we can go through them together right here."

**Tables Required:** TBL-001 (towers for high-level categories), TBL-007 (aliases to match informal terms), TBL-016 (crosswalks for any client category data)  
**Workflow:** Conversational intake → gradual classification. NOT a scripted workflow — this is the bot's natural onboarding flow.  
**Bot Gap Today:** Partially possible — TBL-007 aliases handle simple term matching. But the conversational scaffolding (meeting the user at their level, not forcing taxonomy) is a UX design challenge for the bot prompt engineering, not a data gap.

---

### GQ-7.5: "We're about to sign a $3M/year deal with a vendor I've never worked with. What should I know before I sign?"

**Why this matters:** This is the highest-stakes question a procurement professional faces — committing significant spend to a new relationship. Tests the full Maxx value prop: vendor intelligence + rate benchmarking + contract review + risk assessment, all synthesized into decision support. The user doesn't want 4 separate reports; they want one answer: "should I sign, and what should I fix first?"

**Expected Bot Behavior:**
1. Ask: "Who's the vendor, and what service are they providing? Also, where will they deliver from?"
2. User: "It's Wipro, application maintenance, mostly from Hyderabad."
3. Bot assembles comprehensive pre-signature assessment:
   - **Vendor Profile** (TBL-006): Wipro — $11.3B, 234K employees, A-rated, Leader for App Dev
   - **Rate Check** (TBL-003): Mid-level developer in Hyderabad runs $20–$35/hr market; compare to their quote
   - **Risk Flags** (TBL-012): Check if $3M creates concentration risk; check Wipro's financial health
   - **Contract Must-Haves** (TBL-014): For IT outsourcing, ensure T4C, SLA credits 5%+, COLA cap, IP clarity
   - **Alternative Options** (TBL-008): TCS and Infosys are comparable Leaders if you need a backup or leverage
4. Synthesize into: "Wipro is a strong choice for this service. Here are 3 things to fix in the contract before you sign, and 2 things to watch during the first year."

**Answer (example):**
"Good news: Wipro is a solid choice — Everest Leader for App Dev, A-rated financial health, 234K employees with global delivery including Hyderabad.

**Before you sign, make sure:**
1. **Rates are competitive** — App maintenance in Hyderabad should run $20–$35/hr for mid-level. If they're quoting above $40/hr, push back with market data.
2. **Contract protections** — At $3M/year, you need: 90-day T4C, SLA credits at 5%+ at-risk, annual rate benchmarking, and a COLA cap at 3%.
3. **Don't sole-source** — $3M with one vendor for a critical function is manageable but have a backup option identified. TCS and Infosys are comparable alternatives.

**Watch during Year 1:**
- Invoice accuracy vs. rate card (rate card violations are common in new relationships)
- SLA performance against commitments (establish baseline in months 1-3)

Overall assessment: **Proceed, with contract modifications.** Want me to create a pre-signature checklist?"

**Tables Required:** TBL-006, TBL-003, TBL-005, TBL-008, TBL-012, TBL-013, TBL-014  
**Workflow:** Hybrid — combines all four capability areas into synthesized decision support  
**Bot Gap Today:** Only vendor profile lookup works. Full synthesis requires R-v4 complete data stack + multi-workflow orchestration.

---

## Golden Question → Function (routing)

Use with **R_MAXXBOT_BOTPRESS_MAPPING** and **R_FUNCTION_CATALOG v2.0**. Rate lookup and vendor/location/methodology are **regular capabilities**; Contract Risk, Managed Service Rate Conversion, Risk Assessment, Treatment Recommendation are **scripted workflows**.

| GQ ID | Capability / workflow | Notes |
|-------|------------------------|--------|
| GQ-1.1–1.5 | Rate lookup (regular) | TBL-003 + TBL-004/005/007/017; filter Rate_Unit = 'Per_Hour' for hourly |
| GQ-2.x | Vendor intelligence / comparison (regular) | TBL-006, TBL-008, TBL-009, TBL-011 |
| GQ-3.1–3.5 | **Risk Assessment** (scripted) | TBL-012; walk-through or template → score |
| GQ-4.1–4.5 | **Treatment Recommendation** (scripted) | TBL-013, TBL-012, TBL-003, TBL-015 |
| GQ-5.2, 5.4, 5.5 | **Contract Risk Analysis** (scripted) | Upload + TBL-014; Siva building |
| GQ-5.1, 5.3 | Proposal comparison | Not in April priority |
| GQ-6.1–6.5 | Methodology (regular, KB) | KB-driven |
| GQ-7.x | Future / hybrid | Multi-capability synthesis |

---

## Supplemental golden questions (v3 ecosystem)

These cover v3-specific behavior and data so Siva can calibrate against the updated tables and logic.

### S-V3.1: "What's the blended hourly rate for a standard managed service for customer service in India?"

**Answer:** Unblended rate from TBL-003 (e.g. Customer_Service_Agent, IN-BLR, tier) × TBL-017 multiplier for **Standard** (1.45). Example: $8/hr unblended → $11.60/hr blended (Standard). Bot should use TBL-004.Managed_Service_Load for the service type (default Standard) → TBL-017.Load_Level → Multiplier_Median.  
**Source:** TBL-003, TBL-004 (Frontline_Agent_Type, Managed_Service_Load), TBL-017. **Function:** Rate lookup (regular) or **Managed Service Rate Conversion** (scripted) if user wants full walk-through.

### S-V3.2: "How do I turn my unblended frontline rate into a blended rate or price per unit?"

**Answer:** Use the **Managed Service Rate Conversion** workflow. Bot collects (or assumes from table defaults): service type, location, tier, volume, compliance, contract length, managed load (Light/Standard/Premium). Applies TBL-017 for blended; TBL-010/TBL-015 for modifiers per 8-step sequence. Can output blended hourly or PPU.  
**Source:** R_FUNCTION_CATALOG — scripted workflow #2. **Function:** Managed Service Rate Conversion (scripted).

### S-V3.3: "Which towers have rate data but no service type taxonomy?"

**Answer:** Towers **PS, CL, ME, EN, MO** have legacy rate rows in TBL-003 but **zero** categories/service types in TBL-002/TBL-004 (rehomed or retired). Rate lookup for those tower codes works by Tower_Code + Frontline_Agent_Type only (no alias → TBL-004 path). **ENG, FR, MK, RC** have taxonomy but no TBL-003 rates in v3.  
**Source:** TOWER_COVERAGE_STATUS.md. **Function:** Methodology / taxonomy (regular).

### S-V3.4: "Where do I get SLA targets by service type?"

**Answer:** Use **SLA.csv** (master) and **Service_Type_SLA.csv** (junction). Do **not** use TBL-004 for SLA in v3 (SLA columns were removed). Each service type can have multiple SLAs; junction links Service_Type_ID to SLA_ID with optional Target_Override.  
**Source:** R_DATABASE_SCHEMA — SLA and Service_Type_SLA (files 18–19). **Function:** Rate lookup (optional) or Methodology (regular).

### S-V3.5: "Why do some service types have no Frontline_Agent_Type?"

**Answer:** **244** TBL-004 rows have Frontline_Agent_Type (towers with TBL-003 rates). **170** are NULL: towers **ENG, FR, MK, RC** have no rate rows in TBL-003, so the join would return nothing; leaving NULL is correct. Rate lookup for those towers will return no rows until rates are added.  
**Source:** TBL-004, TBL-003; TOWER_COVERAGE_STATUS.md. **Function:** Methodology / taxonomy (regular).

### S-V3.6: "I need a redlined Word doc after contract review — how do I get that?"

**Answer:** Use the **Contract Risk Analysis** scripted workflow. The workflow output includes (or can be extended to) a redlined Word document with risk summary and recommended changes. Export is an **output** of that workflow, not a separate export workflow.  
**Source:** R_FUNCTION_CATALOG — scripted workflow #1. **Function:** Contract Risk Analysis (scripted).

---

## Updated Summary Table

| Category | Total Qs | Answerable Now (HIGH) | Partial (MEDIUM) | Missing Table/KB (LOW) | Blocked |
|----------|----------|-----------------------|-------------------|------------------------|---------|
| 1. Rate Benchmarking | 5 | 2 | 1 | 2 | — |
| 2. Vendor Intelligence | 5 | 2 | 1 | 2 | — |
| 3. Risk Assessment | 5 | 0 | 0 | 5 | TBL-012 |
| 4. Treatment Recs | 5 | 0 | 0 | 5 | TBL-013 |
| 5. Document Analysis | 5 | 0 | 0 | — | 5 (doc pipeline) |
| 6. Methodology | 5 | 0 | 2 | 3 | KB content |
| **7. Future State** | **5** | **0** | **0** | **—** | **5 (full stack)** |
| **TOTAL** | **35** | **4 (11%)** | **4 (11%)** | **17 (49%)** | **10 (29%)** |

## What the Future-State Questions Tell Us

The 5 new GQs (7.1–7.5) aren't just harder versions of the existing questions. They represent a fundamental shift in how MaxxBot should work:

**From lookup tool → procurement advisor.** GQ-1.1 asks "what's the rate?" GQ-7.2 asks "walk me through my contract renewal." The bot needs to orchestrate multiple data sources into synthesized advice, not just return table rows.

**From our taxonomy → the user's language.** GQ-7.4 tests whether the bot can onboard a non-expert without throwing taxonomy codes at them. The taxonomy is the engine under the hood; the user should never need to learn it.

**From passive Q&A → active data ingestion.** GQ-7.1 and GQ-7.3 are the data flywheel in action. User uploads messy data → MaxxBot classifies it → returns insights → we (anonymously) learn from the data to improve benchmarks.

**From single-capability → multi-capability synthesis.** GQ-7.5 combines vendor intelligence + rate benchmarking + risk assessment + contract review into one coherent answer. This is what ISG charges $1M for. MaxxBot should do it in 60 seconds.

## Priority Actions for Siva

1. **Now:** Calibrate on 4 HIGH-confidence questions (GQ-1.1, 1.2, 2.1, 2.5) — these should work today
2. **This week:** Add USD-only caveat to all rate responses (suppress local currency columns)
3. **Feb 14 (R-v2 ship):** Receive seeded TBL-012/013/014 → enables partial Cat 3/4 answers
4. **Feb 28 (R-v3 ship):** Enriched data → enables MEDIUM-confidence Cat 3/4/6 answers
5. **Mar 21 (R-v4 lock):** Full validated stack → target 90% accuracy on GQ 1-6
6. **Post-launch:** Future-state GQs (Cat 7) become the roadmap for v2.0 capabilities

## Perplexity Research Needed

1. **GQ-2.4:** Which RPO providers (Korn Ferry, Randstad, Cielo, PeopleScout, Hudson RPO) have dedicated healthcare verticals
2. **GQ-2.3:** Conduent-specific risk factors — SEC filings, contract losses, leadership changes since 2023
3. **TBL-003 rate validation:** Top 20 roles need re-sourcing with verifiable external benchmarks (replace FD6)
