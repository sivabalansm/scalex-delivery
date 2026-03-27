import { Workflow } from "@botpress/runtime";
import { createReadStream } from "fs";
import csv from "csv-parser";
import { join } from "path";
import towersTable from "../tables/towersTable";
import { parser as towersTableParser } from "../tables/towersTable";
import categoriesTable from "../tables/categoriesTable";
import { parser as categoriesTableParser } from "../tables/categoriesTable";
import baseRatesTable from "../tables/baseRatesTable";
import { parser as baseRatesTableParser } from "../tables/baseRatesTable";
import serviceTypesTable from "../tables/serviceTypesTable";
import { parser as serviceTypesTableParser } from "../tables/serviceTypesTable";
import locationsTable from "../tables/locationsTable";
import { parser as locationsTableParser } from "../tables/locationsTable";
import serviceVendorMapTable from "../tables/serviceVendorMapTable";
import { parser as serviceVendorMapTableParser } from "../tables/serviceVendorMapTable";
import vendorLocationsTable from "../tables/vendorLocationsTable";
import { parser as vendorLocationsTableParser } from "../tables/vendorLocationsTable";
import modifiersTable from "../tables/modifiersTable";
import { parser as modifiersTableParser } from "../tables/modifiersTable";
import serviceNameAliasesTable from "../tables/serviceNameAliasesTable";
import { parser as serviceNameAliasesTableParser } from "../tables/serviceNameAliasesTable";
import vendorIdMappingTable from "../tables/vendorIdMappingTable";
import { parser as vendorIdMappingTableParser } from "../tables/vendorIdMappingTable";
import vendorsTable from "../tables/vendorsTable";
import { parser as vendorsTableParser } from "../tables/vendorsTable";
import riskRulesTable from "../tables/riskRulesTable";
import { parser as riskRulesTableParser } from "../tables/riskRulesTable";
import treatmentRecommendationsTable from "../tables/treatmentRecommendationsTable";
import { parser as treatmentRecommendationsTableParser } from "../tables/treatmentRecommendationsTable";
import contractBenchmarksTable from "../tables/contractBenchmarksTable";
import { parser as contractBenchmarksTableParser } from "../tables/contractBenchmarksTable";
import modifierAdjustmentsTable from "../tables/modifierAdjustmentsTable";
import { parser as modifierAdjustmentsTableParser } from "../tables/modifierAdjustmentsTable";
import taxonomyCrosswalksTable from "../tables/taxonomyCrosswalksTable";
import { parser as taxonomyCrosswalksTableParser } from "../tables/taxonomyCrosswalksTable";
import managedServiceLoadTable from "../tables/managedServiceLoadTable";
import { parser as managedServiceLoadTableParser } from "../tables/managedServiceLoadTable";
import baseRatesExtTable from "../tables/baseRatesExtTable";
import { parser as baseRatesExtTableParser } from "../tables/baseRatesExtTable";
import serviceTypesExtTable from "../tables/serviceTypesExtTable";
import { parser as serviceTypesExtTableParser } from "../tables/serviceTypesExtTable";
import vendorsExtTable from "../tables/vendorsExtTable";
import { parser as vendorsExtTableParser } from "../tables/vendorsExtTable";
import slaTable from "../tables/slaTable";
import { parser as slaTableParser } from "../tables/slaTable";
import serviceTypeSlaTable from "../tables/serviceTypeSlaTable";
import { parser as serviceTypeSlaTableParser } from "../tables/serviceTypeSlaTable";

const KB_DATA_DIR = join("/Users/sivabalan.muthurajan/sc/delivery-pv/scalex/bot/scalex-agent", "kb-data", "data", "updated-tables");

/**
 * Parse and validate CSV data, then insert into table with error handling
 */
async function csvToTable(csvFile: string, table: any, parser: any): Promise<void> {
	console.log(process.cwd());
	console.log("============================");
	console.log("Parsing CSV :", csvFile);
	console.log("To table :", table.name);
	console.log("============================");

	return new Promise((resolve, reject) => {
		const validRows: any[] = [];
		const errors: Array<{ row: number; data: any; error: string }> = [];
		let rowNumber = 0;

		createReadStream(join(KB_DATA_DIR, csvFile))
			.pipe(csv())
			.on("data", (data: any) => {
				rowNumber++;
				try {
					// Validate and parse the row
					const parsedData = parser(data);
					validRows.push(parsedData);
				} catch (error: any) {
					// Collect validation errors with row context
					errors.push({
						row: rowNumber + 1, // +1 for header row
						data: data,
						error: error.message || String(error),
					});
				}
			})
			.on("end", async () => {
				// Report validation errors
				if (errors.length > 0) {
					console.error(`\n✗ Validation errors in ${errors.length} rows:`);
					errors.slice(0, 5).forEach((e) => {
						console.error(`  Row ${e.row}: ${e.error}`);
						console.error(`    Data: ${JSON.stringify(e.data).slice(0, 200)}...`);
					});
					if (errors.length > 5) {
						console.error(`  ... and ${errors.length - 5} more errors`);
					}
				}

				// Insert valid rows in batch
				if (validRows.length > 0) {
					try {
						if (validRows.length >= 1000) {
							const limit = validRows.length;
							let start = 0;
							let end = 999;
							do {
								await table.createRows({ rows: validRows.slice(start, end) });
								start += 1000;
								end += 1000;
							} while (end < limit)
							if (validRows.slice(start, end).length > 0) {
								await table.createRows({ rows: validRows.slice(start, end) });
							}
						} else {
							await table.createRows({ rows: validRows });
						}
						console.log(`✓ Successfully inserted ${validRows.length} rows into ${table.name}`);
					} catch (insertError: any) {
						console.error(`✗ Error inserting rows into ${table.name}:`, insertError.message || insertError);
						reject(insertError);
						return;
					}
				} else {
					console.warn(`⚠ No valid rows to insert into ${table.name}`);
				}

				// Summary
				const total = rowNumber;
				const valid = validRows.length;
				const invalid = errors.length;
				console.log(`\nSummary: ${valid}/${total} rows valid (${invalid} failed validation)\n`);

				resolve();
			})
			.on("error", (error) => {
				console.error(`✗ Error reading CSV file ${csvFile}:`, error);
				reject(error);
			});
	});
}

export default new Workflow({
	name: "populateTables",
	handler: async ({ step }) => {
		console.log("🚀 Starting table population workflow (v3)\n");

		await step("populate-towers", async () => {
			await csvToTable("TBL-001_TOWERS_v4.csv", towersTable, towersTableParser);
		});

		await step("populate-categories", async () => {
			await csvToTable("TBL-002_CATEGORIES_COMPLETE.csv", categoriesTable, categoriesTableParser);
		});

		await step("populate-base-rates", async () => {
			await csvToTable("TBL-003_BaseRates_v7_AMENDED.csv", baseRatesTable, baseRatesTableParser);
		});

		await step("populate-service-types", async () => {
			await csvToTable("TBL-004_SERVICE_TYPES_v2.csv", serviceTypesTable, serviceTypesTableParser);
		});

		await step("populate-locations", async () => {
			await csvToTable("TBL-005_LOCATIONS_v4.csv", locationsTable, locationsTableParser);
		});

		await step("populate-vendors", async () => {
			await csvToTable("TBL-006_VENDORS_BOTPRESS_FINAL_v4.csv", vendorsTable, vendorsTableParser);
		});

		await step("populate-service-name-aliases", async () => {
			await csvToTable("TBL-007_SERVICE_NAME_ALIASES_v3.csv", serviceNameAliasesTable, serviceNameAliasesTableParser);
		});

		await step("populate-service-vendor-map", async () => {
			await csvToTable("TBL-008_SERVICE_VENDOR_MAP_v4.csv", serviceVendorMapTable, serviceVendorMapTableParser);
		});

		await step("populate-vendor-locations", async () => {
			await csvToTable("TBL-009_VENDOR_LOCATIONS_VALIDATED.csv", vendorLocationsTable, vendorLocationsTableParser);
		});

		await step("populate-modifiers", async () => {
			await csvToTable("TBL-010_MODIFIERS.csv", modifiersTable, modifiersTableParser);
		});

		await step("populate-vendor-id-mapping", async () => {
			await csvToTable("TBL-011_VENDORID_MAPPING.csv", vendorIdMappingTable, vendorIdMappingTableParser);
		});

		await step("populate-risk-rules", async () => {
			await csvToTable("TBL-012_RISK_RULES_v2.csv", riskRulesTable, riskRulesTableParser);
		});

		await step("populate-treatment-recommendations", async () => {
			await csvToTable("TBL-013_TREATMENT_RECOMMENDATIONS_v2.csv", treatmentRecommendationsTable, treatmentRecommendationsTableParser);
		});

		await step("populate-contract-benchmarks", async () => {
			await csvToTable("TBL-014_CONTRACT_BENCHMARKS_v2.csv", contractBenchmarksTable, contractBenchmarksTableParser);
		});

		await step("populate-modifier-adjustments", async () => {
			await csvToTable("TBL-015_MODIFIER_ADJUSTMENTS.csv", modifierAdjustmentsTable, modifierAdjustmentsTableParser);
		});

		await step("populate-taxonomy-crosswalks", async () => {
			await csvToTable("TBL-016_TAXONOMY_CROSSWALKS.csv", taxonomyCrosswalksTable, taxonomyCrosswalksTableParser);
		});

		await step("populate-managed-service-load", async () => {
			await csvToTable("TBL-017_MANAGED_SERVICE_LOAD.csv", managedServiceLoadTable, managedServiceLoadTableParser);
		});

		// Extension tables (overflow columns from tables exceeding 20-column limit)
		await step("populate-base-rates-ext", async () => {
			await csvToTable("TBL-003_BaseRates_v7_AMENDED.csv", baseRatesExtTable, baseRatesExtTableParser);
		});

		await step("populate-service-types-ext", async () => {
			await csvToTable("TBL-004_SERVICE_TYPES_v2.csv", serviceTypesExtTable, serviceTypesExtTableParser);
		});

		await step("populate-vendors-ext", async () => {
			await csvToTable("TBL-006_VENDORS_BOTPRESS_FINAL_v4.csv", vendorsExtTable, vendorsExtTableParser);
		});

		// SLA tables (new in v3)
		await step("populate-sla", async () => {
			await csvToTable("SLA.csv", slaTable, slaTableParser);
		});

		await step("populate-service-type-sla", async () => {
			await csvToTable("Service_Type_SLA.csv", serviceTypeSlaTable, serviceTypeSlaTableParser);
		});

		console.log("✅ Table population workflow completed! (22 tables)");
	},
});
