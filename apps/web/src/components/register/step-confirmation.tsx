import { Link } from "@tanstack/react-router";

import { ArrowLabel } from "@/components/site/arrow-label";

import type { Division, RegisterState } from "./data";
import {
  LEADER_INDEX,
  confirmationCopy,
  divisionLabels,
  divisionOrder,
  registerSteps,
} from "./data";

export const COMPETITION_RULES_HREF =
  "/downloads/byte-quest-2027-competition-rules.pdf";

interface StepConfirmationProps {
  onReset: () => void;
  references: Partial<Record<Division, string>>;
  state: RegisterState;
}

export const StepConfirmation = ({
  onReset,
  references,
  state,
}: StepConfirmationProps) => {
  const activeDivisions = divisionOrder.filter((division) =>
    state.divisions.includes(division)
  );
  const multi = activeDivisions.length > 1;
  const withDivisionTag = (base: string, division: Division) =>
    multi
      ? `${base} · ${divisionLabels[division].split(" ·")[0].toUpperCase()}`
      : base;

  const teamFacts = activeDivisions.flatMap((division) => {
    const leader = state.students[division][LEADER_INDEX];
    return [
      {
        label: withDivisionTag(confirmationCopy.teamLabel, division),
        value: state.teams[division].name,
      },
      {
        label: withDivisionTag(confirmationCopy.leaderLabel, division),
        value: leader?.fullName || "-",
      },
    ];
  });

  const facts = [
    ...teamFacts,
    { label: confirmationCopy.schoolLabel, value: state.school.name },
    { label: confirmationCopy.statusLabel, value: confirmationCopy.statusValue },
  ];

  const teamNames = activeDivisions
    .map((division) => state.teams[division].name.trim())
    .filter((name) => name.length > 0);
  const welcomeNames =
    teamNames.length > 0
      ? teamNames.join(" and ")
      : confirmationCopy.fallbackTeam;

  return (
    <output className="flex flex-col gap-5">
      <span className="bg-volt text-ink flex size-14 items-center justify-center rounded-full text-[26px] font-bold shadow-[0_0_40px_rgba(82,255,61,0.45)]">
        ✓
      </span>
      <div>
        <div className="text-volt font-mono text-[12.5px] tracking-[0.16em]">
          {registerSteps.confirmation.eyebrow}
        </div>
        <h2 className="mt-2 mb-0 text-[clamp(30px,4vw,48px)] leading-none tracking-[-0.035em]">
          {registerSteps.confirmation.title}
        </h2>
        <p className="text-muted mt-2.5 mb-0 max-w-[520px] text-[15px] leading-[1.6]">
          Welcome to the quest, {welcomeNames}. A confirmation will be sent to
          the teacher in charge.
        </p>
      </div>
      {activeDivisions.map((division) => (
        <div
          className="rounded-[16px] border border-[rgba(82,255,61,0.35)] bg-[rgba(82,255,61,0.06)] px-[18px] py-5"
          key={division}
        >
          <div className="text-muted-2 font-mono text-[12.5px] tracking-[0.14em]">
            {withDivisionTag(confirmationCopy.referenceLabel, division)}
          </div>
          <div className="font-display text-volt mt-1.5 text-[clamp(28px,4vw,40px)] font-bold tracking-[0.04em]">
            {references[division] ?? "-"}
          </div>
          <p className="text-muted mt-2 mb-0 text-[14.5px]">
            Keep this code. It identifies your team in any follow-up.
          </p>
        </div>
      ))}
      <p className="text-muted m-0 rounded-[14px] border border-[rgba(240,216,117,0.3)] bg-[rgba(240,216,117,0.08)] px-4 py-3 text-[14.5px] text-[#F0D875]">
        This registration is submitted and locked. It cannot be edited from
        this page.
      </p>
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-px overflow-hidden rounded-[16px] border border-[rgba(185,245,208,0.08)] bg-[rgba(185,245,208,0.08)]">
        {facts.map((fact) => (
          <div className="bg-ink min-w-0 px-[18px] py-4" key={fact.label}>
            <div className="text-faint font-mono text-[12.5px] tracking-[0.14em]">
              {fact.label}
            </div>
            <div className="mt-1.5 text-[15px] [overflow-wrap:anywhere] text-[#F2F7F4]">
              {fact.value}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="text-muted-2 font-mono text-[12.5px] tracking-[0.16em]">
          {confirmationCopy.nextStepsLabel}
        </div>
        <div className="mt-3 grid gap-2">
          {confirmationCopy.nextSteps.map((item) => (
            <div
              className="text-fg-dim flex items-center gap-3.5 text-[15.5px]"
              key={item.n}
            >
              <span className="text-volt font-mono text-[13px]">{item.n}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <a
          className="text-fg hover:border-volt rounded-full border border-[rgba(242,247,244,0.25)] px-[22px] py-3.5 text-[15.5px] font-semibold whitespace-nowrap"
          download
          href={COMPETITION_RULES_HREF}
        >
          {confirmationCopy.rulesLabel}
        </a>
        <Link
          className="bg-volt text-ink hover:bg-lime hover:text-ink rounded-full px-[22px] py-3.5 text-[15.5px] font-bold whitespace-nowrap"
          to="/journey"
        >
          <ArrowLabel>{confirmationCopy.journeyLabel}</ArrowLabel>
        </Link>
        <button
          className="text-fg hover:border-volt cursor-pointer rounded-full border border-[rgba(242,247,244,0.25)] bg-transparent px-[22px] py-3.5 font-sans text-[15.5px] font-semibold"
          onClick={onReset}
          type="button"
        >
          {confirmationCopy.resetLabel}
        </button>
      </div>
    </output>
  );
};
