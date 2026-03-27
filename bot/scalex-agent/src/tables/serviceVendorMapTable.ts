import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Mapping_ID: csv.string().describe("Unique mapping identifier"),
  Service_Type_ID: csv.string().describe("Service type identifier"),
  Vendor_ID: csv.string().describe("Vendor identifier"),
  Vendor_Name: csv.string().describe("Vendor name"),
  Analyst_Ranking: csv.stringOptional().describe("Analyst ranking designation"),
  Analyst_Source: csv.stringOptional().describe("Source of analyst ranking"),
  Ranking_Tier: csv.stringOptional().describe("Ranking tier"),
  Vendor_Type: csv.string().describe("Type of vendor (Established, Emerging)"),
  Founded_Year: csv.numberOptional().describe("Year vendor was founded"),
  Confidence: csv.string().describe("Confidence level"),
  As_Of_Date: csv.string().describe("Date of data"),
  Source_Type: csv.string().describe("Type of source"),
  Notes: csv.stringOptional().describe("Additional notes"),
  Maxx_Rec_Tier: csv.stringOptional().describe("Maxx recommendation tier"),
  Price_Position: csv.stringOptional().describe("Price position indicator"),
  Typical_Delivery_Location: csv.stringOptional().describe("Typical delivery location"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "serviceVendorMapTable",
  columns: makeSearchable(schema),
});
