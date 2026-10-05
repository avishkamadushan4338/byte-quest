import { Button } from "@byte-quest/ui/primitives/button";

import { galleryEmpty, galleryNote } from "./data";
import type { Project } from "./data";
import { ProjectCard } from "./project-card";

interface GalleryProps {
  projects: Project[];
  onClear: () => void;
  onSelect: (id: string) => void;
}

export const Gallery = ({ projects, onClear, onSelect }: GalleryProps) => {
  const count = projects.length;
  const countLabel = `${count} ${count === 1 ? "PROJECT" : "PROJECTS"}`;

  return (
    <>
      <div className="text-faint mt-4 flex items-center justify-between gap-3 font-mono text-[11px] tracking-[0.1em]">
        <span>{countLabel}</span>
        <span>{galleryNote}</span>
      </div>

      {count > 0 ? (
        <div className="mt-4 grid [grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr))] gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              onSelect={onSelect}
              project={project}
            />
          ))}
        </div>
      ) : (
        <div className="border-line-fg/20 mt-4 rounded-[18px] border border-dashed p-10 text-center">
          <p className="font-display text-fg m-0 text-[20px]">
            {galleryEmpty.title}
          </p>
          <p className="text-muted-2 mx-auto mt-2 max-w-[440px] text-[14px] leading-[1.6]">
            {galleryEmpty.description}
          </p>
          <Button
            className="mt-6 font-mono text-[12px] tracking-[0.08em]"
            onClick={onClear}
            variant="outline"
          >
            {galleryEmpty.action}
          </Button>
        </div>
      )}
    </>
  );
};
