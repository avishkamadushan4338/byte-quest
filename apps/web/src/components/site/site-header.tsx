import { useScrolled } from "@byte-quest/ui/hooks/use-scrolled";
import { cn } from "@byte-quest/ui/lib/utils";
import {
  DialogClose,
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@byte-quest/ui/primitives/dialog";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { isInternalHref, menuLinks, primaryNavLinks } from "./navigation";

const navLinkClass =
  "text-muted hover:text-fg relative inline-flex items-center rounded-full px-3.5 py-2 text-[13.5px] font-medium tracking-[0.01em] whitespace-nowrap transition-colors duration-200 hover:bg-[rgba(185,245,208,0.06)] data-[status=active]:text-fg data-[status=active]:after:absolute data-[status=active]:after:bottom-[3px] data-[status=active]:after:left-1/2 data-[status=active]:after:size-1 data-[status=active]:after:-translate-x-1/2 data-[status=active]:after:rounded-full data-[status=active]:after:bg-volt data-[status=active]:after:shadow-[0_0_8px_var(--color-volt)] data-[status=active]:after:content-['']";
const menuLinkClass =
  "font-display text-fg hover:text-volt flex items-baseline gap-4 border-b border-[rgba(185,245,208,0.08)] py-2.5 text-[clamp(26px,3.4vw,40px)] font-semibold tracking-[-0.025em]";

export interface SiteHeaderProps {
  isSignedIn: boolean;
  isAdmin: boolean;
}

export const SiteHeader = ({ isSignedIn, isAdmin }: SiteHeaderProps) => {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  let authMenuLink = { label: "Sign in", href: "/auth/login" };
  if (isAdmin) {
    authMenuLink = { label: "Admin", href: "/admin" };
  } else if (isSignedIn) {
    authMenuLink = { label: "Dashboard", href: "/dashboard" };
  }
  const mobileMenuLinks = [...menuLinks, authMenuLink];

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex justify-center transition-[padding] duration-[350ms] ease-out"
      style={{
        padding: scrolled
          ? "10px clamp(8px,2vw,16px)"
          : "clamp(10px,2vw,18px) clamp(10px,3vw,24px)",
      }}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "relative flex w-full max-w-[1240px] items-center justify-between gap-3 rounded-full border backdrop-blur-xl backdrop-saturate-150 transition-all duration-[350ms] ease-out min-[1920px]:max-w-[1560px] sm:gap-6",
          scrolled
            ? "border-[rgba(185,245,208,0.14)] bg-[rgba(2,8,7,0.72)] shadow-[0_18px_50px_-18px_rgba(0,0,0,0.85),0_0_0_1px_rgba(2,8,7,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]"
            : "border-[rgba(185,245,208,0.07)] bg-[rgba(2,8,7,0.28)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        )}
        style={{
          padding: scrolled
            ? "6px 6px 6px clamp(12px,3vw,18px)"
            : "9px 9px 9px clamp(14px,3.5vw,22px)",
        }}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-[rgba(82,255,61,0.55)] to-transparent transition-opacity duration-[350ms]",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        />
        <Link
          aria-label="BYTE QUEST home"
          className="text-fg hover:text-fg flex shrink-0 items-center gap-3"
          to="/"
        >
          <img
            alt="St. Aloysius' College crest"
            className={cn(
              "w-auto transition-[height] duration-300",
              scrolled
                ? "h-7 min-[380px]:h-[30px]"
                : "h-7 min-[380px]:h-8 sm:h-9"
            )}
            src="/assets/crest.png"
          />
          <span aria-hidden="true" className="bg-line-strong h-6 w-px" />
          <img
            alt="BYTE QUEST"
            className={cn(
              "w-auto transition-[height] duration-300",
              scrolled
                ? "h-5 min-[380px]:h-[22px]"
                : "h-5 min-[380px]:h-6 sm:h-7"
            )}
            src="/assets/bq-logo.png"
          />
        </Link>

        <div className="hidden items-center gap-1 min-[1100px]:flex">
          {primaryNavLinks.map((link) => (
            <Link className={navLinkClass} key={link.label} to={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            className="group bg-volt text-ink hover:text-ink hover:bg-lime inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-bold tracking-[0.01em] whitespace-nowrap shadow-[0_0_0_1px_rgba(82,255,61,0.4),0_8px_28px_-6px_rgba(82,255,61,0.55),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_0_1px_rgba(183,240,0,0.5),0_12px_34px_-6px_rgba(183,240,0,0.6),inset_0_1px_0_rgba(255,255,255,0.5)]"
            to="/volunteers"
          >
            Volunteer
            <ArrowRightIcon
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
              weight="bold"
            />
          </Link>
          <DialogRoot onOpenChange={setMenuOpen} open={menuOpen}>
            <DialogTrigger
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex size-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border border-[rgba(185,245,208,0.18)] bg-[rgba(185,245,208,0.03)] transition-colors duration-200 hover:border-[rgba(82,255,61,0.55)] min-[1100px]:hidden"
            >
              <span
                className={cn(
                  "bg-fg h-[1.5px] w-[15px] transition-transform duration-300 ease-in-out",
                  menuOpen && "translate-y-[3.25px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "bg-fg h-[1.5px] w-[15px] transition-transform duration-300 ease-in-out",
                  menuOpen && "-translate-y-[3.25px] -rotate-45"
                )}
              />
            </DialogTrigger>
            <DialogContent className="overflow-y-auto px-[clamp(20px,5vw,64px)] py-6 sm:px-[clamp(20px,5vw,64px)] sm:py-6">
              <div className="flex items-center justify-between">
                <DialogTitle>Menu</DialogTitle>
                <DialogClose
                  aria-label="Close menu"
                  className="hover:text-fg border-[rgba(185,245,208,0.25)] text-[20px] hover:border-[rgba(185,245,208,0.25)]"
                >
                  ×
                </DialogClose>
              </div>
              <div className="grid flex-1 [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))] content-center gap-x-12 gap-y-1">
                {mobileMenuLinks.map((link, index) => {
                  const number = (
                    <span className="text-teal font-mono text-[11px] tracking-[0.1em]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  );
                  if (isInternalHref(link.href)) {
                    return (
                      <Link
                        className={menuLinkClass}
                        key={link.label}
                        onClick={closeMenu}
                        to={link.href}
                      >
                        {number}
                        {link.label}
                      </Link>
                    );
                  }
                  return (
                    <a
                      className={menuLinkClass}
                      href={link.href}
                      key={link.label}
                      onClick={closeMenu}
                    >
                      {number}
                      {link.label}
                    </a>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2.5 min-[540px]:hidden">
                <Link
                  className="bg-volt text-ink hover:text-ink hover:bg-lime inline-flex min-h-11 items-center gap-1.5 rounded-full px-5 text-[14px] font-bold"
                  onClick={closeMenu}
                  to="/volunteers"
                >
                  Volunteer with us
                  <ArrowRightIcon aria-hidden="true" weight="bold" />
                </Link>
              </div>
              <div className="text-muted-2 flex flex-wrap justify-between gap-3 font-mono text-[11px] tracking-[0.08em]">
                <span>LEARN. BUILD. INNOVATE. INSPIRE.</span>
                <span>ST. ALOYSIUS&apos; COLLEGE, GALLE · OBA</span>
              </div>
            </DialogContent>
          </DialogRoot>
        </div>
      </nav>
    </header>
  );
};
