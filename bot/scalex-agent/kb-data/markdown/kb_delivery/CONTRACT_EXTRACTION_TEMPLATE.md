# Contract Data Extraction Template & Rules for Nielsen Assessment

## 🎯 EXTRACTION PHILOSOPHY
**Extract EVERYTHING Commercial - It's Our Only Source**
- Rate data is GOLD - we need it for benchmarking and negotiations
- Commercial terms drive savings opportunities
- Even granular pricing (like Optum RX drugs) can reveal patterns
- Better to over-extract than miss critical pricing intelligence

## 📋 MASTER EXTRACTION TEMPLATE (EXCEL FORMAT)

### Sheet 1: Contract Master Registry
Core contract identification and terms (1 row per contract):

| Field_Name | Data_Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| VENDOR_KEY | TEXT | YES | Standardized vendor name | OPTUM_RX |
| Contract_ID | TEXT | YES | Unique identifier | RX-2024-001 |
| Vendor_Legal_Name | TEXT | YES | Exact legal entity | OptumRx Inc. |
| Vendor_DBA | TEXT | NO | Doing business as | OptumRx |
| Contract_Type | TEXT | YES | MSA/SOW/Amendment/PO/Rate Card | MSA |
| Effective_Date | DATE | YES | Contract start | 01/01/2024 |
| Expiration_Date | DATE | YES | Contract end | 12/31/2026 |
| Total_Contract_Value | CURRENCY | NO | Stated or estimated | $45,000,000 |
| Annual_Contract_Value | CURRENCY | NO | ACV if available | $15,000,000 |
| Payment_Terms | TEXT | YES | Net 30/45/60 | Net 45 |
| Payment_Method | TEXT | NO | ACH/Wire/Check | ACH |
| Auto_Renewal | BOOLEAN | YES | Yes/No/Not Stated | Yes |
| Renewal_Notice_Days | NUMBER | NO | Days notice required | 90 |
| Termination_Notice_Days | NUMBER | NO | Days for termination | 90 |
| Termination_for_Convenience | BOOLEAN | NO | Yes/No/Not Stated | Yes |
| Termination_Penalties | TEXT | NO | Description of penalties | 25% of remaining |
| Price_Increase_Cap | PERCENTAGE | NO | Annual increase limit | 3% |
| Volume_Discount_Available | BOOLEAN | NO | Yes/No | Yes |
| Volume_Discount_Tiers | TEXT | NO | Summary of tiers | 10%@$1M, 15%@$5M |
| Rebate_Structure | TEXT | NO | Rebate terms | 2% quarterly |
| SLA_Defined | BOOLEAN | YES | Yes/No | Yes |
| SLA_Credit_Structure | TEXT | NO | Credit/penalty structure | 5% credit <95% |
| Insurance_Required | CURRENCY | NO | Insurance limits | $5M general |
| Liability_Cap | TEXT | NO | Liability limitations | 12 months fees |
| Data_Security_Required | BOOLEAN | NO | Yes/No | Yes |
| Audit_Rights | BOOLEAN | NO | Yes/No | Yes |
| Geographic_Scope | TEXT | NO | Global/Regional/Local | National |
| Exclusivity_Terms | TEXT | NO | Any exclusivity | Non-exclusive |
| Most_Favored_Nation | BOOLEAN | NO | MFN clause present | No |
| Benchmarking_Allowed | BOOLEAN | NO | Yes/No | Yes |
| Extraction_Date | DATE | YES | When extracted | 01/04/2025 |
| Extraction_Confidence | TEXT | YES | HIGH/MEDIUM/LOW | HIGH |
| Pages_Processed | NUMBER | YES | Total pages reviewed | 300 |
| Has_Rate_Details | BOOLEAN | YES | Rate cards present | Yes |
| Rate_Detail_Location | TEXT | NO | Where rates are | Appendix A, p50-290 |

### Sheet 2: Rate Card Details
Detailed pricing information (multiple rows per contract):

| Field_Name | Data_Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| Contract_ID | TEXT | YES | Links to master | RX-2024-001 |
| VENDOR_KEY | TEXT | YES | Links to master | OPTUM_RX |
| Service_Category | TEXT | YES | Type of service/product | Generic Drugs |
| Service_SubCategory | TEXT | NO | More specific category | Tier 1 Generics |
| Item_Code | TEXT | NO | SKU/Product code | RX-GEN-001 |
| Item_Description | TEXT | YES | What is being priced | Metformin 500mg |
| Unit_of_Measure | TEXT | YES | Each/Hour/Month/User | 30-day supply |
| List_Price | CURRENCY | NO | Published price | $45.00 |
| Negotiated_Price | CURRENCY | YES | Our price | $12.50 |
| Discount_Percentage | PERCENTAGE | NO | Discount from list | 72.2% |
| Volume_Tier | TEXT | NO | Volume tier if tiered | Tier 1 (0-1000) |
| Minimum_Commitment | NUMBER | NO | Minimum volume | 100 |
| Maximum_Quantity | NUMBER | NO | Maximum at this price | 1000 |
| Price_Valid_From | DATE | NO | Price start date | 01/01/2024 |
| Price_Valid_To | DATE | NO | Price end date | 12/31/2024 |
| Geographic_Restriction | TEXT | NO | Geographic limits | US Only |
| Escalation_Terms | TEXT | NO | How price changes | CPI + 2% |
| Additional_Fees | TEXT | NO | Other charges | $2.50 dispensing |
| Notes | TEXT | NO | Other pricing notes | Requires formulary |

### Sheet 3: SLA & Performance Metrics
Service level commitments (multiple rows per contract):

| Field_Name | Data_Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| Contract_ID | TEXT | YES | Links to master | RX-2024-001 |
| VENDOR_KEY | TEXT | YES | Links to master | OPTUM_RX |
| Metric_Name | TEXT | YES | What's measured | Fill Accuracy |
| Metric_Target | TEXT | YES | Target level | 99.5% |
| Metric_Threshold | TEXT | NO | Minimum acceptable | 98% |
| Measurement_Frequency | TEXT | NO | How often measured | Monthly |
| Credit_Penalty_Amount | TEXT | NO | Financial impact | 2% credit |
| Escalation_Process | TEXT | NO | How issues escalate | VP level at <95% |
| Reporting_Required | BOOLEAN | NO | Yes/No | Yes |
| Current_Performance | TEXT | NO | If stated in contract | 99.7% YTD |

### Sheet 4: Special Terms & Conditions
Unique or complex terms (multiple rows per contract):

| Field_Name | Data_Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| Contract_ID | TEXT | YES | Links to master | RX-2024-001 |
| VENDOR_KEY | TEXT | YES | Links to master | OPTUM_RX |
| Term_Category | TEXT | YES | Type of term | Volume Commitment |
| Term_Description | TEXT | YES | Full description | Must purchase 80% of generics |
| Financial_Impact | CURRENCY | NO | Estimated impact | $500K penalty |
| Risk_Level | TEXT | NO | HIGH/MEDIUM/LOW | MEDIUM |
| Mitigation_Options | TEXT | NO | How to manage | Quarterly reviews |

## 📐 EXTRACTION STRATEGY BY CONTRACT TYPE

### Type A: Complex Service Contracts (Optum RX Example)
```python
extraction_strategy = {
    "pages_1_20": "Extract all terms, parties, dates, high-level commercials",
    "rate_sections": "Create separate row for EACH rate tier/category",
    "appendices": "Extract ALL rate cards into Sheet 2",
    "approach": "Systematic page-by-page for rates"
}

# For Optum RX specifically:
# - Sheet 1: 1 master row with contract terms
# - Sheet 2: Could be 1000+ rows (one per drug/tier combination)
# - This is GOOD - we want this detail for analysis
```

### Type B: Professional Services (Deloitte, PwC)
```python
extraction_strategy = {
    "master_agreement": "Extract all commercial terms",
    "rate_cards": "Extract each role/level as separate row",
    "sow_attachments": "Link to master via Contract_ID",
    "approach": "Hierarchical - MSA first, then SOWs"
}
```

### Type C: Software/Technology (Microsoft, Oracle)
```python
extraction_strategy = {
    "licensing_terms": "Extract per-user/per-device pricing",
    "product_bundles": "Each bundle as separate rate row",
    "true_up_terms": "Special terms sheet",
    "approach": "Focus on scalability and tier breaks"
}
```

## 💻 EXTRACTION SCRIPT FRAMEWORK

```python
def extract_comprehensive_contract_data(file_path, contract_type):
    """
    Extract ALL commercial data from contracts
    Build multiple related tables for complete analysis
    """
    
    # Initialize output structures
    master_record = {}  # Sheet 1: One row
    rate_records = []   # Sheet 2: Many rows
    sla_records = []    # Sheet 3: Many rows
    terms_records = []  # Sheet 4: Many rows
    
    # Read ENTIRE document (yes, all 300 pages if needed)
    full_content = read_full_document(file_path)
    
    # Extract hierarchically
    master_record = extract_master_terms(full_content)
    
    # Deep dive into rates (this is where the value is)
    if "rate" in full_content.lower() or "price" in full_content.lower():
        rate_records = extract_all_rates(full_content, aggressive=True)
    
    # For Optum RX type contracts
    if "formulary" in full_content.lower():
        drug_rates = extract_formulary_details(full_content)
        rate_records.extend(drug_rates)  # Yes, we want all 5000 drugs
    
    # SLAs and performance
    if "service level" in full_content.lower():
        sla_records = extract_sla_metrics(full_content)
    
    # Special terms
    special_terms = extract_special_conditions(full_content)
    
    return {
        'master': master_record,
        'rates': rate_records,
        'slas': sla_records,
        'terms': terms_records
    }

def extract_all_rates(content, aggressive=True):
    """
    Extract EVERY rate/price found in the document
    """
    rate_records = []
    
    # Pattern matching for rates
    rate_patterns = [
        r'(\$[\d,]+\.?\d*)\s+per\s+(\w+)',  # $X per Y
        r'(\d+%)\s+discount',                 # X% discount
        r'tier\s+(\d+).*?(\$[\d,]+)',        # Tier pricing
        r'(\w+):\s*(\$[\d,]+)',              # Item: $Price
    ]
    
    # Extract aggressively if flagged
    if aggressive:
        # Process tables, lists, appendices
        tables = extract_all_tables(content)
        for table in tables:
            rate_records.extend(parse_rate_table(table))
    
    return rate_records
```

## 📊 FINAL OUTPUT STRUCTURE

### What You'll Have After Extraction:
```
Nielsen_Contract_Master.xlsx
├── Sheet1: Contract_Registry (41 rows)
├── Sheet2: Rate_Details (2,000-10,000 rows depending on contracts)
├── Sheet3: SLA_Metrics (200-500 rows)
└── Sheet4: Special_Terms (100-300 rows)
```

### How This Feeds Into Templates:
1. **Template 1 (Workflows)**: Uses Contract_Registry for enrichment
2. **Template 2 (Enrichment)**: JOINs on VENDOR_KEY to pull rates
3. **Template 3 (Forecast)**: Uses Rate_Details for accurate projections
4. **Template 4 (Insights)**: Analyzes rate variations and savings opportunities

## 🎯 SPECIFIC INSTRUCTIONS FOR CURSOR

```
"For contract extraction, use this comprehensive approach:

1. Create Nielsen_Contract_Master.xlsx with 4 sheets
2. Read ENTIRE contract (yes, all 300 pages of Optum RX)
3. Extract EVERY rate, price, and commercial term found
4. Create separate rows for each:
   - Drug price (Optum RX)
   - Consultant rate (Deloitte)
   - Software SKU (Microsoft)
   - Service tier (any vendor)

5. For the Optum RX contract specifically:
   - Sheet 1: 1 master row with contract terms
   - Sheet 2: Extract ALL formulary drugs as individual rows
   - Even if it's 5,000 rows - we need this for benchmarking

6. Link everything with Contract_ID and VENDOR_KEY

7. Time expectation: 
   - Simple contracts: 10-15 minutes
   - Complex contracts (Optum): 45-60 minutes
   - Total for 41 contracts: 8-10 hours

8. Output both:
   - Excel file with 4 sheets
   - CSV exports of each sheet for processing

This detailed extraction is worth the time - it's our ONLY source of commercial intelligence."
```

## ✅ VALIDATION CHECKLIST

After extraction, verify:
- [ ] Every contract has a master row in Sheet 1
- [ ] Contracts with rate cards have entries in Sheet 2
- [ ] Total rows in Sheet 2 > 1,000 (shows detailed extraction)
- [ ] Optum RX alone has 500+ rate entries
- [ ] All VENDOR_KEYs are standardized (UPPER_CASE)
- [ ] All Contract_IDs are unique
- [ ] Every rate record links to a master contract

## 🎯 Why This Approach Works

1. **Complete Intelligence**: We capture ALL commercial data for future analysis
2. **Structured for Analysis**: Related tables allow complex queries
3. **Benchmarking Ready**: Detailed rates enable true market comparison
4. **Savings Identification**: Rate variations reveal negotiation opportunities
5. **Audit Trail**: Complete extraction provides documentation

The extra extraction time (8-10 hours) is worth it because this data becomes the foundation for identifying millions in savings opportunities!