import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Rate_ID: csv.string().describe("Rate ID linking to baseRatesTable"),
  Rate_Per_Unit_Median_USD: csv.numberOptional().describe("Median per-unit rate in USD"),
  Resource_Unit_Type: csv.stringOptional().describe("Type of resource unit"),
  AHT_Minutes_Used: csv.stringOptional().describe("Average handle time minutes used"),
  Confidence_Score: csv.numberOptional().describe("Numeric confidence score"),
  Source_Type: csv.stringOptional().describe("Type of rate source"),
  Methodology_Version: csv.numberOptional().describe("Methodology version number"),
  Change_Notes: csv.stringOptional().describe("Notes on rate changes"),
  Rate_Type: csv.stringOptional().describe("Type of rate"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "baseRatesExtTable",
  columns: makeSearchable(schema),
});
