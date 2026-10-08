import { organiser } from "./data";

export const Organisers = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]"
    id="organisers"
  >
    <div
      className="mx-auto max-w-[760px] overflow-hidden rounded-[28px] border border-[rgba(212,175,55,0.2)]"
      style={{
        background:
          "radial-gradient(60% 80% at 0% 0%, rgba(212,175,55,0.1), transparent 60%), linear-gradient(160deg,#071D16,#030F0B)",
      }}
    >
      <div className="flex flex-col gap-[18px] p-[clamp(28px,4vw,56px)]">
        <div className="text-gold font-mono text-[11px] tracking-[0.16em]">
          {organiser.kicker}
        </div>
        <h2 className="m-0 text-[clamp(28px,3.2vw,44px)] leading-[1.05] tracking-[-0.03em]">
          {organiser.title}
        </h2>
        <p className="text-muted m-0 max-w-[480px] text-[15.5px] leading-[1.6]">
          {organiser.body}
        </p>
        <div className="text-gold-bright font-mono text-[12px] tracking-[0.14em]">
          {organiser.motto}
        </div>
      </div>
    </div>
  </section>
);
