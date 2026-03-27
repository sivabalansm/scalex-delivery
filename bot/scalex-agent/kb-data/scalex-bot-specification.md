---
projectName: MaxxBot - AI Procurement Intelligence Assistant
clientName: ScaleX LLC
lastUpdated: January 26, 2026
targetLaunch: April 14, 2026
stakeholders: "Alex Rochlitz (Founder) | Botpress: David Paquet"
---

# MaxxBot Bot Specification

## Executive Summary

**Goal:** Build a production-ready AI procurement intelligence assistant that queries ScaleX-provided structured data tables, analyzes uploaded documents, and returns grounded, non-hallucinated procurement outputs.

**Pain Points:**
- Enterprise buyers lack quick access to vendor intelligence and rate benchmarks
- Contract review and risk assessment is manual and time-consuming
- Treatment recommendations require expertise that's hard to scale

**Success Criteria:**
- >=90% of Golden Questions answered correctly (30 questions across 6 categories)
- No critical hallucinations (all responses grounded in configured data)
- System is demo-ready and suitable for early production use by April 14, 2026

---

## Bot Configuration

**Bot Name:** MaxxBot
**Tone:** Professional, consultative, data-driven procurement expert
**Personality:** Authoritative yet approachable; provides clear rationale for recommendations
**Language(s):** English

### Channels

| Channel | Configuration | Notes |
| --- | --- | --- |
| Web Chat | Yes | Embedded in ScaleX platform with authenticated sessions |
| HITL Channel | TBD | Admin access for logs and feedback review |

*Note: Mobile apps, WhatsApp, and other channels are explicitly out of scope per SOW Section 9*

---

## Core Requirements

| Requirement | Description | Priority |
| --- | --- | --- |
| Rate Benchmarking | Fuzzy matching on service names, location normalization, currency conversion with FX assumptions, confidence indicators | HIGH |
| Vendor Intelligence | Vendor profile lookup, shortlisting by service/location, red flag identification from configured data | HIGH |
| Risk Assessment | Scenario attribute extraction, risk detection using risksTable, severity assignment (LOW/MEDIUM/HIGH/CRITICAL), mitigation strategies | HIGH |
| Treatment Recommendation | Deterministic IF/THEN rule evaluation using treatmentRulesTable, priority ranking, explicit assumptions when inputs missing | HIGH |
| Proposal Comparison | PDF/DOCX upload (up to 2 docs), extraction of pricing/SLAs/scope/terms, pricing normalization, side-by-side comparison | HIGH |
| Contract Risk Analysis | Contract upload (PDF/DOCX), clause classification using contractClausesTable, risk flagging, recommended redline language | HIGH |
| Savings Calculation | Estimated savings ranges using methodologyTable heuristics, transparent assumptions | MEDIUM |
| Methodology Explanation | Plain-language explanations of logic and calculations, no exposure of internal prompts | MEDIUM |

### Key Capabilities Needed

- **Conversation Context Memory**: Persist user context across authenticated sessions, allow reset/clear, prevent cross-user leakage
- **Query and Response Logging**: Log prompts, tool calls, data sources, and responses with admin export
- **Feedback Capture**: Thumbs up/down on responses with reason codes and optional comments
- **Export Functionality**: Export responses or conversation segments to PDF/Excel
- **Graceful Failure Handling**: Never return empty or broken responses, clear error messaging
- **Demo/Example Queries**: Lightweight onboarding with example prompts aligned to Golden Questions

---

## Knowledge & Data Sources

**Knowledge Bases:**
- ScaleX-provided structured data tables (~11 tables, ~14,500 rows total)
- Update frequency: Managed by ScaleX; Botpress will not modify table content

**Tables:**

### Received Tables (11 tables, ~12,600 rows) - Data folder: `data/`

| File | Description | Rows |
| --- | --- | --- |
| TBL-001_TOWERS_v4.csv | Top-level service categories (towers) | 15 |
| TBL-002_CATEGORIES_COMPLETE.csv | Category taxonomy under each tower | 120 |
| TBL-003_BaseRates_v5_FINAL.csv | Rate benchmarks by service/location/tier | 1,055 |
| TBL-005_SERVICE_TYPES.csv | Service taxonomy with SLAs, pricing models | 918 |
| TBL-006_LOCATIONS_v4.csv | Locations with FX rates, cost index, tiers | 186 |
| TBL-009_SERVICE_VENDOR_MAP_v4.csv | Vendor-service relationships with rankings | 4,693 |
| TBL-010_VENDOR_LOCATIONS_VALIDATED.csv | Vendor delivery center locations | 645 |
| TBL-011_MODIFIERS.csv | Rate modifiers (complexity, language, etc.) | 9 |
| SERVICE_NAME_ALIASES_v3.csv | Fuzzy matching aliases for service names | 1,463 |
| VENDORID_MAPPING.csv | Vendor name normalization | 1,742 |
| VENDORS_BOTPRESS_FINAL_v4.csv | Full vendor profiles with red flags | 1,742 |

### Pending Tables (4 tables, ~250 rows) - Per SOW Section 4.2

| Table | Description | Est. Rows | Status |
| --- | --- | --- | --- |
| TBL-012: risksTable | Risk identification and severity thresholds | ~50 | Alex to provide within 1 week |
| TBL-013: methodologyTable | Treatment logic and savings methodology | ~25 | Alex to provide within 1 week |
| TBL-014: treatmentRulesTable | Deterministic IF/THEN decision rules | ~100 | Alex to provide within 1 week |
| TBL-015: contractClausesTable | Contract clause parsing and redlines | ~75 | Alex to provide within 1 week |

**Total: ~12,850 rows across 15 tables**

*See `appendix-tables-and-golden-questions.md` for TBL-012 to TBL-015 schemas (from SOW Appendix A)*

**External Integrations:**
- None required for Phase 1 (all data provided via tables)

---

## Conversation Flow

```
START
  │
  ▼
[Greeting] ──→ [Intent Detection] ──→ [Route to Capability]
                                           │
          ┌────────────────────────────────┼────────────────────────────────┐
          ▼                                ▼                                ▼
    [Chat Query]                    [Document Upload]                 [Unknown]
          │                                │                                │
    ┌─────┴─────┐                    ┌─────┴─────┐                          │
    ▼           ▼                    ▼           ▼                          ▼
[Rate/Vendor] [Risk/Treatment]  [Proposal]  [Contract]                  [Clarify]
    │           │                    │           │                          │
    ▼           ▼                    ▼           ▼                          │
[Query Tables] [Eval Rules]    [Extract &    [Classify &                    │
    │           │              Compare]      Flag Risks]                    │
    │           │                    │           │                          │
    └───────────┴────────────────────┴───────────┴──────────────────────────┘
                                           │
                                           ▼
                                    [Format Response]
                                           │
                                           ▼
                                    [Log & Feedback?] ──→ [END]
```

### Document Processing Flow

```
[Upload PDF/DOCX]
        │
        ▼
[Extract Text & Structure]
        │
        ▼
[Normalize Pricing/Terms]
        │
        ▼
[Match to Tables/Benchmarks]
        │
        ▼
[Generate Analysis]
        │
        ├──→ [Proposal Comparison]: Side-by-side with negotiation opportunities
        │
        └──→ [Contract Analysis]: Clause risks, severity, redline recommendations
```

---

## Sample Interactions

*These scenarios align with the 6 Golden Question categories used for acceptance testing.*

### Scenario 1: Rate Benchmarking
**User:** What's the hourly rate for customer service agents in Manila?
**Bot:** Based on our benchmark data, customer service agents in Manila typically range from $8-12/hour (USD) for Tier 1 locations, with a median of $10/hour. This reflects rates as of [data date]. Key factors affecting pricing include language requirements, technical complexity, and volume commitments.

**User:** How does that compare to the Philippines overall?
**Bot:** Manila rates are approximately 5-10% higher than provincial Philippine locations due to talent density and infrastructure. Provincial rates range $7-11/hour.

**Confidence:** HIGH (based on 127 data points in ratesTable for Philippines/customer service)

---

### Scenario 2: Vendor Intelligence
**User:** Tell me about Accenture's BPO capabilities.
**Bot:** Here's Accenture's BPO profile from our vendor database:

**Overview:** Global leader in business process services with 500,000+ employees across 120+ countries.

**Capabilities:**
- Finance & Accounting (F&A)
- Customer Service / Contact Center
- Procurement BPO
- HR Services

**Geographic Footprint:** Strong presence in India, Philippines, Costa Rica, Poland, Romania

**Strengths:**
- Scale and global delivery capability
- Industry-specific solutions (banking, healthcare, retail)
- Technology integration (automation, AI)

**Red Flags:**
- Premium pricing (typically 15-25% above market)
- Complex contract structures
- Minimum deal sizes often $5M+

**User:** Compare Infosys vs TCS vs Wipro for application development.
**Bot:** Here's a side-by-side comparison:

| Factor | Infosys | TCS | Wipro |
| --- | --- | --- | --- |
| Global Headcount | 335K | 615K | 250K |
| ADM Strength | Strong | Very Strong | Moderate |
| Rate Range (India) | $25-45/hr | $28-50/hr | $22-40/hr |
| Key Verticals | BFSI, Retail | BFSI, Mfg | Healthcare, Energy |
| Red Flags | Attrition concerns | Rigid engagement models | Leadership transitions |

---

### Scenario 3: Risk Assessment
**User:** We spend $5M with one recruiting firm. What are the risks?
**Bot:** Based on your scenario, I've identified the following risks:

| Risk | Severity | Detection Criteria |
| --- | --- | --- |
| Concentration risk | CRITICAL | Single vendor >$3M or >40% of category spend |
| Pricing opacity | HIGH | Large spend without competitive benchmarking |
| Relationship dependency | MEDIUM | Key personnel dependencies likely at this volume |
| Contract leverage | HIGH | Vendor may have become complacent |

**Mitigation Strategies:**
1. Conduct immediate competitive benchmark
2. Develop secondary supplier relationship (even at small scale)
3. Review contract terms for exit provisions
4. Implement quarterly business reviews with performance metrics

---

### Scenario 4: Treatment Recommendations
**User:** How can I reduce my staffing spend?
**Bot:** Based on treatmentRulesTable analysis, here are prioritized recommendations:

**Priority 1: Rate Optimization** (Typical savings: 8-15%)
- IF: Contract >2 years old AND no recent benchmark → Conduct market rate analysis
- IF: Volume >50 FTEs → Negotiate volume discounts

**Priority 2: Supplier Consolidation** (Typical savings: 5-12%)
- IF: >3 suppliers in same category → Consolidate to preferred vendors
- Rationale: Increased leverage, reduced management overhead

**Priority 3: Scope Optimization** (Typical savings: 10-20%)
- IF: Markup >35% → Evaluate statement of work for scope creep
- IF: Tenure >18 months → Consider conversion to full-time

**Assumptions Made:**
- Current contract is at market rates (unverified)
- No geographic constraints mentioned

Would you like me to prioritize these differently based on your specific situation?

---

### Scenario 5: Document Analysis
**User:** [Uploads vendor_proposal.pdf] Is this pricing competitive?
**Bot:** I've analyzed your vendor proposal. Here's my assessment:

**Pricing Summary:**
| Line Item | Proposed | Benchmark | Assessment |
| --- | --- | --- | --- |
| Level 1 Support | $15/hr | $12-16/hr | Competitive (60th percentile) |
| Level 2 Support | $28/hr | $22-30/hr | Slightly high (70th percentile) |
| Management Fee | 12% | 8-10% | Above market |

**Negotiation Opportunities:**
1. Volume discount: At 50+ FTEs, target $13.50/hour for L1
2. Management fee: Push to 9% (market standard)
3. SLA credits: Standard is 5% for misses; they offer 2% - negotiate to 4%
4. Term: 2-year commitment should yield 8-10% reduction

**User:** [Uploads MSA.pdf] Review this MSA for risks.
**Bot:** I've analyzed your Master Service Agreement. Here's my risk assessment:

**High Risk Clauses:**

| Clause | Risk Level | Issue | Recommendation |
| --- | --- | --- | --- |
| Section 4.2 - Limitation of Liability | HIGH | Caps damages at 1x annual fees | Negotiate to 2x minimum for service failures |
| Section 7.1 - Termination | HIGH | 180-day notice period | Reduce to 90 days; add termination for convenience |
| Section 9.3 - IP Ownership | MEDIUM | Vendor retains all IP | Add carve-out for client-specific deliverables |

**Missing Standard Protections:**
- No SLA credit mechanism defined
- No audit rights for invoices
- No business continuity provisions

**Recommended Redlines:** [Export available in PDF format]

---

### Scenario 6: Methodology Explanation
**User:** How do you calculate procurement savings?
**Bot:** Our savings methodology uses a multi-factor approach:

**1. Baseline Establishment**
- Current contracted rates vs. actual spend
- Normalized by service type, location, and volume

**2. Benchmark Comparison**
- Compare to market rates from benchmarksTable (updated quarterly)
- Adjust for geography, complexity, and volume tiers

**3. Savings Categories**

| Type | Calculation | Typical Range |
| --- | --- | --- |
| Rate Reduction | (Current Rate - Market Rate) x Volume | 8-15% |
| Consolidation | Reduced suppliers x Management savings | 5-12% |
| Scope Optimization | Removed/reduced services x Rate | 10-20% |
| Process Improvement | Efficiency gains x Labor cost | 5-10% |

**4. Confidence Scoring**
- HIGH: >50 comparable data points, same geography
- MEDIUM: 20-50 data points, similar geography
- LOW: <20 data points or proxy data used

**Important:** All savings projections are estimates. Actual results depend on negotiation execution and market conditions.

**User:** What's the difference between direct and indirect spend?
**Bot:** Here's the distinction:

**Direct Spend:** Costs directly tied to producing goods/services you sell
- Raw materials, components, manufacturing services
- Typically managed by Supply Chain/Operations
- Usually 60-70% of total spend

**Indirect Spend:** Costs that support operations but aren't in the final product
- IT services, HR outsourcing, facilities, marketing
- Typically managed by Procurement/Finance
- Usually 30-40% of total spend

MaxxBot specializes in **indirect spend** categories, particularly:
- Professional services (consulting, legal, accounting)
- IT services (development, support, infrastructure)
- Business process outsourcing (F&A, HR, customer service)
- Staffing and contingent labor

---

## Project Boundaries & Requirements

### Access Requirements
- ScaleX must provide all structured data tables with schemas and sample data
- Golden Questions defined in SOW Appendix B (30 questions across 6 categories) - expected answers must be grounded in table data
- Representative (sanitized) documents required for testing document processing
- Authentication method for session persistence must be confirmed

### Scope Boundaries
- Only features explicitly listed in SOW Exhibit A are included
- All data tables are created, owned, and populated by ScaleX
- Botpress implements agent logic, workflows, and grounding logic
- Minor improvements after launch included in monthly maintenance
- Major new features require written agreement and may be billed additionally

### Data Privacy & AI Usage
- All ScaleX-provided data remains exclusive property of ScaleX
- Data may not be reused for other clients (NDA and DPA apply)
- Bot conversations processed by AI models for functionality
- No exposure of internal prompts to end users

### Performance Targets (Best Effort)
- Standard conversational responses: Generally within a few seconds
- Document analysis: Visible progress feedback, reasonable enterprise timeframe
- Performance targets are not strict SLAs per SOW Section 7

---

## Pending Decisions

1. **Authentication Method**: How will users authenticate to enable session persistence?
2. **Deployment Location**: Where will MaxxBot be embedded? (standalone app, existing platform, etc.)
3. **Admin Access**: Who needs access to logs, feedback data, and exports?
4. **Data Table Format**: What format will ScaleX provide tables in? (Airtable, CSV, database)
5. **Golden Question Expected Answers**: Need to confirm expected outputs for each of the 30 Golden Questions based on actual table data

---

## Acceptance Criteria (Per SOW Section 8)

Functional Delivery is achieved when:

| Criteria | Requirement |
| --- | --- |
| Accuracy | >=90% of Golden Questions answered correctly |
| Grounding | No critical hallucinations |
| Capabilities | All HIGH priority features operate end-to-end |
| Context | User context persists across authenticated sessions |
| Operations | Logging, feedback, and export features operational |
| Readiness | Demo-ready and suitable for early production use |

*Functional Delivery is based on correctness, usability, and demo readiness. Not contingent on strict latency thresholds.*

---

## Next Steps

1. **Schedule requirements workshop** to review data tables and confirm expected answers for Golden Questions
2. **ScaleX provides** table schemas, sample data, and representative test documents
3. **Confirm authentication method** for session persistence
4. **Establish iteration cadence** (recommend weekly check-ins)
5. **Create Linear project** to track development milestones

*Note: Golden Questions already defined in SOW Appendix B - see `appendix-tables-and-golden-questions.md`*

---

> **Out of Scope (Per SOW Section 9):**
> - Multi-language support
> - Real-time external API integrations
> - Direct procurement suite integrations (Coupa, Ariba, etc.)
> - Custom dashboards beyond chat
> - Native mobile apps
> - Enterprise SSO beyond ScaleX-selected authentication

*Botpress may include these as a bonus without affecting acceptance criteria.*

---

## Project Timeline

| Milestone | Target Date |
| --- | --- |
| Contract Signed | January 21, 2026 |
| Requirements Workshop | TBD (this week) |
| Data Tables Received | TBD |
| Iteration 1 Build | February - March 2026 |
| **Functional Delivery** | **April 14, 2026** |
| Client Launch Event | April 28, 2026 |

*Credit clause: $1,495 credit if Functional Delivery not achieved by April 14, 2026 due solely to Botpress fault.*

---

## Project Collaboration Guidelines

To keep things running smoothly, we suggest that both sides aim to respond to communication within two business days.

We'd appreciate timely access to any systems, sandboxes, or documentation needed to build and test the bot effectively.

## Responsible AI Practices

The bot will always follow ethical AI practices to ensure a respectful and transparent user experience:
- It will provide fact-based, clear, and non-hyped messaging
- It will not pretend to be human, and will never fabricate personal stories or identities
- It will comply with OpenAI's usage policies and general best practices for AI behavior
- **Critical**: All responses must be grounded in ScaleX-provided data sources with no hallucination

---

## Reference Documents

| Document | Location |
| --- | --- |
| Signed Order Form (SOW) | `Botpress __ ScaleX - Managed Plan Annual Order Form.pdf` |
| Table Schemas & Golden Questions | `appendix-tables-and-golden-questions.md` |
| Pre-Call Preparation | `2026-01-26-pre-call-prep.md` |
| HubSpot Context | `context.md` |

---

*Specification Version: 1.0*
*Based on: BP-PO-202501191101 Exhibit A (Statement of Work)*
*Last Updated: January 26, 2026*
