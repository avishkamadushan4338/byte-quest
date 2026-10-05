import {
  fieldGridClass,
  InputField,
  SelectField,
} from "@/components/site/design-fields";

import type { RegisterErrors, SchoolDetails } from "./data";
import { provinceOptions } from "./data";

interface StepSchoolProps {
  errors: RegisterErrors;
  onChange: (patch: Partial<SchoolDetails>) => void;
  school: SchoolDetails;
}

export const StepSchool = ({ errors, onChange, school }: StepSchoolProps) => (
  <div className={fieldGridClass}>
    <InputField
      error={errors.school?.name}
      id="school-name"
      label="School name"
      onValueChange={(value) => onChange({ name: value })}
      placeholder="Full school name"
      requirement="required"
      value={school.name}
    />
    <SelectField
      error={errors.school?.province}
      id="school-province"
      label="Province"
      onValueChange={(value) => onChange({ province: value || null })}
      options={provinceOptions}
      requirement="required"
      value={school.province ?? ""}
    />
    <InputField
      error={errors.school?.district}
      id="school-district"
      label="District / city"
      onValueChange={(value) => onChange({ district: value })}
      placeholder="e.g. Galle"
      requirement="required"
      value={school.district}
    />
    <InputField
      id="school-address"
      label="School address"
      onValueChange={(value) => onChange({ address: value })}
      placeholder="Street, city"
      requirement="optional"
      value={school.address}
    />
  </div>
);
