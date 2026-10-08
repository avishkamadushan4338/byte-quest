import { SubpageHero } from "@/components/site/subpage-hero";

import { aboutLead, crestAlt } from "./data";

const OBA_LOGO_SRC = "/assets/crest.png";

export const Hero = () => (
  <SubpageHero
    aside={
      <div className="flex flex-col gap-6">
        <p className="text-muted m-0 max-w-[520px] text-[17px] leading-[1.65] text-pretty">
          {aboutLead}
        </p>
        <img
          alt={crestAlt}
          className="h-16 w-auto self-start"
          src={OBA_LOGO_SRC}
        />
      </div>
    }
    className="overflow-hidden pt-[clamp(56px,8vw,112px)] pb-[clamp(48px,6vw,80px)]"
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
