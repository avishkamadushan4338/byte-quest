import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@byte-quest/ui/lib/utils";

type SectionTone =
  | "base"
  | "alt"
  | "journey"
  | "gold"
  | "impact"
  | "cta"
  | "schools";

const toneBackgrounds = {
  base: "#020807",
  alt: "#051712",
  journey: "linear-gradient(180deg,#020807,#051712 50%,#020807)",
  gold: "radial-gradient(50% 45% at 50% 35%, rgba(212,175,55,0.12), transparent 70%), #020807",
  impact: "#051712",
  cta: "radial-gradient(45% 55% at 50% 100%, rgba(82,255,61,0.2), transparent 70%), radial-gradient(70% 80% at 50% 120%, rgba(8,122,85,0.55), transparent 70%), #020807",
  schools: "linear-gradient(180deg,#020807,#051712)",
} satisfies Record<SectionTone, string>;

type SectionProps = HTMLAttributes<HTMLElement> & {
  id?: string;
  tone?: SectionTone;
  bleed?: boolean;
  children: ReactNode;
};

function Section({
  id,
  tone = "base",
  bleed = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-28",
        bleed
          ? "py-[clamp(48px,6vw,80px)]"
          : "px-[clamp(20px,5vw,64px)] py-[clamp(64px,8vw,112px)]",
        className
      )}
      style={{ background: toneBackgrounds[tone] }}
      {...props}
    >
      {children}
    </section>
  );
}

export { Section };
export type { SectionProps, SectionTone };
