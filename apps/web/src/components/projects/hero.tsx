import { SubpageHero } from "@/components/site/subpage-hero";

import { projectsHero } from "./data";

export const ProjectsHero = () => (
  <SubpageHero
    className="pb-[clamp(32px,4vw,48px)]"
    kicker={projectsHero.kicker}
    lead={projectsHero.lead}
    title={projectsHero.title}
  />
);
