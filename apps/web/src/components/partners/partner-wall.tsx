import { partnerTiers, partnerWall } from "./data";

export const PartnerWall = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,104px)]"
    id="partners-wall"
  >
    <div className="mx-auto max-w-[1280px]">
      <div className="text-muted-2 font-mono text-[11px] tracking-[0.16em]">
        {partnerWall.kicker}
      </div>
      <div className="mt-5 grid gap-3">
        {partnerTiers.map((tier) => (
          <div
            className="bg-surface grid grid-cols-[120px_1fr] items-center gap-4 rounded-[16px] border border-[rgba(185,245,208,0.07)] p-3.5"
            key={tier.name}
          >
            <span
              className="font-mono text-[11px] tracking-[0.16em]"
              style={{ color: tier.accent }}
            >
              {tier.label}
            </span>
            <div className="grid [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))] gap-2">
              {Array.from({ length: tier.slots }, (_, slot) => (
                <div
                  className="text-faint-2 flex items-center justify-center rounded-[10px] border border-dashed border-[rgba(185,245,208,0.12)] font-mono text-[10px] tracking-[0.1em]"
                  key={slot}
                  style={{ height: tier.slotHeight }}
                >
                  LOGO · TBA
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
