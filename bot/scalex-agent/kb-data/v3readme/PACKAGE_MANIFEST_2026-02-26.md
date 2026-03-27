# Final package manifest — 2026-02-26

**Folder:** `projects/R_methodology/for siva v3 final/`  
**Refresh script:** `python3 projects/R_methodology/analysis/refresh_siva_v3_final_package.py` (from repo root)

## Tables (19 CSVs)

| File | Description |
|------|-------------|
| TBL-001_TOWERS_v4.csv | Towers (20) |
| TBL-002_CATEGORIES_COMPLETE.csv | Categories (94) |
| TBL-003_BaseRates_v7_AMENDED.csv | Base rates (Direct_Labor) |
| TBL-004_SERVICE_TYPES_v2.csv | Service types (414) |
| TBL-005_LOCATIONS_v4.csv | Locations (India=100) |
| TBL-006_VENDORS_BOTPRESS_FINAL_v4.csv | Vendor profiles |
| TBL-007_SERVICE_NAME_ALIASES_v3.csv | Service name aliases |
| TBL-008_SERVICE_VENDOR_MAP_v4.csv | Service–vendor mapping |
| TBL-009_VENDOR_LOCATIONS_VALIDATED.csv | Vendor locations |
| TBL-010_MODIFIERS.csv | Modifiers (39) |
| TBL-011_VENDORID_MAPPING.csv | Vendor ID mapping |
| TBL-012_RISK_RULES_v2.csv | Risk rules |
| TBL-013_TREATMENT_RECOMMENDATIONS_v2.csv | Treatment recommendations |
| TBL-014_CONTRACT_BENCHMARKS_v2.csv | Contract benchmarks |
| TBL-015_MODIFIER_ADJUSTMENTS.csv | Modifier adjustments |
| TBL-016_TAXONOMY_CROSSWALKS.csv | Taxonomy crosswalks (88: 27 Nielsen + 61 APQC) |
| TBL-017_MANAGED_SERVICE_LOAD.csv | Managed service load (Light/Standard/Premium) |
| SLA.csv | SLA master |
| Service_Type_SLA.csv | Service type × SLA junction (828 rows) |

## Documentation

| File | Use |
|------|-----|
| R_DATABASE_SCHEMA.md | Table definitions, column specs, relationships, query patterns |
| R_MAXXBOT_BOTPRESS_MAPPING.md | Routing, RETRIEVE, STEPS, PROCESS; delivery model; modifier math |
| R_MAXX_METHODOLOGY_v2.md | Methodology; pricing; taxonomy; TBL-017; appendices (location, modifiers) |
| R_FUNCTION_CATALOG.md | 12 functions (WF-01–WF-12); in-scope ~3 scripted |
| R_GOLDEN_QUESTION_ANSWERS_v2.md | Golden question answer key |
| R_TABLE_FIELD_DEFINITIONS.md | Every table and column defined |
| AUTHORITATIVE_VALUES.md | Locked figures (do not change without approval) |

## Excels (optional for validation)

| File | Use |
|------|-----|
| R_Table_Field_Definitions.xlsx | Field_Definitions, Table_Purpose_Why, Review_Findings |
| R_Table_Definitions_And_Data.xlsx | One tab per table: Data + Def |

## One-pagers

| File | Use |
|------|-----|
| R_BOTPRESS_V3_UPDATE_FOR_SIVA.md | v3 status and v2→v3 delta |
| R_BOTPRESS_V2_TO_V3_SUMMARY_OVERVIEW.html | Summary overview (open in browser) |
