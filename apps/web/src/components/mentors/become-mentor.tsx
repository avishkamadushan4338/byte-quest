import { ArrowLabel } from "@/components/site/arrow-label";

import { becomeMentor, contributions, mentorshipMailto } from "./data";

export const BecomeMentor = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]"
    id="become"
  >
    <div
      className="mx-auto grid max-w-[1280px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr))] overflow-hidden rounded-[28px] border border-[rgba(82,255,61,0.18)]"
      style={{
        background:
          "radial-gradient(60% 80% at 100% 0%, rgba(82,255,61,0.08), transparent 60%), linear-gradient(160deg,#071D16,#030F0B)",
      }}
    >
      <div className="flex flex-col gap-5 p-[clamp(28px,4vw,48px)]">
        <div className="text-volt font-mono text-[11px] tracking-[0.16em]">
          {becomeMentor.kicker}
        </div>
        <h2 className="m-0 text-[clamp(28px,3.2vw,42px)] leading-[1.05] tracking-[-0.03em]">
          {becomeMentor.title}
        </h2>
        <p className="text-muted m-0 max-w-[440px] text-[15.5px] leading-[1.6]">
          {becomeMentor.body}
        </p>
        <a
          className="bg-fg text-ink hover:bg-volt hover:text-ink self-start rounded-full px-[22px] py-3.5 text-[14px] font-bold whitespace-nowrap"
          href={mentorshipMailto}
        >
          <ArrowLabel>{becomeMentor.action}</ArrowLabel>
        </a>
      </div>
      <div className="grid grid-cols-2 gap-px border-l border-[rgba(185,245,208,0.07)] bg-[rgba(185,245,208,0.07)]">
        {contributions.map((item) => (
          <div
            className="flex flex-col gap-2 bg-[#04120E] p-[clamp(18px,2.4vw,26px)]"
            key={item.n}
          >
            <span className="text-volt font-mono text-[11px] tracking-[0.1em]">
              {item.n}
            </span>
            <div className="font-display text-[16px] font-semibold">
              {item.title}
            </div>
            <div className="text-muted-2 text-[13px] leading-[1.5]">
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
