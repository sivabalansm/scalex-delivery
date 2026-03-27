import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Vendor_Name: csv.string().describe("Vendor name"),
  Vendor_ID: csv.string().describe("Vendor identifier"),
  Search_Key: csv.string().describe("Search key for vendor lookup"),
  Alt_Names: csv.stringOptional().describe("Alternative vendor names"),
  Parent_Vendor_ID: csv.stringOptional().describe("Parent vendor identifier"),
  Is_Active: csv.booleanOptional().describe("Whether vendor mapping is active"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "vendorIdMappingTable",
  columns: makeSearchable(schema),
});
