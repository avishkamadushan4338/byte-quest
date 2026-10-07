import { crestAlt, organiser } from "./data";

const CREST_SRC = "/assets/sacoba-logo.png";

export const Organisers = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]"
    id="organisers"
  >
    <div
      className="mx-auto grid max-w-[1280px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center overflow-hidden rounded-[28px] border border-[rgba(212,175,55,0.2)]"
      style={{
        background:
          "radial-gradient(60% 80% at 0% 0%, rgba(212,175,55,0.1), transparent 60%), linear-gradient(160deg,#071D16,#030F0B)",
      }}
    >
      <div className="flex justify-center p-[clamp(28px,4vw,56px)]">
        <img
          alt={crestAlt}
          className="h-auto w-[min(220px,60%)] drop-shadow-[0_20px_50px_rgba(212,175,55,0.25)]"
          src={CREST_SRC}
        />
      </div>
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
