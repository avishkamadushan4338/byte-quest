import { StatStrip } from "@byte-quest/ui/components/stat-strip";
import { Button } from "@byte-quest/ui/primitives/button";
import { Link } from "@tanstack/react-router";

import { PageHero } from "@/components/site/page-hero";

import { programmeBreadcrumb, programmeLead, programmeStats } from "./data";

export const Hero = () => (
  <div id="programme">
    <PageHero
      aside={
        <>
          <p className="text-muted m-0 text-[17px] leading-[1.65]">
            {programmeLead}
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Button render={<Link to="/register" />}>
              Register your team <span aria-hidden="true">→</span>
            </Button>
            <Button render={<Link to="/journey" />} variant="outline">
              See the 12-week journey
            </Button>
          </div>
        </>
      }
      breadcrumb={programmeBreadcrumb}
      kicker="THE PROGRAMME"
      kickerTone="volt"
      title="An innovation accelerator for schools."
    >
      <StatStrip
        className="mt-12"
        columns="minmax(min(100%,190px),1fr)"
        items={programmeStats}
      />
    </PageHero>
  </div>
);
