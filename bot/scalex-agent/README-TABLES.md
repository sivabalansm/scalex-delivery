# Knowledge Base Tables - Quick Start

## What I Created

I've created **11 ADK tables** based on your CSV files in `kb-data/data/` to serve as your bot's knowledge base:

### Tables Created

| Table | Source CSV | Records | Purpose |
|-------|-----------|---------|---------|
| `towersTable` | TBL-001_TOWERS_v4.csv | Service towers (HR, FA, etc.) |
| `categoriesTable` | TBL-002_CATEGORIES_COMPLETE.csv | Categories within towers |
| `baseRatesTable` | TBL-003_BaseRates_v5_FINAL.csv | Pricing rates by location/tier |
| `serviceTypesTable` | TBL-005_SERVICE_TYPES.csv | Detailed service definitions |
| `locationsTable` | TBL-006_LOCATIONS_v4.csv | Geographic locations |
| `serviceVendorMapTable` | TBL-009_SERVICE_VENDOR_MAP_v4.csv | Service-to-vendor mappings |
| `vendorLocationsTable` | TBL-010_VENDOR_LOCATIONS_VALIDATED.csv | Vendor delivery centers |
| `modifiersTable` | TBL-011_MODIFIERS.csv | Configuration modifiers |
| `serviceNameAliasesTable` | SERVICE_NAME_ALIASES_v3.csv | Service name aliases |
| `vendorIdMappingTable` | VENDORID_MAPPING.csv | Vendor ID lookups |
| `vendorsTable` | VENDORS_BOTPRESS_FINAL_v4.csv | Complete vendor information |

## Files Created

### Table Definitions
- `src/tables/towersTable.ts`
- `src/tables/categoriesTable.ts`
- `src/tables/baseRatesTable.ts`
- `src/tables/serviceTypesTable.ts`
- `src/tables/locationsTable.ts`
- `src/tables/serviceVendorMapTable.ts`
- `src/tables/vendorLocationsTable.ts`
- `src/tables/modifiersTable.ts`
- `src/tables/serviceNameAliasesTable.ts`
- `src/tables/vendorIdMappingTable.ts`
- `src/tables/vendorsTable.ts`

### Utilities
- `src/workflows/populateTables.ts` - Workflow to load CSV data into tables
- `src/tools/queryKnowledgeBase.ts` - Tool for agents to query tables
- `scripts/populate-tables.ts` - Standalone script for data loading

## Quick Start

### Step 1: Populate the Tables

Run the populate workflow to load your CSV data:

```bash
# Start dev server
adk dev

# In another terminal or in the dev console (http://localhost:3001):
# Go to Workflows → populate_tables → Run
```

The workflow will:
- Parse each CSV file
- Transform and validate data
- Insert into corresponding tables
- Log progress for each table

### Step 2: Use in Conversations

The tables are now available for querying in your conversations:

```typescript
import { serviceTypesTable, vendorsTable } from "@botpress/runtime";
import towersTable from "../tables/towersTable";
import queryKnowledgeBase from "../tools/queryKnowledgeBase";

export default new Conversation({
  channel: "webchat.channel",
  handler: async ({ execute }) => {
    await execute({
      instructions: `
        You are a service recommendation assistant.
        Use the query_knowledge_base tool to answer questions about:
        - Available services and service types
        - Vendors and their capabilities
        - Pricing information by location
        - Service requirements and SLAs
      `,
      tools: [queryKnowledgeBase],
    });
  },
});
```

### Step 3: Query Examples

Your agent can now use the `query_knowledge_base` tool:

```typescript
// Example queries the agent can make:
await queryKnowledgeBase({
  query_type: "vendors",
  search_term: "Accenture",
  limit: 5,
});

await queryKnowledgeBase({
  query_type: "service_types",
  filters: { Tower_Code: "HR" },
  search_term: "payroll",
  limit: 10,
});

await queryKnowledgeBase({
  query_type: "locations",
  filters: { Country: "India" },
  limit: 20,
});
```

## Direct Table Queries

You can also query tables directly in your code:

```typescript
import towersTable from "../tables/towersTable";
import serviceTypesTable from "../tables/serviceTypesTable";
import vendorsTable from "../tables/vendorsTable";

// Find active towers
const activeTowers = await towersTable.findRows({
  filter: { Status: "Active" },
});

// Search for services
const payrollServices = await serviceTypesTable.findRows({
  search: "payroll processing",
  filter: { Confidence: "HIGH" },
});

// Find vendors by criteria
const topVendors = await vendorsTable.findRows({
  filter: {
    financialHealthScore: { $in: ["A", "A+"] },
    primaryTower: "HR",
  },
  limit: 10,
});
```

## Table Features

### Full-Text Search
Tables have full-text search enabled on key columns:
- Tower/Category/Service names and descriptions
- Vendor names and capabilities
- Location cities and countries
- Service capabilities and certifications

### Complex Filtering
Use MongoDB-style query operators:
- `$eq`, `$ne` - Equal, not equal
- `$gt`, `$gte`, `$lt`, `$lte` - Comparisons
- `$in`, `$nin` - In array, not in array
- `$exists` - Field exists

### Relationships
Tables are interconnected:
```
Towers → Categories → Service Types → Service Vendor Map → Vendors
                                    ↓
                              Base Rates ← Locations
                                           ↓
                              Vendor Locations
```

## Common Use Cases

### Find services and pricing for a location
```typescript
// 1. Find services
const services = await serviceTypesTable.findRows({
  filter: { Tower_Code: "HR" },
  search: "payroll",
});

// 2. Get rates for location
const rates = await baseRatesTable.findRows({
  filter: {
    Service_Type_ID: services[0].Service_Type_ID,
    Location_Code: "IN-BLR",
  },
});

// 3. Find vendors for this service
const vendors = await serviceVendorMapTable.findRows({
  filter: { Service_Type_ID: services[0].Service_Type_ID },
});
```

### Find vendor capabilities and locations
```typescript
// 1. Find vendor
const vendor = await vendorsTable.findRows({
  search: "Accenture",
  limit: 1,
});

// 2. Get their delivery centers
const locations = await vendorLocationsTable.findRows({
  filter: { Vendor_ID: vendor[0].vendorId },
});

// 3. Get services they offer
const services = await serviceVendorMapTable.findRows({
  filter: { Vendor_ID: vendor[0].vendorId },
});
```

### Resolve service name aliases
```typescript
const userInput = "1099 reporting";

// Find the canonical service type
const alias = await serviceNameAliasesTable.findRows({
  filter: { User_Term: userInput },
  limit: 1,
});

if (alias.length > 0) {
  const serviceType = await serviceTypesTable.findRows({
    filter: { Service_Type_ID: alias[0].Service_Type_ID },
  });
}
```

## Updating Data

To refresh table data after updating CSVs:

1. Clear existing data (add to workflow):
```typescript
await towersTable.deleteAllRows();
await categoriesTable.deleteAllRows();
// ... etc
```

2. Re-run the populate workflow

## Next Steps

1. ✅ Tables created and built successfully
2. ⏭️ Run the populate workflow to load data
3. ⏭️ Test queries in your conversations
4. ⏭️ Add the queryKnowledgeBase tool to your main conversation
5. ⏭️ Consider creating specialized tools for common query patterns

## Documentation

- Full details in `TABLES.md`
- ADK Table docs: https://botpress.com/docs/for-developers/adk/concepts/tables
- Project structure in `CLAUDE.md`
