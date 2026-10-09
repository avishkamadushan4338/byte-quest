import {
  DialogClose,
  DialogContent,
  DialogRoot,
  DialogTitle,
} from "@byte-quest/ui/primitives/dialog";

import {
  categoryTints,
  divisionMeta,
  pending,
  placeholderTitle,
  projectSummary,
  projectYear,
} from "./data";
import type { Project } from "./data";

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const detailRows = (project: Project) => [
  { label: "SCHOOL", value: pending },
  { label: "TEAM", value: pending },
  { label: "DIVISION", value: divisionMeta[project.division].scope },
  { label: "TECHNOLOGY", value: project.tech },
  { label: "YEAR", value: projectYear },
];

export const ProjectModal = ({
  project,
  open,
  onOpenChange,
}: ProjectModalProps) => (
  <DialogRoot onOpenChange={onOpenChange} open={open && Boolean(project)}>
    <DialogContent
      aria-label="Project details"
      backdropClassName="bg-[rgba(2,8,7,0.82)] backdrop-blur-[10px]"
      className="bg-surface h-auto max-h-[calc(100vh-40px)] max-w-[880px] overflow-auto rounded-[24px] border border-[rgba(185,245,208,0.14)] p-0 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] sm:p-0"
      viewportClassName="items-center justify-center p-5"
    >
      {project ? (
        <>
          <div
            className="relative flex aspect-[16/7] items-center justify-center"
            style={{
              background: `radial-gradient(60% 80% at 70% 30%, ${categoryTints[project.category]}, transparent 70%), repeating-linear-gradient(135deg,#061C16 0 12px,#04140F 12px 24px)`,
            }}
          >
            <span className="text-faint-2 font-mono text-[13px] tracking-[0.1em]">
              PROJECT IMAGE / VIDEO
            </span>
            <DialogClose
              aria-label="Close"
              className="hover:text-fg absolute top-3.5 right-3.5 size-10 cursor-pointer border-[rgba(242,247,244,0.2)] bg-[rgba(2,8,7,0.7)] text-[18px] hover:border-[rgba(242,247,244,0.2)]"
            >
              ×
            </DialogClose>
          </div>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-7 p-[clamp(20px,3vw,32px)]">
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-wrap gap-1.5">
                <span
                  className="rounded-[6px] px-2 py-1 font-mono text-[12.5px] tracking-[0.12em]"
                  style={{
                    color: divisionMeta[project.division].color,
                    border: `1px solid ${divisionMeta[project.division].line}`,
                  }}
                >
                  {project.division}
                </span>
                <span className="text-lime rounded-full bg-[rgba(82,255,61,0.07)] px-[9px] py-1 text-[13px]">
                  {project.category}
                </span>
              </div>
              <DialogTitle className="font-display text-fg m-0 text-[clamp(26px,3vw,36px)] leading-[1.05] font-bold tracking-[-0.03em] normal-case">
                {placeholderTitle}
              </DialogTitle>
              <p className="text-muted-2 m-0 text-[15px] leading-[1.6]">
                {projectSummary}
              </p>
            </div>
            <div className="grid gap-px self-start overflow-hidden rounded-[14px] bg-[rgba(185,245,208,0.08)]">
              {detailRows(project).map((row) => (
                <div
                  className="bg-ink grid grid-cols-[110px_1fr] gap-3 px-4 py-3 text-[15px]"
                  key={row.label}
                >
                  <span className="text-faint pt-0.5 font-mono text-[12.5px] tracking-[0.12em]">
                    {row.label}
                  </span>
                  <span className="text-fg-dim">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </DialogContent>
  </DialogRoot>
);
