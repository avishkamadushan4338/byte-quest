import { TextField } from "@byte-quest/ui/components/fields";

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
  <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
    <TextField
      autoComplete="name"
      error={errors.teacher?.name}
      id="teacher-name"
      label="Teacher in charge"
      onValueChange={(value) => onChange({ name: value })}
      placeholder="Full name"
      required
      value={teacher.name}
    />
    <TextField
      error={errors.teacher?.designation}
      id="teacher-designation"
      label="Designation"
      onValueChange={(value) => onChange({ designation: value })}
      placeholder="e.g. ICT Teacher"
      required
      value={teacher.designation}
    />
    <TextField
      autoComplete="tel"
      error={errors.teacher?.phone}
      id="teacher-phone"
      inputMode="tel"
      label="Contact number"
      onValueChange={(value) => onChange({ phone: value })}
      placeholder="07XXXXXXXX"
      required
      type="tel"
      value={teacher.phone}
    />
    <TextField
      autoComplete="email"
      error={errors.teacher?.email}
      id="teacher-email"
      inputMode="email"
      label="Email"
      onValueChange={(value) => onChange({ email: value })}
      placeholder="teacher@school.lk"
      required
      type="email"
      value={teacher.email}
    />
    <TextField
      autoComplete="name"
      id="teacher-principal"
      label="Principal name"
      onValueChange={(value) => onChange({ principal: value })}
      placeholder="Full name"
      value={teacher.principal}
    />
  </div>
);
