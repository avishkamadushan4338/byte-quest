import { cn } from "@byte-quest/ui/lib/utils";
import { UserIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ArrowLabel } from "@/components/site/arrow-label";
import { SubpageHero } from "@/components/site/subpage-hero";
import {
  statusPrimaryButton,
  statusSecondaryButton,
} from "@/components/status/status-shell";

import { REGISTRATION_OPENS_AT, registrationNotOpen } from "./data";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

interface RegistrationNotOpenProps {
  /** Called once the opening time is reached so the form can take over. */
  onOpen: () => void;
}

const TEAM_SEATS = [
  { id: "seat-1", required: true },
  { id: "seat-2", required: true },
  { id: "seat-3", required: true },
  { id: "seat-4", required: false },
  { id: "seat-5", required: false },
];

const pad = (value: number) => String(value).padStart(2, "0");

const splitRemaining = (remaining: number) => ({
  days: Math.floor(remaining / DAY),
  hours: Math.floor((remaining % DAY) / HOUR),
  minutes: Math.floor((remaining % HOUR) / MINUTE),
  seconds: Math.floor((remaining % MINUTE) / SECOND),
});

export const RegistrationNotOpen = ({ onOpen }: RegistrationNotOpenProps) => {
  // Null until mounted so server and client render the same markup.
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const left = REGISTRATION_OPENS_AT.getTime() - Date.now();
      if (left <= 0) {
        onOpen();
        return;
      }
      setRemaining(left);
    };
    tick();
    const timer = window.setInterval(tick, SECOND);
    return () => window.clearInterval(timer);
  }, [onOpen]);

  const parts = remaining === null ? null : splitRemaining(remaining);
  const units = [
    { label: "DAYS", value: parts ? pad(parts.days) : "--" },
    { label: "HOURS", value: parts ? pad(parts.hours) : "--" },
    { label: "MINUTES", value: parts ? pad(parts.minutes) : "--" },
    { label: "SECONDS", value: parts ? pad(parts.seconds) : "--" },
  ];

  return (
    <main className="bg-ink">
      <SubpageHero
        className="pt-[clamp(104px,11vw,148px)] pb-[clamp(28px,4vw,44px)] [&_h1]:mt-4 [&_h1]:text-[clamp(40px,5.5vw,76px)]"
        kicker={registrationNotOpen.kicker}
        lead={registrationNotOpen.lead}
        title={registrationNotOpen.title}
      />

      <section className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]">
        <div className="mx-auto max-w-[880px]">
          <div
            className="relative min-w-0 overflow-hidden rounded-[24px] border border-[rgba(212,175,55,0.22)] p-[clamp(22px,3.5vw,44px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            style={{
              background:
                "radial-gradient(60% 80% at 100% 0%, rgba(82,255,61,0.12), transparent 62%), radial-gradient(50% 70% at 0% 0%, rgba(212,175,55,0.1), transparent 60%), #030F0B",
            }}
          >
            <span className="text-gold-bright inline-flex items-center gap-2 rounded-full border border-[rgba(240,216,117,0.35)] bg-[rgba(240,216,117,0.07)] px-3 py-1.5 font-mono text-[12.5px] tracking-[0.16em]">
              <span
                aria-hidden="true"
                className="bg-gold-bright size-2 rounded-full motion-safe:animate-pulse"
              />
              {registrationNotOpen.status}
            </span>

            <div className="text-muted-2 mt-7 font-mono text-[12.5px] tracking-[0.16em]">
              {registrationNotOpen.opensLabel}
            </div>
            <div className="font-display text-volt mt-2 text-[clamp(34px,5vw,60px)] leading-none font-bold tracking-[-0.04em]">
              {registrationNotOpen.opensDate}
            </div>

            <div
              className="mt-8 grid grid-cols-4 gap-2 sm:gap-3.5"
              role="timer"
            >
              {units.map((unit) => (
                <div
                  className="min-w-0 rounded-[16px] border border-[rgba(185,245,208,0.1)] bg-[rgba(2,8,7,0.55)] px-1 py-4 text-center sm:px-2 sm:py-5"
                  key={unit.label}
                >
                  <div className="font-display text-fg text-[clamp(26px,4.2vw,46px)] leading-none font-bold tracking-[-0.03em] tabular-nums">
                    {unit.value}
                  </div>
                  <div className="text-faint mt-2 font-mono text-[10px] leading-tight tracking-[0.04em] whitespace-nowrap sm:text-[13px] sm:tracking-[0.14em]">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-[18px] border border-[rgba(185,245,208,0.1)] bg-[rgba(2,8,7,0.55)] px-5 py-4 sm:px-6">
              <div>
                <div className="text-teal font-mono text-[12.5px] tracking-[0.16em]">
                  {registrationNotOpen.readyKicker}
                </div>
                <div className="font-display text-fg mt-1.5 text-[clamp(22px,2.6vw,30px)] leading-none font-bold tracking-[-0.03em]">
                  {registrationNotOpen.readyTitle}
                </div>
              </div>
              <div aria-hidden="true" className="flex items-center gap-2">
                {TEAM_SEATS.map((seat) => (
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full border sm:size-11",
                      seat.required
                        ? "text-volt border-[rgba(82,255,61,0.45)] bg-[rgba(82,255,61,0.12)] shadow-[0_0_18px_-4px_rgba(82,255,61,0.5)]"
                        : "text-faint border-dashed border-[rgba(185,245,208,0.28)]"
                    )}
                    key={seat.id}
                  >
                    <UserIcon
                      aria-hidden="true"
                      size={20}
                      weight={seat.required ? "fill" : "regular"}
                    />
                  </span>
                ))}
              </div>
              <div className="text-muted-2 basis-full font-mono text-[11.5px] tracking-[0.12em]">
                {registrationNotOpen.readyNote}
              </div>
            </div>

            <p className="text-muted-2 mt-4 mb-0 text-[14.5px] leading-[1.55]">
              {registrationNotOpen.closesNote}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link className={statusPrimaryButton} to="/programme">
                <ArrowLabel>Explore the programme →</ArrowLabel>
              </Link>
              <Link className={statusSecondaryButton} to="/journey">
                See the journey
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
