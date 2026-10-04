import type { ReactNode } from "react";

import { Check } from "@byte-quest/ui/components/icons";
import { ComboboxEmpty, ComboboxIcon, ComboboxInput, ComboboxItem, ComboboxList, ComboboxPopup, ComboboxPortal, ComboboxPositioner, ComboboxRoot } from "@byte-quest/ui/primitives/combobox";
import { Checkbox } from "@byte-quest/ui/primitives/checkbox";
import { cn } from "@byte-quest/ui/lib/utils";
import { Field, FieldDescription, FieldError, FieldLabel } from "@byte-quest/ui/primitives/field";
import { Input } from "@byte-quest/ui/primitives/input";
import { Radio, RadioGroup } from "@byte-quest/ui/primitives/radio";
import { SelectGroup, SelectGroupLabel, SelectIcon, SelectItem, SelectList, SelectPopup, SelectPortal, SelectPositioner, SelectRoot, SelectTrigger, SelectValue } from "@byte-quest/ui/primitives/select";
import { Switch } from "@byte-quest/ui/primitives/switch";
import { Textarea } from "@byte-quest/ui/primitives/textarea";

type TagTone = "required" | "optional";

function FieldTag({ tone }: { tone: TagTone }) {
  return (
    <span className="text-faint-2 ml-auto font-mono text-[10px] tracking-[0.1em]">
      {tone.toUpperCase()}
    </span>
  );
}

type TextFieldProps = {
  id: string;
  label: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  type?: string;
  placeholder?: string;
  description?: ReactNode;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  autoComplete?: string;
  min?: string;
  max?: string;
  maxLength?: number;
};

function TextField({
  id,
  label,
  value,
  onValueChange,
  name,
  type = "text",
  placeholder,
  description,
  error,
  required = false,
  disabled = false,
  className,
  inputMode,
  autoComplete,
  min,
  max,
  maxLength,
}: TextFieldProps) {
  return (
    <Field className={cn("grid gap-2", className)} invalid={Boolean(error)}>
      <div className="flex items-center gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <FieldTag tone={required ? "required" : "optional"} />
      </div>
      <Input
        aria-describedby={description ? `${id}-description` : undefined}
        aria-invalid={Boolean(error) || undefined}
        autoComplete={autoComplete}
        disabled={disabled}
        id={id}
        inputMode={inputMode}
        max={max}
        maxLength={maxLength}
        min={min}
        name={name ?? id}
        onChange={(event) => onValueChange(event.currentTarget.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
      {description ? (
        <FieldDescription id={`${id}-description`}>
          {description}
        </FieldDescription>
      ) : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

type TextareaFieldProps = Omit<TextFieldProps, "type" | "inputMode" | "autoComplete" | "maxLength" | "min" | "max"> & {
  rows?: number;
};

function TextareaField({
  id,
  label,
  value,
  onValueChange,
  name,
  placeholder,
  description,
  error,
  required = false,
  disabled = false,
  className,
  rows = 3,
}: TextareaFieldProps) {
  return (
    <Field className={cn("grid gap-2", className)} invalid={Boolean(error)}>
      <div className="flex items-center gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <FieldTag tone={required ? "required" : "optional"} />
      </div>
      <Textarea
        aria-describedby={description ? `${id}-description` : undefined}
        aria-invalid={Boolean(error) || undefined}
        disabled={disabled}
        id={id}
        name={name ?? id}
        onChange={(event) => onValueChange(event.currentTarget.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        value={value}
      />
      {description ? (
        <FieldDescription id={`${id}-description`}>
          {description}
        </FieldDescription>
      ) : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

type SelectOption = {
  value: string;
  label: ReactNode;
};

type SelectFieldProps = {
  id: string;
  label: ReactNode;
  value: string | null;
  onValueChange: (value: string | null) => void;
  options: SelectOption[];
  name?: string;
  placeholder?: string;
  description?: ReactNode;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

function SelectField({
  id,
  label,
  value,
  onValueChange,
  options,
  name,
  placeholder = "Select",
  description,
  error,
  required = false,
  disabled = false,
  className,
}: SelectFieldProps) {
  return (
    <Field className={cn("grid gap-2", className)} invalid={Boolean(error)}>
      <div className="flex items-center gap-2">
        <FieldLabel>{label}</FieldLabel>
        <FieldTag tone={required ? "required" : "optional"} />
      </div>
      <SelectRoot
        disabled={disabled}
        items={options.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        name={name ?? id}
        onValueChange={(next) => onValueChange((next as string | null) ?? null)}
        required={required}
        value={value}
      >
        <SelectTrigger aria-describedby={description ? `${id}-description` : undefined}>
          <SelectValue placeholder={placeholder} />
          <SelectIcon />
        </SelectTrigger>
        <SelectPortal>
          <SelectPositioner sideOffset={6}>
            <SelectPopup>
              <SelectList>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectList>
            </SelectPopup>
          </SelectPositioner>
        </SelectPortal>
      </SelectRoot>
      {description ? (
        <FieldDescription id={`${id}-description`}>
          {description}
        </FieldDescription>
      ) : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

type ComboboxFieldProps = {
  id: string;
  label: ReactNode;
  value: string | null;
  onValueChange: (value: string | null) => void;
  options: SelectOption[];
  name?: string;
  placeholder?: string;
  emptyLabel?: ReactNode;
  description?: ReactNode;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

function ComboboxField({
  id,
  label,
  value,
  onValueChange,
  options,
  name,
  placeholder = "Select",
  emptyLabel = "No matches",
  description,
  error,
  required = false,
  disabled = false,
  className,
}: ComboboxFieldProps) {
  return (
    <Field className={cn("grid gap-2", className)} invalid={Boolean(error)}>
      <div className="flex items-center gap-2">
        <FieldLabel>{label}</FieldLabel>
        <FieldTag tone={required ? "required" : "optional"} />
      </div>
      <ComboboxRoot
        items={options.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        name={name ?? id}
        onValueChange={(next) => onValueChange(next ?? null)}
        required={required}
        value={value}
      >
        <div className="relative">
          <ComboboxInput
            aria-describedby={description ? `${id}-description` : undefined}
            disabled={disabled}
            placeholder={placeholder}
          />
          <ComboboxIcon className="pointer-events-none absolute inset-y-0 right-3 my-auto" />
        </div>
        <ComboboxPortal>
          <ComboboxPositioner sideOffset={6}>
            <ComboboxPopup>
              <ComboboxList>
                {options.map((option) => (
                  <ComboboxItem key={option.value} value={option.value}>
                    {option.label}
                  </ComboboxItem>
                ))}
              </ComboboxList>
              <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
            </ComboboxPopup>
          </ComboboxPositioner>
        </ComboboxPortal>
      </ComboboxRoot>
      {description ? (
        <FieldDescription id={`${id}-description`}>
          {description}
        </FieldDescription>
      ) : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

type CheckboxFieldProps = {
  id: string;
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  name?: string;
  description?: ReactNode;
  error?: string | null;
  disabled?: boolean;
  className?: string;
};

function CheckboxField({
  id,
  label,
  checked,
  onCheckedChange,
  name,
  description,
  error,
  disabled = false,
  className,
}: CheckboxFieldProps) {
  return (
    <Field className={cn("grid gap-2", className)} invalid={Boolean(error)}>
      <label
        className="text-muted flex cursor-pointer items-start gap-3 text-[13.5px] leading-[1.5]"
        htmlFor={id}
      >
        <Checkbox
          checked={checked}
          disabled={disabled}
          id={id}
          name={name ?? id}
          onCheckedChange={onCheckedChange}
        />
        <span>{label}</span>
      </label>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

type RadioCardOption = {
  value: string;
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  meta?: ReactNode;
};

type RadioCardFieldProps = {
  name: string;
  legend: ReactNode;
  value: string | null;
  onValueChange: (value: string) => void;
  options: RadioCardOption[];
  columns?: string;
  error?: string | null;
  className?: string;
};

function RadioCardField({
  name,
  legend,
  value,
  onValueChange,
  options,
  columns = "minmax(min(100%,260px),1fr)",
  error,
  className,
}: RadioCardFieldProps) {
  return (
    <Field className={cn("grid gap-3", className)} invalid={Boolean(error)}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] tracking-[0.16em] text-muted-2 uppercase">
          {legend}
        </span>
        <FieldTag tone="required" />
      </div>
      <RadioGroup
        className={cn("grid gap-3")}
        name={name}
        onValueChange={(next) => onValueChange(String(next))}
        style={{ gridTemplateColumns: `repeat(auto-fit,${columns})` }}
        value={value ?? undefined}
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              className={cn(
                "relative flex cursor-pointer flex-col gap-3 rounded-[18px] border p-6 transition-all duration-200",
                selected
                  ? "border-volt/60 bg-[linear-gradient(160deg,#0a2a20,#020807)]"
                  : "border-line-strong bg-ink hover:border-line-strong/80"
              )}
              key={option.value}
            >
              <Radio
                aria-label={typeof option.title === "string" ? option.title : undefined}
                className="absolute top-4 right-4"
                value={option.value}
              />
              {option.badge ? (
                <span className="text-teal font-mono text-[10.5px] tracking-[0.14em]">
                  {option.badge}
                </span>
              ) : null}
              <span className="font-display pr-8 text-[28px] font-bold tracking-[-0.03em]">
                {option.title}
              </span>
              {option.description ? (
                <span className="text-muted text-[13.5px] leading-[1.5]">
                  {option.description}
                </span>
              ) : null}
              {option.meta}
            </label>
          );
        })}
      </RadioGroup>
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

type SwitchFieldProps = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
};

function SwitchField({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  name,
  disabled = false,
  className,
}: SwitchFieldProps) {
  return (
    <Field className={cn("grid gap-2", className)}>
      <label
        className="flex cursor-pointer items-center justify-between gap-4"
        htmlFor={id}
      >
        <span className="text-fg text-[15px] font-medium">{label}</span>
        <Switch
          checked={checked}
          disabled={disabled}
          id={id}
          name={name ?? id}
          onCheckedChange={onCheckedChange}
        />
      </label>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  );
}

type OptionToggleItem = {
  value: string;
  title: ReactNode;
  description?: ReactNode;
};

type OptionToggleFieldProps = {
  legend: ReactNode;
  values: string[];
  onValuesChange: (values: string[]) => void;
  options: OptionToggleItem[];
  columns?: string;
  error?: string | null;
  className?: string;
};

function OptionToggleField({
  legend,
  values,
  onValuesChange,
  options,
  columns = "minmax(min(100%,220px),1fr)",
  error,
  className,
}: OptionToggleFieldProps) {
  const handleToggle = (optionValue: string) => {
    onValuesChange(
      values.includes(optionValue)
        ? values.filter((entry) => entry !== optionValue)
        : [...values, optionValue]
    );
  };

  return (
    <Field className={cn("grid gap-3", className)} invalid={Boolean(error)}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] tracking-[0.16em] text-muted-2 uppercase">
          {legend}
        </span>
        <FieldTag tone="required" />
      </div>
      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: `repeat(auto-fit,${columns})` }}
      >
        {options.map((option) => {
          const selected = values.includes(option.value);
          return (
            <button
              aria-pressed={selected}
              className={cn(
                "relative cursor-pointer rounded-[14px] border p-4 text-left transition-colors duration-200",
                selected
                  ? "border-volt/55 bg-volt/7"
                  : "border-line-strong bg-ink hover:border-volt/40"
              )}
              key={option.value}
              onClick={() => handleToggle(option.value)}
              type="button"
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-md border transition-colors",
                  selected
                    ? "border-volt bg-volt text-ink"
                    : "border-line-strong bg-ink"
                )}
              >
                {selected ? <Check className="size-3.5" /> : null}
              </span>
              <span className="font-display text-fg mt-3 block text-[16px] font-semibold">
                {option.title}
              </span>
              {option.description ? (
                <span className="text-muted-2 mt-1 block text-[12.5px] leading-[1.5]">
                  {option.description}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

export {
  CheckboxField,
  ComboboxField,
  OptionToggleField,
  RadioCardField,
  SelectField,
  SelectGroup,
  SelectGroupLabel,
  SwitchField,
  TextareaField,
  TextField,
};
export type {
  CheckboxFieldProps,
  ComboboxFieldProps,
  OptionToggleFieldProps,
  RadioCardFieldProps,
  SelectFieldProps,
  SelectOption,
  SwitchFieldProps,
  TextareaFieldProps,
  TextFieldProps,
};