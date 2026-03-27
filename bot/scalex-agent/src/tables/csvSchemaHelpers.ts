import { z } from "@botpress/runtime";

/**
 * CSV-friendly Zod schema helpers
 *
 * These preprocessors handle empty values from CSV parsing:
 * - Empty strings "" become undefined (not empty string or NaN)
 * - This allows proper validation for required vs optional fields
 * - Required fields with empty values will fail validation
 * - Optional fields with empty values become undefined/null in database
 */

/**
 * csvString - REQUIRED string field preprocessor
 * Converts empty strings to undefined, which will fail validation
 */
const getValidString = (v : any) => {
    if (v === null || v === undefined) return undefined;
    if (typeof v === "string" && v.trim() === "") return undefined;
    return v;
}
const csvString = z.preprocess(getValidString, z.string());

/**
 * csvStringOptional - OPTIONAL string field preprocessor
 * Converts empty strings to undefined, which is accepted for optional fields
 */
const csvStringOptional = z.preprocess(getValidString, z.string().optional());

/**
 * csvNumber - REQUIRED number field preprocessor
 * Converts empty or invalid numeric strings to undefined, which will fail validation
 */

const getValidNumber = (v : any) => {
    if (v === null || v === undefined || v === "") return undefined;
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (trimmed === "") return undefined;
      const parsed = Number(trimmed);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
}

const csvNumber = z.preprocess(getValidNumber, z.number());

/**
 * csvNumberOptional - OPTIONAL number field preprocessor
 * Converts empty or invalid numeric strings to undefined, which is accepted
 */
const csvNumberOptional = z.preprocess(getValidNumber, z.number().optional());

/**
 * csvBoolean - REQUIRED boolean field preprocessor
 * Handles string boolean values: "true", "True", "false", "False"
 */
const getValidBoolean = (v : any) => {
    if (v === null || v === undefined || v === "") return undefined;
    if (typeof v === "boolean") return v;
    if (typeof v === "string") {
      const lower = v.trim().toLowerCase();
      if (lower === "true") return true;
      if (lower === "false") return false;
    }
    return undefined;
  }
const csvBoolean = z.preprocess(getValidBoolean, z.boolean());

/**
 * csvBooleanOptional - OPTIONAL boolean field preprocessor
 */
const csvBooleanOptional = z.preprocess(getValidBoolean, z.boolean().optional());

/**
 * csvNumberOrString - REQUIRED flexible number/string preprocessor
 * Attempts numeric conversion for pure numeric strings
 * Keeps strings like "10000+" or "N/A" as strings
 */
const getValidStringOrNumber = (v) => {
    if (v === null || v === undefined || v === "") return undefined;
    if (typeof v === "string") {
      const s = v.trim();
      if (s === "") return undefined;
      // Only convert if it's a pure number (integer or decimal, optional negative)
      if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
      return s; // Keep as string for "10000+", "N/A", etc.
    }
    return v;
}

const csvNumberOrString = z.preprocess(getValidStringOrNumber, z.union([z.number(), z.string()]));

/**
 * csvNumberOrStringOptional - OPTIONAL flexible number/string preprocessor
 */
const csvNumberOrStringOptional = z.preprocess(getValidStringOrNumber, z.union([z.number(), z.string()]).optional());

/**
 * Export typed helpers with required/optional variants
 */
/**
 * csvStringWithDefault - String field that defaults to a value when empty
 * Use for columns that are required in the cloud table but may be empty in v3 CSVs
 */
const csvStringWithDefault = (defaultVal: string) =>
  z.preprocess(getValidString, z.string().default(defaultVal));

/**
 * csvNumberWithDefault - Number field that defaults to a value when empty
 * Use for columns that are required in the cloud table but may be empty in v3 CSVs
 */
const csvNumberWithDefault = (defaultVal: number) =>
  z.preprocess(getValidNumber, z.number().default(defaultVal));

export const csv = {
  // String helpers
  string: () => csvString,
  stringOptional: () => csvStringOptional,
  stringWithDefault: (defaultVal: string) => csvStringWithDefault(defaultVal),

  // Number helpers
  number: () => csvNumber,
  numberOptional: () => csvNumberOptional,
  numberWithDefault: (defaultVal: number) => csvNumberWithDefault(defaultVal),

  // Boolean helpers
  boolean: () => csvBoolean,
  booleanOptional: () => csvBooleanOptional,

  // Flexible number/string helpers
  numberOrString: () => csvNumberOrString,
  numberOrStringOptional: () => csvNumberOrStringOptional,
};

/**
 * Transform a schema object to make all columns searchable
 *
 * This helper converts short-form schema definitions to the long-form
 * format with searchable: true, enabling semantic search on all columns
 * while preserving the original schema export for other uses (e.g., queryTableTool)
 *
 * @example
 * const schema = { name: csv.string(), age: csv.number() }
 * new Table({ columns: makeSearchable(schema) })
 */
export function makeSearchable<T extends Record<string, z.ZodTypeAny>>(
  schema: T
): Record<keyof T, { schema: T[keyof T]; searchable: true }> {
  const result: any = {}
  for (const [key, value] of Object.entries(schema)) {
    result[key] = { schema: value, searchable: true }
  }
  return result
}
