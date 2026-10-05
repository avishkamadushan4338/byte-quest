import { cn } from "@byte-quest/ui/lib/utils";
import { Link } from "@tanstack/react-router";

interface ClosingCtaAction {
  label: string;
  to: string;
  variant?: "primary" | "outline";
}

interface ClosingCtaProps {
  title: string;
  actions: ClosingCtaAction[];
  compact?: boolean;
}

const actionClasses = {
  primary: "bg-volt text-ink hover:bg-lime hover:text-ink font-bold",
  outline:
    "text-fg hover:border-volt hover:text-fg border border-[rgba(242,247,244,0.25)] font-semibold",
} satisfies Record<NonNullable<ClosingCtaAction["variant"]>, string>;

export const ClosingCta = ({ title, actions, compact }: ClosingCtaProps) => (
  <section
    className={cn(
      "px-[clamp(20px,5vw,64px)] text-center",
      compact ? "py-[clamp(64px,9vw,112px)]" : "py-[clamp(72px,10vw,128px)]"
    )}
    style={{
      background:
        "radial-gradient(45% 60% at 50% 100%, rgba(82,255,61,0.16), transparent 70%), #020807",
    }}
  >
    <div className="mx-auto max-w-[820px]">
      <h2
        className={cn(
          "m-0 tracking-[-0.05em]",
          compact
            ? "text-[clamp(38px,5.5vw,72px)]"
            : "text-[clamp(40px,6vw,80px)]",
          "leading-[0.92]"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "flex flex-wrap justify-center gap-2.5",
          compact ? "mt-7" : "mt-8"
        )}
      >
        {actions.map((action) => (
          <Link
            className={cn(
              "rounded-full px-7 py-4 text-[15px] whitespace-nowrap",
              actionClasses[action.variant ?? "primary"]
            )}
            key={action.label}
            to={action.to}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  </section>
);
