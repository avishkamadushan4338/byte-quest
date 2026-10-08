import { cn } from "@byte-quest/ui/lib/utils";
import { useEffect, useState } from "react";

import { StatusShell } from "./status-shell";

const BRAND_SRC = "/assets/bq-logo.png";
const CREST_SRC = "/assets/crest.png";
const TICK_MS = 110;
const HOLD_TICKS = 8;
const STEP_SIZE = 25;
const MAX_PERCENT = 100;
const EASE_FACTOR = 0.07;

const steps = [
  { label: "LEARN", color: "var(--color-teal)" },
  { label: "BUILD", color: "var(--color-volt)" },
  { label: "INNOVATE", color: "var(--color-lime)" },
  { label: "INSPIRE", color: "var(--color-gold-bright)" },
];

interface Progress {
  hold: number;
  percent: number;
}

const advance = ({ hold, percent }: Progress): Progress => {
  if (percent >= MAX_PERCENT) {
    return hold > HOLD_TICKS
      ? { hold: 0, percent: 0 }
      : { hold: hold + 1, percent: MAX_PERCENT };
  }
  const increment = Math.max(
    1,
    Math.round((MAX_PERCENT - percent) * EASE_FACTOR)
  );
  return { hold: 0, percent: Math.min(MAX_PERCENT, percent + increment) };
};

export const LoadingScreen = () => {
  const [progress, setProgress] = useState<Progress>({ hold: 0, percent: 0 });
  const { percent } = progress;

  useEffect(() => {
    const timer = setInterval(() => setProgress(advance), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const activeIndex = Math.min(
    steps.length - 1,
    Math.floor(percent / STEP_SIZE)
  );
  const phrase = percent >= MAX_PERCENT ? "READY" : "LOADING THE QUEST";

  return (
    <StatusShell background="#020807" className="overflow-hidden">
      <main
        aria-label="Loading BYTE QUEST"
        aria-live="polite"
        className="relative grid h-svh min-h-[520px] grid-rows-[auto_1fr_auto] overflow-hidden px-[clamp(20px,5vw,64px)] py-[clamp(20px,3.5vw,40px)]"
      >
        <div
          aria-hidden="true"
          className="animate-breath pointer-events-none absolute top-[46%] left-1/2 aspect-square w-[min(110vw,1100px)] rounded-full bg-[radial-gradient(circle_closest-side,rgba(82,255,61,0.14),rgba(0,169,154,0.05)_50%,transparent)] motion-reduce:animate-none"
        />

        <header className="relative flex items-center justify-between gap-4">
          <img
            alt="St. Aloysius' College Galle crest"
            className="h-[clamp(30px,3.4vw,40px)] w-auto"
            src={CREST_SRC}
          />
          <span className="text-faint font-mono text-[10.5px] tracking-[0.2em] whitespace-nowrap">
            INTER SCHOOL · 2026
          </span>
        </header>

        <div className="relative flex flex-col items-center justify-center gap-[22px]">
          <div className="relative w-[min(84vw,620px)] overflow-hidden">
            <img
              alt="BYTE QUEST"
              className="block h-auto w-full"
              src={BRAND_SRC}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden [mask-image:url(/assets/bq-logo.png)] [mask-size:100%_100%]"
            >
              <div className="animate-sweep absolute inset-y-0 w-[35%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.85),transparent)] motion-reduce:animate-none" />
            </div>
          </div>
          <div className="font-display text-muted-2 text-[clamp(12px,1.2vw,14px)] font-medium tracking-[0.32em]">
            {phrase}
          </div>
        </div>

        <footer className="relative flex flex-col gap-[18px]">
          <div className="flex items-end justify-between gap-6">
            <div className="font-display flex items-baseline gap-1.5 leading-[0.8] font-bold tracking-[-0.06em]">
              <span className="text-fg text-[clamp(72px,11vw,160px)] tabular-nums">
                {percent}
              </span>
              <span className="text-volt text-[clamp(22px,2.6vw,36px)]">%</span>
            </div>
            <ol className="m-0 grid list-none gap-2 p-0 text-right">
              {steps.map((step, index) => {
                const on =
                  percent >= (index + 1) * STEP_SIZE ||
                  (index === activeIndex && percent > index * STEP_SIZE);
                return (
                  <li
                    className={cn(
                      "flex items-center justify-end gap-2.5 font-mono text-[11px] tracking-[0.16em] transition-colors duration-300",
                      on ? "text-fg" : "text-[#3d5249]"
                    )}
                    key={step.label}
                  >
                    {step.label}
                    <span
                      aria-hidden="true"
                      className="size-[7px] rotate-45 transition-all duration-300"
                      style={{
                        background: on ? step.color : "rgba(185,245,208,.12)",
                        boxShadow: on ? `0 0 10px ${step.color}` : "none",
                      }}
                    />
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="relative h-0.5 bg-[rgba(185,245,208,0.1)]">
            <div
              className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,#00a99a,#52ff3d,#b7f000)] shadow-[0_0_14px_rgba(82,255,61,0.8)] transition-[width] duration-200 ease-linear"
              style={{ width: `${percent}%` }}
            />
            <div
              className="bg-fg absolute top-1/2 -mt-1 -ml-1 size-2 rounded-full shadow-[0_0_14px_#52ff3d,0_0_4px_#fff] transition-[left] duration-200 ease-linear"
              style={{ left: `${percent}%` }}
            />
          </div>
        </footer>
      </main>
    </StatusShell>
  );
};
