import { Enquire } from "./enquire";
import { Hero } from "./hero";
import { PartnerWall } from "./partner-wall";
import { Tiers } from "./tiers";

export const Partners = () => (
  <main className="bg-ink">
    <Hero />
    <Tiers />
    <PartnerWall />
    <Enquire />
  </main>
);
