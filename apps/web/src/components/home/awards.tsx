import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";
import { cn } from "@byte-quest/ui/lib/utils";

import { podium, specialAwards } from "./data";

export const Awards = () => (
  <Section className="overflow-hidden py-[clamp(64px,8vw,104px)]" id="awards">
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(60% 50% at 50% 38%, rgba(212,175,55,0.16), rgba(212,175,55,0.04) 45%, transparent 75%), #020807",
      }}
    />

    <Container className="relative">
      <header className="text-center">
        <Kicker className="inline-block tracking-[0.2em]" tone="gold">
          10 / Awards &amp; Recognition
        </Kicker>
        <h2 className="mx-auto mt-5 max-w-[900px] text-[clamp(36px,4.6vw,64px)] leading-[0.95] tracking-[-0.04em]">
          Excellence,{" "}
          <span className="bg-[linear-gradient(180deg,#FFF1B8,#D4AF37_60%,#8C6E1A)] bg-clip-text text-transparent">
            recognised.
          </span>
        </h2>
        <p className="text-muted mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.6]">
          Awarded in both the Junior and Senior divisions at the Grand Final
          Innovation Expo.
        </p>
      </header>

      <div className="mx-auto mt-11 grid max-w-[1040px] grid-cols-1 items-end gap-[14px] min-[1000px]:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)]">
        {podium.map((place) => (
          <article
            className={cn(
              "relative flex flex-col justify-between gap-[18px] overflow-hidden rounded-3xl p-[22px] transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-2",
              place.minHeightClass,
              place.orderClass
            )}
            key={place.rank}
            style={{
              background: place.background,
              border: `1px solid ${place.line}`,
              boxShadow: `inset 0 1px 0 rgba(255,240,190,${place.highlight}), 0 50px 100px -50px ${place.shadow}`,
            }}
          >
            <div
              aria-hidden="true"
              className="absolute top-[-30%] left-1/2 aspect-square w-[140%] -translate-x-1/2 rounded-full"
              style={{
                background: `radial-gradient(circle closest-side, ${place.glow}, transparent)`,
              }}
            />
            <div
              aria-hidden="true"
              className={cn(
                "font-display pointer-events-none absolute right-[-12px] bottom-[-0.18em] leading-none font-bold tracking-[-0.08em] text-transparent",
                place.numeralClass,
                place.numeralStrokeClass
              )}
            >
              {place.rank}
            </div>

            <div className="relative flex items-start justify-between gap-3">
              <span
                className="font-mono text-[11px] tracking-[0.18em] whitespace-nowrap"
                style={{ color: place.color }}
              >
                {place.kicker}
              </span>
              <span className="text-muted-2 rounded-full border border-[rgba(185,245,208,0.14)] px-2.5 py-[5px] font-mono text-[10px] tracking-[0.14em] whitespace-nowrap">
                PER DIVISION
              </span>
            </div>

            <div className="relative flex justify-center">
              <div
                className={cn(
                  "relative flex aspect-square items-center justify-center rounded-full",
                  place.medalClass
                )}
                style={{
                  background: place.medalBackground,
                  boxShadow: `0 0 0 ${place.ring} rgba(2,8,7,0.6), 0 0 0 calc(${place.ring} + 1px) ${place.line}, 0 0 80px ${place.glow}, inset 0 -10px 24px rgba(0,0,0,0.35), inset 0 6px 14px rgba(255,255,255,0.35)`,
                }}
              >
                <span
                  className={cn(
                    "font-display font-bold tracking-[-0.05em]",
                    place.medalNumberClass
                  )}
                  style={{
                    color: place.ink,
                    textShadow: "0 1px 0 rgba(255,255,255,0.35)",
                  }}
                >
                  {place.rank}
                </span>
              </div>
            </div>

            <div className="relative text-center">
              <h3
                className={cn(
                  "font-display leading-[1] font-bold tracking-[-0.04em]",
                  place.titleClass
                )}
              >
                {place.title}
              </h3>
              <div className="mt-2 text-[13.5px] text-[#A9BBB3]">
                {place.description}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-14 flex items-center gap-5">
        <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.35))]" />
        <span className="text-gold font-mono text-[11px] tracking-[0.2em] whitespace-nowrap">
          SPECIAL AWARDS
        </span>
        <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(212,175,55,0.35),transparent)]" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-2.5 min-[600px]:grid-cols-2 min-[1100px]:grid-cols-4">
        {specialAwards.map((award) => (
          <div
            className="relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.16)] bg-[linear-gradient(180deg,rgba(212,175,55,0.07),rgba(212,175,55,0)_60%),#030F0B] px-[18px] py-4 transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1 hover:border-[rgba(212,175,55,0.5)] hover:shadow-[0_30px_60px_-36px_rgba(212,175,55,0.6)]"
            key={award}
          >
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFF1B8,#D4AF37_50%,#7A6216)] shadow-[0_0_24px_rgba(212,175,55,0.35),inset_0_-4px_8px_rgba(0,0,0,0.3)]"
            >
              <span className="size-[9px] rotate-45 rounded-[2px] bg-[#2A2106] opacity-75" />
            </span>
            <div className="min-w-0">
              <div className="text-gold font-mono text-[10px] tracking-[0.16em]">
                BEST
              </div>
              <div className="font-display mt-[3px] text-[16px] leading-[1.15] font-semibold tracking-[-0.01em]">
                {award}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </Section>
);
