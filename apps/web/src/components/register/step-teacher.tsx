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
      error={errors.teacher?.designation}
      id="teacher-designation"
      label="Designation"
      onValueChange={(value) => onChange({ designation: value })}
      placeholder="e.g. ICT Teacher"
      requirement="required"
      value={teacher.designation}
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
    <InputField
      error={errors.teacher?.email}
      id="teacher-email"
      inputMode="email"
      label="Email"
      onValueChange={(value) => onChange({ email: value })}
      placeholder="teacher@school.lk"
      requirement="required"
      type="email"
      value={teacher.email}
    />
    <InputField
      id="teacher-principal"
      label="Principal name"
      onValueChange={(value) => onChange({ principal: value })}
      placeholder="Full name"
      requirement="optional"
      value={teacher.principal}
    />
  </div>
);
