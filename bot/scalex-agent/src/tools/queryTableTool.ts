import { Autonomous, z } from "@botpress/runtime";
import towersTable, { schema as towersSchema } from "../tables/towersTable";
import categoriesTable, { schema as categoriesSchema } from "../tables/categoriesTable";
import serviceTypesTable, { schema as serviceTypesSchema } from "../tables/serviceTypesTable";
import locationsTable, { schema as locationsSchema } from "../tables/locationsTable";
import vendorsTable, { schema as vendorsSchema } from "../tables/vendorsTable";
import serviceVendorMapTable, { schema as serviceVendorMapSchema } from "../tables/serviceVendorMapTable";
import vendorLocationsTable, { schema as vendorLocationsSchema } from "../tables/vendorLocationsTable";
import modifiersTable, { schema as modifiersSchema } from "../tables/modifiersTable";
import serviceNameAliasesTable, { schema as serviceAliasesSchema } from "../tables/serviceNameAliasesTable";
import baseRatesTable, { schema as baseRatesSchema } from "../tables/baseRatesTable";
import vendorIdMappingTable, { schema as vendorIdMappingSchema } from "../tables/vendorIdMappingTable";
import riskRulesTable, { schema as riskRulesSchema } from "../tables/riskRulesTable";
import treatmentRecommendationsTable, { schema as treatmentRecommendationsSchema } from "../tables/treatmentRecommendationsTable";
import contractBenchmarksTable, { schema as contractBenchmarksSchema } from "../tables/contractBenchmarksTable";
import modifierAdjustmentsTable, { schema as modifierAdjustmentsSchema } from "../tables/modifierAdjustmentsTable";
import taxonomyCrosswalksTable, { schema as taxonomyCrosswalksSchema } from "../tables/taxonomyCrosswalksTable";
import managedServiceLoadTable, { schema as managedServiceLoadSchema } from "../tables/managedServiceLoadTable";
import baseRatesExtTable, { schema as baseRatesExtSchema } from "../tables/baseRatesExtTable";
import serviceTypesExtTable, { schema as serviceTypesExtSchema } from "../tables/serviceTypesExtTable";
import vendorsExtTable, { schema as vendorsExtSchema } from "../tables/vendorsExtTable";
import slaTable, { schema as slaSchema } from "../tables/slaTable";
import serviceTypeSlaTable, { schema as serviceTypeSlaSchema } from "../tables/serviceTypeSlaTable";

// Create Zod schemas from table schemas (these represent the clean data without ADK metadata)
const towerOutputSchema = z.object(towersSchema);
const categoryOutputSchema = z.object(categoriesSchema);
const serviceTypeOutputSchema = z.object(serviceTypesSchema);
const locationOutputSchema = z.object(locationsSchema);
const vendorOutputSchema = z.object(vendorsSchema);
const serviceVendorMapOutputSchema = z.object(serviceVendorMapSchema);
const vendorLocationOutputSchema = z.object(vendorLocationsSchema);
const modifierOutputSchema = z.object(modifiersSchema);
const serviceAliasOutputSchema = z.object(serviceAliasesSchema);
const baseRateOutputSchema = z.object(baseRatesSchema);
const vendorIdMappingOutputSchema = z.object(vendorIdMappingSchema);
const riskRulesOutputSchema = z.object(riskRulesSchema);
const treatmentRecommendationsOutputSchema = z.object(treatmentRecommendationsSchema);
const contractBenchmarksOutputSchema = z.object(contractBenchmarksSchema);
const modifierAdjustmentsOutputSchema = z.object(modifierAdjustmentsSchema);
const taxonomyCrosswalksOutputSchema = z.object(taxonomyCrosswalksSchema);
const managedServiceLoadOutputSchema = z.object(managedServiceLoadSchema);
const baseRatesExtOutputSchema = z.object(baseRatesExtSchema);
const serviceTypesExtOutputSchema = z.object(serviceTypesExtSchema);
const vendorsExtOutputSchema = z.object(vendorsExtSchema);
const slaOutputSchema = z.object(slaSchema);
const serviceTypeSlaOutputSchema = z.object(serviceTypeSlaSchema);

// Helper function to strip ADK metadata fields from results
function stripAdkMetadata(rows: any[]): any[] {
  return rows.map(row => {
    const { computed, stale, id, createdAt, updatedAt, ...cleanData } = row;
    return cleanData;
  });
}

export default new Autonomous.Tool({
  name: "queryTableTool",
  description:
    "Query the knowledge base tables for information about service towers, vendors, locations, pricing, and service types. Use this to answer questions about available services, vendor capabilities, locations, and pricing information.",
  input: z.object({
    query_type: z
      .enum([
        "towers",
        "categories",
        "service_types",
        "locations",
        "vendors",
        "vendor_locations",
        "service_vendor_map",
        "modifiers",
        "service_aliases",
        "base_rates",
        "vendor_id_mapping",
        "risk_rules",
        "treatment_recommendations",
        "contract_benchmarks",
        "modifier_adjustments",
        "taxonomy_crosswalks",
        "managed_service_load",
        "base_rates_ext",
        "service_types_ext",
        "vendors_ext",
        "sla",
        "service_type_sla",
      ])
      .describe("The type of query to perform"),
    search_term: z
      .string()
      .optional()
      .describe("Search term to filter results (searches in searchable columns)"),
    filters: z
      .record(z.string(), z.any())
      .optional()
      .describe("Additional filters as key-value pairs (e.g., {Tower_Code: 'HR'})"),
    limit: z.number().optional().default(5).describe("Maximum number of results to return (default: 5)"),
  }),
  output: z.discriminatedUnion("query_type", [
    z.object({
      query_type: z.literal("towers"),
      results: z.array(towerOutputSchema).describe("List of service towers with their details"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("categories"),
      results: z.array(categoryOutputSchema).describe("List of service categories within towers"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("service_types"),
      results: z.array(serviceTypeOutputSchema).describe("Service type definitions with pricing models and delivery channels. SLA data moved to sla/service_type_sla tables in v3. Frontline_Agent_Type is NULL for taxonomy-only towers (ENG, FR, MK, RC)."),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("locations"),
      results: z.array(locationOutputSchema).describe("List of geographic locations with cost indices"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("vendors"),
      results: z.array(vendorOutputSchema).describe("List of vendors with capabilities and details"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("vendor_locations"),
      results: z.array(vendorLocationOutputSchema).describe("List of vendor delivery centers and offices"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("service_vendor_map"),
      results: z.array(serviceVendorMapOutputSchema).describe("List of service-vendor relationships and rankings"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("modifiers"),
      results: z.array(modifierOutputSchema).describe("List of configuration modifiers for services"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("service_aliases"),
      results: z.array(serviceAliasOutputSchema).describe("List of user-friendly service name aliases"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("base_rates"),
      results: z.array(baseRateOutputSchema).describe("Hourly rate benchmarks by Frontline_Agent_Type, Location_Code, and Tier. Filter on these columns. For staff aug use directly; for managed service multiply by TBL-017 load multiplier."),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("vendor_id_mapping"),
      results: z.array(vendorIdMappingOutputSchema).describe("List of vendor name to ID mappings for lookup"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("risk_rules"),
      results: z.array(riskRulesOutputSchema).describe("List of risk scoring rules and thresholds"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("treatment_recommendations"),
      results: z.array(treatmentRecommendationsOutputSchema).describe("List of recommended actions for findings"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("contract_benchmarks"),
      results: z.array(contractBenchmarksOutputSchema).describe("List of contract term benchmarks and clauses"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("modifier_adjustments"),
      results: z.array(modifierAdjustmentsOutputSchema).describe("List of pricing adjustment multipliers"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("taxonomy_crosswalks"),
      results: z.array(taxonomyCrosswalksOutputSchema).describe("List of external system to Maxx taxonomy mappings"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("managed_service_load"),
      results: z.array(managedServiceLoadOutputSchema).describe("List of service complexity load multipliers"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("base_rates_ext"),
      results: z.array(baseRatesExtOutputSchema).describe("Extended base rate data (confidence, methodology, change notes). Join with base_rates on Rate_ID."),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("service_types_ext"),
      results: z.array(serviceTypesExtOutputSchema).describe("Extended service type data including Managed_Service_Load (needed for blended rate calc), complexity tiers, AHT, volumes, and confidence scores. Join with service_types on Service_Type_ID."),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("vendors_ext"),
      results: z.array(vendorsExtOutputSchema).describe("Extended vendor data (tier, risk score, numeric financials). Join with vendors on vendorId."),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("sla"),
      results: z.array(slaOutputSchema).describe("List of SLA definitions (timeliness and quality)"),
      count: z.number().describe("Number of results returned"),
    }),
    z.object({
      query_type: z.literal("service_type_sla"),
      results: z.array(serviceTypeSlaOutputSchema).describe("List of service type to SLA mappings with target overrides"),
      count: z.number().describe("Number of results returned"),
    }),
  ]),
  handler: async ({ query_type, search_term, filters, limit }) => {
    console.log("AI called: ");
    console.log("query_type: ", query_type);
    console.log("search_term: ", search_term);
    console.log("filters: ", filters);
    console.log("limit: ", limit);
    let results: any[] = [];

    const queryOptions: any = {
      limit,
      filter: filters || {},
    };

    if (search_term) {
      queryOptions.search = search_term;
    }

    try {
      switch (query_type) {
        case "towers":
          results = await towersTable.findRows(queryOptions);
          break;

        case "categories":
          results = await categoriesTable.findRows(queryOptions);
          break;

        case "service_types":
          results = await serviceTypesTable.findRows(queryOptions);
          break;

        case "locations":
          results = await locationsTable.findRows(queryOptions);
          break;

        case "vendors":
          results = await vendorsTable.findRows(queryOptions);
          break;

        case "vendor_locations":
          results = await vendorLocationsTable.findRows(queryOptions);
          break;

        case "service_vendor_map":
          results = await serviceVendorMapTable.findRows(queryOptions);
          break;

        case "modifiers":
          results = await modifiersTable.findRows(queryOptions);
          break;

        case "service_aliases":
          results = await serviceNameAliasesTable.findRows(queryOptions);
          break;

        case "base_rates":
          results = await baseRatesTable.findRows(queryOptions);
          break;

        case "vendor_id_mapping":
          results = await vendorIdMappingTable.findRows(queryOptions);
          break;

        case "risk_rules":
          results = await riskRulesTable.findRows(queryOptions);
          break;

        case "treatment_recommendations":
          results = await treatmentRecommendationsTable.findRows(queryOptions);
          break;

        case "contract_benchmarks":
          results = await contractBenchmarksTable.findRows(queryOptions);
          break;

        case "modifier_adjustments":
          results = await modifierAdjustmentsTable.findRows(queryOptions);
          break;

        case "taxonomy_crosswalks":
          results = await taxonomyCrosswalksTable.findRows(queryOptions);
          break;

        case "managed_service_load":
          results = await managedServiceLoadTable.findRows(queryOptions);
          break;

        case "base_rates_ext":
          results = await baseRatesExtTable.findRows(queryOptions);
          break;

        case "service_types_ext":
          results = await serviceTypesExtTable.findRows(queryOptions);
          break;

        case "vendors_ext":
          results = await vendorsExtTable.findRows(queryOptions);
          break;

        case "sla":
          results = await slaTable.findRows(queryOptions);
          break;

        case "service_type_sla":
          results = await serviceTypeSlaTable.findRows(queryOptions);
          break;

        default:
          throw new Error(`Unknown query type: ${query_type}`);
      }

      // Strip ADK metadata to provide clean data to LLM
      console.log("Raw results with metadata: ", results);
      const cleanResults = stripAdkMetadata(results["rows"]);
      console.log("Clean results: ", cleanResults);

      console.log("Made it to return");
      return {
        query_type,
        results: cleanResults,
        count: cleanResults.length,
      };
    } catch (error: any) {
      console.error("Query error:", error);
      return {
        query_type,
        results: [],
        count: 0,
      };
    }
  },
});
