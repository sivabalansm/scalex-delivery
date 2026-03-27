# Operational Procedures for Vendor Management

[RFP COMPONENT]

> Day-to-day operational procedures for managing outsourcing relationships. Complements the structural guidance in CONTRACT_PROVISIONS_GUIDE.md with actionable process templates.

---

## Escalation Matrix

[CHECKLIST]

### Priority Definitions

| Priority | Definition | Examples | Response Target | Resolution Target |
|----------|------------|----------|-----------------|-------------------|
| **P1 - Critical** | Complete service outage or severe business impact | Production system down; data breach; complete service failure | 15 minutes | 4 hours |
| **P2 - High** | Major functionality impaired, workaround not available | Key application degraded; significant user impact | 1 hour | 8 hours |
| **P3 - Medium** | Functionality impaired but workaround exists | Non-critical system issue; limited user impact | 4 hours | 24 hours |
| **P4 - Low** | Minor issue, no significant business impact | Cosmetic issues; enhancement requests; documentation | 8 hours | 5 business days |

### Escalation Path Template

| Time Elapsed | P1 Action | P2 Action | P3 Action | P4 Action |
|--------------|-----------|-----------|-----------|-----------|
| 0 min | Vendor Service Desk notified | Vendor Service Desk notified | Vendor Service Desk notified | Vendor Service Desk notified |
| 15 min | Vendor Team Lead engaged | — | — | — |
| 30 min | Vendor Operations Manager engaged | Vendor Team Lead engaged | — | — |
| 1 hour | Client VM notified; War room initiated | Vendor Operations Manager engaged | — | — |
| 2 hours | Vendor Account Director engaged | Client VM notified | Vendor Team Lead engaged | — |
| 4 hours | Client Director engaged; Executive bridge | Vendor Account Director engaged | — | — |
| 8 hours | Executive escalation both sides | Client Director engaged | Client VM notified | — |
| 24 hours | Contract remedies review | Executive escalation | — | — |

### Contact List Template

| Role | Name | Phone | Email | Escalation Level |
|------|------|-------|-------|------------------|
| Vendor Service Desk | [Team] | [Number] | [Email] | L1 |
| Vendor Team Lead | [Name] | [Number] | [Email] | L2 |
| Vendor Operations Manager | [Name] | [Number] | [Email] | L3 |
| Vendor Account Director | [Name] | [Number] | [Email] | L4 |
| Client Vendor Manager | [Name] | [Number] | [Email] | L3 |
| Client Director | [Name] | [Number] | [Email] | L4 |
| Client VP/Executive | [Name] | [Number] | [Email] | L5 |

**Source**: Governance best practices

---

## Monthly Operational Review Agenda

[CHECKLIST]

### Standard Monthly Review Structure (90 minutes)

**1. Performance Review (30 min)**
- [ ] SLA dashboard review (all metrics vs. targets)
- [ ] Service credit calculation (if applicable)
- [ ] Trend analysis (improving/declining metrics)
- [ ] Root cause review for any missed SLAs

**2. Operational Updates (20 min)**
- [ ] Volume trends vs. baseline
- [ ] Staffing/capacity status
- [ ] Major incidents since last review
- [ ] Upcoming planned maintenance/changes

**3. Risk and Issue Review (15 min)**
- [ ] Open risks (new, ongoing, closed)
- [ ] Issue log review
- [ ] Escalations since last meeting
- [ ] Audit findings (if any)

**4. Improvement Initiatives (15 min)**
- [ ] Productivity/efficiency initiatives status
- [ ] Automation opportunities
- [ ] Process improvement recommendations
- [ ] Innovation pipeline

**5. Forward Look (10 min)**
- [ ] Next month's planned activities
- [ ] Upcoming milestones/deadlines
- [ ] Resource requirements
- [ ] Action items and owners

### Required Pre-Read Materials
- SLA performance report
- Incident summary report
- Volume report
- Risk/issue log
- Change log

**Source**: Governance exhibit best practices

---

## SLA Breach Documentation Process

[CHECKLIST]

### When to Document
Document any SLA miss immediately, even if within service credit thresholds. Documentation supports:
- Service credit claims
- Pattern identification
- Contract renewal negotiations
- Potential termination for cause

### Required Documentation Elements

**1. Incident Identification**
- [ ] Incident ticket number
- [ ] Date/time of occurrence (start)
- [ ] Date/time of resolution (end)
- [ ] Duration of breach
- [ ] SLA metric breached
- [ ] Target vs. actual performance

**2. Impact Assessment**
- [ ] Business units affected
- [ ] Number of users impacted
- [ ] Revenue/productivity impact (if quantifiable)
- [ ] Downstream system impacts
- [ ] Customer-facing impact (if any)

**3. Root Cause Analysis**
- [ ] Vendor-provided root cause
- [ ] Client assessment of root cause
- [ ] Contributing factors
- [ ] Was this preventable?
- [ ] Has this occurred before?

**4. Remediation**
- [ ] Immediate fix applied
- [ ] Long-term remediation plan
- [ ] Timeline for permanent fix
- [ ] Preventive measures proposed

**5. Commercial Impact**
- [ ] Service credit calculation
- [ ] Credit amount claimed
- [ ] Cumulative credits this period
- [ ] Chronic failure threshold status

### Breach Log Template

| Field | Value |
|-------|-------|
| Breach ID | [Auto-increment] |
| Date | [YYYY-MM-DD] |
| SLA Metric | [Metric name] |
| Target | [Target value] |
| Actual | [Actual value] |
| Duration | [HH:MM] |
| Ticket # | [Reference] |
| Root Cause | [Summary] |
| Service Credit | [$Amount] |
| Status | [Open/Closed] |

**Source**: Service Levels exhibit, Governance exhibit

---

## Invoice Dispute Resolution Process

[CHECKLIST]

### Timeline Requirements

| Step | Timeline | Action |
|------|----------|--------|
| Invoice Receipt | Day 0 | Vendor submits invoice with supporting documentation |
| Initial Review | Day 1-5 | Client reviews invoice against contract terms |
| Query Submission | Day 10 | Client submits any queries/disputes in writing |
| Vendor Response | Day 15 | Vendor responds to queries with supporting evidence |
| Resolution Meeting | Day 20 | Joint meeting if dispute unresolved |
| Escalation | Day 25 | Escalate to Account Director/Client Director |
| Final Resolution | Day 30 | Resolution or formal dispute under contract |

### Dispute Documentation Requirements

**For Unit-Based Disputes:**
- [ ] Volume reports showing actual counts
- [ ] System logs supporting claimed volumes
- [ ] Comparison to baseline volumes
- [ ] Rate card reference

**For Rate Disputes:**
- [ ] Applicable rate card provision
- [ ] Role/resource classification evidence
- [ ] Hours/time logs (if T&M)
- [ ] Approval documentation

**For Out-of-Scope Charges:**
- [ ] Change order/SOW reference
- [ ] Approval documentation
- [ ] Scope definition from contract
- [ ] Email/meeting notes supporting scope interpretation

### Dispute Categories

| Category | Common Causes | Evidence Required |
|----------|---------------|-------------------|
| Volume Variance | Miscounting, system errors | Logs, reports |
| Rate Discrepancy | Wrong role classification | Approval, rate card |
| Unauthorized Charges | No approval, scope creep | Change orders, SOW |
| Service Credit Omission | Credits not applied | Breach log, SLA report |
| Pass-Through Markup | Incorrect markup applied | Third-party invoices, contract |

**Source**: Invoicing and Payment exhibit

---

## Vendor Staff Offboarding Checklist

[CHECKLIST]

### Security & Access (Complete within 24 hours of departure)

- [ ] Revoke VPN access
- [ ] Disable Active Directory / SSO accounts
- [ ] Remove from email distribution lists
- [ ] Revoke badge/physical access
- [ ] Disable application-specific accounts
- [ ] Remove from collaboration tools (Slack, Teams, SharePoint)
- [ ] Revoke cloud console access (AWS, Azure, GCP)
- [ ] Remove from ticketing system assignments
- [ ] Disable remote access tools
- [ ] Collect any client-issued equipment

### Knowledge Transfer (Complete before departure)

- [ ] Document open tickets/issues with status
- [ ] Update runbooks with any undocumented procedures
- [ ] Transfer ownership of scheduled tasks/jobs
- [ ] Hand over any client-specific credentials to successor
- [ ] Complete knowledge transfer sessions with replacement
- [ ] Update contact lists and escalation matrices

### Compliance & Documentation

- [ ] Confirm all client data returned/deleted from personal devices
- [ ] Obtain signed acknowledgment of confidentiality obligations
- [ ] Update security clearance records (if applicable)
- [ ] Archive email/communications per retention policy
- [ ] Update vendor staffing reports

### Notification Requirements

| Stakeholder | Timeline | Method |
|-------------|----------|--------|
| Client Security Team | Same day | Email + ticket |
| Client Vendor Manager | 24 hours advance | Email |
| Affected resolver groups | 48 hours advance | Email |
| Project teams | 1 week advance | Meeting |

**Source**: Key Personnel exhibit, Security requirements

---

## P1 Incident War Room Procedures

[CHECKLIST]

### War Room Activation Criteria
- Any P1 incident
- Multiple related P2 incidents
- Security incident (any severity)
- Data breach or potential data breach
- Client executive request

### War Room Roles

| Role | Responsibility | Required? |
|------|----------------|-----------|
| Incident Commander | Owns resolution, makes decisions | Yes |
| Technical Lead | Drives technical investigation | Yes |
| Communications Lead | Manages stakeholder updates | Yes |
| Scribe | Documents timeline and actions | Yes |
| Subject Matter Experts | Provide domain expertise | As needed |
| Client Representative | Provides client context/approvals | Recommended |

### Communication Cadence

| Audience | Frequency | Format |
|----------|-----------|--------|
| War Room participants | Continuous | Bridge call |
| Client Vendor Manager | Every 30 min | Email + call |
| Client Leadership | Every hour | Email summary |
| Affected users | At key milestones | Status page / email |

### Post-Incident Requirements

- [ ] Incident timeline documented within 24 hours
- [ ] Root cause analysis within 5 business days
- [ ] Post-incident review meeting within 10 business days
- [ ] Remediation plan with timeline
- [ ] Lessons learned documented

**Source**: Cross-Functional Services SOW, Governance exhibit

---

**Source**: Compiled from ISG RFP/Contract templates, Governance best practices
