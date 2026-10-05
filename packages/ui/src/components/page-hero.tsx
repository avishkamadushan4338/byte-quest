import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

import { Container } from "@byte-quest/ui/components/container";
import { Kicker, type KickerTone } from "@byte-quest/ui/components/kicker";
import { Section, type SectionTone } from "@byte-quest/ui/components/section";

type PageHeroProps = {
  id?: string;
  kicker: ReactNode;
  kickerTone?: KickerTone;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  asideTone?: SectionTone;
  glow?: "teal" | "gold";
  className?: string;
  children?: ReactNode;
};

const glowBackgrounds = {
  teal: "radial-gradient(50% 70% at 85% 20%, rgba(8,122,85,0.32), transparent 65%), #020807",
  gold: "radial-gradient(50% 70% at 85% 20%, rgba(212,175,55,0.14), transparent 65%), #020807",
} satisfies Record<NonNullable<PageHeroProps["glow"]>, string>;

function PageHero({
  id,
  kicker,
  kickerTone = "teal",
  title,
  lead,
  aside,
  asideTone,
  glow = "teal",
  className,
  children,
}: PageHeroProps) {
  return (
    <Section
      className={cn("pt-[clamp(48px,6vw,80px)] pb-[clamp(40px,5vw,64px)]", className)}
      id={id}
      style={{ background: glowBackgrounds[glow] }}
      tone={asideTone ?? "base"}
    >
      <Container>
        <div className="grid items-end gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))] lg:gap-x-[72px]">
          <div>
            <Kicker tone={kickerTone}>{kicker}</Kicker>
            <h1 className="mt-4 text-[clamp(40px,6.5vw,88px)] leading-[0.92] tracking-[-0.045em]">
              {title}
            </h1>
          </div>
          {aside ?? lead ? (
            <div className="m-0 flex max-w-[520px] flex-col gap-6">
              {lead ? (
                <p className="m-0 text-[17px] leading-[1.65] text-muted">
                  {lead}
                </p>
              ) : null}
              {aside}
            </div>
          ) : null}
        </div>
        {children}
      </Container>
    </Section>
  );
}

export { PageHero };
export type { PageHeroProps };