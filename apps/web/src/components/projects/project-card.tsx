import { Card } from "@byte-quest/ui/components/card";
import { cn } from "@byte-quest/ui/lib/utils";

import { categoryTints, divisionMeta } from "./data";
import type { Project } from "./data";

interface ProjectCardProps {
  project: Project;
  onSelect: (id: string) => void;
}

export const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  const division = divisionMeta[project.division];

  return (
    <Card className="hover:border-volt/35 flex flex-col overflow-hidden rounded-[18px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(82,255,61,0.35)]">
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
          className={cn(
            "absolute top-3 left-3 rounded-md border bg-[rgba(2,8,7,0.85)] px-2 py-1 font-mono text-[10px] tracking-[0.12em]",
            division.text,
            division.border
          )}
        >
          {division.label}
        </span>
        {project.award ? (
          <span className="border-gold/40 bg-gold/15 text-gold-bright absolute top-3 right-3 rounded-md border px-2 py-1 font-mono text-[10px] tracking-[0.12em]">
            ★ {project.award}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-[18px]">
        <h3 className="font-display text-muted text-[19px]">{project.title}</h3>
        <p className="text-faint text-[13px]">
          {project.school} · {project.team}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-volt/7 text-lime rounded-full px-2.5 py-1 text-[11.5px]">
            {project.category}
          </span>
          <span className="bg-mint/5 text-muted-2 rounded-md px-2 py-1 font-mono text-[10.5px]">
            {project.tech}
          </span>
        </div>
        <button
          className="border-line-soft hover:text-volt mt-auto flex w-full cursor-pointer items-center justify-between border-t bg-transparent pt-3 text-left text-[13.5px] font-semibold transition-colors"
          onClick={() => onSelect(project.id)}
          type="button"
        >
          View project
          <span className="text-volt">→</span>
        </button>
      </div>
    </Card>
  );
};
