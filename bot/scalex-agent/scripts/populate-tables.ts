/**
 * Script to populate ADK tables from CSV files in kb-data/data/
 *
 * Usage: bun run scripts/populate-tables.ts
 */

import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { join } from 'path';

// Import tables - adjust paths based on your generated types
// You'll need to run `adk dev` or `adk build` first to generate types
// import { towersTable, categoriesTable, etc } from '@botpress/runtime';

const KB_DATA_DIR = join(process.cwd(), 'kb-data', 'data');

interface CSVMapping {
  csvFile: string;
  tableName: string;
  transformRow?: (row: any) => any;
}

const csvMappings: CSVMapping[] = [
  {
    csvFile: 'TBL-001_TOWERS_v4.csv',
    tableName: 'towersTable',
    transformRow: (row) => ({
      Tower_Code: row.Tower_Code,
      Tower_Name: row.Tower_Name,
      Description: row.Description,
      Status: row.Status,
      Service_Type_Count: row.Service_Type_Count,
      Vendor_Count: row.Vendor_Count,
    }),
  },
  {
    csvFile: 'TBL-002_CATEGORIES_COMPLETE.csv',
    tableName: 'categoriesTable',
    transformRow: (row) => ({
      Category_Code: row.Category_Code,
      Tower_Code: row.Tower_Code,
      Category_Name: row.Category_Name,
      Description: row.Description,
    }),
  },
  {
    csvFile: 'TBL-003_BaseRates_v5_FINAL.csv',
    tableName: 'baseRatesTable',
    transformRow: (row) => ({
      Rate_ID: row.Rate_ID,
      Tower_Code: row.Tower_Code,
      Agent_Type: row.Agent_Type,
      Tier: row.Tier,
      Location_Code: row.Location_Code,
      Rate_Low_USD: row.Rate_Low_USD,
      Rate_High_USD: row.Rate_High_USD,
      Rate_Median_USD: row.Rate_Median_USD,
      Currency_Local: row.Currency_Local,
      Rate_Low_Local: row.Rate_Low_Local,
      Rate_High_Local: row.Rate_High_Local,
      Rate_Unit: row.Rate_Unit,
      Pricing_Model: row.Pricing_Model,
      Effective_Date: row.Effective_Date,
      Source: row.Source,
      Confidence: row.Confidence,
      Last_Updated: row.Last_Updated,
    }),
  },
  {
    csvFile: 'TBL-005_SERVICE_TYPES.csv',
    tableName: 'serviceTypesTable',
    transformRow: (row) => ({
      Service_Type_ID: row.Service_Type_ID,
      SubCategory_Code: row.SubCategory_Code,
      Service_Type_Name: row.Service_Type_Name,
      Description: row.Description,
      Delivery_Channel: row.Delivery_Channel,
      Primary_Pricing_Model: row.Primary_Pricing_Model,
      Benchmark_Unit: row.Benchmark_Unit,
      Frontline_Agent_Type: row.Frontline_Agent_Type,
      Tier_Structure: row.Tier_Structure,
      Default_AHT_Minutes: row.Default_AHT_Minutes,
      SLA_Timeliness_Type: row.SLA_Timeliness_Type,
      SLA_Timeliness_Default: row.SLA_Timeliness_Default,
      SLA_Quality_Type: row.SLA_Quality_Type,
      SLA_Quality_Default: row.SLA_Quality_Default,
      Required_Modifiers: row.Required_Modifiers,
      Optional_Modifiers: row.Optional_Modifiers,
      Typical_Vendors: row.Typical_Vendors,
      Confidence: row.Confidence,
    }),
  },
  {
    csvFile: 'TBL-006_LOCATIONS_v4.csv',
    tableName: 'locationsTable',
    transformRow: (row) => ({
      Location_Code: row.Location_Code,
      Country: row.Country,
      City: row.City,
      Region: row.Region,
      Currency_Code: row.Currency_Code,
      USD_FX_Rate: row.USD_FX_Rate,
      Cost_Index: row.Cost_Index,
      Timezone: row.Timezone,
      Labor_Market_Tier: row.Labor_Market_Tier,
      Notes: row.Notes,
      CL_Strength_Rating: row.CL_Strength_Rating,
    }),
  },
  {
    csvFile: 'TBL-009_SERVICE_VENDOR_MAP_v4.csv',
    tableName: 'serviceVendorMapTable',
    transformRow: (row) => ({
      Service_Type_ID: row.Service_Type_ID,
      Vendor_ID: row.Vendor_ID,
      Vendor_Name: row.Vendor_Name,
      Analyst_Ranking: row.Analyst_Ranking || undefined,
      Analyst_Source: row.Analyst_Source || undefined,
      Ranking_Tier: row.Ranking_Tier || undefined,
      Vendor_Type: row.Vendor_Type,
      Founded_Year: row.Founded_Year ? parseInt(row.Founded_Year) : undefined,
      Confidence: row.Confidence,
      As_Of_Date: row.As_Of_Date,
      Source_Type: row.Source_Type,
      Notes: row.Notes || undefined,
    }),
  },
  {
    csvFile: 'TBL-010_VENDOR_LOCATIONS_VALIDATED.csv',
    tableName: 'vendorLocationsTable',
    transformRow: (row) => ({
      VendorLocation_ID: row.VendorLocation_ID,
      Vendor_ID: row.Vendor_ID,
      Vendor_Name: row.Vendor_Name,
      Location_Code: row.Location_Code,
      City: row.City,
      Country: row.Country,
      Site_Type: row.Site_Type,
      Headcount_Range: row.Headcount_Range,
      Services_Offered: row.Services_Offered,
      Source: row.Source,
      Last_Verified: row.Last_Verified,
    }),
  },
  {
    csvFile: 'TBL-011_MODIFIERS.csv',
    tableName: 'modifiersTable',
    transformRow: (row) => ({
      Modifier_Code: row.Modifier_Code,
      Modifier_Name: row.Modifier_Name,
      Question_Text: row.Question_Text,
      Value_Type: row.Value_Type,
      Common_Values: row.Common_Values,
      Triggers_For: row.Triggers_For,
      Priority: parseInt(row.Priority) || 0,
      Required_By_Default: row.Required_By_Default === 'True' || row.Required_By_Default === 'true',
    }),
  },
  {
    csvFile: 'SERVICE_NAME_ALIASES_v3.csv',
    tableName: 'serviceNameAliasesTable',
    transformRow: (row) => ({
      Alias_ID: row.Alias_ID,
      User_Term: row.User_Term,
      Service_Type_ID: row.Service_Type_ID,
      Service_Type_Name: row.Service_Type_Name,
      Confidence: row.Confidence,
    }),
  },
  {
    csvFile: 'VENDORID_MAPPING.csv',
    tableName: 'vendorIdMappingTable',
    transformRow: (row) => ({
      Vendor_Name: row.Vendor_Name,
      Vendor_ID: row.Vendor_ID,
      Search_Key: row.Search_Key,
    }),
  },
  {
    csvFile: 'VENDORS_BOTPRESS_FINAL_v4.csv',
    tableName: 'vendorsTable',
    transformRow: (row) => ({
      vendorId: row.vendorId,
      vendorName: row.vendorName,
      primaryTower: row.primaryTower,
      secondaryTowers: row.secondaryTowers,
      hqCountry: row.hqCountry,
      ownership: row.ownership,
      revenueUsd: row.revenueUsd,
      employeeCount: row.employeeCount,
      deliveryCenterCount: row.deliveryCenterCount,
      deliveryLocations: row.deliveryLocations,
      certifications: row.certifications,
      keyClients: row.keyClients,
      serviceCapabilities: row.serviceCapabilities,
      competitivePosition: row.competitivePosition,
      strengths: row.strengths,
      weaknesses: row.weaknesses,
      redFlags: row.redFlags,
      pricingModel: row.pricingModel,
      financialHealthScore: row.financialHealthScore,
      batch: row.batch,
    }),
  },
];

function parseCSV(filePath: string): any[] {
  const fileContent = readFileSync(filePath, 'utf-8');
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

async function populateTable(mapping: CSVMapping) {
  console.log(`Processing ${mapping.csvFile}...`);

  const csvPath = join(KB_DATA_DIR, mapping.csvFile);
  const rows = parseCSV(csvPath);

  console.log(`  Found ${rows.length} rows`);

  if (mapping.transformRow) {
    const transformedRows = rows.map(mapping.transformRow);
    console.log(`  Transformed ${transformedRows.length} rows`);

    // Here you would insert into your table
    // Example (uncomment and adjust after running `adk dev`):
    // await towersTable.createRows({ rows: transformedRows });

    console.log(`  ✓ Ready to insert into ${mapping.tableName}`);
  }
}

async function main() {
  console.log('Starting table population...\n');

  for (const mapping of csvMappings) {
    try {
      await populateTable(mapping);
    } catch (error) {
      console.error(`  ✗ Error processing ${mapping.csvFile}:`, error);
    }
    console.log('');
  }

  console.log('Done! Uncomment the table insert calls in the script to actually populate the tables.');
}

main().catch(console.error);
