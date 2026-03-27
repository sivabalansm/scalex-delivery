import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Clause_ID: csv.string().describe("Unique clause identifier"),
  Tower_Code: csv.stringOptional().describe("Tower code"),
  Category_Code: csv.stringOptional().describe("Category code"),
  Clause_Type: csv.string().describe("Type of contract clause"),
  Benchmark_Low: csv.numberOptional().describe("Low benchmark value"),
  Benchmark_Median: csv.numberOptional().describe("Median benchmark value"),
  Benchmark_High: csv.numberOptional().describe("High benchmark value"),
  Unit: csv.stringOptional().describe("Unit of measurement"),
  Risk_Level: csv.stringOptional().describe("Risk level classification"),
  Source: csv.stringOptional().describe("Source of the benchmark"),
  Confidence: csv.stringOptional().describe("Confidence level"),
  Last_Updated: csv.stringOptional().describe("Date benchmark was last updated"),
  Standard_Language: csv.stringOptional().describe("Standard contract language"),
  Red_Flags: csv.stringOptional().describe("Red flag indicators"),
  Negotiation_Points: csv.stringOptional().describe("Key negotiation points"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "contractBenchmarksTable",
  columns: makeSearchable(schema),
});
