import { obaLogoAlt, organiser } from "./data";

const SACOBA_SRC = "/assets/sacoba-logo.png";

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
        <img alt={obaLogoAlt} className="h-11 w-auto" src={SACOBA_SRC} />
        <h2 className="m-0 text-[clamp(28px,3.2vw,44px)] leading-[1.05] tracking-[-0.03em]">
          {organiser.title}
        </h2>
        <p className="text-muted m-0 max-w-[480px] text-[15.5px] leading-[1.6]">
          {organiser.body}
        </p>
        <a
          className="text-gold hover:text-gold-bright text-[20px] font-semibold tracking-[-0.01em] underline-offset-4 hover:underline"
          href={`mailto:${organiser.email}`}
        >
          {organiser.email}
        </a>
        <div className="text-gold-bright font-mono text-[12px] tracking-[0.14em]">
          {organiser.motto}
        </div>
      </div>
    </div>
  </section>
);
