import { Container } from "@byte-quest/ui/components/container";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import {
  footerGuidelineLinks,
  footerNavLinks,
  footerProgrammeLinks,
  isInternalHref,
} from "./navigation";
import type { NavLink } from "./navigation";

const CREST_SRC = "/assets/crest.png";
const BRAND_SRC = "/assets/bq-logo.png";
const BRAND_MARK_SRC = "/assets/bq-logo-mark.png";
const CURRENT_YEAR = new Date().getFullYear();

const pillars = [
  { label: "Learn", dot: "bg-teal" },
  { label: "Build", dot: "bg-volt" },
  { label: "Innovate", dot: "bg-lime" },
  { label: "Inspire", dot: "bg-gold-bright" },
];

const columns = [
  { title: "Programme", titleClass: "text-teal", links: footerProgrammeLinks },
  { title: "Get involved", titleClass: "text-volt", links: footerNavLinks },
];

const socials: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "Facebook",
    href: "#contact",
    icon: (
      <path
        d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.4V11H7v4h3v9h4v-9h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z"
        fill="currentColor"
      />
    ),
  },
  {
    label: "Instagram",
    href: "#contact",
    icon: (
      <>
        <rect
          fill="none"
          height="17"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
          width="17"
          x="3.5"
          y="3.5"
        />
        <circle
          cx="12"
          cy="12"
          fill="none"
          r="4"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="17.2" cy="6.8" fill="currentColor" r="1.1" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "#contact",
    icon: (
      <path
        d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15V9l5.2 3Z"
        fill="currentColor"
      />
    ),
  },
  {
    label: "LinkedIn",
    href: "#contact",
    icon: (
      <path
        d="M6.5 8.5h-3V20h3V8.5ZM5 3.8a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.5 13.4c0-3-1.6-5.1-4.4-5.1-1.5 0-2.5.8-3 1.6V8.5h-3V20h3v-6c0-1.5.6-2.8 2.2-2.8 1.5 0 2.2 1.2 2.2 2.9V20h3v-6.6Z"
        fill="currentColor"
      />
    ),
  },
  {
    label: "TikTok",
    href: "#contact",
    icon: (
      <path
        d="M16.5 3h-3.2v12.3a2.8 2.8 0 1 1-2-2.7V9.4a6 6 0 1 0 5.2 5.9V9.1a7.6 7.6 0 0 0 4.3 1.3V7.2a4.3 4.3 0 0 1-4.3-4.2Z"
        fill="currentColor"
      />
    ),
  },
];

const linkClass =
  "font-display w-fit py-1 text-[17px] font-medium tracking-[-0.01em] text-[#C9D8D1] transition-colors duration-200 hover:text-white";
const eyebrowClass =
  "font-mono text-[10.5px] tracking-[0.2em] text-faint uppercase";

const FooterLink = ({ link }: { link: NavLink }) =>
  isInternalHref(link.href) ? (
    <Link className={linkClass} to={link.href}>
      {link.label}
    </Link>
  ) : (
    <a className={linkClass} href={link.href}>
      {link.label}
    </a>
  );

export const SiteFooter = () => (
  <footer
    className="bg-ink relative overflow-hidden bg-[radial-gradient(55%_45%_at_50%_100%,rgba(82,255,61,0.08),transparent_70%)] px-[clamp(20px,5vw,64px)] pt-[clamp(64px,8vw,104px)] pb-2"
    id="contact"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,169,154,0.5)_20%,rgba(82,255,61,0.6)_50%,rgba(212,175,55,0.45)_80%,transparent)]"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-[clamp(120px,14vw,200px)] left-1/2 w-[min(92vw,1300px)] -translate-x-1/2"
    >
      <img
        alt=""
        className="block h-auto w-full [mask-image:linear-gradient(180deg,#000_30%,transparent_100%)] opacity-[0.05]"
        src={BRAND_SRC}
      />
    </div>

    <Container className="relative">
      <div className="flex flex-wrap gap-x-[clamp(40px,7vw,120px)] gap-y-12">
        <div className="flex max-w-[440px] min-w-0 flex-[1_1_320px] flex-col gap-6">
          <Link
            aria-label="BYTE QUEST home"
            className="inline-flex w-fit items-center gap-3.5"
            to="/"
          >
            <img
              alt="St. Aloysius' College crest"
              className="h-12 w-auto"
              src={CREST_SRC}
            />
            <span aria-hidden="true" className="bg-line-strong h-7 w-px" />
            <img alt="BYTE QUEST" className="h-6 w-auto" src={BRAND_SRC} />
          </Link>
          <p className="font-display text-fg-strong m-0 text-[clamp(20px,1.8vw,24px)] leading-[1.35] font-medium tracking-[-0.015em] text-pretty">
            Where Sri Lanka&apos;s young innovators turn ideas into{" "}
            <span className="text-volt">impact.</span>
          </p>
          <ul className="font-display text-fg-dim m-0 flex list-none flex-wrap items-center gap-x-[22px] gap-y-2.5 p-0 text-[16px] leading-none font-medium">
            {pillars.map((pillar) => (
              <li
                className="inline-flex items-center gap-[0.45em] whitespace-nowrap"
                key={pillar.label}
              >
                <span
                  aria-hidden="true"
                  className={`size-[0.32em] rounded-full ${pillar.dot}`}
                />
                {pillar.label}
              </li>
            ))}
          </ul>
        </div>

        <nav
          aria-label="Footer"
          className="grid min-w-0 flex-[1.6_1_440px] grid-cols-2 gap-x-[clamp(16px,3vw,40px)] gap-y-9"
        >
          {columns.map((column) => (
            <div key={column.title}>
              <div
                className={`font-mono text-[11px] tracking-[0.2em] uppercase ${column.titleClass}`}
              >
                {column.title}
              </div>
              <div className="mt-[18px] grid gap-1.5">
                {column.links.map((link) => (
                  <FooterLink key={link.label} link={link} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-[clamp(56px,7vw,80px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-6 border-t border-[rgba(185,245,208,0.08)] py-6">
        <div className="flex flex-wrap items-center gap-5">
          <span className={eyebrowClass}>Proudly presented by</span>
          <div className="flex items-center gap-4">
            <img
              alt="BYTE QUEST"
              className="h-10 w-auto"
              src={BRAND_MARK_SRC}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <span className={eyebrowClass}>Follow the quest</span>
          <ul className="m-0 flex list-none gap-2 p-0">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  aria-label={`BYTE QUEST on ${social.label}`}
                  className="hover:bg-volt hover:border-volt hover:text-ink flex size-11 items-center justify-center rounded-full border border-[rgba(185,245,208,0.14)] bg-[rgba(255,255,255,0.02)] text-[#C9D8D1] transition-all duration-250"
                  href={social.href}
                >
                  <svg
                    aria-hidden="true"
                    height="18"
                    viewBox="0 0 24 24"
                    width="18"
                  >
                    {social.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-faint flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[rgba(185,245,208,0.08)] py-[22px] text-[13px]">
        <span className="min-w-0 flex-auto">
          © {CURRENT_YEAR} BYTE QUEST · St. Aloysius&apos; College OBA, Galle
        </span>
        <ul className="m-0 flex list-none flex-wrap items-center gap-x-[22px] gap-y-2 p-0">
          {footerGuidelineLinks.map((link) => (
            <li key={link.label}>
              <Link
                className="text-muted-2 hover:text-fg inline-block py-1.5"
                to={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </footer>
);
