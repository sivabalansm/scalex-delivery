import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Service_Type_ID: csv.string().describe("Service Type ID linking to serviceTypesTable"),
  Parent_Category_Code: csv.stringOptional().describe("Parent category code"),
  Managed_Service_Load: csv.stringOptional().describe("Managed service load level"),
  AHT_Data_Tier: csv.stringOptional().describe("AHT data tier classification"),
  AHT_Source: csv.stringOptional().describe("Source of AHT data"),
  Complexity_Tier: csv.stringOptional().describe("Service complexity tier"),
  Service_Unit_Name: csv.stringOptional().describe("Name of the service unit"),
  Service_Unit_Definition: csv.stringOptional().describe("Definition of the service unit"),
  Typical_Volume_Low: csv.stringOptional().describe("Typical low volume range"),
  Typical_Volume_High: csv.stringOptional().describe("Typical high volume range"),
  Confidence_Score: csv.stringOptional().describe("Numeric confidence score"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "serviceTypesExtTable",
  columns: makeSearchable(schema),
});
