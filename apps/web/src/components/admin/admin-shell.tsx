import { Container } from "@byte-quest/ui/components/container";
import { PageHero } from "@byte-quest/ui/components/page-hero";
import { Section } from "@byte-quest/ui/components/section";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { adminNavLinks } from "./admin-nav";
import { adminCopy, adminHero } from "./data";

const navLinkClass =
  "text-muted hover:text-fg hover:border-line-strong shrink-0 rounded-xl border border-transparent px-4 py-2.5 text-[14px] font-semibold whitespace-nowrap transition-colors";
const navLinkActiveClass = "bg-volt/10 border-volt/30 text-volt";

export const AdminShell = ({ children }: { children: ReactNode }) => (
  <main className="bg-ink overflow-x-hidden">
    <PageHero
      glow="gold"
      id="admin"
      kicker={adminHero.kicker}
      kickerTone="volt"
      lead={adminHero.lead}
      title={adminHero.title}
    />

    <Section tone="alt">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-start lg:gap-10">
          <nav
            aria-label={adminCopy.tabsLabel}
            className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {adminNavLinks.map((link) => (
              <Link
                activeProps={{ className: navLinkActiveClass }}
                className={navLinkClass}
                key={link.href}
                to={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </Section>
  </main>
);
