# Financial Frameworks for Procurement

[DUAL PERSPECTIVE]

> Financial methodologies for evaluating outsourcing deals, managing vendor spend, and calculating true costs. Complements negotiation guidance with quantitative frameworks.

---

## Total Cost of Ownership (TCO) Calculation

[DUAL PERSPECTIVE]

**Purpose**: Calculate the complete cost of an outsourcing arrangement beyond the contract price.

### TCO Formula

```
TCO = Contract Value + Management Overhead + Transition Costs + Change Orders + Risk Buffer

Where:
- Contract Value = Annual fees × Term years
- Management Overhead = 5-8% of contract value
- Transition Costs = One-time (typically 5-15% of Year 1)
- Change Orders = Historical average or 10-15% buffer
- Risk Buffer = 5-10% contingency
```

### TCO Components Breakdown

| Component | Description | Typical Range | How to Estimate |
|-----------|-------------|---------------|-----------------|
| **Base Contract** | Stated fees in agreement | 100% (baseline) | Contract value |
| **Management Overhead** | Internal staff to manage vendor | 5-8% | FTEs × loaded cost |
| **Governance Costs** | Meetings, travel, tools | 1-2% | Historical spend |
| **Transition (One-time)** | Knowledge transfer, setup | 5-15% of Y1 | Vendor proposal + internal |
| **Change Orders** | Scope changes, enhancements | 10-20% | Historical average |
| **Integration Costs** | System connections, APIs | Variable | Technical estimate |
| **Training** | Internal staff training | 1-2% | # staff × cost |
| **Exit Costs** | Termination assistance, transition out | 3-6 months fees | Contract terms |
| **Risk Contingency** | Unforeseen issues | 5-10% | Risk assessment |

### TCO Example Calculation

**Scenario**: 5-year IT outsourcing deal, $10M/year contract

| Component | Calculation | Amount |
|-----------|-------------|--------|
| Base Contract | $10M × 5 years | $50,000,000 |
| Management (6%) | $50M × 6% | $3,000,000 |
| Transition | $10M × 10% | $1,000,000 |
| Change Orders (15%) | $50M × 15% | $7,500,000 |
| Risk Buffer (7%) | $50M × 7% | $3,500,000 |
| **Total TCO** | | **$65,000,000** |
| **TCO Premium** | | **30% above contract** |

**Buyer Use Case**: Use TCO to compare proposals on an apples-to-apples basis. A lower contract price with higher management burden may cost more overall.

**Vendor Use Case**: Understand buyer's full cost picture to position value-adds (lower management overhead, smoother transitions) as TCO reducers.

**Source**: Financial best practices, Chapter 5 - Negotiation

---

## Chargeback Allocation Models

[DUAL PERSPECTIVE]

**Purpose**: Allocate shared service costs to business units fairly and transparently.

### Model Comparison

| Model | How It Works | Best For | Pros | Cons |
|-------|--------------|----------|------|------|
| **Consumption-Based** | Charge by actual usage (tickets, transactions, hours) | Variable demand services | Fair, drives efficiency | Complex tracking, unpredictable budgets |
| **Headcount-Based** | Charge by # of users/employees | End-user services (EUC, Service Desk) | Simple, predictable | Doesn't reflect actual usage |
| **Fixed Allocation** | Pre-set percentage per BU | Shared infrastructure | Predictable budgets | May not reflect value received |
| **Tiered/Hybrid** | Base fee + variable usage | Mixed services | Balances predictability and fairness | More complex |

### Consumption-Based Model

```
BU Charge = Unit Rate × BU Volume

Example (Service Desk):
- Unit Rate: $25/ticket
- BU A Volume: 1,000 tickets/month
- BU A Charge: $25,000/month
```

**When to Use**: Service desk tickets, transactions processed, storage consumed, compute hours

### Headcount-Based Model

```
BU Charge = Total Cost × (BU Headcount / Total Headcount)

Example:
- Total Monthly Cost: $500,000
- BU A Headcount: 2,000 of 10,000 total (20%)
- BU A Charge: $100,000/month
```

**When to Use**: Desktop support, email, standard software licenses

### Fixed Allocation Model

```
BU Charge = Total Cost × Pre-Agreed Percentage

Example:
- Total Monthly Cost: $500,000
- BU A Allocation: 25% (agreed in annual planning)
- BU A Charge: $125,000/month
```

**When to Use**: Shared infrastructure, enterprise platforms, overhead services

### Chargeback Implementation Checklist

[CHECKLIST] Setting Up Chargebacks
- [ ] Define allocation methodology per service
- [ ] Establish unit costs or allocation percentages
- [ ] Create tracking/reporting mechanism
- [ ] Define dispute resolution process
- [ ] Communicate methodology to BU finance leads
- [ ] Set review cadence (typically annual)

**Source**: Financial management best practices

---

## Working Capital Impact of Payment Terms

[DUAL PERSPECTIVE]

**Purpose**: Understand cash flow implications of different payment term structures.

### Payment Terms Comparison

| Term | Cash Impact | Vendor Preference | Buyer Preference |
|------|-------------|-------------------|------------------|
| **Net 15** | Fast payment, low float | High | Low |
| **Net 30** | Standard | Medium | Medium |
| **Net 45** | Extended float | Low | High |
| **Net 60** | Significant float | Low | High |
| **Net 90** | Maximum float | Very Low | Very High |

### Working Capital Calculation

```
Working Capital Benefit = Monthly Spend × (Extended Days / 30) × Cost of Capital

Example:
- Monthly Spend: $1,000,000
- Move from Net 30 to Net 60: +30 days
- Cost of Capital: 8% annually (0.67%/month)
- Benefit: $1M × 1 month × 0.67% = $6,700/month = $80,400/year
```

### Payment Terms Negotiation Guide

| Contract Size | Standard Terms | What to Push For |
|---------------|----------------|------------------|
| < $1M/year | Net 30 | Net 30 acceptable |
| $1-5M/year | Net 30 | Net 45 |
| $5-20M/year | Net 30-45 | Net 60 |
| > $20M/year | Net 45 | Net 60-90 |

**Negotiation Leverage Points**:
- Credit strength (investment grade = more leverage)
- Volume/strategic importance to vendor
- Multi-year commitment in exchange for terms
- Early payment discounts (2/10 Net 30)

**Source**: Treasury management, Chapter 5 - Negotiation

---

## Spend Under Management (SUM) Calculation

[DUAL PERSPECTIVE]

**Purpose**: Measure procurement's control over organizational spend.

### SUM Formula

```
Spend Under Management (%) = Managed Spend / Total Addressable Spend × 100

Where:
- Managed Spend = Spend through contracts, preferred suppliers, or procurement oversight
- Total Addressable Spend = All third-party spend (excluding non-addressable like taxes, utilities)
```

### SUM Benchmarks

| Maturity Level | SUM % | Characteristics |
|----------------|-------|-----------------|
| **Basic** | < 50% | Limited visibility, maverick spend common |
| **Developing** | 50-65% | Core categories managed, gaps in tail spend |
| **Mature** | 65-80% | Most categories under contract, active governance |
| **Best-in-Class** | 80-95% | Comprehensive coverage, strong compliance |

### SUM Improvement Levers

| Lever | Impact | Effort |
|-------|--------|--------|
| Tail spend consolidation | +5-10% | Medium |
| Contract compliance enforcement | +5-15% | Low |
| Category expansion | +10-20% | High |
| P2P system implementation | +15-25% | High |
| Supplier rationalization | +5-10% | Medium |

### SUM Calculation Example

```
Total Third-Party Spend: $500M
Non-Addressable (taxes, regulated): $50M
Addressable Spend: $450M

Currently Managed:
- Strategic contracts: $250M
- Preferred suppliers: $75M
- Procurement-led sourcing: $50M
Total Managed: $375M

SUM = $375M / $450M = 83.3%
```

**Source**: Procurement benchmarks, Hackett Group, Ardent Partners

---

## Services Accrual Methodology

[DUAL PERSPECTIVE]

**Purpose**: Properly recognize outsourcing expenses in the correct accounting period.

### Accrual Timing

| Payment Type | Accrual Method | Timing |
|--------------|----------------|--------|
| **Monthly Fixed Fees** | Accrue monthly | End of service month |
| **Quarterly Payments** | Spread over 3 months | 1/3 each month |
| **Annual Prepayment** | Spread over 12 months | 1/12 each month |
| **Usage-Based** | Accrue based on estimated usage | Adjust when actual known |
| **Milestone Payments** | Accrue as work performed | % complete method |

### Accrual Calculation Examples

**Fixed Monthly Fee:**
```
Monthly Fee: $100,000
December Service → Accrue $100,000 in December
Invoice received January → Pay against accrual
```

**Quarterly in Arrears:**
```
Q4 Fee: $300,000 (Oct-Nov-Dec)
October: Accrue $100,000
November: Accrue $100,000
December: Accrue $100,000
January: Invoice received, pay $300,000, reverse accruals
```

**Usage-Based with True-Up:**
```
Estimated Monthly Volume: 10,000 tickets × $25 = $250,000
October Estimate: Accrue $250,000
October Actual: 11,500 tickets × $25 = $287,500
True-Up: Accrue additional $37,500
```

### Month-End Accrual Checklist

[CHECKLIST] Monthly Close
- [ ] Review all active vendor contracts
- [ ] Calculate fixed fee accruals
- [ ] Estimate variable/usage accruals
- [ ] Review prior month true-ups
- [ ] Post accrual journal entries
- [ ] Reconcile to vendor invoices when received

**Source**: Accounting standards, financial close best practices

---

## Make vs. Buy Analysis Framework

[DUAL PERSPECTIVE]

**Purpose**: Evaluate whether to perform work internally or outsource.

### Decision Framework

| Factor | Favor Insource | Favor Outsource |
|--------|----------------|-----------------|
| **Core Competency** | Core to business | Non-core, commodity |
| **Cost** | Internal cheaper at scale | Vendor economies of scale |
| **Expertise** | Have/can build expertise | Specialized skills needed |
| **Flexibility** | Stable, predictable need | Variable demand |
| **Control** | High control required | Standard delivery acceptable |
| **Risk** | Can manage internally | Transfer risk to vendor |
| **Speed** | Can ramp internally | Need capability fast |

### Cost Comparison Template

| Cost Element | Insource | Outsource |
|--------------|----------|-----------|
| Labor (fully loaded) | $ | $ |
| Management overhead | $ | $ |
| Facilities/equipment | $ | $ |
| Technology/tools | $ | $ |
| Training/development | $ | $ |
| Transition costs | $ | $ |
| Risk/contingency | $ | $ |
| **Total Annual Cost** | **$** | **$** |

### Beyond Cost Considerations

[CHECKLIST] Strategic Factors
- [ ] Does this differentiate us competitively?
- [ ] Do we have/want this expertise long-term?
- [ ] What's the market availability of this skill?
- [ ] What are the quality/security/compliance risks?
- [ ] How does this impact organizational agility?
- [ ] What's the exit difficulty if we change our mind?

**Source**: Sourcing strategy frameworks, Chapter 2 - How Clients Buy Services

---

**Source**: Financial management best practices, procurement benchmarks, The Outsourcing Sales Playbook
