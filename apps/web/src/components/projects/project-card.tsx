import {
  categoryTints,
  divisionMeta,
  placeholderByline,
  placeholderTitle,
} from "./data";
import type { Project } from "./data";

interface ProjectCardProps {
  project: Project;
  onSelect: (id: number) => void;
}

export const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  const division = divisionMeta[project.division];
  return (
    <article className="bg-surface flex flex-col overflow-hidden rounded-[18px] border border-[rgba(185,245,208,0.09)] transition-[transform,border-color,box-shadow] duration-[350ms] hover:-translate-y-1 hover:border-[rgba(82,255,61,0.35)] hover:shadow-[0_24px_50px_-28px_rgba(82,255,61,0.35)]">
      <div
        className="relative flex aspect-[16/10] items-center justify-center"
        style={{
          background: `radial-gradient(60% 80% at 70% 30%, ${categoryTints[project.category]}, transparent 70%), repeating-linear-gradient(135deg,#061C16 0 10px,#04140F 10px 20px)`,
        }}
      >
        <span className="text-faint-2 font-mono text-[10.5px] tracking-[0.1em]">
          PROJECT THUMBNAIL
        </span>
        <span
          className="absolute top-3 left-3 rounded-[6px] bg-[rgba(2,8,7,0.85)] px-2 py-1 font-mono text-[10px] tracking-[0.12em]"
          style={{
            color: division.color,
            border: `1px solid ${division.line}`,
          }}
        >
          {project.division}
        </span>
        {project.award ? (
          <span className="text-gold-bright absolute top-3 right-3 rounded-[6px] border border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.15)] px-2 py-1 font-mono text-[10px] tracking-[0.1em]">
            ★ {project.award}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-[18px]">
        <div>
          <div className="font-display text-muted text-[19px] font-semibold tracking-[-0.01em]">
            {placeholderTitle}
          </div>
          <div className="text-faint mt-1 text-[13px]">{placeholderByline}</div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-lime rounded-full bg-[rgba(82,255,61,0.07)] px-[9px] py-1 text-[11.5px]">
            {project.category}
          </span>
          <span className="text-muted-2 rounded-[6px] bg-[rgba(185,245,208,0.05)] px-2 py-1 font-mono text-[10.5px]">
            {project.tech}
          </span>
        </div>
        <button
          className="text-fg hover:text-volt mt-auto flex cursor-pointer items-center justify-between border-x-0 border-t border-b-0 border-solid border-[rgba(185,245,208,0.07)] bg-transparent px-0 pt-3 pb-0 font-sans text-[13.5px] font-semibold"
          onClick={() => onSelect(project.id)}
          type="button"
        >
          View project <span className="text-volt">→</span>
        </button>
      </div>
    </article>
  );
};
