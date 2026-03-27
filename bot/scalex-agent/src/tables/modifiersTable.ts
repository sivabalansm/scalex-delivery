import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Modifier_Code: csv.string().describe("Unique modifier code"),
  Modifier_Name: csv.string().describe("Name of the modifier"),
  Question_Text: csv.string().describe("Question text to present to users"),
  Value_Type: csv.string().describe("Type of value (multi_select, single_select)"),
  Common_Values: csv.stringOptional().describe("Comma-separated list of common values (empty for text input fields)"),
  Triggers_For: csv.string().describe("Tower codes this modifier applies to"),
  Priority: csv.number().describe("Priority order for presenting"),
  Required_By_Default: csv.boolean().describe("Whether this modifier is required by default"),
  Modifier_Category: csv.stringOptional().describe("Category of the modifier"),
  Application_Type: csv.stringOptional().describe("Type of application"),
  Application_Step: csv.numberOptional().describe("Step number in application process"),
  Max_Adjustment_Pct: csv.numberOptional().describe("Maximum adjustment percentage"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "modifiersTable",
  columns: makeSearchable(schema),
});
