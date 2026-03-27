# Knowledge Base Tables

This document describes the ADK tables created from your CSV files and how to use them.

## Tables Created

I've created 11 ADK tables based on your CSV files in `kb-data/data/`:

1. **towersTable** - Service towers (HR, FA, etc.)
2. **categoriesTable** - Service categories within towers
3. **baseRatesTable** - Pricing rates by location, tier, and service
4. **serviceTypesTable** - Detailed service type definitions
5. **locationsTable** - Geographic locations with cost indices
6. **serviceVendorMapTable** - Mapping of services to vendors
7. **vendorLocationsTable** - Vendor delivery center locations
8. **modifiersTable** - Configuration modifiers for services
9. **serviceNameAliasesTable** - User-friendly aliases for service names
10. **vendorIdMappingTable** - Vendor ID lookup table
11. **vendorsTable** - Comprehensive vendor information

## How to Populate Tables

### Option 1: Using the Workflow (Recommended)

I've created a workflow at `src/workflows/populateTables.ts` that will populate all tables from your CSV files.

To run it:

1. Start your dev server: `adk dev`
2. In your dev console (http://localhost:3001), go to Workflows
3. Manually trigger the `populate_tables` workflow
4. Monitor progress in the logs

The workflow uses durable steps, so it will survive restarts and you can see progress for each table.

### Option 2: Using the Script

I've also created a standalone script at `scripts/populate-tables.ts` if you prefer to run outside of the ADK runtime.

```bash
bun run scripts/populate-tables.ts
```

Note: You'll need to uncomment the actual insert calls in the script and adjust the imports after running `adk dev` to generate types.

## Using Tables in Your Agent

### In Conversations

```typescript
import { towersTable, vendorsTable } from "@botpress/runtime";

export default new Conversation({
  channel: "webchat.channel",
  handler: async ({ execute, message }) => {
    // Query tables directly
    const towers = await towersTable.findRows({
      filter: { Status: "Active" },
    });

    // Use in execute with the query tool
    await execute({
      instructions: `You are a service recommendation assistant. Use the query_knowledge_base tool to answer questions about services, vendors, and pricing.`,
      tools: [queryKnowledgeBase],
    });
  },
});
```

### Querying Tables

The ADK provides powerful query capabilities:

```typescript
// Simple search
const results = await serviceTypesTable.findRows({
  search: "customer service",
  limit: 10,
});

// Filtered search
const hrServices = await serviceTypesTable.findRows({
  filter: {
    Tower_Code: "HR",
    Confidence: "HIGH",
  },
  search: "payroll",
});

// Complex queries with operators
const premiumVendors = await vendorsTable.findRows({
  filter: {
    financialHealthScore: { $in: ["A", "A+"] },
    employeeCount: { $gte: 10000 },
  },
});
```

### Using the Query Tool

I've created a tool at `src/tools/queryKnowledgeBase.ts` that your agent can use autonomously:

```typescript
// The agent can now use this tool during execute()
await execute({
  instructions: `Answer questions about vendors and services using the query_knowledge_base tool.`,
  tools: [queryKnowledgeBase],
});

// Example queries the agent can make:
// - "Find all vendors in the HR tower"
// - "What services are available in India?"
// - "Show me high-confidence service types"
```

## Table Features

### Searchable Columns

I've marked certain columns as searchable using `.searchable()`:

- **Tower names and descriptions** - Easy to find towers by name
- **Service names and descriptions** - Search for services
- **Vendor names** - Find vendors by name
- **Location cities and countries** - Geographic search
- **Service capabilities and certifications** - Find vendors by capabilities

### Column Descriptions

All columns have descriptions using `.describe()` to help the LLM understand what data they contain.

## Data Relationships

The tables are related as follows:

```
Towers (Tower_Code)
  └─> Categories (Tower_Code)
       └─> Service Types (SubCategory_Code)
            ├─> Base Rates (Tower_Code)
            └─> Service Vendor Map (Service_Type_ID)
                 └─> Vendors (Vendor_ID)
                      └─> Vendor Locations (Vendor_ID)

Locations (Location_Code)
  ├─> Base Rates (Location_Code)
  └─> Vendor Locations (Location_Code)

Service Name Aliases → Service Types (Service_Type_ID)
Vendor ID Mapping → Vendors (Vendor_ID)
Modifiers → (applies to multiple towers)
```

## Next Steps

1. **Run the populate workflow** to load your data
2. **Test queries** in your conversations
3. **Add custom tools** for specific query patterns your agent needs
4. **Consider creating computed columns** for frequently calculated values
5. **Set up scheduled refresh** if your CSV data updates regularly

## Example Use Cases

### Find vendors for a service
```typescript
const service = await serviceTypesTable.findRows({
  search: "payroll processing",
  limit: 1,
});

const vendors = await serviceVendorMapTable.findRows({
  filter: { Service_Type_ID: service[0].Service_Type_ID },
});
```

### Get pricing for a location
```typescript
const rates = await baseRatesTable.findRows({
  filter: {
    Location_Code: "IN-BLR",
    Tower_Code: "HR",
    Tier: "T1",
  },
});
```

### Find vendor delivery centers
```typescript
const accentureLocations = await vendorLocationsTable.findRows({
  search: "Accenture",
  filter: { Country: "India" },
});
```

## Maintenance

- **Refresh data**: Re-run the populate workflow (it will need logic to clear tables first)
- **Add new tables**: Create new files in `src/tables/` (they're auto-registered)
- **Update schemas**: Modify the table definitions and run `adk build` to regenerate types
