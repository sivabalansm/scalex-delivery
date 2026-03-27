# MAXX Taxonomy — Summary for RAG

> A compact overview of the taxonomy for retrieval. Full row-level taxonomy is provided separately in `MAXX_TAXONOMY_FULL.csv` for table import.

## Unique Service Domains (Level 1)

- Administrative
- Facilities & Operations
- Finance & Accounting
- Healthcare
- HR Services
- Insurance
- IT Operations
- Legal & Compliance
- Logistics & Supply Chain
- Manufacturing
- Marketing & Creative
- Professional Services
- Support Services
- Technology
- UNKNOWN

## Unique Service Categories (Level 2) by Domain

### Administrative

- General Admin

### Facilities & Operations

- Catering Services
- Cleaning Services
- Maintenance Services
- Property Management
- Reception Services
- Security Services

### Finance & Accounting

- Accounts Payable
- Accounts Receivable
- Audit Support
- Financial Planning
- General Ledger
- Tax Services

### Healthcare

- Care Management
- Claims Processing
- Clinical Documentation
- Medical Coding
- Prior Authorization
- Revenue Cycle

### HR Services

- Benefits Administration
- Employee Relations
- Learning & Development
- Payroll Processing
- Performance Management
- Recruiting

### Insurance

- Claims Processing
- Customer Service
- Fraud Investigation
- Policy Administration
- Risk Assessment
- Underwriting Support

### IT Operations

- Application Support
- Cloud Engineering
- Infrastructure Management
- Network Operations
- Security Operations
- Service Desk

### Legal & Compliance

- Contract Management
- Corporate Governance
- IP Management
- Litigation Support
- Regulatory Compliance
- Risk Management

### Logistics & Supply Chain

- Distribution
- Inventory Management
- Procurement
- Supplier Management
- Transportation
- Warehouse Operations

### Manufacturing

- Environmental Compliance
- Maintenance
- Production Planning
- Quality Control
- Safety Management
- Supply Chain

### Marketing & Creative

- Brand Management
- Campaign Management
- Content Creation
- Digital Marketing
- Market Research
- Social Media

### Professional Services

- Business Analysis
- Change Management
- Consulting - General
- Management Consulting
- Process Improvement
- Project Management
- Training Services

### Support Services

- Misc Support

### Technology

- AI/ML Services
- Data Analytics
- DevOps
- Mobile Development
- Quality Assurance
- Software Development

### UNKNOWN

- Other

## Rate Ranges by Region (median + bounds)

| Region_Key | Typical_Rate_Low_count | Typical_Rate_Low_median | Typical_Rate_High_median | Typical_Rate_Low_min | Typical_Rate_High_max |
| --- | --- | --- | --- | --- | --- |
| EMEA | 4535 | 17.99 | 49.5 | 2.7 | 592.15 |
| APAC | 3164 | 7.14 | 20.259999999999998 | 1.5 | 189.36 |
| LatAm | 2780 | 7.5 | 22.5 | 2.4 | 208.6 |
| North America | 2507 | 23.4 | 66.17 | 6.0 | 546.39 |
| Oceania | 793 | 16.2 | 48.6 | 6.0 | 270.0 |
| Unknown | 379 | 29.0 | 80.0 | 5.0 | 146.0 |

## Rate Ranges by Country (median)

| Country | Typical_Rate_Low_count | Typical_Rate_Low_median | Typical_Rate_High_median |
| --- | --- | --- | --- |
| United States | 1712 | 25.5 | 73.305 |
| India | 1486 | 6.25 | 17.5 |
| Philippines | 1281 | 7.12 | 19.95 |
| United Kingdom | 1271 | 25.86 | 72.87 |
| Mexico | 1023 | 6.0 | 18.0 |
| Brazil | 980 | 6.75 | 20.25 |
| Canada | 795 | 15.75 | 47.25 |
| Poland | 795 | 6.75 | 20.25 |
| Australia | 793 | 16.2 | 48.6 |
| France | 788 | 15.75 | 47.25 |
| Germany | 787 | 16.2 | 48.6 |
| Argentina | 777 | 7.5 | 22.5 |
| Ireland | 552 | 30.36 | 90.55 |
| Unknown | 379 | 29.0 | 80.0 |
| China | 279 | 10.22 | 30.65 |
| Netherlands | 267 | 31.36 | 93.03 |
| South Korea | 44 | 29.0 | 78.0 |
| Spain | 41 | 35.0 | 91.0 |
| Japan | 37 | 22.0 | 80.0 |
| Singapore | 37 | 23.0 | 77.0 |
| Italy | 34 | 27.5 | 92.0 |

## Lookup Key Format

- TAXONOMY_KEY appears pipe-delimited (example: `IT OPERATIONS|SERVICE DESK|L1|REMOTE`). It contains 4 segments; treat it as a stable composite key.
- Use `TAXONOMY_KEY` for deterministic lookup into the full taxonomy table (CSV/Table import).
