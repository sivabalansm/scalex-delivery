import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Alias_ID: csv.string().describe("Unique alias identifier"),
  User_Term: csv.string().describe("User-friendly term or alias"),
  Service_Type_ID: csv.string().describe("Corresponding service type ID"),
  Service_Type_Name: csv.string().describe("Official service type name"),
  Confidence: csv.string().describe("Confidence level of the alias mapping"),
  Source: csv.stringOptional().describe("Source of the alias"),
  Usage_Count: csv.numberOptional().describe("Number of times alias has been used"),
  Created_Date: csv.stringOptional().describe("Date alias was created"),
  Is_Active: csv.booleanOptional().describe("Whether alias is active"),
  Tower_Code: csv.stringOptional().describe("Associated tower code"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "serviceNameAliasesTable",
  columns: makeSearchable(schema),
});
