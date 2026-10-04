import type { SVGProps } from "react";

import { cn } from "@byte-quest/ui/lib/utils";

type IconProps = SVGProps<SVGSVGElement>;

function iconClasses(className?: string) {
  return cn("size-4 shrink-0", className);
}

function ChevronDown({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClasses(className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUp({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClasses(className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

function ChevronRight({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClasses(className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function Check({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClasses(className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.4"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

function Close({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClasses(className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function Search({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClasses(className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function Plus({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClasses(className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function Minus({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClasses(className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function ArrowRight({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClasses(className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

function Alert({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClasses(className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 3.5 21.5 20h-19L12 3.5Z" />
      <path d="M12 10v4.5M12 17.4h.01" />
    </svg>
  );
}

function Info({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClasses(className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8h.01" />
    </svg>
  );
}

export {
  Alert,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Close,
  Info,
  Minus,
  Plus,
  Search,
};