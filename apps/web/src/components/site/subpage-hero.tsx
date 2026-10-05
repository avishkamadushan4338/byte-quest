import { cn } from "@byte-quest/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type HeroTone = "teal" | "gold";

interface SubpageHeroProps {
  crumb: string;
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  tone?: HeroTone;
  narrow?: boolean;
  className?: string;
  gridClassName?: string;
  children?: ReactNode;
}

const toneText = {
  teal: "text-teal",
  gold: "text-gold",
} satisfies Record<HeroTone, string>;

const toneGlow = {
  teal: "radial-gradient(50% 70% at 85% 20%, rgba(8,122,85,0.32), transparent 65%), #020807",
  gold: "radial-gradient(50% 70% at 85% 20%, rgba(212,175,55,0.14), transparent 65%), #020807",
} satisfies Record<HeroTone, string>;

export const HeaderSpacer = () => (
  <div aria-hidden="true" className="h-[84px]" />
);

export const SubpageHero = ({
  crumb,
  kicker,
  title,
  lead,
  aside,
  tone = "teal",
  narrow,
  className,
  gridClassName,
  children,
}: SubpageHeroProps) => (
  <>
    <HeaderSpacer />
    <section
      className={cn(
        "relative px-[clamp(20px,5vw,64px)] pt-[clamp(56px,8vw,104px)] pb-[clamp(40px,5vw,64px)]",
        className
      )}
      style={{ background: toneGlow[tone] }}
    >
      <div className="mx-auto max-w-[1280px]">
        <nav
          aria-label="Breadcrumb"
          className="text-faint flex gap-2 font-mono text-[11px] tracking-[0.12em]"
        >
          <Link className="text-muted-2 hover:text-volt" to="/">
            HOME
          </Link>
          <span>/</span>
          <span aria-current="page" className={toneText[tone]}>
            {crumb}
          </span>
        </nav>
        <div
          className={cn(
            "mt-7 grid items-end gap-x-[72px] gap-y-6",
            narrow
              ? "[grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))]"
              : "[grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr))]",
            gridClassName
          )}
        >
          <div>
            <div
              className={cn(
                "font-mono text-[11px] tracking-[0.16em]",
                toneText[tone]
              )}
            >
              {kicker}
            </div>
            <h1 className="mt-[18px] mb-0 text-[clamp(44px,6.5vw,92px)] leading-[0.92] tracking-[-0.045em]">
              {title}
            </h1>
          </div>
          {aside ?? (
            <p className="text-muted m-0 max-w-[520px] text-[17px] leading-[1.65] text-pretty">
              {lead}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  </>
);
