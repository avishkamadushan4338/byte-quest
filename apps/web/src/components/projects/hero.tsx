import { PageHero } from "@/components/site/page-hero";

import { projectsHero } from "./data";

export const ProjectsHero = () => (
  <PageHero
    breadcrumb={projectsHero.breadcrumb}
    id="projects"
    kicker={projectsHero.kicker}
    lead={projectsHero.lead}
    title={projectsHero.title}
  />
);
