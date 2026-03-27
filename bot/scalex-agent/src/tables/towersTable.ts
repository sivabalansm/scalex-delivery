import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
    Tower_Code: csv.string().describe("Unique code for the tower (e.g., HR, FA)"),
    Tower_Name: csv.string().describe("Name of the service tower"),
    Description: csv.string().describe("Description of the tower's services"),
    Status: csv.string().describe("Status of the tower (e.g., Active)"),
    Service_Type_Count: csv.number().describe("Number of service types in this tower"),
    Vendor_Count: csv.number().describe("Number of vendors serving this tower"),
    Sort_Order: csv.number().describe("Display sort order"),
    Icon_Key: csv.stringOptional().describe("Icon key for UI display"),
    APQC_Process_Group: csv.stringOptional().describe("APQC process group reference"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "towersTable",
  columns: makeSearchable(schema),
});
