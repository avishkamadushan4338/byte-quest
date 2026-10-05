import { SubpageHero } from "@/components/site/subpage-hero";

import { partnerHero } from "./data";

export const Hero = () => (
  <SubpageHero
    className="pt-[clamp(72px,9vw,128px)] pb-[clamp(48px,6vw,72px)]"
    kicker={partnerHero.kicker}
    lead={partnerHero.lead}
    narrow
    title={partnerHero.title}
    tone="gold"
  />
);
