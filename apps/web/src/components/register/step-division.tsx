import { RadioCardField } from "@byte-quest/ui/components/fields";

import type { Division, RegisterErrors } from "./data";
import { divisionOptions, platformsByDivision } from "./data";

interface StepDivisionProps {
  division: Division | null;
  errors: RegisterErrors;
  onChange: (division: Division) => void;
}

const chipClasses =
  "border-line-strong text-muted rounded-[6px] border px-2 py-1 font-mono text-[10.5px]";

const toDivision = (value: string): Division =>
  value === "senior" ? "senior" : "junior";

export const StepDivision = ({
  division,
  errors,
  onChange,
}: StepDivisionProps) => (
  <RadioCardField
    error={errors.division}
    legend="Division"
    name="division"
    onValueChange={(value) => onChange(toDivision(value))}
    options={divisionOptions.map((option) => ({
      value: option.value,
      title: option.title,
      badge: option.badge,
      description: option.description,
      meta: (
        <span className="mt-1 flex flex-wrap gap-1.5">
          {platformsByDivision[option.value].map((platform) => (
            <span className={chipClasses} key={platform}>
              {platform}
            </span>
          ))}
        </span>
      ),
    }))}
    value={division}
  />
);
