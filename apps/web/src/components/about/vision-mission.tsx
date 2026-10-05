import { visionMission } from "./data";

export const VisionMission = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] py-[clamp(64px,8vw,112px)]"
    id="vision"
  >
    <div className="mx-auto grid max-w-[1280px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-4">
      {visionMission.map((card) => (
        <div
          className="relative flex flex-col gap-[18px] overflow-hidden rounded-[24px] p-[clamp(26px,3.5vw,44px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          key={card.id}
          style={{
            background: card.background,
            border: `1px solid ${card.border}`,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 size-[260px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${card.glow}, transparent 70%)`,
            }}
          />
          <div
            className="relative font-mono text-[11px] tracking-[0.16em]"
            style={{ color: card.color }}
          >
            {card.kicker}
          </div>
          <p className="font-display relative m-0 text-[clamp(22px,2.2vw,30px)] leading-[1.25] font-medium tracking-[-0.015em] text-pretty">
            {card.copy}
          </p>
        </div>
      ))}
    </div>
  </section>
);
