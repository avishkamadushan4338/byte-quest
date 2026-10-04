import { PageHero } from "@/components/site/page-hero";

import { partnerHero } from "./data";

export const Hero = () => (
  <PageHero
    breadcrumb={[{ label: "Home", to: "/" }, { label: "Partners" }]}
    breadcrumbTone="gold"
    glow="gold"
    kicker={partnerHero.kicker}
    kickerTone="gold"
    lead={partnerHero.lead}
    title={partnerHero.title}
  />
);
