import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Treatment_ID: csv.string().describe("Unique treatment identifier"),
  Finding_Type: csv.string().describe("Type of finding"),
  Recommended_Product: csv.string().describe("Recommended product or service"),
  Treatment_Level: csv.string().describe("Level of treatment"),
  Savings_Rate_Low_Pct: csv.numberOptional().describe("Low savings rate percentage"),
  Savings_Rate_High_Pct: csv.numberOptional().describe("High savings rate percentage"),
  Implementation_Timeline: csv.stringOptional().describe("Timeline for implementation"),
  Prerequisites: csv.stringOptional().describe("Prerequisites for treatment"),
  Applicable_Towers: csv.string().describe("Tower codes this treatment applies to"),
  Priority_Level: csv.string().describe("Priority level of the treatment"),
  Description: csv.string().describe("Description of the treatment recommendation"),
  Condition_Metric: csv.stringOptional().describe("Condition metric for applicability"),
  Condition_Operator: csv.stringOptional().describe("Condition comparison operator"),
  Condition_Value: csv.stringOptional().describe("Condition value"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "treatmentRecommendationsTable",
  columns: makeSearchable(schema),
});
