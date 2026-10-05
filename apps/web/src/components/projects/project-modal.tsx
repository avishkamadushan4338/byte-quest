import { DefinitionTable } from "@byte-quest/ui/components/table";
import { cn } from "@byte-quest/ui/lib/utils";
import {
  DialogClose,
  DialogContent,
  DialogRoot,
  DialogTitle,
} from "@byte-quest/ui/primitives/dialog";

import { categoryTints, divisionMeta } from "./data";
import type { Project } from "./data";

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectModal = ({
  project,
  open,
  onOpenChange,
}: ProjectModalProps) => (
  <DialogRoot onOpenChange={onOpenChange} open={open && Boolean(project)}>
    <DialogContent className="h-full w-full overflow-y-auto">
      {project ? (
        <div className="border-line-soft bg-surface my-auto w-full max-w-[1020px] overflow-hidden rounded-[20px] border">
          <div
            className="relative flex aspect-[16/7] items-center justify-center"
            style={{
              background: `radial-gradient(60% 80% at 70% 30%, ${categoryTints[project.category]}, transparent 70%), repeating-linear-gradient(135deg,#061C16 0 12px,#04140F 12px 24px)`,
            }}
          >
            <span className="text-faint-2 font-mono text-[10.5px] tracking-[0.1em]">
              PROJECT IMAGE / VIDEO
            </span>
            <DialogClose
              aria-label="Close"
              className="border-line-strong hover:border-volt hover:text-volt absolute top-4 right-4 bg-[rgba(2,8,7,0.85)]"
            >
              ×
            </DialogClose>
          </div>

          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-7 p-[clamp(20px,3vw,32px)]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 font-mono text-[10.5px] tracking-[0.12em]",
                    divisionMeta[project.division].chip
                  )}
                >
                  {divisionMeta[project.division].label}
                </span>
                <span className="bg-volt/7 text-lime rounded-full px-2.5 py-1 text-[11.5px]">
                  {project.category}
                </span>
              </div>
              <DialogTitle className="font-display text-fg text-[clamp(26px,3vw,36px)] tracking-[-0.03em] normal-case">
                {project.title}
              </DialogTitle>
              <p className="text-muted-2 m-0 text-[15px] leading-[1.65]">
                {project.summary}
              </p>
            </div>

            <DefinitionTable
              labelWidth="120px"
              rows={[
                { label: "School", value: project.school },
                { label: "Team", value: project.team },
                {
                  label: "Division",
                  value: divisionMeta[project.division].scope,
                },
                { label: "Technology", value: project.tech },
                { label: "Year", value: "2026" },
              ]}
            />
          </div>
        </div>
      ) : null}
    </DialogContent>
  </DialogRoot>
);
