import { runnerUps, specialAwards } from "./data";
import { HomeHeading } from "./home-heading";

const GOLD_TEXT =
  "bg-[linear-gradient(180deg,#FFF1B8,#D4AF37_55%,#8C6E1A)] bg-clip-text text-transparent";

export const Awards = () => (
  <section
    className="relative px-[clamp(20px,5vw,64px)] py-[clamp(72px,9vw,128px)]"
    id="awards"
    style={{
      background:
        "radial-gradient(50% 45% at 30% 55%, rgba(212,175,55,0.10), transparent 70%), #020807",
    }}
  >
    <div className="mx-auto max-w-[1280px]">
      <HomeHeading
        kicker="10 / AWARDS & RECOGNITION"
        leadClassName="max-w-[480px] text-[16.5px]"
        kickerColor="#D4AF37"
        lead="Awarded in both the Junior and Senior divisions at the Grand Final Innovation Expo."
        title={
          <>
            Excellence, <span className={GOLD_TEXT}>recognised.</span>
          </>
        }
      />

      <div className="mt-14 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-x-14 gap-y-5">
        <article
          className="relative flex flex-col gap-[22px] overflow-hidden rounded-[24px] border border-transparent p-[clamp(24px,2.6vw,32px)] shadow-[inset_0_1px_0_rgba(255,240,190,0.2),0_60px_120px_-60px_rgba(212,175,55,0.6)]"
          style={{
            background:
              "radial-gradient(80% 70% at 100% 0%,rgba(212,175,55,0.22),transparent 60%) padding-box,linear-gradient(160deg,#1A1709,#030F0B 60%) padding-box,linear-gradient(160deg,rgba(255,236,170,0.8),rgba(212,175,55,0.25) 40%,rgba(212,175,55,0.05) 75%) border-box",
          }}
        >
          <div
            aria-hidden="true"
            className="font-display pointer-events-none absolute right-[-0.04em] bottom-[-0.24em] text-[clamp(150px,14vw,200px)] leading-none font-bold tracking-[-0.08em] text-transparent [-webkit-text-stroke:1.5px_rgba(212,175,55,0.22)]"
          >
            01
          </div>
          <div className="relative flex items-center justify-between gap-3">
            <span className="text-gold-bright font-mono text-[11px] tracking-[0.2em]">
              FIRST PLACE
            </span>
            <span className="text-gold-bright rounded-full border border-[rgba(240,216,117,0.35)] px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap">
              JUNIOR · SENIOR
            </span>
          </div>
          <div className="relative">
            <h3
              className={`m-0 text-[clamp(38px,3.6vw,52px)] leading-[0.95] tracking-[-0.045em] ${GOLD_TEXT}`}
            >
              Champion
            </h3>
            <div className="mt-3.5 h-0.5 w-14 bg-[linear-gradient(90deg,#F0D875,transparent)]" />
            <p className="text-fg-dim mt-3 mb-0 max-w-[300px] text-[14.5px] leading-[1.55]">
              The highest honour of BYTE QUEST, awarded to the strongest team in
              each division.
            </p>
          </div>
        </article>

        <div className="flex flex-col justify-center border-t border-[rgba(185,245,208,0.1)]">
          {runnerUps.map((place) => (
            <div
              className="grid grid-cols-[auto_1fr] items-center gap-6 border-b border-[rgba(185,245,208,0.1)] py-7"
              key={place.rank}
            >
              <span
                className="font-display bg-clip-text text-[clamp(64px,6vw,88px)] leading-[0.8] font-bold tracking-[-0.06em] text-transparent"
                style={{ backgroundImage: place.numeralGradient }}
              >
                {place.rank}
              </span>
              <div className="min-w-0">
                <div
                  className="font-mono text-[10.5px] tracking-[0.18em]"
                  style={{ color: place.kickerColor }}
                >
                  {place.kicker}
                </div>
                <div className="font-display mt-2 text-[clamp(24px,2.2vw,30px)] leading-none font-bold tracking-[-0.03em]">
                  {place.title}
                </div>
                <div className="mt-1.5 text-[14px] text-[#A9BBB3]">
                  {place.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-[72px] flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="m-0 text-[clamp(26px,2.6vw,34px)] tracking-[-0.03em]">
          Special awards
        </h3>
        <span className="text-muted-2 font-mono text-[11px] tracking-[0.16em]">
          EIGHT CATEGORIES · BOTH DIVISIONS
        </span>
      </div>
      <ol className="m-0 mt-6 grid list-none [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-10 p-0">
        {specialAwards.map((award, index) => (
          <li
            className="flex items-baseline gap-[18px] border-t border-[rgba(212,175,55,0.18)] py-5 transition-[padding] duration-300 ease-in-out hover:pl-2"
            key={award}
          >
            <span className="text-gold font-mono text-[11px] tracking-[0.12em]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-fg text-[clamp(18px,1.6vw,21px)] font-semibold tracking-[-0.015em]">
              Best {award}
            </span>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
