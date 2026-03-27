import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Location_Code: csv.string().describe("Unique location code"),
  Country: csv.string().describe("Country name"),
  City: csv.string().describe("City name"),
  Region: csv.stringOptional().describe("Region within country"),
  Currency_Code: csv.string().describe("Currency code (e.g., USD, INR)"),
  USD_FX_Rate: csv.number().describe("Foreign exchange rate to USD"),
  Date_of_FX: csv.stringOptional().describe("FX snapshot date"),
  Cost_Index: csv.number().describe("Cost index relative to baseline"),
  US_Reference_Index: csv.numberOptional().describe("US reference cost index"),
  Timezone: csv.stringWithDefault("N/A").describe("Timezone identifier"),
  Labor_Market_Tier: csv.stringOptional().describe("Labor market tier (1-4)"),
  Notes: csv.stringOptional().describe("Additional notes about the location"),
  BPO_Market_Maturity: csv.numberOptional().describe("BPO market maturity score"),
  ITO_Market_Maturity: csv.stringOptional().describe("ITO/tech talent market maturity"),
  Benefit_Burden_Pct: csv.numberOptional().describe("Benefit burden percentage"),
  Index_Source: csv.stringOptional().describe("Source of the cost index"),
  Index_Confidence: csv.stringOptional().describe("Confidence level of the index"),
  Last_Calibrated: csv.stringOptional().describe("Date index was last calibrated"),
  High_Inflation_Flag: csv.booleanOptional().describe("Flag for high inflation locations"),
  Change_Notes: csv.stringOptional().describe("Notes on location changes"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "locationsTable",
  columns: makeSearchable(schema),
});
