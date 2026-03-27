# MAXX Schema + Data Dictionary

> Combined reference for the MAXX Database tables, key fields, and field definitions.

## Metadata (SUMMARY)

- **Version**: v1.0
- **Packaged_On**: 2025-09-03 22:28:12
- **Source_File**: MAXX_DATABASE_20250903_221741.xlsx
- **Notes**: Official Maxx field schema; ready for template population

## Data Dictionary

## RATES

| Field | Type | Is_Essential | Description |
| --- | --- | --- | --- |
| Service_Domain | object | No |  |
| Service_Category | object | No |  |
| Process_Level | object | No |  |
| Role_Title | object | No |  |
| Common_Alt_Titles | object | No |  |
| Seniority_Level | object | No |  |
| Years_Experience_Range | object | No |  |
| Education_Typical | object | No |  |
| Certifications_Common | object | No |  |
| Location_Type | object | No |  |
| Country | object | No |  |
| State_Province | object | No |  |
| Metro_Area | object | No |  |
| Employment_Model | object | No |  |
| Min_Rate_USD | float64 | No |  |
| Market_Rate_USD | int64 | No |  |
| Max_Rate_USD | float64 | No |  |
| Rate_Unit | object | No |  |
| Benefits_Loading_% | float64 | No |  |
| Total_Comp_Multiplier | float64 | No |  |
| Currency_Local | object | No |  |
| Local_Min_Rate | float64 | No |  |
| Local_Market_Rate | float64 | No |  |
| Local_Max_Rate | float64 | No |  |
| Supply_Score_1to10 | int64 | No |  |
| Demand_Score_1to10 | int64 | No |  |
| Turnover_Risk_% | int64 | No |  |
| Career_Path_Next | object | No |  |
| Skill_Variations | object | No |  |
| Premium_Skills | object | No |  |
| Volume_Assumption | object | No |  |
| Utilization_Target_% | float64 | No |  |
| Overtime_Eligible | object | No |  |
| Source | object | No |  |
| Data_Points | float64 | No |  |
| Confidence_Level | float64 | No |  |
| Last_Updated | object | No |  |
| Lookup_Key | object | No |  |
| Alt_Lookup_Key | object | No |  |
| Notes | object | No |  |
| Years_Experience | object | No |  |
| Region | object | No |  |
| Location_Factor | float64 | No |  |
| Confidence_Score | float64 | No |  |
| Contract_Amount_Total_Contract_Value | float64 | Yes |  |
| Contract_Type | float64 | Yes |  |
| Payment_Terms | float64 | Yes |  |
| Volume_Commitment | float64 | Yes |  |
| Baseline_Contract_Value | float64 | Yes |  |
| Negotiated_Discounts_Rebates | float64 | Yes |  |
| Market_Pricing_Reference | float64 | Yes |  |
| RATE_KEY | object | No |  |

## RISKS

| Field | Type | Is_Essential | Description |
| --- | --- | --- | --- |
| Cost_ID | object | No |  |
| Cost_Category | object | No |  |
| Cost_Subcategory | object | No |  |
| Cost_Name | object | No |  |
| Cost_Description | object | No |  |
| Service_Domains_Affected | object | No |  |
| Pricing_Models_Affected | object | No |  |
| Typical_Triggers | object | No |  |
| Detection_Method | object | No |  |
| Cost_Range_Low_% | int64 | No |  |
| Cost_Range_High_% | int64 | No |  |
| Dollar_Impact_Small_Contract | object | No |  |
| Dollar_Impact_Medium_Contract | object | No |  |
| Dollar_Impact_Large_Contract | object | No |  |
| Frequency | object | No |  |
| Typical_Timing | object | No |  |
| Geographic_Variations | object | No |  |
| Industry_Variations | object | No |  |
| Avoidability_Score_1to10 | int64 | No |  |
| Impact_Severity_1to10 | int64 | No |  |
| Likelihood_1to10 | int64 | No |  |
| Real_Example | object | No |  |
| Warning_Signs | object | No |  |
| Mitigation_Strategy | object | No |  |
| Contract_Language | object | No |  |
| Insurance_Coverage | object | No |  |
| Benchmarking_Data | object | No |  |
| Regulatory_Drivers | object | No |  |
| Negotiation_Tips | object | No |  |
| Prevention_Measures | object | No |  |
| Last_Updated | object | No |  |
| Source | object | No |  |
| Confidence_Score | int64 | No |  |
| Notes | object | No |  |
| Vendor_Criticality_Rating | float64 | Yes |  |
| Single_Source_Flag | float64 | Yes |  |
| Contract_End_Date | datetime64[ns] | Yes |  |
| Auto_Renewal_Clauses | float64 | Yes |  |
| Financial_Health_Score | float64 | Yes |  |
| Compliance_Status | float64 | Yes |  |
| Cybersecurity_Rating | float64 | Yes |  |
| Geographic_Risk_Score | float64 | Yes |  |

## TAXONOMY

| Field | Type | Is_Essential | Description |
| --- | --- | --- | --- |
| Service_Domain | object | No |  |
| Service_Category | object | No |  |
| Process_Level | object | No |  |
| Delivery_Method | object | No |  |
| Specialization | object | No |  |
| Product_Area_Biz_Unit | object | No |  |
| Country | object | No |  |
| Country_Code | object | No |  |
| State_Province | object | No |  |
| Metro_Area | object | No |  |
| Timezone | object | No |  |
| Region_Key | object | No |  |
| Typical_Rate_Low | float64 | No |  |
| Typical_Rate_High | float64 | No |  |
| Rate_Unit | object | No |  |
| Location_Factor | float64 | No |  |
| Industry_Factor | float64 | No |  |
| Skill_Premium | float64 | No |  |
| Lookup_Key | object | No |  |
| Category_Key | object | No |  |
| Usage_Frequency | object | No |  |
| Display_Order | int64 | No |  |
| Last_Updated | object | No |  |
| Benchmark_Source | object | No |  |
| Notes | object | No |  |
| Confidence_Score | int64 | No |  |
| Source | object | No |  |
| SLA_Performance_Score | float64 | Yes |  |
| Quality_Rating_Defect_Rate | float64 | Yes |  |
| On_Time_Delivery_Performance | float64 | Yes |  |
| Invoice_Accuracy_Rate | float64 | Yes |  |
| Response_Time_to_Issues | float64 | Yes |  |
| Innovation_Contribution_Score | float64 | Yes |  |
| ESG_Compliance_Score | float64 | Yes |  |
| TAXONOMY_KEY | object | No |  |
| UNSPSC_Code | object | No |  |

## VENDORS

| Field | Type | Is_Essential | Description |
| --- | --- | --- | --- |
| Vendor_ID | object | No |  |
| Vendor_Name | object | No |  |
| Vendor_Category | object | No |  |
| Legal_Entity_Name | object | No |  |
| Headquarters_Country | object | No |  |
| Founded_Year | float64 | No |  |
| Annual_Revenue_USD | float64 | No |  |
| Employee_Count_Global | float64 | No |  |
| Geographic_Presence | object | No |  |
| Primary_Services | object | No |  |
| Secondary_Services | object | No |  |
| Industry_Focus | object | No |  |
| Technology_Stack | object | No |  |
| Delivery_Locations | object | No |  |
| Certifications | object | No |  |
| Quality_Rating_1to10 | float64 | No |  |
| Delivery_Rating_1to10 | float64 | No |  |
| Cost_Competitiveness_1to10 | float64 | No |  |
| Innovation_Rating_1to10 | float64 | No |  |
| Relationship_Rating_1to10 | float64 | No |  |
| Overall_Rating_1to10 | float64 | No |  |
| Client_References_Available | object | No |  |
| Key_Strengths | object | No |  |
| Key_Weaknesses | object | No |  |
| Risk_Factors | object | No |  |
| Financial_Health | object | No |  |
| Insurance_Coverage | object | No |  |
| Contract_Terms_Typical | object | No |  |
| Pricing_Model_Preferred | object | No |  |
| Rate_Card_Available | object | No |  |
| Volume_Discounts | object | No |  |
| Payment_Terms | object | Yes |  |
| SLA_Standards | object | No |  |
| Penalty_Structure | object | No |  |
| Termination_Notice | object | No |  |
| IP_Ownership | object | No |  |
| Data_Security_Level | object | No |  |
| Compliance_Standards | object | No |  |
| Audit_Rights | object | No |  |
| Negotiation_Tips | object | No |  |
| Best_Use_Cases | object | No |  |
| Avoid_If | object | No |  |
| Recent_News | object | No |  |
| Market_Position | object | No |  |
| Competitive_Differentiators | object | No |  |
| Client_Retention_Rate_% | float64 | No |  |
| Average_Project_Size_USD | float64 | No |  |
| Typical_Ramp_Time_Weeks | float64 | No |  |
| Last_Updated | object | No |  |
| Source | object | No |  |
| Confidence_Score | float64 | No |  |
| Notes | object | No |  |
| Employee_Count | float64 | No |  |
| Specialization | object | No |  |
| Vendor | object | No |  |
| Service_Domain | object | No |  |
| Service_Subtype | object | No |  |
| Vertical_Focus | object | No |  |
| Specialization_Score | float64 | No |  |
| Years_Experience | float64 | No |  |
| Contracts_Fulfilled | float64 | No |  |
| Avg_CSAT_% | float64 | No |  |
| Reference_Rate_USD_per_FTE | float64 | No |  |
| Revenue_2024_Million_USD | float64 | No |  |
| Growth_Rate_Percent | float64 | No |  |
| Financial_Health_Score_1to5 | float64 | No |  |
| Service_Specializations | object | No |  |
| Tier_Classification | object | No |  |
| Geographic_Presence_Countries | float64 | No |  |
| Employee_Count_Thousands | float64 | No |  |
| Recent_MA_Activity_Count | float64 | No |  |
| Client_Concentration_Risk_1to5 | float64 | No |  |
| Innovation_Investment_Percent_Revenue | float64 | No |  |
| Gartner_Rating_1to5 | float64 | No |  |
| Everest_Rating_1to5 | float64 | No |  |
| HFS_Rating_1to5 | float64 | No |  |
| Market_Share_Percent | float64 | No |  |
| Delivery_Centers_Count | float64 | No |  |
| Major_Certifications_Count | float64 | No |  |
| Digital_Maturity_Score_1to5 | float64 | No |  |
| Automation_Capability_Score_1to5 | float64 | No |  |
| Security_Rating_1to5 | float64 | No |  |
| Contract_Compliance_Rate | float64 | Yes |  |
| Total_Cost_of_Ownership_per_Unit | float64 | Yes |  |
| On_Time_Delivery_Performance_Rate | float64 | Yes |  |
| Quality_Score_Defect_Rate | float64 | Yes |  |
| Customer_Satisfaction_Index | float64 | Yes |  |
| Vendor_Responsiveness_Time | float64 | Yes |  |
| Financial_Health_Score | float64 | Yes |  |
| Innovation_Contribution_Index | float64 | Yes |  |
| VENDOR_KEY | object | No |  |

## WORKFLOWS

| Field | Type | Is_Essential | Description |
| --- | --- | --- | --- |
| Workflow_ID | object | No |  |
| Service_Domain | object | No |  |
| Service_Category | object | No |  |
| Process_Level | object | No |  |
| Delivery_Method | object | No |  |
| Country | object | No |  |
| Region_Key | object | No |  |
| Workflow_Type | object | No |  |
| Typical_Role_L0_Title | object | No |  |
| L0_FTE_Range | datetime64[ns] | No |  |
| L0_Rate_Range_USD | object | No |  |
| L0_Locations | object | No |  |
| Typical_Role_L1_Title | object | No |  |
| L1_FTE_Range | datetime64[ns] | No |  |
| L1_Rate_Range_USD | object | No |  |
| L1_Locations | object | No |  |
| Typical_Role_L2_Title | object | No |  |
| L2_FTE_Range | datetime64[ns] | No |  |
| L2_Rate_Range_USD | object | No |  |
| L2_Locations | object | No |  |
| Typical_Role_L3_Title | object | No |  |
| L3_FTE_Range | datetime64[ns] | No |  |
| L3_Rate_Range_USD | object | No |  |
| L3_Locations | object | No |  |
| Typical_Role_L4_Title | object | No |  |
| L4_FTE_Range | object | No |  |
| L4_Rate_Range_USD | object | No |  |
| L4_Locations | object | No |  |
| Team_Structure_Ratio | object | No |  |
| Minimum_Team_Size | int64 | No |  |
| Optimal_Team_Size | int64 | No |  |
| Internal_Dependencies | object | No |  |
| Handoff_Risks | object | No |  |
| Insourcing_Triggers | object | No |  |
| Outsourcing_Readiness_Score_1to10 | int64 | No |  |
| Knowledge_Transfer_Months | int64 | No |  |
| Process_Maturity_Level | object | No |  |
| Automation_Potential | object | No |  |
| Regulatory_Complexity | object | No |  |
| Client_Interaction_Level | object | No |  |
| SLA_Requirements | object | No |  |
| Volume_Characteristics | object | No |  |
| Peak_Volume_Multiplier | object | No |  |
| Seasonal_Variations | object | No |  |
| Cost_Per_Transaction | float64 | No |  |
| Efficiency_Gain_Potential | object | No |  |
| Break_Even_Volume | object | No |  |
| Required_Tools | object | No |  |
| Integration_Complexity | object | No |  |
| Security_Requirements | object | No |  |
| Last_Updated | object | No |  |
| Source | object | No |  |
| Confidence_Score | int64 | No |  |
| Lookup_Key | object | No |  |
| Notes | object | No |  |
| Vendor_ID | float64 | No |  |
| Vendor_Name | float64 | No |  |
| Contract_Amount_Total_Contract_Value | float64 | Yes |  |
| Contract_Start_Date | datetime64[ns] | No |  |
| Contract_End_Date | datetime64[ns] | Yes |  |
| Vendor_Criticality_Rating | float64 | Yes |  |
| Contract_Type | float64 | Yes |  |
| Payment_Terms | float64 | Yes |  |
| SLA_Performance_Score | float64 | Yes |  |
| Quality_Rating_Defect_Rate | float64 | Yes |  |
| On_Time_Delivery_Performance | float64 | Yes |  |
| Customer_Satisfaction_Index | float64 | Yes |  |
| Financial_Health_Score | float64 | Yes |  |
| Compliance_Status | float64 | Yes |  |
| Single_Source_Flag | float64 | Yes |  |
| Volume_Commitment | float64 | Yes |  |
| Negotiated_Discounts_Rebates | float64 | Yes |  |
| Invoice_Accuracy_Rate | float64 | Yes |  |
| Response_Time_to_Issues | float64 | Yes |  |
| Innovation_Contribution_Score | float64 | Yes |  |
| ESG_Compliance_Score | float64 | Yes |  |
| Cybersecurity_Rating | float64 | Yes |  |
| Geographic_Risk_Score | float64 | Yes |  |
| Contract_Compliance_Rate | float64 | Yes |  |
| Total_Cost_of_Ownership_per_Unit | float64 | Yes |  |
| Vendor_Responsiveness_Time | float64 | Yes |  |
| Baseline_Contract_Value | float64 | Yes |  |
| Market_Pricing_Reference | float64 | Yes |  |
| Auto_Renewal_Clauses | float64 | Yes |  |

## Template Field Map

| Maxx_Field | Template_Field |
| --- | --- |
| Auto_Renewal_Clauses | Auto_Renewal |
| Contract_Amount_Total_Contract_Value | Contract_Value_USD |
| Contract_End_Date | Contract_End_Date |
| Contract_Type | Contract_Type |
| Cybersecurity_Rating | Cybersecurity |
| ESG_Compliance_Score | ESG_Score |
| Invoice_Accuracy_Rate | Invoice_Accuracy |
| Payment_Terms | Payment_Terms |
| Process_Level | Process_Level |
| Quality_Rating_Defect_Rate | Quality_Score |
| SLA_Performance_Score | SLA_Score |
| Service_Category | Service_Category |
| Service_Domain | Service_Domain |
| Single_Source_Flag | Single_Source |
| UNSPSC_Code | UNSPSC_Code |
| VENDOR_KEY | Vendor_Key |
| Vendor_Criticality_Rating | Vendor_Criticality |
| Vendor_Name | Vendor |
