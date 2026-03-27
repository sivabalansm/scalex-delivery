import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Adjustment_ID: csv.string().describe("Unique adjustment identifier"),
  Modifier_Code: csv.string().describe("Modifier code reference"),
  Modifier_Value: csv.string().describe("Modifier value"),
  Adjustment_Low: csv.numberWithDefault(0).describe("Low adjustment multiplier"),
  Adjustment_High: csv.numberWithDefault(0).describe("High adjustment multiplier"),
  Adjustment_Median: csv.number().describe("Median adjustment multiplier"),
  Adjustment_Type: csv.string().describe("Type of adjustment"),
  Applies_To_Towers: csv.string().describe("Tower codes this adjustment applies to"),
  Applies_To_Tiers: csv.string().describe("Tiers this adjustment applies to"),
  Source: csv.stringOptional().describe("Source of adjustment data"),
  Confidence: csv.stringOptional().describe("Confidence level"),
  Last_Updated: csv.stringOptional().describe("Date adjustment was last updated"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "modifierAdjustmentsTable",
  columns: makeSearchable(schema),
});
