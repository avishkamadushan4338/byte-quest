import { PageHero } from "@/components/site/page-hero";

import { volunteerHero } from "./data";

export const Hero = () => (
  <PageHero
    breadcrumb={[{ label: "Home", to: "/" }, { label: "Volunteer" }]}
    kicker={volunteerHero.kicker}
    kickerTone="volt"
    lead={volunteerHero.lead}
    title={volunteerHero.title}
  />
);
