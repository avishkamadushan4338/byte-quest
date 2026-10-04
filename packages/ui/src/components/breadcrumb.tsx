import { cn } from "@byte-quest/ui/lib/utils";
import type { ComponentType, ReactNode } from "react";

import { ChevronRight } from "@byte-quest/ui/components/icons";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbLinkProps = {
  to: string;
  className?: string;
  children: ReactNode;
};

function AnchorLink({ to, className, children }: BreadcrumbLinkProps) {
  return (
    <a className={className} href={to}>
      {children}
    </a>
  );
}

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  tone?: "teal" | "gold" | "volt";
  linkComponent?: ComponentType<BreadcrumbLinkProps>;
  className?: string;
};

const toneClasses = {
  teal: "text-teal",
  gold: "text-gold",
  volt: "text-volt",
} satisfies Record<NonNullable<BreadcrumbProps["tone"]>, string>;

function Breadcrumb({
  items,
  tone = "teal",
  linkComponent: Link = AnchorLink,
  className,
}: BreadcrumbProps) {
  const lastIndex = items.length - 1;

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="text-faint flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase">
        {items.map((item, index) => {
          const isLast = index === lastIndex;
          const content =
            item.to && !isLast ? (
              <Link
                className="text-muted-2 transition-colors hover:text-volt"
                to={item.to}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={cn(isLast && toneClasses[tone])}
              >
                {item.label}
              </span>
            );

          return (
            <li className="flex items-center gap-2" key={item.label}>
              {index > 0 ? <ChevronRight className="text-faint-2 size-3" /> : null}
              {content}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

type GlyphProps = {
  className?: string;
};

function Diamond({ className }: GlyphProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("bg-volt inline-block size-1.5 rotate-45", className)}
    />
  );
}

type IconChipTone = "volt" | "gold" | "teal" | "mint";

const chipToneClasses = {
  volt: "border-volt/35",
  gold: "border-gold/40",
  teal: "border-teal/40",
  mint: "border-mint/30",
} satisfies Record<IconChipTone, string>;

const chipDotClasses = {
  volt: "bg-volt",
  gold: "bg-gold",
  teal: "bg-teal",
  mint: "bg-mint",
} satisfies Record<IconChipTone, string>;

type IconChipProps = {
  tone?: IconChipTone;
  className?: string;
  children?: ReactNode;
};

function IconChip({ tone = "volt", className, children }: IconChipProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-[26px] shrink-0 items-center justify-center rounded-[7px] border",
        chipToneClasses[tone],
        className
      )}
    >
      {children ?? <Diamond className={cn("size-[7px]", chipDotClasses[tone])} />}
    </span>
  );
}

export { Breadcrumb, Diamond, IconChip };
export type { BreadcrumbItem, IconChipTone };