import { ArrowRightIcon } from "@phosphor-icons/react";

import { impactSteps } from "./data";
import { HomeHeading } from "./home-heading";

const LAST_STEP = impactSteps.length - 1;
const STEP_SHARE = 25;

export const Impact = () => (
  <section
    className="relative overflow-hidden px-[clamp(20px,5vw,64px)] py-[clamp(72px,9vw,128px)]"
    id="impact"
    style={{
      background:
        "radial-gradient(60% 70% at 85% 0%, rgba(183,240,0,0.08), transparent 60%), #041410",
    }}
  >
    <div className="mx-auto max-w-[1280px]">
      <HomeHeading
        kicker="06 / INNOVATE FOR IMPACT · SENIOR"
        leadClassName="max-w-[480px] text-[16.5px]"
        kickerColor="#B7F000"
        lead="Senior teams innovate for the UN Sustainable Development Goals - turning a real-world problem into a technology solution."
        title="Technology with purpose."
      />
      <ol className="relative m-0 mt-16 grid list-none grid-cols-1 border-t border-[rgba(185,245,208,0.12)] p-0 min-[600px]:grid-cols-2 min-[1000px]:grid-cols-4">
        {impactSteps.map((step, index) => (
          <li
            className="relative flex flex-col gap-[18px] pt-7 pr-7 pb-2"
            key={step.n}
          >
            <span
              aria-hidden="true"
              className="absolute -top-px left-0 h-0.5 bg-[linear-gradient(90deg,#B7F000,#52FF3D)] shadow-[0_0_12px_rgba(183,240,0,0.6)]"
              style={{ width: `${(index + 1) * STEP_SHARE}%` }}
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-lime font-mono text-[11px] tracking-[0.16em]">
                {step.n}
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-[14px]"
                style={{
                  color: index === LAST_STEP ? "transparent" : "#5E7469",
                }}
              >
                <ArrowRightIcon weight="bold" />
              </span>
            </div>
            <div className="font-display text-fg text-[clamp(40px,4.6vw,68px)] leading-[0.9] font-bold tracking-[-0.05em]">
              {step.title}
              <span className="text-lime">.</span>
            </div>
            <p className="text-muted m-0 max-w-[240px] text-[15px] leading-[1.55] text-pretty">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
