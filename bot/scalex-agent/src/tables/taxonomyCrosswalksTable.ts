import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Crosswalk_ID: csv.string().describe("Unique crosswalk identifier"),
  External_System: csv.string().describe("External system name"),
  External_Code: csv.string().describe("External system code"),
  External_Name: csv.string().describe("External system name for the item"),
  Maxx_Level: csv.string().describe("Maxx taxonomy level"),
  Maxx_Code: csv.string().describe("Maxx taxonomy code"),
  Maxx_Name: csv.string().describe("Maxx taxonomy name"),
  Mapping_Confidence: csv.stringOptional().describe("Confidence of the mapping"),
  Mapping_Notes: csv.stringOptional().describe("Notes about the mapping"),
  Created_By: csv.stringOptional().describe("Who created the mapping"),
  Created_Date: csv.stringOptional().describe("Date mapping was created"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "taxonomyCrosswalksTable",
  columns: makeSearchable(schema),
});
