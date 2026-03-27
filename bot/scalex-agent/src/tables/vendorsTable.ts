import { Table, z } from "@botpress/runtime";
import { csv, makeSearchable } from "./csvSchemaHelpers";

export const schema = {
  vendorId: csv.string().describe("Unique vendor identifier"),
  vendorName: csv.string().describe("Vendor name"),
  primaryTower: csv.string().describe("Primary service tower"),
  secondaryTowers: csv.stringOptional().describe("Secondary towers (comma-separated)"),
  hqCountry: csv.string().describe("Headquarters country"),
  ownership: csv.string().describe("Ownership type"),
  revenueUsd: csv.stringOptional().describe("Revenue in USD"),
  employeeCount: csv.numberOptional().describe("Total employee count"),
  deliveryCenterCount: csv.numberOptional().describe("Number of delivery centers"),
  deliveryRegions: csv.stringOptional().describe("Delivery region areas"),
  certifications: csv.stringOptional().describe("Certifications held"),
  keyClients: csv.stringOptional().describe("Key client information"),
  serviceCapabilities: csv.stringOptional().describe("Service capabilities"),
  competitivePosition: csv.stringOptional().describe("Competitive position and rankings"),
  strengths: csv.stringOptional().describe("Vendor strengths"),
  weaknesses: csv.stringOptional().describe("Vendor weaknesses"),
  redFlags: csv.stringOptional().describe("Red flags or concerns"),
  pricingModel: csv.stringOptional().describe("Pricing model(s)"),
  financialHealthScore: csv.stringOptional().describe("Financial health score"),
}

export const parser = z.object(schema).parse

export default new Table({
  name: "vendorsTable",
  columns: makeSearchable(schema),
});
