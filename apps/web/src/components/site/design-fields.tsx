import { cn } from "@byte-quest/ui/lib/utils";
import {
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxRoot,
  ComboboxTrigger,
} from "@byte-quest/ui/primitives/combobox";
import {
  SelectIcon,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@byte-quest/ui/primitives/select";
import { useMemo, useState } from "react";
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
}

interface ComboboxFieldProps extends ControlProps {
  options: FieldOption[];
  /** Lets free text pass through when it matches no option (e.g. a school not in the catalog). */
  allowFreeText?: boolean;
  emptyMessage?: string;
  maxResults?: number;
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
      className="text-fg-dim flex justify-between gap-2 text-[14.5px] font-semibold"
      htmlFor={id}
    >
      {label}
      {requirement ? (
        <span className="text-faint-2 font-mono text-[12.5px] font-normal tracking-[0.1em]">
          {requirementLabels[requirement]}
        </span>
      ) : null}
    </label>
    {children}
    {hint && !error ? (
      <span className="text-muted-2 text-[13px]">{hint}</span>
    ) : (
      <span className="min-h-[15px] text-[13px] text-[#FF8A7A]" role="alert">
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
}: SelectFieldProps) => (
  <FieldShell
    error={error}
    hint={hint}
    id={id}
    label={label}
    requirement={requirement}
  >
    <SelectRoot
      items={options}
      onValueChange={(next) => onValueChange((next as string | null) ?? "")}
      value={value || null}
    >
      <SelectTrigger
        aria-invalid={Boolean(error)}
        className={controlClass(surface, error)}
        id={id}
      >
        <SelectValue placeholder="Select" />
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
  </FieldShell>
);

/**
 * Searchable dropdown built on the unstyled Combobox primitive --
 * deliberately not the native `<select>`, so long option lists (e.g. the
 * national school directory) stay filterable and keyboard-navigable without
 * a browser-native popup. With `allowFreeText`, typed text that matches no
 * option is kept as-is (for entries outside the known catalog); otherwise
 * the field clears on blur unless it exactly matches an option label.
 */
export const ComboboxField = ({
  id,
  label,
  value,
  onValueChange,
  requirement,
  error,
  hint,
  placeholder,
  surface = "ink",
  options,
  allowFreeText = false,
  emptyMessage = "No matches",
  maxResults = 40,
}: ComboboxFieldProps) => {
  const [query, setQuery] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // The committed value can change from outside (e.g. picking a school fills
  // province/district too). Resync the visible query during render rather
  // than in an effect, per React's "adjusting state on prop change" pattern.
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  const filteredLabels = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pool = query
      ? options.filter((option) => option.label.toLowerCase().includes(needle))
      : options;
    return pool.slice(0, maxResults).map((option) => option.label);
  }, [options, query, maxResults]);

  const commitFreeText = (text: string) => {
    if (allowFreeText) {
      onValueChange(text);
      return;
    }
    const match = options.find(
      (option) => option.label.toLowerCase() === text.trim().toLowerCase()
    );
    onValueChange(match ? match.value : "");
    setQuery(match ? match.label : "");
  };

  // Base UI reverts the input to its own tracked selection on blur/escape,
  // so that selection must mirror what we consider "confirmed": the typed
  // query itself when free text is allowed, or the option matching the
  // committed value otherwise (null when nothing valid is committed).
  const committedLabel =
    options.find((option) => option.value === value)?.label ?? null;
  const comboboxValue = allowFreeText ? query : committedLabel;

  return (
    <FieldShell
      error={error}
      hint={hint}
      id={id}
      label={label}
      requirement={requirement}
    >
      <ComboboxRoot
        inputValue={query}
        value={comboboxValue}
        items={filteredLabels}
        onInputValueChange={(text) => {
          setQuery(text);
          if (allowFreeText) {
            onValueChange(text);
          }
        }}
        onValueChange={(selected) => {
          if (typeof selected === "string") {
            const match = options.find((option) => option.label === selected);
            const nextValue = match ? match.value : selected;
            onValueChange(nextValue);
            setQuery(match ? match.label : selected);
          }
        }}
      >
        <div className="relative">
          <ComboboxInput
            aria-invalid={Boolean(error)}
            className={cn(controlClass(surface, error), "h-auto pr-10")}
            id={id}
            onBlur={(event) => commitFreeText(event.target.value)}
            placeholder={placeholder}
          />
          <ComboboxTrigger />
        </div>
        <ComboboxPortal>
          <ComboboxPositioner sideOffset={6}>
            <ComboboxPopup>
              <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxPopup>
          </ComboboxPositioner>
        </ComboboxPortal>
      </ComboboxRoot>
    </FieldShell>
  );
};

export const fieldGridClass =
  "grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-4 gap-y-3.5";
