import { fieldGridClass, InputField } from "@/components/site/design-fields";

import type { RegisterErrors, TeacherDetails } from "./data";

interface StepTeacherProps {
  errors: RegisterErrors;
  onChange: (patch: Partial<TeacherDetails>) => void;
  teacher: TeacherDetails;
}

export const StepTeacher = ({
  errors,
  onChange,
  teacher,
}: StepTeacherProps) => (
  <div className={fieldGridClass}>
    <InputField
      error={errors.teacher?.name}
      id="teacher-name"
      label="Teacher in charge"
      onValueChange={(value) => onChange({ name: value })}
      placeholder="Full name"
      requirement="required"
      value={teacher.name}
    />
    <InputField
      error={errors.teacher?.phone}
      id="teacher-phone"
      inputMode="tel"
      label="Contact number"
      onValueChange={(value) => onChange({ phone: value })}
      placeholder="07XXXXXXXX"
      requirement="required"
      type="tel"
      value={teacher.phone}
    />
  </div>
);
