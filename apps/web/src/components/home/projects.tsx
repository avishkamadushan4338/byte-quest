import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";
import { Button } from "@byte-quest/ui/primitives/button";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { projectFilters, projectSlots } from "./data";

export const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <Section id="projects">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>07 / Featured Student Projects</Kicker>
            <h2 className="mt-[18px] text-[clamp(38px,5vw,68px)] leading-[0.95] tracking-[-0.04em]">
              The innovation exhibition.
            </h2>
          </div>
          <Button
            render={<Link aria-label="Explore all projects" to="/projects" />}
            variant="outline"
          >
            Explore all projects →
          </Button>
        </div>

        <div className="border-line-soft bg-surface mt-9 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border p-2">
          <div className="flex flex-wrap gap-1">
            {projectFilters.map((filter) => (
              <button
                aria-pressed={activeFilter === filter}
                className={`cursor-pointer rounded-[9px] border-none px-3.5 py-2 font-mono text-[11.5px] tracking-[0.06em] whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? "bg-fg text-ink"
                    : "text-muted hover:text-fg bg-transparent"
                }`}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="border-line-soft text-faint flex min-w-[200px] items-center gap-2 rounded-[9px] border px-3.5 py-2 text-[13px]">
            <span aria-hidden="true">⌕</span>
            Search projects, schools…
          </div>
        </div>

        <div className="mt-4 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          {projectSlots.map((slot, index) => (
            <article
              className="border-line-soft bg-surface hover:border-volt/35 overflow-hidden rounded-[18px] border transition-all duration-[400ms] hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(-2deg)_translateY(-4px)] hover:shadow-[0_24px_50px_-28px_rgba(82,255,61,0.35)]"
              key={`${slot.division}-${index}`}
            >
              <div className="relative flex aspect-video items-center justify-center bg-[repeating-linear-gradient(135deg,#061C16_0_10px,#04140F_10px_20px)]">
                <span className="text-faint-2 font-mono text-[10.5px] tracking-[0.1em]">
                  PROJECT THUMBNAIL
                </span>
                <span
                  className="absolute top-3 left-3 rounded-md border bg-[rgba(2,8,7,0.85)] px-2 py-1 font-mono text-[10px] tracking-[0.12em]"
                  style={{ color: slot.color, borderColor: slot.line }}
                >
                  {slot.division}
                </span>
              </div>
              <div className="grid gap-3 p-[18px] pb-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-display text-muted text-[18px] font-semibold">
                    Project title
                  </div>
                  <span className="text-faint-2 font-mono text-[10px] tracking-[0.1em]">
                    TBA
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["SCHOOL", "CATEGORY", "TECHNOLOGY"].map((meta) => (
                    <span
                      className="bg-line-soft text-faint rounded-md px-2 py-1 font-mono text-[10.5px] tracking-[0.06em]"
                      key={meta}
                    >
                      {meta}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="border-line-strong mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-dashed px-5 py-4">
          <span className="text-muted text-[14px]">
            Approved projects are published here after{" "}
            <span className="text-fg font-semibold">Hackathon 01</span>.
          </span>
          <Link
            className="font-mono text-[11.5px] tracking-[0.08em] whitespace-nowrap"
            to="/auth/login"
          >
            BE AMONG THE FIRST →
          </Link>
        </div>
      </Container>
    </Section>
  );
};
