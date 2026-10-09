import { SectionHeading } from "@/components/site/section-heading";

import { comparisonRows } from "./data";

const rowGrid =
  "grid grid-cols-[minmax(64px,0.5fr)_minmax(0,1fr)_minmax(0,1fr)] sm:grid-cols-[minmax(110px,0.6fr)_minmax(0,1fr)_minmax(0,1fr)]";
const cellBorder = "border-l border-[rgba(185,245,208,0.08)]";

export const Divisions = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] py-[clamp(56px,7vw,96px)]"
    id="divisions"
  >
    <div className="mx-auto max-w-[1280px]">
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-[72px] gap-y-6">
        <div>
          <SectionHeading
            kicker="DIVISIONS"
            title="Junior and Senior, side by side."
          />
        </div>
        <p className="text-muted m-0 max-w-[500px] text-[16.5px] leading-[1.65]">
          Each team competes in one division, based on the grades of its
          members.
        </p>
      </div>
      <div className="mt-10 overflow-hidden rounded-[20px] border border-[rgba(185,245,208,0.1)]">
        <div className={`${rowGrid} bg-surface-2`}>
          <div className="px-3 py-4 break-words sm:px-[18px]" />
          <div className={`${cellBorder} px-3 py-4 break-words sm:px-[18px]`}>
            <div className="text-mint font-mono text-[12.5px] tracking-[0.14em]">
              DIVISION A
            </div>
            <div className="font-display mt-1 text-[clamp(22px,2.4vw,30px)] font-bold tracking-[-0.025em]">
              Junior
            </div>
          </div>
          <div className={`${cellBorder} px-3 py-4 break-words sm:px-[18px]`}>
            <div className="text-volt font-mono text-[12.5px] tracking-[0.14em]">
              DIVISION B
            </div>
            <div className="font-display mt-1 text-[clamp(22px,2.4vw,30px)] font-bold tracking-[-0.025em]">
              Senior
            </div>
          </div>
        </div>
        {comparisonRows.map((row) => (
          <div
            className={`${rowGrid} bg-surface border-t border-[rgba(185,245,208,0.08)]`}
            key={row.label}
          >
            <div className="text-faint px-3 py-4 font-mono text-[12.5px] tracking-[0.12em] break-words sm:px-[18px]">
              {row.label}
            </div>
            <div
              className={`${cellBorder} text-fg-dim px-3 py-4 text-[15.5px] leading-[1.5] break-words sm:px-[18px]`}
            >
              {row.junior}
            </div>
            <div
              className={`${cellBorder} text-fg-dim px-3 py-4 text-[15.5px] leading-[1.5] break-words sm:px-[18px]`}
            >
              {row.senior}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
