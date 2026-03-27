import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  VendorLocation_ID: csv.string().describe("Unique vendor location identifier"),
  Vendor_ID: csv.string().describe("Vendor identifier"),
  Vendor_Name: csv.string().describe("Vendor name"),
  Location_Code: csv.string().describe("Location code"),
  City: csv.stringWithDefault("N/A").describe("City name"),
  Country: csv.stringWithDefault("N/A").describe("Country name"),
  Site_Type: csv.string().describe("Type of site (e.g., Delivery_Center)"),
  Headcount_Range: csv.stringWithDefault("N/A").describe("Range of headcount at location"),
  Services_Offered: csv.stringWithDefault("N/A").describe("Services available at this location"),
  Source: csv.string().describe("Source of information"),
  Last_Verified: csv.string().describe("Last verification date"),
  Location_Tier: csv.stringOptional().describe("Location tier classification"),
  Capacity_Status: csv.stringOptional().describe("Capacity status of the location"),
  Delivery_Model: csv.stringOptional().describe("Delivery model at this location"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "vendorLocationsTable",
  columns: makeSearchable(schema),
});
