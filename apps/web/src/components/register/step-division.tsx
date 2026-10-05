import { ChoiceCard } from "./choice-card";
import type { Division, RegisterErrors } from "./data";
import { divisionOptions, platformsByDivision } from "./data";

interface StepDivisionProps {
  division: Division | null;
  errors: RegisterErrors;
  onChange: (division: Division) => void;
}

export const StepDivision = ({
  division,
  errors,
  onChange,
}: StepDivisionProps) => (
  <>
    <div
      aria-label="Division"
      className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3"
      role="radiogroup"
    >
      {divisionOptions.map((option) => (
        <ChoiceCard
          name="division"
          color={option.color}
          description={option.description}
          key={option.value}
          kicker={option.badge}
          onSelect={() => onChange(option.value)}
          selected={division === option.value}
          title={option.title}
        >
          <span className="flex flex-wrap gap-[5px]">
            {platformsByDivision[option.value].map((platform) => (
              <span
                className="rounded-[6px] px-2 py-1 font-mono text-[10.5px]"
                key={platform}
                style={{
                  color: option.color,
                  border: `1px solid ${option.line}`,
                }}
              >
                {platform}
              </span>
            ))}
          </span>
        </ChoiceCard>
      ))}
    </div>
    <div className="mt-2.5 min-h-4 text-[12px] text-[#FF8A7A]" role="alert">
      {errors.division}
    </div>
  </>
);
