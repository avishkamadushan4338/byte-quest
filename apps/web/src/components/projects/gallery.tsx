import { galleryEmpty, galleryNote } from "./data";
import type { Project } from "./data";
import { ProjectCard } from "./project-card";

interface GalleryProps {
  projects: Project[];
  onSelect: (id: number) => void;
  onClear: () => void;
}

const countLabel = (count: number) =>
  `${count} PROJECT${count === 1 ? "" : "S"}`;

export const Gallery = ({ projects, onSelect, onClear }: GalleryProps) => (
  <>
    <div className="text-faint mt-4 flex items-center justify-between gap-3 font-mono text-[11px] tracking-[0.1em]">
      <span>{countLabel(projects.length)}</span>
      <span>{galleryNote}</span>
    </div>
    <div className="mt-3.5 grid [grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr))] gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} onSelect={onSelect} project={project} />
      ))}
    </div>
    {projects.length === 0 ? (
      <div className="mt-3.5 rounded-[18px] border border-dashed border-[rgba(185,245,208,0.18)] px-5 py-10 text-center">
        <div className="font-display text-[20px] font-semibold">
          {galleryEmpty.title}
        </div>
        <button
          className="text-fg hover:border-volt mt-3.5 cursor-pointer rounded-full border border-[rgba(242,247,244,0.22)] bg-transparent px-[18px] py-2.5 font-sans text-[13.5px] font-semibold"
          onClick={onClear}
          type="button"
        >
          {galleryEmpty.action}
        </button>
      </div>
    ) : null}
  </>
);
