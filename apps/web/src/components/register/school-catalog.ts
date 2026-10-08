import type { FieldOption } from "@/components/site/design-fields";
import schoolsJson from "@/data/schools.json";

/**
 * National government school directory (2018 census), sourced from
 * `apps/web/src/data/schools.csv`. Used to power the School name combobox on
 * the register form so a school can be found by typing a few letters instead
 * of retyping its exact official name; province and district are filled in
 * automatically when an entry from this list is picked. Schools outside this
 * list (private, international, or newly opened) can still be typed in by
 * hand - the field does not require a catalog match.
 */
export interface CatalogSchool {
  name: string;
  province: string;
  district: string;
}

export const SCHOOL_CATALOG: CatalogSchool[] = schoolsJson as CatalogSchool[];

const byName: Record<string, CatalogSchool> = Object.fromEntries(
  SCHOOL_CATALOG.map((school) => [school.name.toLowerCase(), school] as const)
);

/** Exact (case-insensitive) catalog match for a typed school name. */
export const findSchoolByName = (name: string): CatalogSchool | null =>
  byName[name.trim().toLowerCase()] ?? null;

/**
 * One combobox option per distinct school name (first catalog occurrence
 * wins when a name repeats across districts). District/province for the
 * picked school are still filled from the exact match above, and the
 * separate District field stays user-editable for any mismatch.
 */
export const schoolNameOptions: FieldOption[] = Object.values(byName).map(
  (school) => ({ value: school.name, label: school.name })
);
