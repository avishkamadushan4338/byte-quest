import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { useMemo, useState } from "react";

import { ClosingCta } from "@/components/site/closing-cta";

import {
  categoryFilters,
  divisionFilters,
  projects,
  projectsClosing,
} from "./data";
import { FilterBar } from "./filter-bar";
import { Gallery } from "./gallery";
import { ProjectsHero } from "./hero";
import { ProjectModal } from "./project-modal";

export const Projects = () => {
  const [divisionIndex, setDivisionIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const division = divisionFilters[divisionIndex];
  const category = categoryFilters[categoryIndex];
  const needle = query.toLowerCase().trim();

  const visibleProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (division !== "ALL" && project.division !== division) {
          return false;
        }
        if (category !== "All" && project.category !== category) {
          return false;
        }
        if (needle.length === 0) {
          return true;
        }
        return [
          project.title,
          project.school,
          project.team,
          project.category,
          project.tech,
          project.division,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      }),
    [category, division, needle]
  );

  const selectedProject =
    projects.find((project) => project.id === selectedId) ?? null;

  const clearFilters = () => {
    setDivisionIndex(0);
    setCategoryIndex(0);
    setQuery("");
  };

  const openProject = (id: string) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  return (
    <main className="bg-ink">
      <ProjectsHero />
      <Section
        className="pt-[clamp(32px,4vw,52px)]"
        id="projects-gallery"
        tone="base"
      >
        <Container>
          <FilterBar
            categoryIndex={categoryIndex}
            divisionIndex={divisionIndex}
            onCategoryChange={setCategoryIndex}
            onDivisionChange={setDivisionIndex}
            onQueryChange={setQuery}
            query={query}
          />
          <Gallery
            onClear={clearFilters}
            onSelect={openProject}
            projects={visibleProjects}
          />
        </Container>
      </Section>
      <ClosingCta
        actions={[...projectsClosing.actions]}
        title={projectsClosing.title}
      />
      <ProjectModal
        onOpenChange={setModalOpen}
        open={modalOpen}
        project={selectedProject}
      />
    </main>
  );
};
