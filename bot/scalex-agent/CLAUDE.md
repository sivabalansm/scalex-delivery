# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**scalex-agent** is a Botpress ADK bot that serves as an enterprise service vendor and pricing knowledge base assistant. It helps users query information about outsourcing vendors, service pricing, locations, and capabilities across multiple service towers (HR, Finance, IT, etc.).

**Key Characteristic**: This is a CSV-first architecture where 22 tables (19 CSVs + 3 ext overflow tables) are ingested into ADK tables rather than using external knowledge bases or document storage. Botpress Cloud has a 20-column limit per table, so large schemas are split into a base table + `_ext` overflow table joined on a shared ID.

## Development Commands

```bash
# Development
adk dev                    # Starts dev server at http://localhost:3001
                          # Hot reload enabled, web console for testing

# Build & Deploy
adk build                 # Compiles TypeScript, generates types
adk deploy                # Deploys to Botpress Cloud

# Testing Data Load
# After starting adk dev:
# 1. Open http://localhost:3001
# 2. Navigate to Workflows
# 3. Execute "populateTables" workflow
# 4. Check logs for validation errors and row counts
```

## Architecture Overview

### Data Flow

```
CSV Files (kb-data/data/)
    ↓ (parsed via csv-parser)
populateTables Workflow
    ↓ (validates with Zod parsers)
22 ADK Tables
    ↓ (queried via)
queryKnowledgeBase Tool
    ↓ (called by)
Conversation Handlers (future)
```

### Core Tables (22 total)

The system is built around 22 interconnected knowledge base tables (plus 3 clause extraction tables):

**Primary Entities:**
- `towersTable` (~14 rows) - Service domains (HR, Finance, IT, etc.)
- `vendorsTable` (~1,700 rows) - Vendor profiles (capped at 20 columns)
- `vendorsExtTable` - Extended vendor data (Maxx tier, risk score, numeric financials). Join on vendorId.
- `locationsTable` (~185 rows) - Geographic locations with cost indices

**Service Definitions & SLAs:**
- `categoriesTable` (~119 rows) - Sub-domains within towers
- `serviceTypesTable` (~414 rows) - Canonical service definitions, pricing models, delivery channels
- `serviceTypesExtTable` - Extended service type data (complexity, AHT, volumes, Managed_Service_Load). Join on Service_Type_ID.
- `slaTable` (~11 rows) - SLA definitions (timeliness & quality targets)
- `serviceTypeSlaTable` (~828 rows) - Junction: maps service types to SLAs with target overrides

**Pricing & Rates:**
- `baseRatesTable` (~1,054 rows) - Hourly rates by location, tier, and agent type
- `baseRatesExtTable` - Extended rate data (per-unit rates, methodology, confidence). Join on Rate_ID.
- `managedServiceLoadTable` - Service complexity load multipliers (Light 1.20x, Standard 1.45x, Premium 1.65x)
- `modifierAdjustmentsTable` - Pricing adjustment multipliers by modifier

**Vendor & Location Mapping:**
- `serviceVendorMapTable` (~4,692 rows) - Which vendors offer which services
- `vendorLocationsTable` (~644 rows) - Vendor delivery centers
- `vendorIdMappingTable` (~1,741 rows) - Vendor name → ID lookup

**Lookup & Configuration:**
- `modifiersTable` (~8 rows) - Configuration questions for services
- `serviceNameAliasesTable` (~1,462 rows) - User term → service mappings
- `taxonomyCrosswalksTable` - External system code → Maxx taxonomy mappings

**Risk, Treatment & Contracts:**
- `riskRulesTable` - Risk scoring rules and thresholds
- `treatmentRecommendationsTable` - Recommended actions for procurement findings
- `contractBenchmarksTable` - Contract term benchmarks and standard clauses

**Note:** Botpress Cloud enforces a 20-column limit per table. Tables exceeding this are split into base + `_ext` tables joined on a shared ID column.

## Critical Patterns

### 1. Table Definition Pattern

**Every table follows this exact structure:**

```typescript
import { Table, z } from "@botpress/runtime";
import { csv } from "./csvSchemaHelpers";

const schema = {
  Field_Name: csv.string().describe("Description"),
  Optional_Field: csv.stringOptional().describe("Description"),
  // ... more fields
};

export const parser = z.object(schema).parse;  // ← MUST export for workflow

export default new Table({
  name: "tableName Table",  // ← MUST end with "Table" suffix
  columns: schema,
});
```

**Key Rules:**
- Table names MUST end with "Table" (ADK requirement)
- Export both `schema` and `parser`
- Use CSV helpers from `csvSchemaHelpers.ts`, not raw `z.coerce.*`

### 2. CSV Schema Helpers (Critical!)

**File:** `src/tables/csvSchemaHelpers.ts`

This is the most important utility in the codebase. It provides 8 typed functions that handle CSV-specific data validation:

**Available Helpers:**

| Helper | Use When | Empty Value Behavior |
|--------|----------|---------------------|
| `csv.string()` | Required text field | Empty → validation error |
| `csv.stringOptional()` | Optional text field | Empty → `undefined` |
| `csv.number()` | Required numeric field | Empty/invalid → validation error |
| `csv.numberOptional()` | Optional numeric field | Empty/invalid → `undefined` |
| `csv.boolean()` | Required boolean | Handles "True"/"False" strings |
| `csv.booleanOptional()` | Optional boolean | Handles "True"/"False" strings |
| `csv.numberOrString()` | Flexible field | Converts "100" → 100, keeps "10000+" as string |
| `csv.numberOrStringOptional()` | Optional flexible | Same + empty → `undefined` |
| `csv.stringWithDefault(def)` | String with fallback | Empty → default value |
| `csv.numberWithDefault(def)` | Number with fallback | Empty/invalid → default value |

**Why These Exist:**
- CSV parsers return empty strings `""` for empty cells
- Standard `z.coerce.number()` converts `""` → `NaN` → validation failure
- Standard `z.string().optional()` doesn't work because preprocessors return `undefined` before `.optional()` can accept it
- These helpers have `.optional()` built into the base schema, not added after

**❌ WRONG:**
```typescript
import { z } from "@botpress/runtime";
Founded_Year: z.coerce.number().optional()  // Will fail on empty values
```

**✅ CORRECT:**
```typescript
import { csv } from "./csvSchemaHelpers";
Founded_Year: csv.numberOptional()  // Handles empty values properly
```

### 3. CSV Import Workflow Pattern

**File:** `src/workflows/example.ts` (active workflow, despite the name)

The `populateTables` workflow demonstrates the standard CSV import pattern:

```typescript
async function csvToTable(csvFile: string, table: any, parser: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const validRows: any[] = [];
    const errors: Array<{ row: number; data: any; error: string }> = [];
    let rowNumber = 0;

    createReadStream(join(KB_DATA_DIR, csvFile))
      .pipe(csv())
      .on("data", (data: any) => {
        rowNumber++;
        try {
          const parsedData = parser(data);  // Zod validation happens here
          validRows.push(parsedData);
        } catch (error: any) {
          errors.push({ row: rowNumber + 1, data, error: error.message });
        }
      })
      .on("end", async () => {
        // Report errors (first 5 + count)
        if (errors.length > 0) { /* ... */ }

        // Batch insert in 1000-row chunks
        if (validRows.length >= 1000) {
          for (let start = 0; start < validRows.length; start += 1000) {
            await table.createRows({ rows: validRows.slice(start, 1000) });
          }
        } else {
          await table.createRows({ rows: validRows });
        }

        resolve();
      });
  });
}
```

**Key Features:**
- Row-by-row validation with error collection
- Continues processing on validation errors (doesn't fail fast)
- Batch inserts for performance (1000 rows at a time)
- Detailed error reporting with row numbers

### 4. Tool Pattern: queryTableTool

**File:** `src/tools/queryTableTool.ts`

This tool provides the agent with table query capabilities across all 22 KB tables:

```typescript
export default new Autonomous.Tool({
  name: "queryTableTool",
  input: z.object({
    query_type: z.enum([
      "towers", "categories", "service_types", "locations",
      "vendors", "vendor_locations", "service_vendor_map",
      "modifiers", "service_aliases", "base_rates", "vendor_id_mapping",
      "risk_rules", "treatment_recommendations", "contract_benchmarks",
      "modifier_adjustments", "taxonomy_crosswalks", "managed_service_load",
      "base_rates_ext", "service_types_ext", "vendors_ext",
      "sla", "service_type_sla"
    ]),
    search_term: z.string().optional(),
    filters: z.record(z.string(), z.any()).optional(),
    limit: z.number().optional().default(5),
  }),
  // Returns typed discriminated union per query_type with clean (no ADK metadata) results
});
```

**Usage in Conversations:**
```typescript
await execute({
  instructions: customPrompt,
  tools: [queryTableTool],
  knowledge: [narrativeAdvisoryContext],
});
```

## Common Tasks

### Adding a New Table

1. Create CSV file in `kb-data/data/`
2. Create table definition in `src/tables/`:
   ```typescript
   import { Table, z } from "@botpress/runtime";
   import { csv } from "./csvSchemaHelpers";

   const schema = {
     id: csv.string().describe("Unique identifier"),
     name: csv.string().describe("Name"),
     optional_field: csv.stringOptional().describe("Optional data"),
   };

   export const parser = z.object(schema).parse;

   export default new Table({
     name: "myNewTable",  // Must end with "Table"
     columns: schema,
   });
   ```
3. Add import to `src/workflows/example.ts`
4. Add step to `populateTables` workflow
5. Run `adk build` to regenerate types
6. Test with `adk dev` and execute workflow

### Modifying Table Schemas

1. Update the table's schema definition
2. If changing optional fields, use `csv.*Optional()` helpers
3. Run `adk build` to regenerate types
4. Clear existing table data if needed
5. Re-run `populateTables` workflow
6. Check logs for validation errors

### Debugging CSV Import Failures

When rows fail validation, the workflow logs show:
```
✗ Validation errors in 10 rows:
  Row 42: [ { "code": "invalid_type", "path": ["fieldName"], "message": "Required" } ]
  Data: {"field1":"value1","field2":"","field3":"value3"}...
```

**Common Issues:**
1. **Empty required field** → Make field optional with `csv.*Optional()`
2. **Invalid number format** → Check for non-numeric strings, use `csv.numberOrString()`
3. **Boolean as string** → Use `csv.boolean()` which handles "True"/"False"
4. **Union type rejection** → Don't use `numberOrString.optional()`, use `csv.numberOrStringOptional()`

## File Organization

```
scalex-agent/
├── agent.config.ts              # Root configuration (webchat integration)
├── src/
│   ├── conversations/           # User interaction handlers (v3 prompt)
│   │   └── index.ts
│   ├── workflows/               # Background tasks & data loading
│   │   └── example.ts          # ⚠️ ACTIVE CSV import workflow (misnamed)
│   ├── tables/                  # 22 KB table definitions + 3 clause tables + helpers
│   │   ├── csvSchemaHelpers.ts # ⚠️ CRITICAL - CSV validation helpers (includes stringWithDefault, numberWithDefault)
│   │   ├── numberOrString.ts   # Legacy helper (use csvSchemaHelpers instead)
│   │   ├── towersTable.ts
│   │   ├── categoriesTable.ts
│   │   ├── baseRatesTable.ts
│   │   ├── baseRatesExtTable.ts     # Ext overflow (join on Rate_ID)
│   │   ├── serviceTypesTable.ts
│   │   ├── serviceTypesExtTable.ts  # Ext overflow (join on Service_Type_ID)
│   │   ├── locationsTable.ts
│   │   ├── serviceVendorMapTable.ts
│   │   ├── vendorLocationsTable.ts
│   │   ├── modifiersTable.ts
│   │   ├── modifierAdjustmentsTable.ts
│   │   ├── serviceNameAliasesTable.ts
│   │   ├── vendorIdMappingTable.ts
│   │   ├── vendorsTable.ts
│   │   ├── vendorsExtTable.ts       # Ext overflow (join on vendorId)
│   │   ├── slaTable.ts
│   │   ├── serviceTypeSlaTable.ts
│   │   ├── riskRulesTable.ts
│   │   ├── treatmentRecommendationsTable.ts
│   │   ├── contractBenchmarksTable.ts
│   │   ├── managedServiceLoadTable.ts
│   │   └── taxonomyCrosswalksTable.ts
│   ├── tools/                   # AI-callable functions
│   │   └── queryKnowledgeBase.ts  # Main query tool
│   ├── triggers/                # Event handlers
│   │   └── index.ts            # Bot.started event
│   ├── knowledge/               # RAG narrative/advisory KB markdown files
│   ├── utils/                   # Helpers (file upload, progress components)
│   └── actions/                 # Action handlers
├── kb-data/
│   ├── data/                   # ⚠️ Source CSV files (19 files)
│   └── *.md                    # Project specifications
└── scripts/
    └── populate-tables.ts      # UNUSED - example only (use workflows/example.ts)
```

## Known Issues & Gotchas

### 1. Hardcoded Path in Workflow
```typescript
// src/workflows/example.ts line 28
const KB_DATA_DIR = join("/Users/sivabalan.muthurajan/...", "kb-data", "data");
```
**Issue:** Absolute path is machine-specific
**Fix:** Should use environment variable or `process.cwd()`

### 2. Misnamed Active Workflow
The primary CSV import workflow is in `example.ts`, not `populateTables.ts` (which is unused).

### 3. Auto-Registration vs. Manual Exports
- Tables in `src/tables/` are **auto-registered** by ADK (DO NOT export from index.ts)
- Manually exporting causes duplicate registration errors
- Same applies to conversations, workflows, triggers

### 4. Table Name Suffix Requirement
```typescript
// ❌ WRONG
name: "vendors"

// ✅ CORRECT
name: "vendorsTable"
```
ADK requires all table names to end with "Table".

### 5. Reserved Column Names
Cannot use these as column names in table schemas:
- `id` (auto-generated by ADK)
- `createdAt` (auto-generated)
- `updatedAt` (auto-generated)
- `computed`
- `stale`

### 6. Union Types Not Supported in Botpress Cloud
```typescript
// ❌ WRONG - Will fail on deployment
Labor_Market_Tier: csv.numberOrStringOptional()  // Union type: z.union([number, string])

// ✅ CORRECT - Use simple types
Labor_Market_Tier: csv.stringOptional()  // Simple string type
```

**Issue:** Botpress Cloud tables only support simple types (string, number, boolean), not union types like `z.union([z.number(), z.string()])`.

**When this fails:**
- During `adk deploy` when syncing tables to production
- Error: "Invalid input" with nested union validation errors

**Solution:**
- Use `csv.stringOptional()` instead of `csv.numberOrStringOptional()`
- Use `csv.numberOptional()` for purely numeric fields
- Store mixed-type data as strings and parse in application code if needed
- The `csv.numberOrString()` helpers work fine for **local development and CSV import**, but the resulting table schema cannot be deployed to Botpress Cloud

**Development vs Production:**
- ✅ Local dev (`adk dev`): Union types work fine
- ❌ Production (`adk deploy`): Union types fail during table sync
- **Best practice:** Use only simple types in table schemas to ensure deployment compatibility

## Next Steps for Development

**Completed:**
- Conversation handler with v3 system prompt (delivery model gate, SLA lookup, modifier sequence, risk/treatment, tower coverage)
- Clause extraction workflow (PDF/DOCX upload → clause extraction → benchmark comparison)
- 22-table v3 data model with ext overflow pattern
- Bot naming/branding (MaxxBot)

**Future Enhancements:**
- Better LLM model selection
- Document comparison feature
- Automated modifier stacking calculations

## ADK Reference

**Useful Commands:**
```bash
adk dev                 # Development mode with hot reload
adk build              # Generate types, compile TypeScript
adk deploy             # Deploy to Botpress Cloud
adk chat               # CLI chat interface (after adk dev)
```

**Key Documentation:**
- ADK Overview: https://botpress.com/docs/adk
- Tables: https://botpress.com/docs/adk/concepts/tables
- Workflows: https://botpress.com/docs/adk/concepts/workflows
- Tools: https://botpress.com/docs/adk/concepts/tools
