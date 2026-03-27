# Statement of Work (SOW) Guide by Service Tower

[SOW ELEMENT]

> How to structure tower-specific SOWs for enterprise outsourcing. Focus: document structure, completeness, and clear scoping.

---

## Cross-Functional Services (Service Desk, ITSM) (Exhibit 2.1)

[SOW ELEMENT]

**Template file(s) in this package**: `02 - Statement of Work/021 RFP Exhibit 2.1 Cross-Functional Services Revised 040317 v1.6.docx`

**Template heading examples**:
- Introduction
- Scope
- Provider's Overarching IT Service Management (ITSM) Responsibilities
- Incident Management
- Problem Management
- Change Management
- Configuration Management
- Continual Service Improvement

**What It Covers**: Service desk (L0–L2), request fulfillment, incident/problem/change processes, knowledge management, CMDB touchpoints, tooling (ITSM), reporting, and service management governance.

**Key Sections to Include**:
1. Service scope boundaries (what is and is not handled by the service desk)
2. Channel model (phone/chat/portal), hours of coverage, language support
3. Ticket lifecycle definitions and priority/severity model
4. RACI across Client/Vendor/third parties (including resolver groups)
5. Knowledge management responsibilities (creation, approval, maintenance)
6. Tooling requirements (ITSM platform, integrations, data ownership)
7. Reporting pack (volumes, backlog, FCR, CSAT, trends)
8. Transition approach (knowledge transfer, runbooks, hypercare)

**Critical Considerations**:
- Priority/severity definitions must be consistent across towers (service desk vs apps vs infrastructure).
- Define what “first contact resolution” means and how it is measured.
- Require clear demarcation for vendor-to-vendor handoffs to avoid “ticket ping-pong”.

[CHECKLIST] Exhibit 2.1 SOW Completeness
- [ ] Priority/severity model defined (including examples)
- [ ] RACI includes resolver groups and third parties
- [ ] ITSM tooling/integration requirements specified
- [ ] Knowledge base obligations and ownership defined
- [ ] Reporting cadence and required metrics listed
- [ ] Transition/hypercare and steady-state handoff defined

**Source**: Exhibit 2.1 - Cross-Functional Services

---

## Application Development & Maintenance (ADM) (Exhibit 2.2)

[SOW ELEMENT]

**Template file(s) in this package**: `02 - Statement of Work/022 RFP10.1 Exhibit 2.2 Application Development and Maintenance Services 2015-04-27 v1.1.docx`

**Template heading examples**:
- General
- Application Maintenance and Support Services
- Application Design/Build Services
- Application Testing Services
- Application Quality Assurance
- Application Implementation Services
- Application Methodologies, Standards and Architecture

**What It Covers**: Run support (incidents/problems), minor enhancements, major projects (if in scope), application portfolio management, testing, release/deployment support, and application-specific SLAs.

**Key Sections to Include**:
1. Application inventory in scope (by app, technology, environment)
2. Support model (L2/L3 split, on-call, hours, languages)
3. Enhancement intake and prioritization (governance + backlog management)
4. SDLC and release management expectations (Dev/Test/Prod controls)
5. Code ownership, repositories, tooling, and documentation requirements
6. Non-functional requirements (security, performance, availability support)
7. Testing obligations (unit/integration/UAT support, defect remediation)
8. Metrics and reporting (MTTR, defect leakage, release success rate)

**Critical Considerations**:
- Split “run” versus “change” work types; define how each is authorized and priced.
- Ensure the SOW states who owns/controls code, pipelines, and environments.
- Require a clear definition of “application” and “in scope” (interfaces count? shared services?).

[CHECKLIST] Exhibit 2.2 SOW Completeness
- [ ] In-scope portfolio baselined (apps + environments)
- [ ] Release management and change authorization defined
- [ ] Documentation and knowledge transfer requirements listed
- [ ] Testing responsibilities defined (including UAT support)
- [ ] Security and compliance obligations included
- [ ] Reporting metrics cover both run and change

**Source**: Exhibit 2.2 - Application Development and Maintenance Services

---

## Data Center Services (Exhibit 2.3)

[SOW ELEMENT]

**Template file(s) in this package**: `02 - Statement of Work/023 RFP Exhibit 2.3 Data Center Services 20170403_final v1.2 08-17-2017a.docx` (plus optional supplemental modules `2.3.1–2.3.3`)

**Template heading examples**:
- Introduction
- Server Support, Operation, and Administration
- Storage Support, Operation, and Administration
- Backup and Restore Support, Operation, and Administration
- Mainframe Support, Operation, and Administration
- Database and Middleware Support
- Data Security and Data Protection
- Field Support (Smart Hands & Feet)

**What It Covers**: Servers (physical/virtual), storage, backup, monitoring, data center operations, hosting (on-prem), capacity management, patching, and platform administration.

**Key Sections to Include**:
1. Scope (server/storage/backup/monitoring) and what is out of scope
2. Inventory baselines (counts, critical systems, lifecycle/refresh assumptions)
3. Standard builds, patching policy, configuration management
4. Monitoring and event management (tools, alert rules, responsibilities)
5. Backup/restore requirements and retention policies
6. Capacity management and reporting (utilization, forecasts, triggers)
7. Security hardening responsibilities and access controls
8. Dependencies (facilities, power/cooling, network, client approvals)

**Critical Considerations**:
- Separate “service parameters” (design minima) from SLAs (performance commitments).
- Clarify ownership of asset records and change approval for standard builds.
- Explicitly define maintenance windows and planned outage notification.

[CHECKLIST] Exhibit 2.3 SOW Completeness
- [ ] Inventory baselines included (server/storage/backup scope)
- [ ] Patch/config management standards defined
- [ ] Monitoring tool obligations and alert handling defined
- [ ] Backup/restore targets and retention defined
- [ ] Capacity management approach defined
- [ ] Dependencies and maintenance windows specified

**Source**: Exhibit 2.3 - Data Center Services

---

## Network Services (Exhibit 2.4)

[SOW ELEMENT]

**Template file(s) in this package**: `02 - Statement of Work/024 RFP Exhibit 2.4 MNS 2017 07 31 v1.docx`

**Template heading examples**:
- Introduction
- Wide Area Network (WAN) Services
- Local Area Network (LAN) Services
- Remote Access Services
- Mobile Services
- Voice Services
- Conferencing Services

**What It Covers**: WAN/LAN/WLAN operations, routing/switching, firewall/security zones (if not in security tower), network monitoring, remote access/VPN, carrier management, and circuit provisioning.

**Key Sections to Include**:
1. Network scope (sites, devices, services, carriers)
2. Network architecture standards and approved device/tool list
3. Incident/change management for network changes (including emergency changes)
4. Provisioning and MACD processes (Move/Add/Change/Delete)
5. Performance reporting (availability, latency, packet loss, capacity)
6. Firewall rule/request process and auditability
7. Carrier/vendor management and escalation processes
8. Documentation obligations (diagrams, IP plans, runbooks)

**Critical Considerations**:
- Clearly define change windows and approval authority for network changes.
- Require accurate, maintained network documentation as an explicit deliverable.
- Define demarcation with telecom/voice and security towers.

[CHECKLIST] Exhibit 2.4 SOW Completeness
- [ ] Site/device/carrier scope defined and baselined
- [ ] Change control model defined (standard/normal/emergency)
- [ ] Firewall rule process and documentation defined
- [ ] Performance metrics and reporting cadence defined
- [ ] Documentation deliverables (diagrams/runbooks) included
- [ ] Demarcations with voice/security towers specified

**Source**: Exhibit 2.4 - Network Services

---

## End User Computing (EUC) (Exhibit 2.5)

[SOW ELEMENT]

**Template file(s) in this package**: `02 - Statement of Work/025 RFP Exhibit 2.5 End-User Computing Services vf.docx`

**Template heading examples**:
- Introduction
- EUC Device and Software Support
- Installations, Moves, Adds, and Changes (IMACs)
- EUC Application Packaging Services
- Automation
- VIP Support
- Depot Services and device mail-in support

**What It Covers**: Desktop/laptop support, VDI (if in scope), endpoint management, IMAC, field support, software packaging, device lifecycle, and endpoint security coordination.

**Key Sections to Include**:
1. Device scope (types, models, OS standards), supported geographies
2. Support model (onsite vs remote, dispatch, hours, VIP support)
3. IMAC and provisioning processes (build, image, asset tagging)
4. Endpoint management tooling (MDM/UEM, patching, encryption)
5. Software distribution and licensing coordination
6. Asset management and lifecycle responsibilities
7. User experience metrics (CSAT, time-to-restore, first-time fix)
8. Security requirements (endpoint hardening, admin rights, exceptions)

**Critical Considerations**:
- Clarify who owns devices and how refresh is funded and executed.
- Define “standard device” vs “non-standard” and the charge model for exceptions.
- Ensure the SOW states how walk-up support and onsite coverage are handled.

[CHECKLIST] Exhibit 2.5 SOW Completeness
- [ ] Device population and coverage hours defined
- [ ] IMAC and provisioning steps defined
- [ ] Endpoint tooling requirements defined
- [ ] Asset management roles and data ownership defined
- [ ] UX metrics and reporting cadence defined
- [ ] Security exception/admin rights process defined

**Source**: Exhibit 2.5 - End User Computing

---

## Managed Security Services (Exhibit 2.6)

[SOW ELEMENT]

**Template mapping note**: In this template package, the dedicated Security SOW is labeled as **Exhibit 2.8** (file name includes “Security Services”). Map by topic/title if your numbering differs.

**Template file(s) in this package**: `02 - Statement of Work/RFP Exhibit 2.8 Security Services 20170216_finalv1.1.docx`

**Template heading examples**:
- Information Security
- Access Control
- Data Protection
- Compliance
- Security Incidents and Investigation
- Security Information and Event Management (SIEM)
- Security Awareness

**What It Covers**: Security monitoring (SOC), incident response, vulnerability management, identity and access operations (if in scope), security tooling operations, and compliance reporting.

**Key Sections to Include**:
1. Scope (SOC, SIEM, EDR, vuln mgmt, IAM ops) and exclusions
2. Security incident severity model and response timelines
3. Detection/monitoring requirements and log sources
4. Vulnerability scanning cadence, remediation workflow, and exceptions
5. Threat intel and tuning responsibilities
6. Evidence and compliance reporting (audit artifacts)
7. Access controls, privileged access management expectations
8. Coordination model with Client security team and other towers

**Critical Considerations**:
- Define “security incident” vs “IT incident” and escalation boundaries.
- Require clarity on who owns remediation actions (security vs infrastructure/app teams).
- Ensure evidence retention and chain-of-custody expectations are explicit.

[CHECKLIST] Exhibit 2.6 SOW Completeness
- [ ] Severity model and response timelines defined
- [ ] Log sources and monitoring coverage defined
- [ ] Vulnerability management workflow defined (scan → prioritize → remediate)
- [ ] Reporting/audit evidence obligations defined
- [ ] Escalation and coordination with other towers defined
- [ ] Access control/PAM responsibilities defined

**Source**: Security Services SOW template (package file labeled “Exhibit 2.8 Security Services”)

---

## Voice Services (Exhibit 2.7)

[SOW ELEMENT]

**Template mapping note**: This template package does not include a standalone “Voice Services” SOW labeled as Exhibit 2.7. Voice-related sections appear within the Network Services SOW.

**Template file(s) in this package**: `02 - Statement of Work/024 RFP Exhibit 2.4 MNS 2017 07 31 v1.docx` (voice subsections)

**Template heading examples**:
- Voice Services
- Trader Voice Services
- Conferencing Services

**What It Covers**: UC/telephony operations (PBX/VoIP), contact center platforms (if in scope), voicemail, SIP trunks, call routing, and carrier coordination.

**Key Sections to Include**:
1. Platform scope (systems, sites, endpoints, contact center)
2. Provisioning workflow (adds/moves/changes, numbers, extensions)
3. Availability and quality metrics (call quality, jitter, packet loss)
4. Incident response and outage communications
5. Carrier/vendor management responsibilities
6. Security and compliance (e.g., call recording retention rules)
7. Documentation (dial plans, routing rules, inventories)
8. Transition approach (cutovers, parallel run, testing)

**Critical Considerations**:
- Define what “availability” means for voice (platform vs endpoint vs carrier).
- Ensure routing/dial plan changes have tight change control and audit trails.
- Clarify responsibilities for telecom contracts and pass-through billing.

[CHECKLIST] Exhibit 2.7 SOW Completeness
- [ ] Platform/site inventory baseline included
- [ ] Provisioning and change control defined
- [ ] Quality/availability metrics defined
- [ ] Carrier management responsibilities defined
- [ ] Call recording and retention requirements defined (if applicable)
- [ ] Documentation deliverables included

**Source**: Network Services SOW template (voice subsections)

---

## Workplace/Mobility (Exhibit 2.8)

[SOW ELEMENT]

**Template mapping note**: Mobility requirements appear as a network attachment in this package (Attachment 2.4-C “Mobility Services”) and as “Mobile Services” subsections in the Network SOW.

**Template file(s) in this package**:
- `02 - Statement of Work/Attachments/024c RFP Attachment 2.4-C Mobility Services.docx`
- `02 - Statement of Work/024 RFP Exhibit 2.4 MNS 2017 07 31 v1.docx` (Mobile Services section)

**Template heading examples**:
- MOBILE Services
- General Mobility Management Services
- Mobile Phone Services
- Mobility Equipment Administration

**What It Covers**: Mobile device management, corporate mobility services, workplace tools support, and field/remote workforce support patterns (often overlaps EUC; clarify demarcations).

**Key Sections to Include**:
1. In-scope mobility services (devices, OS, apps, BYOD rules)
2. MDM/UEM tooling and policies (enrollment, compliance, encryption)
3. Support model for mobile issues (tiers, carrier interactions)
4. Application distribution and secure access (VPN/SSO where relevant)
5. Device lifecycle and replacement rules
6. Security controls and exception handling
7. Reporting (device compliance, incidents, provisioning volumes)
8. Demarcation with EUC and security towers

**Critical Considerations**:
- Ensure responsibilities for carrier management and billing are explicit.
- Define what data is managed/wiped and under what triggers (lost device, termination).
- Avoid duplication with EUC by explicitly defining scope boundaries.

[CHECKLIST] Exhibit 2.8 SOW Completeness
- [ ] BYOD/COPE policy alignment documented
- [ ] MDM tooling and compliance rules defined
- [ ] Security controls and wipe/lock policies defined
- [ ] Carrier interaction responsibilities defined
- [ ] Device lifecycle rules defined
- [ ] Demarcation with EUC/security towers defined

**Source**: Mobility Services template (Attachment 2.4-C) and Network SOW “Mobile Services” section

---

## Cloud Services (Exhibit 2.9)

[SOW ELEMENT]

**Template mapping note**: This template package does not contain a dedicated Cloud Services SOW labeled Exhibit 2.9. Use this section as the recommended structure for a Cloud SOW, and map to any cloud-specific templates in your package (if present).

**What It Covers**: Cloud operations (IaaS/PaaS), landing zone operations, account/subscription management, cloud security coordination, cost management responsibilities, and platform reliability.

**Key Sections to Include**:
1. Cloud scope (providers, accounts/subscriptions, services in scope)
2. Operating model (SRE/ops responsibilities, escalation, on-call)
3. Provisioning controls (account creation, guardrails, approvals)
4. Monitoring/logging requirements and tool integrations
5. Backup/DR expectations for cloud workloads
6. Patch and vulnerability management responsibilities
7. Cost management responsibilities (tagging, reporting, optimization cadence)
8. Security controls and compliance (IAM, encryption, key management)

**Critical Considerations**:
- Separate “cloud consumption cost” (pass-through) from managed service fees; define controls and reporting.
- Require tagging standards and cost allocation model if Vendor is responsible for reporting.
- Clarify who owns architecture decisions vs operational execution.

[CHECKLIST] Exhibit 2.9 SOW Completeness
- [ ] Provider/account scope clearly listed
- [ ] Provisioning/guardrails and approval model defined
- [ ] Monitoring/logging obligations defined
- [ ] Backup/DR responsibilities defined
- [ ] Cost reporting/tagging responsibilities defined
- [ ] Security/IAM responsibilities defined

**Source**: Cloud Services SOW (structure guidance; no Exhibit 2.9 template present in this package)

---

## Service Integration & Management (SIAM) (Exhibit 2.10)

[SOW ELEMENT]

**Template file(s) in this package**: `02 - Statement of Work/0210 RFP Exhibit 2.10 Service Integration and Management Services 2017-04-09 v3.1.docx`

**Template heading examples**:
- Introduction
- Service Strategy
- Service Design
- Service Transition
- Service Operation
- Continual Service Improvement
- Change Management
- Configuration Management

**What It Covers**: Multi-vendor integration, end-to-end service management, cross-tower reporting, governance orchestration, service catalog management, and “single throat to choke” coordination responsibilities.

**Key Sections to Include**:
1. SIAM scope and authority (what can SIAM direct vs recommend)
2. Integrated process model (ITIL/ITSM) across towers/vendors
3. Cross-vendor performance reporting and dashboards
4. End-to-end incident/problem/change coordination
5. Escalation model and “war room” operations for major incidents
6. Service catalog ownership and updates
7. Integration requirements (ticketing, CMDB, monitoring tool integrations)
8. Continual service improvement (CSI) cadence and deliverables

**Critical Considerations**:
- Define decision rights: SIAM without authority becomes a reporting function only.
- Require consistent data definitions across towers (priority, outage, SLA clock start/stop).
- Ensure integration deliverables are explicit (interfaces, data mapping, reporting templates).

[CHECKLIST] Exhibit 2.10 SOW Completeness
- [ ] SIAM authority/decision rights defined
- [ ] Integrated process model defined (incident/problem/change)
- [ ] Cross-vendor reporting and KPI definitions standardized
- [ ] Tool integration requirements listed (ITSM/CMDB/monitoring)
- [ ] Major incident management playbook obligations defined
- [ ] CSI deliverables and cadence defined

**Source**: Exhibit 2.10 - Service Integration and Management (SIAM)

---


