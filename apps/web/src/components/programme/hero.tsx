import { Link } from "@tanstack/react-router";

import { ArrowLabel } from "@/components/site/arrow-label";
import { FactStrip } from "@/components/site/fact-strip";
import { SubpageHero } from "@/components/site/subpage-hero";

import { programmeFacts, programmeLead } from "./data";

export const Hero = () => (
  <SubpageHero
    aside={
      <div className="flex flex-col gap-[22px]">
        <p className="text-muted m-0 max-w-[520px] text-[17px] leading-[1.65] text-pretty">
          {programmeLead}
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link
            className="bg-volt text-ink hover:bg-lime hover:text-ink rounded-full px-[22px] py-3.5 text-[15.5px] font-bold whitespace-nowrap"
            to="/register/team"
          >
            <ArrowLabel>Register your team →</ArrowLabel>
          </Link>
          <Link
            className="text-fg hover:border-volt hover:text-fg rounded-full border border-[rgba(242,247,244,0.24)] px-[22px] py-3.5 text-[15.5px] font-semibold whitespace-nowrap"
            to="/journey"
          >
            See the 12-week journey
          </Link>
        </div>
      </div>
    }
    kicker="THE PROGRAMME"
    title="An innovation accelerator for schools."
  >
    <FactStrip compact facts={programmeFacts} />
  </SubpageHero>
);
