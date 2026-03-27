import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Rule_ID: csv.string().describe("Unique rule identifier"),
  Rule_Name: csv.string().describe("Name of the risk rule"),
  Rule_Category: csv.string().describe("Category of the risk rule"),
  Applicable_Towers: csv.string().describe("Tower codes this rule applies to"),
  Condition_Type: csv.string().describe("Type of condition"),
  Condition_Config: csv.string().describe("Configuration for the condition"),
  Severity_Weight: csv.number().describe("Severity weight for scoring"),
  Recommended_Treatment: csv.string().describe("Recommended treatment action"),
  Description: csv.string().describe("Description of the risk rule"),
  Mitigation_Text: csv.stringOptional().describe("Mitigation guidance text"),
  Is_Active: csv.booleanOptional().describe("Whether rule is active"),
  Created_Date: csv.stringOptional().describe("Date rule was created"),
  Last_Updated: csv.stringOptional().describe("Date rule was last updated"),
  Threshold_Metric: csv.stringOptional().describe("Metric used for threshold"),
  Threshold_Operator: csv.stringOptional().describe("Threshold comparison operator"),
  Threshold_Value: csv.numberOptional().describe("Threshold value"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "riskRulesTable",
  columns: makeSearchable(schema),
});
