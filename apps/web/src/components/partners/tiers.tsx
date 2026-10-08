import { cn } from "@byte-quest/ui/lib/utils";
import { ArrowRightIcon } from "@phosphor-icons/react";

import { partnerTiers } from "./data";

export const Tiers = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,104px)]"
    id="tiers"
  >
    <div className="mx-auto grid max-w-[1280px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
      {partnerTiers.map((tier) => (
        <div
          className="flex flex-col gap-[22px] rounded-[18px] p-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          key={tier.name}
          style={{
            background: tier.background,
            border: `1px solid ${tier.border}`,
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[11px] tracking-[0.18em]"
              style={{ color: tier.accent }}
            >
              {tier.label}
            </span>
            <span
              aria-hidden="true"
              className="size-2.5 rotate-45"
              style={{
                background: tier.accent,
                boxShadow: `0 0 14px ${tier.accent}`,
              }}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-muted-2 font-mono text-[11px]">LKR</span>
            <span className="font-display text-[clamp(30px,2.6vw,38px)] leading-none font-bold tracking-[-0.035em]">
              {tier.amount}
            </span>
          </div>
          <a
            className={cn(
              "text-fg-dim flex justify-between border-t border-[rgba(242,247,244,0.08)] pt-3.5 text-[13.5px] font-semibold",
              tier.accentHover
            )}
            href="#enquire"
          >
            <span>Enquire about {tier.name}</span>
            <ArrowRightIcon aria-hidden="true" weight="bold" />
          </a>
        </div>
      ))}
    </div>
  </section>
);
