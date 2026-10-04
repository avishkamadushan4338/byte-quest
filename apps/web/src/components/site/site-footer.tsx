import { Brand } from "@byte-quest/ui/components/brand";
import { Container } from "@byte-quest/ui/components/container";
import { Link } from "@tanstack/react-router";

import { footerGuidelineLinks, footerNavLinks } from "./navigation";

const CREST_SRC = "/assets/crest.png";

const columns = [
  { title: "Navigation", links: footerNavLinks },
  { title: "Guidelines", links: footerGuidelineLinks },
];

const isRouteLink = (href: string) =>
  href.startsWith("/") && !href.startsWith("/#");

export const SiteFooter = () => (
  <footer
    className="border-line-soft bg-ink border-t px-[clamp(20px,5vw,64px)] pt-16 pb-8"
    id="contact"
  >
    <Container>
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-10">
        <div className="min-w-0 md:col-span-2">
          <span className="flex items-center gap-3.5">
            <img
              alt="St. Aloysius' College crest"
              className="h-[52px] w-auto"
              src={CREST_SRC}
            />
            <Brand size="lg" />
          </span>
          <div className="font-display text-muted mt-[18px] text-[12.5px] font-semibold tracking-[0.16em]">
            LEARN. BUILD. INNOVATE. INSPIRE.
          </div>
          <p className="text-muted-2 mt-3 text-[14px] leading-[1.6]">
            St. Aloysius&apos; College, Galle
            <br />
            Old Boys&apos; Association
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <div className="text-faint font-mono text-[10.5px] tracking-[0.16em] uppercase">
              {column.title}
            </div>
            <div className="mt-4 grid gap-2.5">
              {column.links.map((link) =>
                isRouteLink(link.href) ? (
                  <Link
                    className="text-muted hover:text-volt text-[14px] transition-colors"
                    key={link.label}
                    to={link.href}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    className="text-muted hover:text-volt text-[14px] transition-colors"
                    href={link.href}
                    key={link.label}
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-line-soft text-faint mt-14 flex flex-wrap justify-between gap-3 border-t pt-[22px] text-[12.5px]">
        <span>
          © 2026 BYTE QUEST · St. Aloysius&apos; College OBA, Galle, Sri Lanka
        </span>
        <span className="font-mono tracking-[0.08em]">
          SOCIAL LINKS · COMING SOON
        </span>
      </div>
    </Container>
  </footer>
);
