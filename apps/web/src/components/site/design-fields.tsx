import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

type Requirement = "required" | "optional";
type Surface = "ink" | "surface";

interface FieldShellProps {
  id: string;
  label: string;
  requirement?: Requirement;
  error?: string;
  hint?: string;
  children: ReactNode;
}

interface ControlProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  requirement?: Requirement;
  error?: string;
  hint?: string;
  placeholder?: string;
  surface?: Surface;
}

interface InputFieldProps extends ControlProps {
  type?: "text" | "email" | "tel" | "password" | "date";
  inputMode?: "text" | "email" | "tel" | "numeric";
  autoComplete?: string;
}

interface TextareaFieldProps extends ControlProps {
  rows?: number;
}

export interface FieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends ControlProps {
  options: FieldOption[];
  hideArrow?: boolean;
}

const requirementLabels = {
  required: "REQUIRED",
  optional: "OPTIONAL",
} satisfies Record<Requirement, string>;

const surfaceClasses = {
  ink: "bg-ink",
  surface: "bg-surface",
} satisfies Record<Surface, string>;

const controlClass = (surface: Surface, error?: string) =>
  cn(
    "text-fg focus:border-volt w-full rounded-[11px] border px-3.5 py-[13px] font-sans text-[15px] outline-none",
    surfaceClasses[surface],
    error ? "border-[rgba(255,138,122,0.6)]" : "border-[rgba(185,245,208,0.14)]"
  );

export const FieldShell = ({
  id,
  label,
  requirement,
  error,
  hint,
  children,
}: FieldShellProps) => (
  <div className="flex flex-col gap-[7px]">
    <label
      className="text-fg-dim flex justify-between gap-2 text-[13px] font-semibold"
      htmlFor={id}
    >
      {label}
      {requirement ? (
        <span className="text-faint-2 font-mono text-[10px] font-normal tracking-[0.1em]">
          {requirementLabels[requirement]}
        </span>
      ) : null}
    </label>
    {children}
    {hint && !error ? (
      <span className="text-muted-2 text-[12px]">{hint}</span>
    ) : (
      <span className="min-h-[15px] text-[12px] text-[#FF8A7A]" role="alert">
        {error}
      </span>
    )}
  </div>
);

export const InputField = ({
  id,
  label,
  value,
  onValueChange,
  requirement,
  error,
  hint,
  placeholder,
  surface = "ink",
  type = "text",
  inputMode,
  autoComplete = "off",
}: InputFieldProps) => (
  <FieldShell
    error={error}
    hint={hint}
    id={id}
    label={label}
    requirement={requirement}
  >
    <input
      aria-invalid={Boolean(error)}
      autoComplete={autoComplete}
      className={controlClass(surface, error)}
      id={id}
      inputMode={inputMode}
      onChange={(event) => onValueChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  </FieldShell>
);

export const TextareaField = ({
  id,
  label,
  value,
  onValueChange,
  requirement,
  error,
  hint,
  placeholder,
  surface = "ink",
  rows = 3,
}: TextareaFieldProps) => (
  <FieldShell
    error={error}
    hint={hint}
    id={id}
    label={label}
    requirement={requirement}
  >
    <textarea
      className={cn(controlClass(surface, error), "resize-y")}
      id={id}
      onChange={(event) => onValueChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      value={value}
    />
  </FieldShell>
);

export const SelectField = ({
  id,
  label,
  value,
  onValueChange,
  requirement,
  error,
  hint,
  options,
  surface = "ink",
  hideArrow,
}: SelectFieldProps) => (
  <FieldShell
    error={error}
    hint={hint}
    id={id}
    label={label}
    requirement={requirement}
  >
    <select
      aria-invalid={Boolean(error)}
      className={cn(
        controlClass(surface, error),
        "cursor-pointer",
        hideArrow && "appearance-none"
      )}
      id={id}
      onChange={(event) => onValueChange(event.target.value)}
      value={value}
    >
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </FieldShell>
);

export const fieldGridClass =
  "grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-4 gap-y-3.5";
