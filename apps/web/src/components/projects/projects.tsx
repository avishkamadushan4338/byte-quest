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

const SEARCH_SUFFIX = " project school team";

export const Projects = () => {
  const [divisionIndex, setDivisionIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
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
        return `${project.category} ${project.tech} ${project.division}${SEARCH_SUFFIX}`
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

  const openProject = (id: number) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  return (
    <main className="bg-ink">
      <ProjectsHero />
      <section
        className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,104px)]"
        id="projects-gallery"
      >
        <div className="mx-auto max-w-[1280px]">
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
        </div>
      </section>
      <ClosingCta
        actions={projectsClosing.actions}
        compact
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
