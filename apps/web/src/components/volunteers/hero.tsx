import { SubpageHero } from "@/components/site/subpage-hero";

import { volunteerHero } from "./data";

export const Hero = () => (
  <SubpageHero
    crumb="VOLUNTEER"
    kicker={volunteerHero.kicker}
    lead={volunteerHero.lead}
    title={volunteerHero.title}
  />
);
