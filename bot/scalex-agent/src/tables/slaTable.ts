import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  SLA_ID: csv.string().describe("Unique SLA identifier"),
  SLA_Name: csv.string().describe("Name of the SLA"),
  SLA_Type: csv.string().describe("Type of SLA (Timeliness or Quality)"),
  Default_Target: csv.stringOptional().describe("Default target value"),
  Unit: csv.stringOptional().describe("Unit of measurement (percent or hours)"),
  Description: csv.stringOptional().describe("Description of the SLA"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "slaTable",
  columns: makeSearchable(schema),
});
