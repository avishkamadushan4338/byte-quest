import { FactStrip } from "@/components/site/fact-strip";
import { SubpageHero } from "@/components/site/subpage-hero";

import { journeyFacts } from "./data";

export const JourneyHero = () => (
  <SubpageHero
    kicker="THE BYTE QUEST JOURNEY"
    lead="A three-month innovation and coding accelerator in three phases, with two hackathons and a Grand Final along the way. Official dates will be announced."
    title="Twelve weeks from idea to impact."
  >
    <FactStrip facts={journeyFacts} />
  </SubpageHero>
);
