import { useState } from "react";

import { SegmentedTabs } from "@/components/site/segmented-tabs";

import {
  directoryNote,
  expertiseFilters,
  mentorPlaceholderName,
  pending,
  PLACEHOLDERS_PER_CATEGORY,
} from "./data";

const placeholderCards = (index: number) => {
  if (index === 0) {
    return expertiseFilters.slice(1).map((category) => ({
      id: category,
      category,
    }));
  }
  const category = expertiseFilters[index];
  return Array.from({ length: PLACEHOLDERS_PER_CATEGORY }, (_, slot) => ({
    id: `${category}-${slot}`,
    category,
  }));
};

export const Directory = () => {
  const [activeFilter, setActiveFilter] = useState(0);
  const cards = placeholderCards(activeFilter);

  return (
    <section
      className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,104px)]"
      id="mentors-directory"
    >
      <div className="mx-auto max-w-[1280px]">
        <SegmentedTabs
          label="Expertise"
          onChange={setActiveFilter}
          options={expertiseFilters}
          value={activeFilter}
        />

        <div className="mt-5 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
          {cards.map((card) => (
            <article
              className="bg-surface overflow-hidden rounded-[18px] border border-[rgba(185,245,208,0.09)] transition-[transform,border-color] duration-[350ms] hover:-translate-y-1 hover:border-[rgba(82,255,61,0.35)]"
              key={card.id}
            >
              <div className="relative flex aspect-[4/3] items-center justify-center bg-[repeating-linear-gradient(135deg,#061C16_0_10px,#04140F_10px_20px)]">
                <span className="text-faint-2 font-mono text-[10.5px] tracking-[0.1em]">
                  MENTOR PHOTO
                </span>
                <span className="text-volt absolute top-3 left-3 rounded-[6px] border border-[rgba(82,255,61,0.3)] bg-[rgba(2,8,7,0.85)] px-2 py-1 font-mono text-[10px] tracking-[0.12em]">
                  {card.category}
                </span>
              </div>
              <div className="grid gap-2.5 p-[18px]">
                <div className="font-display text-muted text-[18px] font-semibold">
                  {mentorPlaceholderName}
                </div>
                <div className="grid gap-1.5 text-[13px]">
                  <div className="flex justify-between gap-3">
                    <span className="text-faint">Role</span>
                    <span className="text-muted-2">{pending}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-faint">Organisation</span>
                    <span className="text-muted-2">{pending}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-muted mt-4 rounded-[14px] border border-dashed border-[rgba(185,245,208,0.18)] px-5 py-4 text-[14px]">
          {directoryNote}
        </div>
      </div>
    </section>
  );
};
