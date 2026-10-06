import { Link } from "@tanstack/react-router";

import { SubpageHero } from "@/components/site/subpage-hero";

interface SectorCardCopy {
  href: "/register/team" | "/register/volunteer";
  kicker: string;
  title: string;
  description: string;
  points: string[];
  color: string;
  line: string;
  cta: string;
}

const CARDS: SectorCardCopy[] = [
  {
    href: "/register/team",
    kicker: "SCHOOLS",
    title: "Register a team",
    description:
      "Your school's teacher-in-charge or principal registers a Junior and/or Senior team, enters the full student roster, and submits for both divisions in one go.",
    points: [
      "One or both divisions, one submission",
      "3–5 students per team",
      "No account needed",
    ],
    color: "#52FF3D",
    line: "rgba(82,255,61,0.3)",
    cta: "Register your team →",
  },
  {
    href: "/register/volunteer",
    kicker: "ST. ALOYSIUS' COLLEGE, GALLE",
    title: "Become a volunteer",
    description:
      "Students at St. Aloysius' College who want to help run BYTE QUEST — content, media, design, logistics or the showcase crew — apply here.",
    points: [
      "Pick the teams you'd like to join",
      "Approved by the organising committee",
      "Get your volunteer ID card",
    ],
    color: "#F0D875",
    line: "rgba(212,175,55,0.3)",
    cta: "Apply to volunteer →",
  },
];

export const SectorSelect = () => (
  <main className="bg-ink overflow-x-hidden">
    <SubpageHero
      className="pt-[clamp(48px,6vw,80px)] pb-[clamp(28px,4vw,44px)] [&_h1]:mt-4 [&_h1]:text-[clamp(40px,5.5vw,76px)]"
      kicker="GET INVOLVED"
      lead="Registering a team and volunteering are both handled here — pick the one that's you."
      title="How are you joining BYTE QUEST?"
    />

    <section className="px-[clamp(20px,5vw,64px)] pb-[clamp(44px,5vw,64px)]">
      <div className="mx-auto grid max-w-[1000px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
        {CARDS.map((card) => (
          <Link
            className="text-fg hover:border-volt focus-visible:outline-volt relative flex flex-col gap-4 rounded-[22px] border border-[rgba(185,245,208,0.12)] bg-[#020807] p-[clamp(24px,3vw,32px)] text-left font-sans transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[3px]"
            key={card.href}
            to={card.href}
          >
            <span
              className="font-mono text-[10.5px] tracking-[0.14em]"
              style={{ color: card.color }}
            >
              {card.kicker}
            </span>
            <span className="font-display text-[30px] leading-[1.05] font-bold tracking-[-0.03em]">
              {card.title}
            </span>
            <span className="text-muted text-[14.5px] leading-[1.6]">
              {card.description}
            </span>
            <ul className="m-0 grid list-none gap-2 p-0">
              {card.points.map((point) => (
                <li
                  className="text-fg-dim flex items-center gap-2.5 text-[13.5px]"
                  key={point}
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ background: card.color }}
                  />
                  {point}
                </li>
              ))}
            </ul>
            <span
              className="mt-2 inline-flex w-fit items-center rounded-full px-[18px] py-3 text-[13.5px] font-bold whitespace-nowrap"
              style={{
                background: card.color,
                color: "#020807",
              }}
            >
              {card.cta}
            </span>
          </Link>
        ))}
      </div>
    </section>

    <section className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]">
      <div className="mx-auto max-w-[1000px] text-center">
        <p className="text-muted-2 m-0 text-[13.5px]">
          Already registered, approved, or organising committee?{" "}
          <Link className="text-volt hover:text-lime" to="/auth/login">
            Sign in →
          </Link>
        </p>
      </div>
    </section>
  </main>
);
