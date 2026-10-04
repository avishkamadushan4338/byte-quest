import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";

import { philosophyWords } from "./data";

export const Philosophy = () => (
  <Section bleed tone="alt">
    <Container className="px-[clamp(20px,5vw,64px)]">
      <ul
        aria-label="Learn, build, innovate, inspire"
        className="border-line-soft bg-surface grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))] overflow-hidden rounded-[20px] border"
      >
        {philosophyWords.map((word) => (
          <li
            className="border-line-soft flex flex-col gap-2 px-6 py-7 [not(:last-child)]:border-r"
            key={word.n}
          >
            <span className="text-faint-2 font-mono text-[11px] tracking-[0.12em]">
              {word.n}
            </span>
            <span
              className="font-display text-[clamp(26px,2.6vw,36px)] tracking-[-0.03em]"
              style={{ color: word.color }}
            >
              {word.label}
            </span>
          </li>
        ))}
      </ul>
    </Container>
  </Section>
);
