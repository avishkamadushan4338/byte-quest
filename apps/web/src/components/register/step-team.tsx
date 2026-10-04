import { TextField, TextareaField } from "@byte-quest/ui/components/fields";
import { cn } from "@byte-quest/ui/lib/utils";
import { Field } from "@byte-quest/ui/primitives/field";
import { Radio, RadioGroup } from "@byte-quest/ui/primitives/radio";

import type { RegisterErrors, TeamDetails } from "./data";
import { teamSizeHint, teamSizeOptions } from "./data";

interface StepTeamProps {
  errors: RegisterErrors;
  onChange: (patch: Partial<TeamDetails>) => void;
  onSizeChange: (size: string) => void;
  team: TeamDetails;
}

const sizeButtonClasses =
  "relative flex h-auto w-[72px] cursor-pointer items-center justify-center rounded-[12px] border py-3.5";

export const StepTeam = ({
  errors,
  onChange,
  onSizeChange,
  team,
}: StepTeamProps) => (
  <div className="grid gap-6">
    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
      <TextField
        error={errors.team?.name}
        id="team-name"
        label="Team name"
        onValueChange={(value) => onChange({ name: value })}
        placeholder="Something memorable"
        required
        value={team.name}
      />
      <TextareaField
        id="team-idea"
        label="Initial project idea"
        onValueChange={(value) => onChange({ idea: value })}
        placeholder="A sentence or two — this can change."
        rows={3}
        value={team.idea}
      />
    </div>

    <Field className="grid gap-3">
      <div className="flex items-center gap-2">
        <span className="text-muted-2 font-mono text-[11px] tracking-[0.16em] uppercase">
          Team size
        </span>
        <span className="text-faint-2 ml-auto font-mono text-[10px] tracking-[0.1em]">
          REQUIRED
        </span>
      </div>
      <RadioGroup
        className="flex flex-wrap gap-2.5"
        name="team-size"
        onValueChange={(value) => onSizeChange(String(value))}
        value={team.size}
      >
        {teamSizeOptions.map((option) => {
          const selected = team.size === option.value;
          return (
            <label
              className={cn(
                sizeButtonClasses,
                selected
                  ? "border-volt bg-volt text-ink"
                  : "border-line-strong bg-ink text-muted"
              )}
              key={option.value}
            >
              <span className="font-display text-[22px] leading-none">
                {option.label}
              </span>
              <Radio
                aria-label={`${option.value} students`}
                className="absolute top-1.5 right-1.5 size-3.5"
                value={option.value}
              />
            </label>
          );
        })}
      </RadioGroup>
      <p className="text-muted-2 text-[12.5px]">{teamSizeHint}</p>
    </Field>
  </div>
);
