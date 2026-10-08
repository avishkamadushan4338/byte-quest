import { ArrowRightIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { moments } from "./data";
import { HomeHeading } from "./home-heading";

const cubeSizes = ["26px", "42px", "26px"];
const ACTIVE_CUBE = 1;

export const Moments = () => {
  const [active, setActive] = useState(0);

  return (
    <section
      className="px-[clamp(20px,5vw,64px)] py-[clamp(64px,8vw,112px)]"
      id="programme"
    >
      <div className="mx-auto max-w-[1280px]">
        <HomeHeading
          kicker="04 / THE THREE BIG MOMENTS"
          lead="Each milestone raises the bar — from first idea to working prototype to a public showcase."
          title="Two hackathons. One grand finale."
        />
        <div className="mt-14 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
          {moments.map((moment, index) => {
            const on = index === active;
            return (
              <div
                className="relative flex flex-col overflow-hidden rounded-[20px] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-[350ms] ease-in-out"
                key={moment.n}
                onFocus={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
                style={{
                  background: on
                    ? "linear-gradient(180deg,#0A2A20,#030F0B 60%)"
                    : "#030F0B",
                  border: `1px solid ${on ? moment.accent : "rgba(185,245,208,0.09)"}`,
                }}
              >
                <div
                  className="relative flex h-[132px] items-center justify-center gap-3 border-b border-[rgba(185,245,208,0.07)] [perspective:500px]"
                  style={{
                    background: `radial-gradient(60% 90% at 50% 100%, ${moment.glowSoft}, transparent 70%)`,
                  }}
                >
                  <span
                    className="font-display absolute top-4 left-[18px] text-[15px] font-bold"
                    style={{ color: on ? moment.accent : "#5E7469" }}
                  >
                    {moment.n}
                  </span>
                  <span className="text-gold-bright absolute top-3.5 right-4 rounded-full border border-[rgba(240,216,117,0.3)] px-[9px] py-[5px] font-mono text-[10px] tracking-[0.12em] whitespace-nowrap">
                    DATE TBA
                  </span>
                  {cubeSizes.map((size, cube) => (
                    <div
                      className="[transform:rotateX(55deg)_rotateZ(45deg)] rounded-[8px]"
                      key={`${moment.n}-${String(cube)}`}
                      style={{
                        width: size,
                        height: size,
                        border: `1.5px solid ${moment.accent}`,
                        boxShadow: `0 0 18px ${moment.glow}`,
                        background:
                          on && cube === ACTIVE_CUBE
                            ? moment.glow
                            : "transparent",
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-1 flex-col gap-4 px-[22px] pt-[22px] pb-5">
                  <div>
                    <div
                      className="font-mono text-[10.5px] tracking-[0.14em]"
                      style={{ color: moment.accent }}
                    >
                      {moment.kicker}
                    </div>
                    <h3 className="mt-1.5 mb-0 text-[24px] leading-[1.1] tracking-[-0.02em]">
                      {moment.title}
                    </h3>
                  </div>
                  <div className="text-muted flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[13.5px]">
                    {moment.flow.map((step, stepIndex) => (
                      <span
                        className="inline-flex items-center gap-2 whitespace-nowrap"
                        key={step}
                      >
                        <span
                          aria-hidden="true"
                          style={{ color: moment.accent }}
                        >
                          {stepIndex > 0 ? (
                            <ArrowRightIcon weight="bold" />
                          ) : null}
                        </span>
                        {step}
                      </span>
                    ))}
                  </div>
                  <div className="text-muted-2 grid gap-2 border-t border-[rgba(185,245,208,0.07)] pt-3.5 text-[13px] leading-[1.5]">
                    <div className="flex justify-between gap-3">
                      <span className="text-fg-dim">Deliverables</span>
                      <span>With challenge brief</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-fg-dim">Judging</span>
                      <span>Criteria published prior</span>
                    </div>
                  </div>
                  <a
                    className="text-fg hover:text-volt mt-auto flex items-center justify-between py-2 text-[13.5px] font-semibold"
                    href="/programme"
                  >
                    View milestone{" "}
                    <ArrowRightIcon
                      style={{ color: moment.accent }}
                      weight="bold"
                    />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
