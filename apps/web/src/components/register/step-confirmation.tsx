import { DataItem } from "@byte-quest/ui/components/data-list";
import { Check } from "@byte-quest/ui/components/icons";
import { Button } from "@byte-quest/ui/primitives/button";
import { Link } from "@tanstack/react-router";

import type { RegisterState } from "./data";
import {
  confirmationBody,
  confirmationCopy,
  divisionSummary,
  registerSteps,
} from "./data";

interface StepConfirmationProps {
  onReset: () => void;
  reference: string;
  state: RegisterState;
}

export const StepConfirmation = ({
  onReset,
  reference,
  state,
}: StepConfirmationProps) => {
  const leader = state.students[state.leaderIndex];

  return (
    <output className="block">
      <div className="flex flex-col items-center text-center">
        <span className="bg-volt text-ink flex size-14 items-center justify-center rounded-full shadow-[0_0_40px_rgba(82,255,61,0.45)]">
          <Check className="size-7" />
        </span>
        <p className="text-volt mt-6 font-mono text-[11px] tracking-[0.16em]">
          {registerSteps.confirmation.eyebrow}
        </p>
        <h2 className="font-display mt-3 text-[clamp(30px,4vw,48px)] leading-[0.98] tracking-[-0.04em]">
          {registerSteps.confirmation.title}
        </h2>
        <p className="text-muted-2 mt-3 max-w-[520px] text-[15px] leading-[1.65]">
          {confirmationBody(state.team.name)}
        </p>
      </div>

      <div className="bg-line-soft mt-8 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-px overflow-hidden rounded-lg">
        <DataItem
          className="bg-ink p-4"
          label={confirmationCopy.referenceLabel}
          value={reference}
          valueClassName="font-mono text-volt"
        />
        <DataItem
          className="bg-ink p-4"
          label={confirmationCopy.teamLabel}
          value={state.team.name}
        />
        <DataItem
          className="bg-ink p-4"
          label={confirmationCopy.divisionLabel}
          value={divisionSummary(state.division)}
        />
        <DataItem
          className="bg-ink p-4"
          label={confirmationCopy.schoolLabel}
          value={state.school.name}
        />
        <DataItem
          className="bg-ink p-4"
          label={confirmationCopy.leaderLabel}
          value={leader?.fullName ?? ""}
        />
        <DataItem
          className="bg-ink p-4"
          label={confirmationCopy.statusLabel}
          value={confirmationCopy.statusValue}
          valueClassName="text-gold-bright"
        />
      </div>

      <div className="mt-8">
        <p className="text-muted-2 font-mono text-[11px] tracking-[0.16em]">
          {confirmationCopy.nextStepsLabel}
        </p>
        <ol className="mt-3 grid gap-3">
          {confirmationCopy.nextSteps.map((item) => (
            <li className="flex items-start gap-4" key={item.n}>
              <span className="text-volt font-mono text-[14px]">{item.n}</span>
              <span className="text-fg-dim text-[14px] leading-[1.6]">
                {item.text}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap gap-2.5">
        <Button
          aria-label={confirmationCopy.journeyAriaLabel}
          render={<Link to="/journey" />}
        >
          {confirmationCopy.journeyLabel}
        </Button>
        <Button onClick={onReset} variant="outline">
          {confirmationCopy.resetLabel}
        </Button>
      </div>
    </output>
  );
};
