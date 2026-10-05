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
  const facts = [
    {
      label: confirmationCopy.referenceLabel,
      value: reference,
      color: "#52FF3D",
    },
    {
      label: confirmationCopy.teamLabel,
      value: state.team.name,
      color: "#F2F7F4",
    },
    {
      label: confirmationCopy.divisionLabel,
      value: divisionSummary(state.division),
      color: "#F2F7F4",
    },
    {
      label: confirmationCopy.schoolLabel,
      value: state.school.name,
      color: "#F2F7F4",
    },
    {
      label: confirmationCopy.leaderLabel,
      value: leader?.fullName || "—",
      color: "#F2F7F4",
    },
    {
      label: confirmationCopy.statusLabel,
      value: confirmationCopy.statusValue,
      color: "#F0D875",
    },
  ];

  return (
    <output className="flex flex-col gap-5">
      <span className="bg-volt text-ink flex size-14 items-center justify-center rounded-full text-[26px] font-bold shadow-[0_0_40px_rgba(82,255,61,0.45)]">
        ✓
      </span>
      <div>
        <div className="text-volt font-mono text-[10.5px] tracking-[0.16em]">
          {registerSteps.confirmation.eyebrow}
        </div>
        <h2 className="mt-2 mb-0 text-[clamp(30px,4vw,48px)] leading-none tracking-[-0.035em]">
          {registerSteps.confirmation.title}
        </h2>
        <p className="text-muted mt-2.5 mb-0 max-w-[520px] text-[15px] leading-[1.6]">
          {confirmationBody(state.team.name)}
        </p>
      </div>
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-px overflow-hidden rounded-[16px] border border-[rgba(185,245,208,0.08)] bg-[rgba(185,245,208,0.08)]">
        {facts.map((fact) => (
          <div className="bg-ink min-w-0 px-[18px] py-4" key={fact.label}>
            <div className="text-faint font-mono text-[10px] tracking-[0.14em]">
              {fact.label}
            </div>
            <div
              className="mt-1.5 text-[15px] [overflow-wrap:anywhere]"
              style={{ color: fact.color }}
            >
              {fact.value}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="text-muted-2 font-mono text-[10.5px] tracking-[0.16em]">
          {confirmationCopy.nextStepsLabel}
        </div>
        <div className="mt-3 grid gap-2">
          {confirmationCopy.nextSteps.map((item) => (
            <div
              className="text-fg-dim flex items-center gap-3.5 text-[14px]"
              key={item.n}
            >
              <span className="text-volt font-mono text-[11px]">{item.n}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <Link
          className="bg-volt text-ink hover:bg-lime hover:text-ink rounded-full px-[22px] py-3.5 text-[14px] font-bold whitespace-nowrap"
          to="/journey"
        >
          {confirmationCopy.journeyLabel}
        </Link>
        <button
          className="text-fg hover:border-volt cursor-pointer rounded-full border border-[rgba(242,247,244,0.25)] bg-transparent px-[22px] py-3.5 font-sans text-[14px] font-semibold"
          onClick={onReset}
          type="button"
        >
          {confirmationCopy.resetLabel}
        </button>
      </div>
    </output>
  );
};
