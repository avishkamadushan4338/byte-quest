import { SubpageHero } from "@/components/site/subpage-hero";

import { aboutLead, crestAlt, presenter } from "./data";

const CREST_SRC = "/assets/crest.png";

export const Hero = () => (
  <SubpageHero
    aside={
      <div className="flex flex-col gap-6">
        <p className="text-muted m-0 max-w-[520px] text-[17px] leading-[1.65] text-pretty">
          {aboutLead}
        </p>
        <div className="flex w-fit max-w-full items-center gap-3.5 rounded-[14px] border border-[rgba(185,245,208,0.1)] bg-[rgba(2,8,7,0.6)] px-[18px] py-3.5">
          <img alt={crestAlt} className="h-10 w-auto" src={CREST_SRC} />
          <div className="text-muted-2 text-[13px] leading-[1.45]">
            <span className="text-fg font-semibold">{presenter.line1}</span>
            <br />
            {presenter.line2}
          </div>
        </div>
      </div>
    }
    className="overflow-hidden pt-[clamp(56px,8vw,112px)] pb-[clamp(48px,6vw,80px)]"
    crumb="ABOUT"
    gridClassName="gap-y-10"
    kicker="ABOUT BYTE QUEST"
    title={
      <>
        Don&apos;t just learn technology.{" "}
        <span className="text-volt">Build with it.</span>
      </>
    }
  />
);
