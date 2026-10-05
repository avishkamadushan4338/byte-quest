import { philosophyWords } from "./data";

export const Philosophy = () => (
  <section className="bg-surface border-y border-[rgba(185,245,208,0.08)]">
    <ul
      aria-label="Learn, build, innovate, inspire"
      className="m-0 mx-auto grid max-w-[1280px] list-none [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))] p-0"
    >
      {philosophyWords.map((word) => (
        <li
          className="flex items-baseline gap-3.5 border-r border-[rgba(185,245,208,0.07)] px-[clamp(20px,3vw,32px)] py-7"
          key={word.n}
        >
          <span className="text-faint-2 font-mono text-[11px]">{word.n}</span>
          <span
            className="font-display text-[clamp(26px,2.6vw,36px)] font-bold tracking-[-0.03em]"
            style={{ color: word.color }}
          >
            {word.label}
          </span>
        </li>
      ))}
    </ul>
  </section>
);
