import { cn } from "@byte-quest/ui/lib/utils";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  SparkleIcon,
} from "@phosphor-icons/react";

import { Reveal } from "@/components/site/motion";

import type { PartnerTier } from "./data";
import { partnerTiers } from "./data";

const TIER_CARD =
  "group relative flex flex-col gap-[22px] overflow-hidden rounded-[18px] p-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-1 motion-reduce:hover:translate-y-0";

const TIER_LABEL = "font-mono text-[13px] tracking-[0.18em]";

const TIER_AMOUNT =
  "font-display text-[clamp(30px,2.6vw,38px)] leading-none font-bold tracking-[-0.035em]";

const TIER_LINK =
  "text-fg-dim flex justify-between border-t border-[rgba(242,247,244,0.08)] pt-3.5 text-[15px] font-semibold transition-colors duration-200";

const TierLink = ({
  name,
  accentHover,
}: Pick<PartnerTier, "name" | "accentHover">) => (
  <span className={cn("flex items-center gap-2", accentHover)}>
    <span>Enquire about {name}</span>
    <ArrowRightIcon
      aria-hidden="true"
      className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      weight="bold"
    />
  </span>
);

/**
 * Platinum gets the whole first row: the headline tier deserves the space, and
 * a four-across grid leaves it stranded at the same size as Title.
 */
const FeaturedTier = ({ tier }: { tier: PartnerTier }) => (
  <Reveal className="min-w-0 sm:col-span-2 lg:col-span-4">
    <div
      className={cn(
        TIER_CARD,
        "gap-[clamp(20px,3vw,44px)] p-[clamp(24px,3.4vw,44px)] lg:flex-row lg:items-center",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_60px_-40px_rgba(82,255,61,0.55)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_34px_80px_-38px_rgba(82,255,61,0.7)]"
      )}
      style={{
        background: tier.background,
        border: `1px solid ${tier.border}`,
      }}
    >
      {/* Rotating conic halo behind the card, kept behind the content. */}
      <span
        aria-hidden="true"
        className="animate-tier-spin pointer-events-none absolute -inset-px rounded-[18px] opacity-60 motion-reduce:hidden"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${tier.accent}22 40deg, transparent 120deg, transparent 240deg, ${tier.accent}1A 290deg, transparent 360deg)`,
          maskImage:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskImage:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: 1,
        }}
      />
      <span
        aria-hidden="true"
        className="animate-tier-halo pointer-events-none absolute -top-24 -left-16 size-[340px] rounded-full bg-[radial-gradient(circle_closest-side,rgba(82,255,61,0.22),transparent)] blur-2xl motion-reduce:hidden"
      />
      <span
        aria-hidden="true"
        className="animate-tier-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-[38%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.09),transparent)] motion-reduce:hidden"
      />

      <div className="relative flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className={TIER_LABEL} style={{ color: tier.accent }}>
            {tier.label}
          </span>
          {tier.badge ? (
            <span
              className="text-volt inline-flex items-center gap-1.5 rounded-full border border-[rgba(82,255,61,0.35)] bg-[rgba(82,255,61,0.1)] px-2.5 py-1 font-mono text-[10.5px] tracking-[0.16em] uppercase"
              style={{ color: tier.accent }}
            >
              <SparkleIcon aria-hidden="true" weight="fill" />
              {tier.badge}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-muted-2 font-mono text-[14px]">LKR</span>
          <span
            className={cn(
              TIER_AMOUNT,
              "text-[clamp(38px,5.2vw,62px)] tracking-[-0.04em]"
            )}
          >
            {tier.amount}
          </span>
        </div>

        <p className="text-muted m-0 max-w-[520px] text-[15px] leading-[1.6]">
          The headline partnership. Platinum sponsors anchor the programme and
          are named first everywhere it appears.
        </p>
      </div>

      {tier.highlights?.length ? (
        <ul className="relative m-0 grid min-w-0 flex-1 list-none gap-2.5 p-0 sm:grid-cols-2 lg:max-w-[560px]">
          {tier.highlights.map((highlight) => (
            <li
              className="text-fg-dim flex items-start gap-2.5 text-[14.5px] leading-[1.45]"
              key={highlight}
            >
              <CheckCircleIcon
                aria-hidden="true"
                className="mt-px size-4 shrink-0"
                style={{ color: tier.accent }}
                weight="fill"
              />
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}

      <a
        className={cn(
          "relative flex shrink-0 items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[15.5px] font-bold whitespace-nowrap transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          "bg-volt text-ink shadow-[0_0_0_1px_rgba(82,255,61,0.45),0_14px_34px_-14px_rgba(82,255,61,0.75)] hover:shadow-[0_0_0_1px_rgba(183,240,0,0.6),0_20px_44px_-14px_rgba(183,240,0,0.7)]"
        )}
        href="#enquire"
      >
        <TierLink name={tier.name} accentHover="text-ink" />
      </a>
    </div>
  </Reveal>
);

const StandardTier = ({
  tier,
  delay,
}: {
  tier: PartnerTier;
  delay: number;
}) => (
  <Reveal className="min-w-0" delay={delay}>
    <div
      className={TIER_CARD}
      style={{
        background: tier.background,
        border: `1px solid ${tier.border}`,
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${tier.accent}, transparent)`,
        }}
      />
      <div className="relative flex items-center justify-between">
        <span className={TIER_LABEL} style={{ color: tier.accent }}>
          {tier.label}
        </span>
        <span
          className="animate-pulse-dot size-2.5 rotate-45 motion-reduce:animate-none"
          style={{
            background: tier.accent,
            boxShadow: `0 0 14px ${tier.accent}`,
          }}
        />
      </div>
      <div className="relative flex items-baseline gap-2">
        <span className="text-muted-2 font-mono text-[13px]">LKR</span>
        <span className={TIER_AMOUNT}>{tier.amount}</span>
      </div>
      <a
        className={cn(TIER_LINK, "relative", tier.accentHover)}
        href="#enquire"
      >
        <TierLink accentHover="" name={tier.name} />
      </a>
    </div>
  </Reveal>
);

export const Tiers = () => {
  const featured = partnerTiers.find((tier) => tier.featured);
  const rest = partnerTiers.filter((tier) => !tier.featured);

  return (
    <section
      className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,104px)]"
      id="tiers"
    >
      <div className="mx-auto grid max-w-[1280px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {featured ? <FeaturedTier tier={featured} /> : null}
        {rest.map((tier, index) => (
          <StandardTier delay={index * 0.06} key={tier.name} tier={tier} />
        ))}
      </div>
    </section>
  );
};
