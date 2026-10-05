import { objectives, objectivesLead } from "./data";

export const Objectives = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]"
    id="objectives"
  >
    <div className="mx-auto grid max-w-[1280px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-x-[72px] gap-y-10">
      <div className="sticky top-[110px]">
        <div className="text-teal font-mono text-[11px] tracking-[0.16em]">
          OBJECTIVES
        </div>
        <h2 className="mt-[18px] mb-0 text-[clamp(34px,4.4vw,60px)] leading-[0.95] tracking-[-0.04em]">
          Why BYTE QUEST exists.
        </h2>
        <p className="text-muted mt-5 mb-0 max-w-[440px] text-[16.5px] leading-[1.65]">
          {objectivesLead}
        </p>
      </div>
      <div className="grid border-t border-[rgba(185,245,208,0.1)]">
        {objectives.map((objective) => (
          <div
            className="grid grid-cols-[56px_1fr] gap-4 border-b border-[rgba(185,245,208,0.1)] py-[22px]"
            key={objective.n}
          >
            <span className="text-volt pt-1 font-mono text-[12px]">
              {objective.n}
            </span>
            <div>
              <div className="font-display text-[20px] font-semibold tracking-[-0.01em]">
                {objective.title}
              </div>
              <div className="text-muted-2 mt-1.5 text-[14.5px] leading-[1.55]">
                {objective.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
