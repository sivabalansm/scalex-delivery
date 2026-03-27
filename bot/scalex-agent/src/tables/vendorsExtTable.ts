import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  vendorId: csv.string().describe("Vendor ID linking to vendorsTable"),
  Maxx_Vendor_Tier: csv.stringOptional().describe("Maxx vendor tier classification"),
  Last_Researched: csv.stringOptional().describe("Date vendor was last researched"),
  Profile_Completeness_Pct: csv.numberOptional().describe("Profile completeness percentage"),
  Risk_Score: csv.stringOptional().describe("Vendor risk score"),
  Revenue_USD_Numeric: csv.numberOptional().describe("Revenue in USD as numeric value"),
  Employee_Count_Numeric: csv.numberOptional().describe("Employee count as numeric value"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "vendorsExtTable",
  columns: makeSearchable(schema),
});
