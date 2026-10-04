import { StatStrip } from "@byte-quest/ui/components/stat-strip";

import { PageHero } from "@/components/site/page-hero";

import { journeyStats } from "./data";

export const JourneyHero = () => (
  <PageHero
    breadcrumb={[{ label: "Home", to: "/" }, { label: "Journey" }]}
    id="journey"
    kicker="THE BYTE QUEST JOURNEY"
    lead="A three-month innovation and coding accelerator in three phases, with two hackathons and a Grand Final along the way. Official dates will be announced."
    title="Twelve weeks from idea to impact."
  >
    <StatStrip
      className="mt-12"
      columns="minmax(min(100%,160px),1fr)"
      items={journeyStats}
    />
  </PageHero>
);
