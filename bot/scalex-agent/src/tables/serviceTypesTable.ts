import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Service_Type_ID: csv.string().describe("Unique service type identifier"),
  Category_Code: csv.string().describe("Category code"),
  Service_Type_Name: csv.string().describe("Name of the service type"),
  Description: csv.string().describe("Detailed description of the service"),
  Delivery_Channel: csv.string().describe("Channel for service delivery (e.g., Voice)"),
  Primary_Pricing_Model: csv.string().describe("Primary pricing model (e.g., PPU)"),
  Benchmark_Unit: csv.string().describe("Unit for benchmarking"),
  Frontline_Agent_Type: csv.stringOptional().describe("Type of frontline agent required"),
  Tier_Structure: csv.stringWithDefault("N/A").describe("Tier structure information"),
  Default_AHT_Minutes: csv.numberOptional().describe("Default average handle time in minutes"),
  SLA_Timeliness_Type: csv.stringOptional().describe("(Deprecated v2) Type of timeliness SLA - see slaTable"),
  SLA_Timeliness_Default: csv.stringOptional().describe("(Deprecated v2) Default timeliness SLA value - see slaTable"),
  SLA_Quality_Type: csv.stringOptional().describe("(Deprecated v2) Type of quality SLA - see slaTable"),
  SLA_Quality_Default: csv.stringOptional().describe("(Deprecated v2) Default quality SLA value - see slaTable"),
  Required_Modifiers: csv.stringOptional().describe("Required modifiers"),
  Optional_Modifiers: csv.stringOptional().describe("Optional modifiers"),
  Typical_Vendors: csv.stringWithDefault("N/A").describe("Comma-separated list of typical vendors"),
  Confidence: csv.string().describe("Confidence level"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "serviceTypesTable",
  columns: makeSearchable(schema),
});
