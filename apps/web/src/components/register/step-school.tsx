import {
  ComboboxField,
  fieldGridClass,
  InputField,
} from "@/components/site/design-fields";

import type { RegisterErrors, SchoolDetails } from "./data";
import { provinceOptions } from "./data";
import { findSchoolByName, schoolNameOptions } from "./school-catalog";

interface StepSchoolProps {
  errors: RegisterErrors;
  onChange: (patch: Partial<SchoolDetails>) => void;
  school: SchoolDetails;
}

export const StepSchool = ({ errors, onChange, school }: StepSchoolProps) => {
  const handleNameChange = (value: string) => {
    const match = findSchoolByName(value);
    if (match) {
      onChange({
        name: match.name,
        province: match.province,
        district: match.district,
      });
      return;
    }
    onChange({ name: value });
  };

  return (
    <div className={fieldGridClass}>
      <ComboboxField
        allowFreeText
        error={errors.school?.name}
        id="school-name"
        label="School name"
        onValueChange={handleNameChange}
        options={schoolNameOptions}
        placeholder="Full school name"
        requirement="required"
        value={school.name}
      />
      <ComboboxField
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
};
