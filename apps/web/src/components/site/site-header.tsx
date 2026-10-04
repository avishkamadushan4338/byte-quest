import { BrandLockup } from "@byte-quest/ui/components/brand";
import { useScrolled } from "@byte-quest/ui/hooks/use-scrolled";
import { Button } from "@byte-quest/ui/primitives/button";
import {
  DialogClose,
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@byte-quest/ui/primitives/dialog";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { menuLinks, primaryNavLinks } from "./navigation";

const CREST_SRC = "/assets/crest.png";

export const SiteHeader = () => {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex justify-center transition-[padding] duration-300"
      style={{ padding: scrolled ? "10px 16px" : "20px 24px" }}
    >
      <nav
        aria-label="Primary"
        className="flex w-full max-w-[1280px] items-center justify-between gap-6 rounded-2xl border backdrop-blur-[18px] transition-all duration-300"
        style={{
          padding: scrolled ? "7px 8px 7px 14px" : "10px 12px 10px 18px",
          background: scrolled ? "rgba(2,8,7,0.78)" : "rgba(2,8,7,0)",
          borderColor: scrolled ? "rgba(185,245,208,0.1)" : "transparent",
        }}
      >
        <Link
          aria-label="BYTE QUEST home"
          className="text-fg flex shrink-0 items-center gap-3"
          to="/"
        >
          <BrandLockup
            crestClassName={scrolled ? "h-[30px]" : "h-10"}
            crestSrc={CREST_SRC}
          />
        </Link>

        <div className="hidden gap-7 text-[13.5px] font-medium min-[1100px]:flex">
          {primaryNavLinks.map((link) => (
            <a
              className="text-muted hover:text-fg whitespace-nowrap transition-colors"
              href={link.href}
              key={link.label}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            nativeButton={false}
            render={<Link to="/auth/login" />}
            size="sm"
          >
            Register Now
          </Button>
          <DialogRoot onOpenChange={setMenuOpen} open={menuOpen}>
            <DialogTrigger
              aria-label="Open menu"
              className="border-line-strong hover:border-volt flex size-10 flex-col items-center justify-center gap-[5px] rounded-full border bg-transparent transition-colors min-[1100px]:hidden"
            >
              <span className="bg-fg h-[1.5px] w-[15px]" />
              <span className="bg-fg h-[1.5px] w-[15px]" />
            </DialogTrigger>
            <DialogContent>
              <div className="flex items-center justify-between">
                <DialogTitle>Menu</DialogTitle>
                <DialogClose aria-label="Close menu">×</DialogClose>
              </div>
              <div
                className="grid flex-1 content-center gap-1 md:grid-cols-2"
                style={{ columnGap: "48px" }}
              >
                {menuLinks.map((link, index) => (
                  <a
                    className="border-line-soft font-display text-fg hover:text-volt flex items-baseline gap-4 border-b py-2.5 text-[clamp(26px,3.4vw,40px)] font-semibold tracking-[-0.025em] transition-colors"
                    href={link.href}
                    key={link.label}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="text-teal font-mono text-[11px] tracking-[0.1em]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="text-muted-2 flex flex-wrap justify-between gap-3 font-mono text-[11px] tracking-[0.08em]">
                <span>LEARN. BUILD. INNOVATE. INSPIRE.</span>
                <span>ST. ALOYSIUS&apos; COLLEGE, GALLE — OBA</span>
              </div>
            </DialogContent>
          </DialogRoot>
        </div>
      </nav>
    </header>
  );
};
