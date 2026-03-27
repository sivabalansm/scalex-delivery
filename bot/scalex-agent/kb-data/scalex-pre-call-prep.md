# Pre-Call Prep: ScaleX (MaxxBot)

**Service ID**: 522621155412
**Service Type**: Managed Plan
**Status**: Awaiting First Call
**HubSpot**: [View Service](https://app.hubspot.com/contacts/46084003/record/0-46/522621155412)

---

## Company Profile

| Field | Value |
|-------|-------|
| **Company** | ScaleX LLC |
| **Domain** | yourscalex.com |
| **Industry** | Management Consulting (AI-powered vendor intelligence) |
| **Size** | ~100 employees |
| **Location** | Beverly Hills, MI 48025 |

### What They Do
ScaleX is an **AI-powered vendor intelligence platform** that helps enterprise buyers optimize vendor operations and indirect spend. Their flagship product "Maxx AI" analyzes contracts, invoices, and SOWs to uncover savings opportunities (claiming 40%+ savings potential).

### Founder Background
**Alex Rochlitz** - 15 years in outsourcing and business transformation
- Former Google: Managed $1B+ annual vendor operations
- Previous: McDonald's, Walmart, AIG
- 2023 International Association of Outsourcing Professionals Member of the Year

---

## Key Contacts

| Name | Email | Phone | Role |
|------|-------|-------|------|
| Alex Rochlitz | alex@yourscalex.com | +15862606172 | Founder & CEO |

**Internal Contacts**:
- **Deal Owner**: Kieran Hamilton (kieran.hamilton@botpress.com)
- **Company Owner**: Gaanan Gajaram (gaanan.gajaram@botpress.com)
- **CSM**: Sam Rees (samuel.rees@botpress.com)

---

## Project Overview: MaxxBot

> **CONTRACTUAL SCOPE**: The signed Order Form (BP-PO-202501191101) includes **Exhibit A - Statement of Work** which defines the complete agreed scope. This is a binding contract - we cannot deviate from this scope without written amendment.
>
> **Reference Document**: `Botpress __ ScaleX - Managed Plan Annual Order Form.pdf`

### Bot Name & Purpose
**MaxxBot** - AI Procurement Intelligence Assistant

The client has provided an **exceptionally detailed SOW** (Statement of Work) that was negotiated during the sales process. This is a complex, custom build outside standard scope.

### Commercial Terms
- **Order Form**: BP-PO-202501191101 (signed Jan 21, 2026)
- **Pricing**: $1,495/month ($17,940 annual) - 50% above standard Managed pricing
- **Payment**: Monthly by credit card (auto-charged 1st of month)
- **Commitment**: 12-month term (auto-renews up to 2x unless cancelled 45 days prior)
- **Target Delivery**: April 14, 2026 (client has April 28 launch event)
- **Credit clause**: $1,495 credit if Functional Delivery not achieved by April 14 (Botpress fault only)
- **Case study**: Client agreed to case study within 6 months of launch

### Plan Entitlements
| Resource | Limit |
|----------|-------|
| Bots | 3 included |
| Bot Invocations | 50,000/month |
| Collaborators | 3 seats |
| Table Rows | 100,000 |
| File Storage | 10 GB |
| Vector DB | 2 GB |

### Workspace Info
- **Workspace ID**: `wkspace_01KCYMP0188JKY90CF7W0TYA33`
- **Existing bots**: "Maxx" (correct one), "deprecated" (ignore)

---

## Scope Summary (From Client SOW)

### Core Capabilities (All HIGH Priority)

1. **Rate Benchmarking**
   - Fuzzy matching on service names
   - Location normalization and tier differentiation
   - Currency conversion with FX assumptions
   - Output: Benchmark range (low/median/high), unit, location, market context

2. **Vendor Intelligence**
   - Vendor profile lookup by name
   - Shortlisting by service type/location
   - Red flag identification
   - Output: Structured profile with overview, capabilities, footprint, strengths, red flags

3. **Risk Assessment**
   - Scenario attribute extraction
   - Risk detection using risksTable criteria
   - Severity assignment (LOW/MEDIUM/HIGH/CRITICAL)
   - Mitigation strategies from configured data

4. **Treatment Recommendation**
   - Deterministic IF/THEN rule evaluation from treatmentRulesTable
   - Priority ranking with rationale
   - Explicit assumptions when inputs missing

5. **Document Processing**
   - **Proposal Comparison**: PDF/DOCX upload (up to 2 docs), extract pricing/SLAs/scope/terms, side-by-side comparison
   - **Contract Risk Analysis**: Clause classification, risk flagging, recommended redline language

### Medium Priority Features
- Savings Calculation (using methodologyTable heuristics)
- Methodology Explanation (plain-language explanations)
- Export to PDF/Excel
- Demo/example queries (onboarding experience)

### User Experience Requirements
- Conversation context memory (persist across authenticated sessions)
- Query and response logging (admin access/export)
- Feedback capture (thumbs up/down with reason codes)
- Graceful failure handling (never return empty/broken responses)

---

## Data Architecture

Client will provide **~11 structured tables totaling ~14,500 rows**:

| Table | Description | Est. Rows |
|-------|-------------|-----------|
| TBL-012 | risksTable | ~50 |
| TBL-013 | methodologyTable | ~25 |
| TBL-014 | treatmentRulesTable | ~100 |
| TBL-015 | contractClausesTable | ~75 |
| + 7 more | Rate/vendor/benchmark tables | ~14,250 |

**Key Data Point**: Alex mentioned in emails he's willing to adjust table configurations, columns, and identifiers to make the bot work more effectively.

---

## Acceptance Criteria (Section 8 of SOW)

Functional Delivery is achieved when:

1. **Accuracy**: >=90% of Golden Questions answered correctly
2. **No Critical Hallucinations**: Responses grounded in configured data
3. **Capabilities**: All core functional capabilities operate end-to-end
4. **UX**: User context persists, logging/feedback/export operational
5. **Demo-ready**: Suitable for early production use

**Important**: Latency requirements were moved to "best effort" (not acceptance criteria) per negotiation.

---

## Explicitly Out of Scope (Phase 1)

- Multi-language support
- Real-time external API integrations
- Direct procurement suite integrations (Coupa, Ariba, etc.)
- Custom dashboards beyond chat
- Native mobile apps
- Enterprise SSO beyond ScaleX-selected authentication

---

## Red Flags & Risks

| Risk | Severity | Notes |
|------|----------|-------|
| **Complex scope** | HIGH | This is above standard Managed scope - requires ADK, custom tools, document processing |
| **Hard deadline** | MEDIUM | April 28 launch event, April 14 delivery target |
| **High expectations** | MEDIUM | 50% premium pricing = high expectations for quality |
| **Data dependency** | MEDIUM | Success depends on quality of client-provided tables |
| **Golden Questions undefined** | HIGH | Need client to define/provide these for acceptance testing |

---

## Questions to Clarify

### Priority 1: Scope & Data
- [ ] Can we review the data tables (TBL-012 to TBL-015)? Need schemas and sample data
- [ ] What are the "Golden Questions" for acceptance testing? (need specific list)
- [ ] Are the ~11 tables ready, or still being built?
- [ ] What format will tables be in? (Airtable, CSV, database?)

### Priority 2: Technical
- [ ] Document processing: What typical file sizes? How many docs per session?
- [ ] Authentication: What auth method for session persistence?
- [ ] Export: PDF/Excel - any specific template requirements?
- [ ] Where will MaxxBot be deployed? (Webchat, standalone app, embedded?)

### Priority 3: Operations
- [ ] Who will manage/update the data tables after launch?
- [ ] Expected usage volume? (affects LLM cost estimation)
- [ ] Who needs admin access to logs and feedback data?

### Priority 4: Timeline
- [ ] April 14 delivery - any interim milestones/demos needed?
- [ ] Who will perform UAT on our builds?
- [ ] Availability for iteration meetings (weekly cadence?)

---

## Preparation Checklist

### Before Call
- [ ] Review ADK capabilities for document processing
- [ ] Research Botpress table/knowledge base integration patterns
- [ ] Prepare questions about data schemas
- [ ] Have Linear project creation ready

### Documents to Have Ready
- [ ] Standard Managed Plan iteration framework
- [ ] ADK documentation reference
- [ ] Document processing capabilities overview

### Technical Preparation
- [ ] Understand fuzzy matching capabilities in ADK
- [ ] Review PDF/DOCX extraction options
- [ ] Consider architecture for rule evaluation (treatmentRulesTable)

---

## Communication History Summary

**Email thread highlights (Jan 15-21, 2026)**:
1. Alex provided detailed SOW (Exhibit A format)
2. Latency requirements negotiated to "best effort"
3. Credit clause agreed: 1 month credit if delivery misses April 14
4. Alex eager to start - mentioned flexibility on table configurations
5. Order form signed Jan 21

**Key quote from Alex**: "Let me know what I can do to help the team. Initial thoughts are the table configurations, columns, etc. It would be very easy for me to adjust them or link them with different identifiers if this would make the bot work more effectively."

---

## Next Steps

1. Schedule requirements workshop call
2. Request data table schemas and sample data
3. Get Golden Questions list for acceptance criteria
4. Create Linear project to track development
5. Establish iteration cadence (recommend weekly)

---

*Prepared: 2026-01-26*
*Source: HubSpot Service 522621155412, Email Communications*
