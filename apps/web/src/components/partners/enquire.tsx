import { ArrowLabel } from "@/components/site/arrow-label";

import { enquireSection, partnerBenefits } from "./data";

export const Enquire = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]"
    id="enquire"
  >
    <div
      className="mx-auto grid max-w-[1280px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr))] overflow-hidden rounded-[28px] border border-[rgba(212,175,55,0.18)]"
      style={{
        background:
          "radial-gradient(60% 80% at 100% 0%, rgba(212,175,55,0.1), transparent 60%), linear-gradient(160deg,#071D16,#030F0B)",
      }}
    >
      <div className="flex flex-col gap-5 p-[clamp(28px,4vw,48px)]">
        <div className="text-gold font-mono text-[11px] tracking-[0.16em]">
          {enquireSection.kicker}
        </div>
        <h2 className="m-0 text-[clamp(28px,3.2vw,42px)] leading-[1.05] tracking-[-0.03em]">
          {enquireSection.title}
        </h2>
        <p className="text-muted m-0 max-w-[440px] text-[15.5px] leading-[1.6]">
          {enquireSection.body}
        </p>
        <div className="flex flex-wrap gap-2.5">
          <a
            className="bg-gold text-ink hover:bg-gold-bright hover:text-ink rounded-full px-[22px] py-3.5 text-[14px] font-bold whitespace-nowrap"
            href={`mailto:?subject=${enquireSection.sponsorSubject}`}
          >
            <ArrowLabel>{enquireSection.sponsorAction}</ArrowLabel>
          </a>
          <a
            className="text-fg hover:border-gold hover:text-fg rounded-full border border-[rgba(242,247,244,0.22)] px-[22px] py-3.5 text-[14px] font-semibold whitespace-nowrap"
            href={`mailto:?subject=${enquireSection.partnerSubject}`}
          >
            {enquireSection.partnerAction}
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px border-l border-[rgba(185,245,208,0.07)] bg-[rgba(185,245,208,0.07)]">
        {partnerBenefits.map((benefit) => (
          <div
            className="flex flex-col gap-2 bg-[#04120E] p-[clamp(18px,2.4vw,26px)]"
            key={benefit.title}
          >
            <span className="flex size-[22px] items-center justify-center rounded-[6px] border border-[rgba(212,175,55,0.4)]">
              <span className="bg-gold size-1.5 rotate-45" />
            </span>
            <div className="font-display text-[16px] font-semibold">
              {benefit.title}
            </div>
            <div className="text-muted-2 text-[13px] leading-[1.5]">
              {benefit.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
