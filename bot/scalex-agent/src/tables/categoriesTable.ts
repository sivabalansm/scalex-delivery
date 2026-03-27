import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Category_Code: csv.string().describe("Unique category code"),
  Tower_Code: csv.string().describe("Reference to parent tower"),
  Category_Name: csv.string().describe("Name of the category"),
  Description: csv.stringWithDefault("N/A").describe("Description of the category"),
  APQC_Category_Ref: csv.stringOptional().describe("APQC category reference"),
  FB_Category_Ref: csv.stringOptional().describe("FB category reference"),
  Falcon_Category_Ref: csv.stringOptional().describe("Falcon category reference"),
  Sort_Order: csv.number().describe("Display sort order"),
  Validated_By_Assessment: csv.booleanOptional().describe("Whether validated by assessment"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "categoriesTable",
  columns: makeSearchable(schema),
});
