import { PageHero } from "@/components/site/page-hero";

import { aboutBreadcrumb, aboutLead, crestAlt, presenter } from "./data";

const CREST_SRC = "/assets/crest.png";

export const Hero = () => (
  <div id="about">
    <PageHero
      aside={
        <div className="border-line-soft bg-ink/50 flex items-center gap-4 rounded-2xl border p-4">
          <img alt={crestAlt} className="h-14 w-auto" src={CREST_SRC} />
          <div className="text-muted-2 text-[12.5px] leading-[1.45]">
            <span className="text-fg font-semibold">{presenter.line1}</span>
            <br />
            {presenter.line2}
          </div>
        </div>
      }
      breadcrumb={aboutBreadcrumb}
      kicker="ABOUT BYTE QUEST"
      kickerTone="volt"
      lead={aboutLead}
      title={
        <>
          Don&apos;t just learn technology.{" "}
          <span className="text-volt">Build with it.</span>
        </>
      }
    />
  </div>
);
