import { keyRules, mainAwards, rulesFootnote, specialAwards } from "./data";

export const Awards = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] py-[clamp(56px,7vw,96px)]"
    id="awards"
  >
    <div className="mx-auto grid max-w-[1280px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-4">
      <div
        className="rounded-[20px] border border-[rgba(212,175,55,0.22)] p-[clamp(22px,3vw,32px)]"
        style={{
          background:
            "linear-gradient(180deg,rgba(212,175,55,0.07),transparent 60%),#030F0B",
        }}
      >
        <div className="text-gold font-mono text-[11px] tracking-[0.16em]">
          AWARDS
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {mainAwards.map((award) => (
            <span
              className="font-display text-gold-bright rounded-[10px] border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.1)] px-3.5 py-[9px] text-[15px] font-semibold whitespace-nowrap"
              key={award}
            >
              {award}
            </span>
          ))}
        </div>
        <div className="text-muted-2 mt-[18px] font-mono text-[10px] tracking-[0.14em]">
          SPECIAL AWARDS
        </div>
        <div className="mt-2.5 grid [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))] gap-x-4 gap-y-2">
          {specialAwards.map((award) => (
            <div
              className="text-fg-dim flex items-center gap-[9px] text-[13.5px]"
              key={award}
            >
              <span className="bg-gold size-[5px] shrink-0 rotate-45" />
              <span className="min-w-0 flex-1">{award}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-surface rounded-[20px] border border-[rgba(185,245,208,0.09)] p-[clamp(22px,3vw,32px)]">
        <div className="text-teal font-mono text-[11px] tracking-[0.16em]">
          KEY RULES
        </div>
        <div className="mt-3 grid">
          {keyRules.map((rule) => (
            <div
              className="text-fg-dim grid grid-cols-[36px_1fr] gap-3 border-b border-[rgba(185,245,208,0.07)] py-3 text-[14px] leading-[1.5]"
              key={rule.n}
            >
              <span className="text-volt pt-0.5 font-mono text-[11px]">
                {rule.n}
              </span>
              {rule.text}
            </div>
          ))}
        </div>
        <div className="text-faint mt-3.5 text-[12.5px]">{rulesFootnote}</div>
      </div>
    </div>
  </section>
);
