import { ChoiceCard } from "./choice-card";
import type { Division, RegisterErrors } from "./data";
import { divisionOptions, platformsByDivision } from "./data";

interface StepDivisionProps {
  divisions: Division[];
  errors: RegisterErrors;
  onToggle: (division: Division) => void;
}

export const StepDivision = ({
  divisions,
  errors,
  onToggle,
}: StepDivisionProps) => (
  <>
    <fieldset aria-label="Division" className="m-0 border-0 p-0">
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3">
        {divisionOptions.map((option) => (
          <ChoiceCard
            name="division"
            color={option.color}
            description={option.description}
            key={option.value}
            kicker={option.badge}
            multiple
            onSelect={() => onToggle(option.value)}
            selected={divisions.includes(option.value)}
            title={option.title}
          >
            <span className="flex flex-wrap gap-[5px]">
              {platformsByDivision[option.value].map((platform) => (
                <span
                  className="rounded-[6px] px-2 py-1 font-mono text-[12.5px]"
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
    </fieldset>
    <div className="mt-2.5 min-h-4 text-[13px] text-[#FF8A7A]" role="alert">
      {errors.divisions}
    </div>
  </>
);
