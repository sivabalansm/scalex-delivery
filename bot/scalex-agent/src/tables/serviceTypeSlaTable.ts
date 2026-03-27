import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Service_Type_SLA_ID: csv.string().describe("Unique service type SLA identifier"),
  Service_Type_ID: csv.string().describe("FK to service types table"),
  SLA_ID: csv.string().describe("FK to SLA table"),
  Target_Override: csv.stringOptional().describe("Override target value for this service type"),
  Display_Order: csv.numberOptional().describe("Display order for UI rendering"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "serviceTypeSlaTable",
  columns: makeSearchable(schema),
});
