import {
  SelectField,
  TextField,
  TextareaField,
} from "@byte-quest/ui/components/fields";

import type { RegisterErrors, SchoolDetails } from "./data";
import { provinceOptions } from "./data";

interface StepSchoolProps {
  errors: RegisterErrors;
  onChange: (patch: Partial<SchoolDetails>) => void;
  school: SchoolDetails;
}

export const StepSchool = ({ errors, onChange, school }: StepSchoolProps) => (
  <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
    <TextField
      autoComplete="organization"
      error={errors.school?.name}
      id="school-name"
      label="School name"
      onValueChange={(value) => onChange({ name: value })}
      placeholder="Full school name"
      required
      value={school.name}
    />
    <SelectField
      error={errors.school?.province}
      id="school-province"
      label="Province"
      onValueChange={(value) => onChange({ province: value })}
      options={provinceOptions}
      placeholder="Select province"
      required
      value={school.province}
    />
    <TextField
      error={errors.school?.district}
      id="school-district"
      label="District / city"
      onValueChange={(value) => onChange({ district: value })}
      placeholder="e.g. Galle"
      required
      value={school.district}
    />
    <TextareaField
      id="school-address"
      label="School address"
      onValueChange={(value) => onChange({ address: value })}
      placeholder="Street, city"
      rows={3}
      value={school.address}
    />
  </div>
);
