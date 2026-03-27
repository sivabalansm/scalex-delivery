# MaxxBot - Appendix A & B

*Reference Document for BP-PO-202501191101 Exhibit A*

---

## Complete Table Inventory

**Total: ~14,500 rows across ~15 tables**

### Core Data Tables (Inferred from SOW Requirements)

*Note: TBL-001 through TBL-011 are provisional names. Exact schemas to be confirmed by ScaleX.*

| Table ID | Name | Est. Rows | Purpose | Used By |
|----------|------|-----------|---------|---------|
| TBL-001 | ratesTable | ~5,000 | Rate benchmarks by service type, location, tier | Rate Benchmarking |
| TBL-002 | vendorsTable | ~2,500 | Vendor profiles, capabilities, footprint, red flags | Vendor Intelligence |
| TBL-003 | servicesTable | ~500 | Service taxonomy and category definitions | All capabilities |
| TBL-004 | locationsTable | ~300 | Location tiers, regions, normalization rules | Rate Benchmarking |
| TBL-005 | currencyTable | ~50 | FX rates and conversion assumptions | Rate Benchmarking |
| TBL-006 | benchmarksTable | ~3,000 | Market benchmarks by category and region | Rate Benchmarking, Document Analysis |
| TBL-007 | taxonomyTable | ~200 | Service name fuzzy matching and synonyms | All capabilities |
| TBL-008 | redFlagsTable | ~150 | Vendor-specific warning indicators | Vendor Intelligence, Risk Assessment |
| TBL-009 | savingsRulesTable | ~200 | Savings calculation heuristics | Savings Calculation |
| TBL-010 | industryTable | ~100 | Industry-specific context and norms | All capabilities |
| TBL-011 | complianceTable | ~150 | Compliance and regulatory requirements | Contract Risk Analysis |

---

## Appendix A: Table Specifications (From SOW)

### TBL-012: risksTable (~50 rows)

**Purpose:** Enable risk identification based on user-provided scenario data.

**Schema (fields):**
| Field | Description |
|-------|-------------|
| Risk_ID | Unique identifier |
| Risk_Name | Name of the risk |
| Risk_Category | Category classification |
| Detection_Criteria | How to detect this risk |
| Severity_Thresholds | LOW/MEDIUM/HIGH/CRITICAL thresholds |
| Mitigation_Strategies | Recommended mitigations |
| Impact_Description | Business impact description |

---

### TBL-013: methodologyTable (~25 rows)

**Purpose:** Explain treatment logic and savings/risk methodology in plain language.

**Schema (fields):**
| Field | Description |
|-------|-------------|
| Method_ID | Unique identifier |
| Method_Name | Name of the methodology |
| Treatment | Treatment approach |
| When_To_Use | Usage conditions |
| How_It_Works | Plain-language explanation |
| Data_Inputs | Required data inputs |
| Notes | Additional notes |

---

### TBL-014: treatmentRulesTable (~100 rows)

**Purpose:** Deterministic IF/THEN decision logic for treatment recommendations.

**Schema (fields):**
| Field | Description |
|-------|-------------|
| Rule_ID | Unique identifier |
| Condition_Type | Type of condition |
| Condition_Value | Condition value/threshold |
| Recommended_Treatment | Treatment to apply |
| Priority | Priority ranking |
| Confidence | Confidence level |
| Rationale | Explanation for rule |

---

### TBL-015: contractClausesTable (~75 rows)

**Purpose:** Clause parsing framework for contract risk analysis and redline recommendations.

**Schema (fields):**
| Field | Description |
|-------|-------------|
| Clause_ID | Unique identifier |
| Clause_Type | Type of contract clause |
| Risk_Level | Associated risk level |
| Standard_Language | Standard/expected language |
| Red_Flags | Warning indicators |
| Negotiation_Points | Suggested negotiation items |
| Market_Standard | Industry standard reference |

---

## Appendix B: Sample Queries (Golden Questions)

These sample prompts are used for testing and onboarding. Exact answers must be grounded in configured data sources.

> **Acceptance Criteria**: >=90% of Golden Questions answered correctly with no critical hallucinations.

---

### Category 1: Rate Benchmarking

1. "What's the hourly rate for customer service agents in Manila?"
2. "How much should I pay for a senior software developer in Bangalore?"
3. "Compare call center rates: India vs Philippines vs Mexico"
4. "What's the daily rate for a management consultant in London?"
5. "Show me payroll processing rates in Poland"

---

### Category 2: Vendor Intelligence

1. "Tell me about Accenture's BPO capabilities"
2. "Who are the top IT help desk providers in LATAM?"
3. "What are red flags for Conduent?"
4. "Which RPO providers have strong healthcare experience?"
5. "Compare Infosys vs TCS vs Wipro for application development"

---

### Category 3: Risk Assessment

1. "We spend $5M with one recruiting firm. What are the risks?"
2. "Our IT contract hasn't been rebid in 7 years. Should I worry?"
3. "Is it risky to have all our finance operations in India?"
4. "What risks should I look for in a BPO relationship?"
5. "We're sole-sourced on a critical vendor. How do I mitigate?"

---

### Category 4: Treatment Recommendations

1. "How can I reduce my staffing spend?"
2. "What should I do about a stale vendor contract?"
3. "We have 20 IT vendors. What do you recommend?"
4. "How do I approach renegotiating with an incumbent?"
5. "What's the best way to consolidate my HR service providers?"

---

### Category 5: Document Analysis

1. "Compare these two staffing proposals" [upload]
2. "Review this MSA for risks" [upload]
3. "Is this pricing competitive?" [upload rate card]
4. "What should I negotiate in this contract?" [upload]
5. "Analyze the SLAs in this SOW" [upload]

---

### Category 6: Methodology

1. "How do you calculate procurement savings?"
2. "What data sources do you use for benchmarks?"
3. "Explain the rate negotiation process"
4. "What's the difference between direct and indirect spend?"
5. "How should I prioritize cost reduction initiatives?"

---

*Source: ScaleX SOW Appendices*
*Total Golden Questions: 30 (5 per category x 6 categories)*
