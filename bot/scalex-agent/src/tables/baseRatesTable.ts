import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Rate_ID: csv.string().describe("Unique rate identifier"),
  Tower_Code: csv.string().describe("Tower code"),
  Agent_Type: csv.stringOptional().describe("Type of agent (e.g., Customer_Service_Agent)"),
  Tier: csv.string().describe("Service tier (e.g., T1, T2)"),
  Location_Code: csv.string().describe("Location code"),
  Rate_Low_USD: csv.number().describe("Low end of rate range in USD"),
  Rate_High_USD: csv.number().describe("High end of rate range in USD"),
  Rate_Median_USD: csv.number().describe("Median rate in USD"),
  Currency_Local: csv.string().describe("Local currency code"),
  Rate_Low_Local: csv.number().describe("Low rate in local currency"),
  Rate_High_Local: csv.number().describe("High rate in local currency"),
  Rate_Unit: csv.string().describe("Unit of rate (e.g., Per_Hour)"),
  Pricing_Model: csv.string().describe("Pricing model (e.g., T&M)"),
  Effective_Date: csv.string().describe("Date when rate becomes effective"),
  Source: csv.string().describe("Source of rate information"),
  Confidence: csv.string().describe("Confidence level (HIGH, MEDIUM, LOW)"),
  Last_Updated: csv.string().describe("Last update date"),
  Frontline_Agent_Type: csv.stringOptional().describe("Type of frontline agent (v3)"),
  Rate_Per_Unit_Low_USD: csv.numberOptional().describe("Low per-unit rate in USD"),
  Rate_Per_Unit_High_USD: csv.numberOptional().describe("High per-unit rate in USD"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "baseRatesTable",
  columns: makeSearchable(schema),
});
