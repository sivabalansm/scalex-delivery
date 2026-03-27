# Documenting Current State for Outsourcing

[RFP COMPONENT]

> Comprehensive guide to documenting your existing environment for vendor 
> due diligence and RFP responses.

---

## Why Current State Documentation Matters

Vendors cannot accurately price or plan transitions without understanding your 
existing environment. Incomplete documentation leads to:

- **Inflated pricing**: Vendors add risk buffer for unknowns
- **Transition failures**: Undiscovered dependencies cause delays
- **Scope disputes**: Ambiguity leads to change orders
- **Poor service**: Vendor teams lack context to perform

---

## Data Center Documentation (Appendix A)

[CHECKLIST] Data Center Information Required

**Physical Infrastructure**
- [ ] Location addresses and access procedures
- [ ] Floor space (raised floor, cage, suite)
- [ ] Power capacity (kW, redundancy level)
- [ ] Cooling capacity and configuration
- [ ] Physical security (biometric, mantrap, cameras)

**Logical Infrastructure**
- [ ] Network topology diagrams
- [ ] IP addressing schemes (subnets, VLANs)
- [ ] DNS/DHCP configuration
- [ ] Firewall rules and security zones
- [ ] Load balancer configuration

**Operations**
- [ ] Current support model (hours, staffing)
- [ ] Monitoring tools in use
- [ ] Backup procedures and schedules
- [ ] DR capabilities and RTO/RPO
- [ ] Capacity utilization trends

**Source**: Appendix A - Data Center Overview

---

## Server Environment (Appendix C)

[CHECKLIST] Server Information Required

**Inventory**
- [ ] Total server count (physical/virtual)
- [ ] Operating systems and versions
- [ ] Server roles and applications
- [ ] Age and refresh schedule
- [ ] Licensing model (owned, subscription)

**Configuration**
- [ ] Standard build specifications
- [ ] Patch management approach
- [ ] Configuration management tools
- [ ] Automation/orchestration tools

**Performance**
- [ ] Utilization metrics
- [ ] Growth trends
- [ ] Peak usage patterns
- [ ] SLA history

**Source**: Appendix C - Server Environment

---

## Network Environment (Appendix D)

[CHECKLIST] Network Information Required

**Architecture**
- [ ] Network topology diagrams
- [ ] WAN connectivity (MPLS, SD-WAN, Internet)
- [ ] LAN architecture per site
- [ ] Wireless infrastructure

**Equipment**
- [ ] Router/switch inventory
- [ ] Firewall inventory and rules
- [ ] Load balancers
- [ ] WAN optimizers

**Services**
- [ ] DNS/DHCP
- [ ] VPN (site-to-site, remote access)
- [ ] Network monitoring
- [ ] Traffic analysis tools

**Source**: Appendix D - Network Environment

---

## Applications (Appendix F - ADM)

[CHECKLIST] Application Information Required

**Inventory**
- [ ] Complete application list
- [ ] Business criticality rating
- [ ] Technology stack per app
- [ ] Integration dependencies
- [ ] Data classification

**Support Model**
- [ ] Current support organization
- [ ] Incident volumes by app
- [ ] Enhancement request backlog
- [ ] Release frequency

**Quality Assessment**
- [ ] Technical debt indicators
- [ ] Code quality metrics
- [ ] Test coverage
- [ ] Documentation status

**Source**: Appendix F - ADM Environment

---

## End User Computing (Appendix E)

[CHECKLIST] EUC Information Required

**Devices**
- [ ] Desktop/laptop count and models
- [ ] Mobile device inventory
- [ ] Thin client/VDI deployment
- [ ] Printer/peripheral inventory

**Software**
- [ ] Standard image composition
- [ ] Licensed software inventory
- [ ] SaaS applications in use
- [ ] Shadow IT assessment

**Support**
- [ ] Service desk volumes
- [ ] IMAC volumes (Install, Move, Add, Change)
- [ ] Break/fix volumes
- [ ] User satisfaction scores

**Source**: Appendix E - End User Environment

---

## HR/Staffing (Appendix H)

[CHECKLIST] HR Information Required

**Headcount**
- [ ] Staff count by role/function
- [ ] Location distribution
- [ ] Contractor vs. employee mix
- [ ] Vacancy rate

**Compensation**
- [ ] Salary ranges by role
- [ ] Benefit summary
- [ ] PTO policies
- [ ] Pension/retirement obligations

**Employment Terms**
- [ ] Notice period requirements
- [ ] Non-compete/non-solicit terms
- [ ] Union/works council considerations
- [ ] Transfer/rebadging history

**Source**: Appendix H - Human Resources

---

## Cloud Environment (Appendix I)

[CHECKLIST] Cloud Information Required

**Providers**
- [ ] Cloud providers in use (AWS, Azure, GCP, etc.)
- [ ] Account/subscription structure
- [ ] Monthly spend by provider
- [ ] Contract terms and commitments

**Architecture**
- [ ] Workloads deployed
- [ ] Network connectivity (Direct Connect, ExpressRoute)
- [ ] Identity integration
- [ ] Security controls

**Operations**
- [ ] Management tools in use
- [ ] Cost optimization measures
- [ ] Governance/tagging standards
- [ ] Incident history

**Source**: Appendix I - Cloud Environment

---

## Documentation Quality Tips

**Do**:
- Use consistent formatting and naming
- Include diagrams where helpful
- Provide actual data, not estimates
- Date all information
- Identify gaps explicitly

**Don't**:
- Leave sections blank without explanation
- Provide outdated information
- Over-classify information (limits vendor access)
- Wait until RFP release to gather data

---

**Source**: RFP Instructions, Appendices A-I
