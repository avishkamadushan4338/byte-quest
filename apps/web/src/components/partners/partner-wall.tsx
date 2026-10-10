import { InfinityIcon } from "@phosphor-icons/react";

import { partnerTiers, partnerWall } from "./data";

const SlotPlaceholder = ({ height }: { height: string }) => (
  <div
    className="text-faint-2 flex items-center justify-center rounded-[10px] border border-dashed border-[rgba(185,245,208,0.12)] font-mono text-[12.5px] tracking-[0.1em]"
    style={{ height }}
  >
    LOGO · TBA
  </div>
);

/** Platinum slots get the flagship treatment: solid, taller and accent-lit. */
const FeaturedSlotPlaceholder = ({
  accent,
  height,
}: {
  accent: string;
  height: string;
}) => (
  <div
    className="font-display relative flex items-center justify-center overflow-hidden rounded-[12px] border text-[13px] font-semibold tracking-[0.06em]"
    style={{
      background: `radial-gradient(70% 120% at 50% 0%, ${accent}1f, transparent 70%), linear-gradient(160deg,rgba(22,35,31,0.9),rgba(3,15,11,0.9))`,
      borderColor: `${accent}59`,
      boxShadow: `inset 0 1px 0 ${accent}26, 0 0 30px -14px ${accent}80`,
      height,
    }}
  >
    <span
      aria-hidden="true"
      className="absolute inset-x-8 top-0 h-px"
      style={{
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
      }}
    />
    <span className="relative" style={{ color: accent }}>
      FLAGSHIP LOGO · TBA
    </span>
  </div>
);

export const PartnerWall = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,104px)]"
    id="partners-wall"
  >
    <div className="mx-auto max-w-[1280px]">
      <div className="text-muted-2 font-mono text-[13px] tracking-[0.16em]">
        {partnerWall.kicker}
      </div>
      <div className="mt-5 grid gap-3">
        {partnerTiers.map((tier) => (
          <div
            className="bg-surface grid grid-cols-1 items-center gap-3 rounded-[16px] border border-[rgba(185,245,208,0.07)] p-3.5 sm:grid-cols-[120px_1fr] sm:gap-4"
            key={tier.name}
          >
            <span
              className="font-mono text-[13px] tracking-[0.16em]"
              style={{ color: tier.accent }}
            >
              {tier.label}
            </span>
            {tier.unlimited ? (
              <div
                className="flex items-center gap-3 rounded-[10px] border border-dashed border-[rgba(185,245,208,0.12)] px-4"
                style={{ height: tier.slotHeight }}
              >
                <InfinityIcon
                  aria-hidden="true"
                  className="shrink-0"
                  size={20}
                  style={{ color: tier.accent }}
                  weight="bold"
                />
                <span className="text-faint-2 font-mono text-[12.5px] tracking-[0.1em]">
                  UNLIMITED TITLE SPONSORS
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: tier.slots }, (_, slot) =>
                  tier.featured ? (
                    <FeaturedSlotPlaceholder
                      accent={tier.accent}
                      height={tier.slotHeight}
                      key={slot}
                    />
                  ) : (
                    <SlotPlaceholder height={tier.slotHeight} key={slot} />
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);
