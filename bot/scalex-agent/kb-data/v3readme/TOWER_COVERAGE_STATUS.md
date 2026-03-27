# Tower coverage status (v3 package)
**Date:** 2026-02-26  
**Purpose:** Document which towers have taxonomy (categories/service types), rate data, and how rate lookup works for Siva.

---

## Summary

| Tower code | Tower name | Categories (TBL-002) | Service types (TBL-004) | Rates (TBL-003) | Frontline_Agent_Type in TBL-004 | Rate lookup path |
|------------|------------|:-------------------:|:-----------------------:|:---------------:|:-------------------------------:|------------------|
| AI | AI & Data Services | ✓ | 10 | ✓ | ✓ | WF-01 full (alias → TBL-004 → TBL-003) |
| CO | Customer Operations | ✓ | 48 | ✓ | ✓ | WF-01 full |
| COP | Content Operations | ✓ | 19 | ✓ | ✓ | WF-01 full |
| ENG | Engineering & Product Development | ✓ | 38 | — | NULL | No rates; taxonomy only |
| FA | Finance & Accounting | ✓ | 35 | ✓ | ✓ | WF-01 full |
| FR | Facilities & Real Estate | ✓ | 41 | — | NULL | No rates in canonical TBL-003; taxonomy only |
| HR | Human Resources | ✓ | 9 | ✓ | ✓ | WF-01 full |
| IT | Information Technology | ✓ | 46 | ✓ | ✓ | WF-01 full |
| MK | Marketing & Growth Services | ✓ | 48 | — | NULL | No rates; taxonomy only |
| RC | Risk & Compliance | ✓ | 43 | — | NULL | No rates; taxonomy only |
| SC | Supply Chain | ✓ | 77 | ✓ | ✓ | WF-01 full |

**Towers in TBL-001 with 0 categories / 0 service types in current taxonomy (rehomed or retired):**

| Tower code | Tower name | Note |
|------------|------------|------|
| PS | Professional Services | Retired for v3. Management consulting assumed in other functional towers (e.g. RC, ENG). |
| CL | Clinical/Life Sciences | Folded into Industry Verticals / SC (e.g. CAT-SC-006 Healthcare & Life Sciences). |
| ME | Media & Entertainment | Folded into SC (CAT-SC-010 Media & Entertainment). |
| EN | Energy & Utilities | Folded into SC (CAT-SC-004 Energy & Utilities). |
| MO | Manufacturing Operations | Folded into SC (CAT-SC-002, SC-009, etc.). |
| IV | Industry Verticals | Placeholder; low data for now. |
| ALL | All Towers | Synthetic (e.g. contract benchmarks). |
| CX | Customer Experience | Alias for CO; used in TBL-014. |
| CNAS | Corporate Non-Addressable Spend | No taxonomy rows yet. |

---

## Note for Siva (rate lookup)

- **WF-01 (Rate Benchmark):** For towers with both taxonomy and rates (AI, CO, COP, FA, HR, IT, SC), use full path: TBL-007 alias → TBL-004 Service_Type_ID → Frontline_Agent_Type + Location + Tier → TBL-003. Filter **Rate_Unit = 'Per_Hour'** for hourly rate lookups (see R_MAXXBOT_BOTPRESS_MAPPING).
- **Towers with taxonomy but no rates (ENG, FR, MK, RC):** TBL-004 exists; Frontline_Agent_Type is NULL. Rate lookup will return no rows until TBL-003 is populated for these towers.
- **PS, CL, ME, EN, MO:** Tower rows exist in TBL-001; rate data for these codes may exist in TBL-003 from legacy. Categories/service types were rehomed (SC, RC, ENG) or retired (PS). For v3 we do not add separate taxonomy under these codes; management consulting and industry-vertical work are covered via SC/RC/ENG where applicable.
