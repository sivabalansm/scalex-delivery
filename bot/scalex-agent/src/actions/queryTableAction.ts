import { Action, z } from "@botpress/runtime";
import towersTable from "../tables/towersTable";
import categoriesTable from "../tables/categoriesTable";
import serviceTypesTable from "../tables/serviceTypesTable";
import locationsTable from "../tables/locationsTable";
import vendorsTable from "../tables/vendorsTable";
import serviceVendorMapTable from "../tables/serviceVendorMapTable";
import vendorLocationsTable from "../tables/vendorLocationsTable";
import modifiersTable from "../tables/modifiersTable";
import serviceNameAliasesTable from "../tables/serviceNameAliasesTable";
import baseRatesTable from "../tables/baseRatesTable";
import vendorIdMappingTable from "../tables/vendorIdMappingTable";
import riskRulesTable from "../tables/riskRulesTable";
import treatmentRecommendationsTable from "../tables/treatmentRecommendationsTable";
import contractBenchmarksTable from "../tables/contractBenchmarksTable";
import modifierAdjustmentsTable from "../tables/modifierAdjustmentsTable";
import taxonomyCrosswalksTable from "../tables/taxonomyCrosswalksTable";
import managedServiceLoadTable from "../tables/managedServiceLoadTable";
import baseRatesExtTable from "../tables/baseRatesExtTable";
import serviceTypesExtTable from "../tables/serviceTypesExtTable";
import vendorsExtTable from "../tables/vendorsExtTable";
import slaTable from "../tables/slaTable";
import serviceTypeSlaTable from "../tables/serviceTypeSlaTable";

export default new Action({
  name: "queryTableAction",
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
    limit: z.number().optional().default(10).describe("Maximum number of results to return"),
  }),
  output: z.object({
    results: z.array(z.any()).describe("Array of matching records"),
    count: z.number().describe("Total number of results found"),
  }),
  handler: async ({ input }) => {
    let { query_type, search_term, filters, limit } = input;
    let results: any[] = [];

    const queryOptions: any = {
      limit,
      filter: filters || {},
    };

    if (search_term) {
      queryOptions.search = search_term;
    }

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

    return {
      results,
      count: results.length,
    };
  },
});
