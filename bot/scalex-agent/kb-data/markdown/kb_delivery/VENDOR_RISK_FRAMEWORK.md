# Vendor Risk Assessment Framework

[DUAL PERSPECTIVE]

> Comprehensive framework for assessing, categorizing, and managing vendor risks. Covers initial assessment, ongoing monitoring, and risk mitigation strategies.

---

## Vendor Risk Assessment Questionnaire (VRAQ)

[DUAL PERSPECTIVE]

**Purpose**: Standardized questionnaire to evaluate vendor risk during selection and ongoing management.

### VRAQ Domain Categories

| Domain | Weight | Key Questions |
|--------|--------|---------------|
| **Financial Stability** | 20% | Solvency, profitability, growth trends |
| **Operational Resilience** | 20% | BCP/DR, capacity, geographic diversity |
| **Information Security** | 20% | Certifications, controls, incident history |
| **Compliance/Regulatory** | 15% | Certifications, audit findings, regulatory status |
| **Concentration Risk** | 15% | Client mix, single points of failure |
| **Strategic Fit** | 10% | Cultural alignment, innovation, partnership |

---

### Financial Stability Questions

| # | Question | Risk Indicators |
|---|----------|-----------------|
| F1 | What is the vendor's annual revenue? | < $10M = Higher risk |
| F2 | What is the revenue trend (3-year)? | Declining = Higher risk |
| F3 | Is the vendor profitable? | Losses > 2 years = Higher risk |
| F4 | What is the ownership structure? | PE with high debt = Monitor |
| F5 | Has there been recent leadership turnover? | CEO/CFO change = Monitor |
| F6 | Are there pending lawsuits or judgments? | Material litigation = Higher risk |
| F7 | What is the credit rating (if available)? | Below investment grade = Higher risk |
| F8 | Has the vendor had layoffs recently? | > 10% = Higher risk |

**Red Flags**:
- Revenue decline > 15% year-over-year
- Operating losses for 2+ consecutive years
- CEO/CFO departure without clear succession
- Credit downgrade
- Failed funding round or down round

---

### Operational Resilience Questions

| # | Question | Risk Indicators |
|---|----------|-----------------|
| O1 | Does vendor have documented BCP/DR plan? | No plan = High risk |
| O2 | How often is BCP/DR tested? | < Annual = Higher risk |
| O3 | What is the geographic diversity of delivery? | Single location = Higher risk |
| O4 | What is current capacity utilization? | > 90% = Capacity risk |
| O5 | What is staff attrition rate? | > 25% = Delivery risk |
| O6 | Are there single points of failure in key personnel? | Yes = Higher risk |
| O7 | What is the average tenure of delivery team? | < 1 year = Quality risk |
| O8 | Does vendor have documented escalation procedures? | No = Process risk |

**Red Flags**:
- Single delivery location for critical services
- No tested DR capability
- Key person dependency without backup
- Attrition > 30% annually

---

### Information Security Questions

| # | Question | Risk Indicators |
|---|----------|-----------------|
| S1 | What security certifications does vendor hold? | No SOC 2 = Higher risk |
| S2 | When was last security audit? | > 12 months = Higher risk |
| S3 | Has vendor had data breaches in past 3 years? | Any breach = Investigate |
| S4 | What is the vulnerability patching SLA? | > 30 days critical = Higher risk |
| S5 | Does vendor have 24/7 security monitoring? | No = Higher risk |
| S6 | How is access to client data controlled? | No RBAC = Higher risk |
| S7 | Is data encrypted at rest and in transit? | No = High risk |
| S8 | Does vendor conduct background checks? | No = Higher risk |

**Required Certifications by Data Type**:
- General data: SOC 2 Type II minimum
- Health data: HIPAA attestation
- Payment data: PCI DSS
- Government data: FedRAMP

---

### Compliance/Regulatory Questions

| # | Question | Risk Indicators |
|---|----------|-----------------|
| C1 | What regulatory frameworks apply to vendor? | Unclear = Risk |
| C2 | Has vendor had regulatory actions in past 3 years? | Any = Investigate |
| C3 | Does vendor have compliance officer/function? | No = Higher risk |
| C4 | How are regulatory changes tracked and implemented? | Ad hoc = Higher risk |
| C5 | Are subcontractors subject to same compliance requirements? | No = Gap |
| C6 | Does vendor maintain audit trails? | No = Compliance risk |
| C7 | Has vendor had audit findings requiring remediation? | Material findings = Monitor |
| C8 | Does vendor carry appropriate insurance? | Insufficient = Risk transfer gap |

---

### Concentration Risk Questions

| # | Question | Risk Indicators |
|---|----------|-----------------|
| R1 | What % of vendor revenue would we represent? | > 20% = Mutual dependency |
| R2 | What % of vendor revenue is from top 3 clients? | > 50% = Vendor fragility |
| R3 | Does vendor have geographic concentration? | Single country = Higher risk |
| R4 | Is there technology platform dependency? | Single platform = Higher risk |
| R5 | What % of our spend is with this vendor? | > 30% category = Our concentration |
| R6 | Are there alternative vendors available? | < 3 alternatives = Market risk |
| R7 | What is switching cost/time? | > 12 months = Lock-in risk |
| R8 | Does vendor have key supplier dependencies? | Single source = Supply chain risk |

---

## Fourth-Party Risk Assessment

[DUAL PERSPECTIVE]

**Purpose**: Assess risks from vendor's vendors (subcontractors, technology providers, infrastructure).

### Fourth-Party Categories

| Category | Examples | Risk Concern |
|----------|----------|--------------|
| **Subcontractors** | Offshore delivery partners | Data access, quality |
| **Cloud Infrastructure** | AWS, Azure, GCP | Availability, security |
| **Software Platforms** | Salesforce, ServiceNow | Data, continuity |
| **Data Centers** | Colocation providers | Physical security, availability |
| **Telecom/Network** | ISPs, MPLS providers | Connectivity, latency |

### Fourth-Party Assessment Questions

| # | Question | Why It Matters |
|---|----------|----------------|
| 4P1 | Who are vendor's critical subcontractors? | Identify hidden dependencies |
| 4P2 | What data do subcontractors access? | Data protection scope |
| 4P3 | Where are subcontractors located? | Jurisdiction, data transfer |
| 4P4 | How does vendor assess subcontractor risk? | Risk management maturity |
| 4P5 | What happens if a key subcontractor fails? | Business continuity |
| 4P6 | Do subcontractor contracts flow down our requirements? | Compliance chain |
| 4P7 | Can we audit subcontractors? | Verification rights |
| 4P8 | How are subcontractor changes communicated? | Change management |

### Fourth-Party Risk Mitigation

[CHECKLIST] Contract Provisions
- [ ] Right to approve material subcontractors
- [ ] Notification of subcontractor changes
- [ ] Flow-down of security/compliance requirements
- [ ] Audit rights extending to subcontractors
- [ ] Vendor remains liable for subcontractor performance
- [ ] Subcontractor location restrictions (if needed)

**Source**: Third-party risk management frameworks

---

## Concentration Risk Methodology

[DUAL PERSPECTIVE]

**Purpose**: Identify and manage over-reliance on single vendors, locations, or individuals.

### Concentration Risk Types

| Type | Definition | Threshold | Mitigation |
|------|------------|-----------|------------|
| **Vendor Spend** | % of category spend with one vendor | > 30% | Dual-source, market test |
| **Vendor Revenue** | % of vendor revenue from us | > 20% | Monitor vendor health |
| **Geographic** | % of service from one location | > 50% | Require backup site |
| **Key Person** | Dependency on specific individuals | Any critical | Require backups, documentation |
| **Technology** | Dependency on single platform | Any critical | Exit plan, data portability |

### Concentration Risk Assessment Matrix

| Dimension | Low Risk | Medium Risk | High Risk |
|-----------|----------|-------------|-----------|
| **Spend %** | < 15% | 15-30% | > 30% |
| **Alternatives** | 5+ viable | 3-4 viable | < 3 viable |
| **Switching Time** | < 6 months | 6-12 months | > 12 months |
| **Switching Cost** | < 10% ACV | 10-25% ACV | > 25% ACV |
| **Business Impact** | Low | Medium | High/Critical |

### Concentration Risk Score Calculation

```
Concentration Score = (Spend % × 0.3) + (Alternative Score × 0.2) + 
                      (Switching Score × 0.25) + (Impact Score × 0.25)

Where each factor is rated 1 (low risk) to 5 (high risk)

Score Interpretation:
1.0 - 2.0: Low concentration risk
2.1 - 3.0: Moderate - monitor
3.1 - 4.0: High - develop mitigation plan
4.1 - 5.0: Critical - immediate action required
```

---

## Risk Tier Classification

[DUAL PERSPECTIVE]

**Purpose**: Categorize vendors by risk level to determine appropriate governance and monitoring.

### Tier Definitions

| Tier | Criteria | Examples |
|------|----------|----------|
| **Critical** | Business cannot operate without; > $5M annual; data access | Core IT infrastructure, ERP, primary BPO |
| **High** | Significant impact if fails; $1-5M annual; some data access | Application support, secondary BPO, consulting |
| **Medium** | Moderate impact; $100K-1M annual; limited data | Staff augmentation, professional services |
| **Low** | Minimal impact; < $100K annual; no sensitive data | Office supplies, facilities, travel |

### Tier-Based Governance Requirements

| Requirement | Critical | High | Medium | Low |
|-------------|----------|------|--------|-----|
| **Initial Assessment** | Full VRAQ | Full VRAQ | Abbreviated | Basic |
| **Security Review** | Detailed | Standard | Self-attestation | N/A |
| **Financial Review** | D&B + analysis | D&B report | Self-attestation | N/A |
| **Contract Review** | Legal + procurement | Legal + procurement | Procurement | Standard terms |
| **Ongoing Monitoring** | Continuous | Quarterly | Annual | As needed |
| **Business Review** | Monthly | Quarterly | Annual | N/A |
| **Risk Reassessment** | Annual | Annual | Biennial | Triennial |
| **BCP/DR Validation** | Annual test | Annual review | Self-attestation | N/A |

### Tier Assignment Checklist

[CHECKLIST] Tiering Criteria
- [ ] Annual spend level
- [ ] Data sensitivity accessed
- [ ] Business criticality (impact of failure)
- [ ] Regulatory/compliance implications
- [ ] Replaceability / switching difficulty
- [ ] Integration depth

> **MaxxBot Note**: Current vendor risk scores (Financial Health Score A/B/C/D) are available in the vendors data. Ask MaxxBot: "What is [vendor]'s financial health score?" or "What vendors have financial concerns?" for current assessments.

---

## Risk Monitoring Cadence

[DUAL PERSPECTIVE]

**Purpose**: Define ongoing monitoring activities by risk tier.

### Monitoring Activities by Tier

| Activity | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Financial health check | Monthly | Quarterly | Annual | N/A |
| News/media monitoring | Continuous | Weekly | Monthly | N/A |
| Security posture review | Quarterly | Semi-annual | Annual | N/A |
| Performance scorecard | Monthly | Monthly | Quarterly | N/A |
| Compliance verification | Annual | Annual | Biennial | N/A |
| On-site audit | Annual | Biennial | As needed | N/A |
| BCP/DR test participation | Annual | Biennial | N/A | N/A |
| Executive relationship check | Quarterly | Semi-annual | Annual | N/A |

### Risk Trigger Events (Immediate Review Required)

| Event | Action Required |
|-------|-----------------|
| Credit downgrade | Financial review, assess impact |
| Data breach | Security review, contractual remedies |
| Key executive departure | Stability assessment, succession review |
| Acquisition announcement | Strategic review, contract implications |
| Major layoffs (> 10%) | Delivery impact assessment |
| Regulatory action | Compliance review, contract implications |
| Service level chronic failure | Root cause, remediation plan |
| Negative press/litigation | Reputational assessment |

---

## Risk Mitigation Strategies

[DUAL PERSPECTIVE]

### By Risk Type

| Risk Type | Mitigation Strategies |
|-----------|----------------------|
| **Financial** | Escrow, parent guarantee, shorter payment terms, termination rights |
| **Operational** | SLAs with teeth, BCP requirements, redundancy requirements |
| **Security** | Certification requirements, audit rights, incident notification |
| **Concentration** | Dual sourcing, exit planning, data portability |
| **Compliance** | Flow-down requirements, audit rights, indemnification |
| **Key Person** | Backup requirements, documentation, knowledge transfer |

### Contract Risk Mitigation Provisions

[CHECKLIST] Risk Mitigation Clauses
- [ ] Termination for convenience (with notice period)
- [ ] Termination for cause (with cure period)
- [ ] Step-in rights (for critical services)
- [ ] Audit rights (financial and operational)
- [ ] Data return/destruction obligations
- [ ] Transition assistance obligations
- [ ] IP ownership clarity
- [ ] Indemnification provisions
- [ ] Insurance requirements
- [ ] Parent company guarantee (if needed)
- [ ] Escrow arrangements (if needed)

**Source**: Risk management frameworks, The Outsourcing Sales Playbook Chapter 11
