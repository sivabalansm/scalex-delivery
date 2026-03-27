# ScaleX Kickoff Email - January 26, 2026

**From:** Alex Rochlitz <alex@yourscalex.com>
**Subject:** kickoff summary / data requests

---

## Alex's Understanding of Build Sequence

1. Table data integration + basic querying (start immediately)
2. Multi-table reasoning (rate benchmarks with location/service type joins)
3. Document upload + structured extraction (proposals, contracts)
4. Export/PDF generation (simple first iteration)

---

## What Alex is Delivering

### This Week (Received Today)
- [x] All current table CSVs (11 tables) - **DOWNLOADED to `data/` folder**
- [ ] 2-3 sample documents for upload testing (contract + supplier proposal) - **in Google Drive links**
- [ ] 20-30 Golden Questions with expected answers - **needs to provide if not in SOW**
- [ ] 2-3 export template mockups - **to be shared later this week**

### Google Drive Links (Sample Documents)
- [Exec Summary Project Swift v4.pdf](https://drive.google.com/file/d/1WodmHOrT8eo4-aKHPCUV9YZWmsNWl0l3/view?usp=drive_web)
- [SOW 1 and MSA signed (2) v4.pdf](https://drive.google.com/file/d/1yiLSZOqI_2rgO5qFFDRVzThVoqY4YvBH/view?usp=drive_web)

**Note:** Documents are confidential - NDA covered in signed SOW.

---

## Alex's Questions (Need Answers)

1. **First Testable Build:** When can Alex test basic table querying?
2. **Golden Questions Validation:** When can we run first 10-15 Golden Questions end-to-end?
3. **Tables 12-15:** The 4 additional tables (risks, methodology, treatmentRules, contractClauses):
   - Are these blocking for initial build, or can we start with the 11 tables?
   - If blocking, what's the latest needed to stay on track for April 14?
4. **Slack Setup:** Should Alex create workspace and invite us, or wait for our invite?

---

## Tables Received (11 total, ~11K rows)

| File | Table | Rows | Description |
|------|-------|------|-------------|
| TBL-001_TOWERS_v4.csv | Towers | 15 | Top-level service categories |
| TBL-002_CATEGORIES_COMPLETE.csv | Categories | 120 | Category taxonomy |
| TBL-003_BaseRates_v5_FINAL.csv | Base Rates | 1,055 | Rate benchmarks by service/location |
| TBL-005_SERVICE_TYPES.csv | Service Types | 918 | Service taxonomy and attributes |
| TBL-006_LOCATIONS_v4.csv | Locations | 186 | Location codes, FX rates, tiers |
| TBL-009_SERVICE_VENDOR_MAP_v4.csv | Service-Vendor Map | 4,693 | Which vendors offer which services |
| TBL-010_VENDOR_LOCATIONS_VALIDATED.csv | Vendor Locations | 645 | Vendor delivery center locations |
| TBL-011_MODIFIERS.csv | Modifiers | 9 | Rate modifiers (complexity, language) |
| SERVICE_NAME_ALIASES_v3.csv | Service Aliases | 1,463 | Fuzzy matching aliases |
| VENDORID_MAPPING.csv | Vendor ID Mapping | 1,742 | Vendor name normalization |
| VENDORS_BOTPRESS_FINAL_v4.csv | Vendors | 1,742 | Full vendor profiles |

**Total: ~12,588 rows**

---

## Alex's Commitment

- Tables 12-15 and completed Golden Questions: **within 1 week if needed**

---

## Action Items

### For Botpress (David)
- [ ] Answer Alex's 4 questions
- [ ] Confirm if TBL-012 to TBL-015 are blocking
- [ ] Provide Slack workspace invite or instructions
- [ ] Download sample documents from Google Drive

### For ScaleX (Alex)
- [ ] Provide Golden Questions with expected answers (if not complete in SOW)
- [ ] Provide export template mockups
- [ ] Create TBL-012 to TBL-015 (within 1 week)
