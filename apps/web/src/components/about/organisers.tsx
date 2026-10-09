import { obaLogoAlt, organiser } from "./data";

const OBA_LOGO_SRC = "/assets/sacoba-logo.webp";

export const Organisers = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]"
    id="organisers"
  >
    <div
      className="mx-auto max-w-[960px] overflow-hidden rounded-[28px] border border-[rgba(212,175,55,0.2)]"
      style={{
        background:
          "radial-gradient(60% 80% at 0% 0%, rgba(212,175,55,0.1), transparent 60%), linear-gradient(160deg,#071D16,#030F0B)",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,320px)_1fr]">
        <div className="flex items-center justify-center p-[clamp(28px,5vw,48px)]">
          <img
            alt={obaLogoAlt}
            className="h-auto w-full max-w-[clamp(180px,22vw,260px)]"
            height={1256}
            src={OBA_LOGO_SRC}
            width={4249}
          />
        </div>
        <div className="flex flex-col gap-[14px] border-t border-[rgba(212,175,55,0.16)] p-[clamp(28px,4vw,56px)] sm:border-t-0 sm:border-l">
          <div className="text-gold font-mono text-[13px] tracking-[0.16em]">
            {organiser.kicker}
          </div>
          <h2 className="m-0 text-[clamp(24px,2.6vw,36px)] leading-[1.1] tracking-[-0.03em]">
            {organiser.title}
          </h2>
          <p className="text-muted m-0 max-w-[480px] text-[15px] leading-[1.6]">
            {organiser.body}
          </p>
          <a
            className="text-gold hover:text-gold-bright inline-flex min-h-11 w-fit items-center text-[18px] font-semibold tracking-[-0.01em]"
            href={`mailto:${organiser.email}`}
          >
            {organiser.email}
          </a>
          <div className="text-gold-bright font-mono text-[13px] tracking-[0.14em]">
            {organiser.motto}
          </div>
        </div>
      </div>
    </div>
  </section>
);
