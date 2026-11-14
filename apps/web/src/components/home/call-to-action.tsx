import { Link } from "@tanstack/react-router";

import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from "@/components/site/contact";

export const CallToAction = () => (
  <section
    className="relative overflow-hidden px-[clamp(20px,5vw,64px)] py-[clamp(88px,12vw,160px)]"
    id="register"
    style={{
      background:
        "radial-gradient(45% 55% at 50% 100%, rgba(82,255,61,0.2), transparent 70%), radial-gradient(70% 80% at 50% 120%, rgba(8,122,85,0.55), transparent 70%), #020807",
    }}
  >
    <div className="relative mx-auto max-w-[960px] text-center">
      <div className="text-volt font-mono text-[13px] tracking-[0.18em]">
        JOIN THE QUEST
      </div>
      <h2 className="mt-[22px] mb-0 text-[clamp(48px,8vw,112px)] leading-[0.9] tracking-[-0.05em]">
        Your idea could be next.
      </h2>
      <p className="text-muted mx-auto mt-6 mb-0 max-w-[460px] text-[17px] leading-[1.6]">
        Team registration is now open. Register your team for BYTE QUEST.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-2.5">
        <Link
          className="text-fg hover:border-volt hover:text-fg inline-flex items-center rounded-full border border-[rgba(242,247,244,0.26)] px-[30px] py-[17px] text-[15px] font-semibold whitespace-nowrap"
          to="/register"
        >
          Register your team
        </Link>
      </div>
      <p className="text-muted-2 mt-6 mb-0 font-mono text-[13px] tracking-[0.1em]">
        TEAM REGISTRATION OPEN
      </p>
      <div className="text-muted mx-auto mt-8 mb-0 max-w-[460px] text-[15px] leading-[1.6]">
        <p className="m-0">
          If you need any help, don&apos;t feel hesitant to call{" "}
          <a
            className="text-volt hover:text-lime font-mono"
            href={CONTACT_PHONE_HREF}
          >
            {CONTACT_PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    </div>
  </section>
);
