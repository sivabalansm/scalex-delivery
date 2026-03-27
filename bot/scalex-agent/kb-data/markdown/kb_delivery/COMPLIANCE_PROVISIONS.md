# Compliance & Data Protection Provisions

[CONTRACT PROVISION]

> Guidance for structuring compliance and data protection requirements in outsourcing contracts. Covers GDPR, cross-border transfers, and certification requirements.

---

## GDPR Subprocessor Obligations

[CONTRACT PROVISION]

### Article 28 Requirements

When engaging a vendor as a data processor (or subprocessor), GDPR Article 28 requires specific contractual provisions:

**Mandatory Contract Terms:**

| Requirement | Contract Language Needed |
|-------------|-------------------------|
| Processing instructions | Vendor processes personal data only on documented instructions from Client |
| Confidentiality | Vendor ensures persons processing data are under confidentiality obligations |
| Security measures | Vendor implements appropriate technical and organizational measures |
| Subprocessor controls | Vendor does not engage another processor without Client authorization |
| Assistance with rights | Vendor assists Client in responding to data subject requests |
| Deletion/return | Vendor deletes or returns all personal data at end of services |
| Audit rights | Vendor allows and contributes to audits and inspections |
| Breach notification | Vendor notifies Client without undue delay of any personal data breach |

### Subprocessor Management

**Prior Authorization Options:**
1. **Specific authorization**: Client approves each subprocessor individually
2. **General authorization**: Client provides blanket consent with notification of changes

**Notification Requirements:**
- Vendor must maintain list of subprocessors
- Client must be notified of intended additions/replacements
- Client must have opportunity to object (typically 30 days)
- Objection process and resolution must be defined

### Data Processing Agreement (DPA) Checklist

[CHECKLIST] DPA Required Elements
- [ ] Subject matter and duration of processing
- [ ] Nature and purpose of processing
- [ ] Type of personal data processed
- [ ] Categories of data subjects
- [ ] Client obligations and rights
- [ ] Vendor obligations per Article 28(3)
- [ ] Subprocessor requirements
- [ ] Data transfer mechanisms (if cross-border)
- [ ] Audit rights and procedures
- [ ] Data deletion/return procedures

**Source**: GDPR Article 28, Standard Contractual Clauses

---

## Cross-Border Data Transfer Mechanisms

[CONTRACT PROVISION]

### Transfer Mechanism Options (Post-Schrems II)

| Mechanism | When to Use | Key Requirements |
|-----------|-------------|------------------|
| **Adequacy Decision** | Transferring to country with EU adequacy | Confirm destination country is on adequacy list |
| **Standard Contractual Clauses (SCCs)** | Most common mechanism | Use EU-approved 2021 SCCs; conduct Transfer Impact Assessment |
| **Binding Corporate Rules** | Intra-group transfers | Requires supervisory authority approval |
| **Explicit Consent** | Limited/occasional transfers | Informed, specific consent; not suitable for ongoing outsourcing |
| **UK IDTA** | UK data transfers post-Brexit | UK-specific addendum to SCCs |

### Standard Contractual Clauses (2021 SCCs)

**Module Selection:**
- **Module 1**: Controller to Controller
- **Module 2**: Controller to Processor (most common for outsourcing)
- **Module 3**: Processor to Processor
- **Module 4**: Processor to Controller

**Required Annexes:**
- Annex I: List of parties, description of transfer, competent supervisory authority
- Annex II: Technical and organizational security measures
- Annex III: List of subprocessors (if applicable)

### Transfer Impact Assessment (TIA)

[CHECKLIST] TIA Required Elements
- [ ] Identify the data being transferred
- [ ] Identify the destination country
- [ ] Assess destination country's legal framework
- [ ] Evaluate government access risks
- [ ] Assess effectiveness of supplementary measures
- [ ] Document decision and rationale
- [ ] Plan for ongoing monitoring

**High-Risk Destinations (Enhanced Scrutiny Required):**
- Countries without adequacy decisions
- Countries with broad surveillance laws
- Countries without independent data protection authority

**Source**: GDPR Chapter V, EDPB Recommendations 01/2020

---

## Certification Requirements by Data Type

[CONTRACT PROVISION]

### Minimum Certification Matrix

| Data Type | Minimum Certifications | Recommended |
|-----------|----------------------|-------------|
| **General Business Data** | SOC 2 Type II | ISO 27001 |
| **Personal Data (Non-Sensitive)** | SOC 2 Type II + GDPR compliance | ISO 27001 + ISO 27701 |
| **Health Data (PHI)** | HIPAA attestation + SOC 2 | HITRUST CSF |
| **Payment Card Data** | PCI DSS Level 1 | SOC 2 + PCI DSS |
| **Financial Data** | SOC 1 Type II + SOC 2 | SSAE 18 |
| **Government Data** | FedRAMP (US) / equivalent | IL4/IL5 for classified |
| **Automotive Data** | TISAX | ISO 27001 + TISAX |

### Certification Definitions

**SOC 2 Type II**
- Covers: Security, Availability, Processing Integrity, Confidentiality, Privacy
- Scope: Service organization controls over 6-12 month period
- Verification: Annual audit by CPA firm
- Relevance: Standard for cloud/SaaS providers

**ISO 27001**
- Covers: Information Security Management System (ISMS)
- Scope: Entire organization or specific services
- Verification: Certification body audit every 3 years
- Relevance: International standard, recognized globally

**ISO 27701**
- Covers: Privacy Information Management System (PIMS)
- Scope: Extension to ISO 27001 for privacy
- Verification: Certification body audit
- Relevance: Demonstrates GDPR-aligned privacy practices

**HIPAA Attestation**
- Covers: Protected Health Information safeguards
- Scope: US healthcare data
- Verification: Third-party assessment or self-attestation
- Relevance: Required for US healthcare outsourcing

**PCI DSS**
- Covers: Cardholder data environment
- Scope: Systems processing/storing payment cards
- Verification: QSA audit (Level 1) or SAQ (Levels 2-4)
- Relevance: Required for payment processing

### Certification Verification Checklist

[CHECKLIST] Annual Verification
- [ ] Request current certification certificates
- [ ] Verify certification scope covers contracted services
- [ ] Review any exceptions or qualifications noted
- [ ] Confirm certification is current (not expired)
- [ ] Review bridge letter if new certification pending
- [ ] Document verification in vendor file

**Source**: Industry security standards, regulatory requirements

---

## Security Requirements Contract Language

[CONTRACT PROVISION]

### Standard Security Provisions

**Access Control:**
- Role-based access control (RBAC) implementation
- Principle of least privilege
- Multi-factor authentication for privileged access
- Regular access reviews (quarterly minimum)
- Immediate revocation upon termination

**Encryption:**
- Data at rest: AES-256 or equivalent
- Data in transit: TLS 1.2+ 
- Key management procedures documented
- Client-managed keys option (for sensitive data)

**Monitoring & Logging:**
- Security event logging enabled
- Log retention minimum 12 months
- Real-time alerting for security events
- Regular log review procedures

**Vulnerability Management:**
- Quarterly vulnerability scans (minimum)
- Annual penetration testing
- Critical vulnerabilities patched within 72 hours
- High vulnerabilities patched within 30 days

**Incident Response:**
- Documented incident response plan
- Security incident notification within 24-72 hours
- Cooperation with Client incident response
- Post-incident review and remediation

### Security Exhibit Checklist

[CHECKLIST] Security Requirements
- [ ] Certification requirements specified
- [ ] Access control requirements defined
- [ ] Encryption standards specified
- [ ] Monitoring/logging requirements
- [ ] Vulnerability management cadence
- [ ] Penetration testing requirements
- [ ] Incident response and notification
- [ ] Audit rights (including security audits)
- [ ] Background check requirements
- [ ] Physical security requirements

**Source**: Technical Architecture exhibit, Security best practices

---

## Data Localization Requirements

[CONTRACT PROVISION]

### Common Data Localization Rules

| Jurisdiction | Requirement | Applies To |
|--------------|-------------|------------|
| **EU/EEA** | Transfer restrictions (GDPR) | Personal data of EU residents |
| **China** | Data localization (PIPL, CSL) | Critical data, personal data |
| **Russia** | Data localization (Federal Law 242-FZ) | Personal data of Russian citizens |
| **India** | Localization for certain data (proposed) | Financial, health data |
| **Australia** | Notification requirements (Privacy Act) | Personal data |
| **Brazil** | Transfer restrictions (LGPD) | Personal data (GDPR-like) |

### Contract Provisions for Data Location

**Required Clauses:**
1. Specification of permitted processing locations
2. Notification requirement before location changes
3. Client approval right for new locations
4. Compliance with local data protection laws
5. Documentation of legal basis for any transfers

**Location Documentation:**
- List of data centers / processing locations
- Subprocessor locations
- Backup/DR site locations
- Support team locations (if accessing data)

**Source**: Global privacy regulations, data protection requirements

---

**Source**: GDPR, ISO 27001, industry compliance frameworks
