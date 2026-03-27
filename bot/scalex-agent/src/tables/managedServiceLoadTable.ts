import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  Load_Level: csv.string().describe("Service load level"),
  Multiplier_Median: csv.number().describe("Median multiplier for this load level"),
  Description: csv.string().describe("Description of the load level"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "managedServiceLoadTable",
  columns: makeSearchable(schema),
});
