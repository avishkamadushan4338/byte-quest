import { Link } from "@tanstack/react-router";

import { ArrowLabel } from "@/components/site/arrow-label";

import {
  StatusShell,
  statusPrimaryButton,
  statusSecondaryButton,
} from "./status-shell";

const AVATAR_SRC = "/assets/hero-avatar.png";

export const NotFoundPage = () => (
  <StatusShell
    background="radial-gradient(45% 60% at 50% 55%, rgba(82,255,61,.16), rgba(0,169,154,.05) 50%, transparent 80%), #020807"
    className="min-h-svh"
  >
    <div className="relative min-h-svh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="font-display [mask-image:linear-gradient(180deg,#000_40%,transparent_92%)] text-[clamp(140px,40vw,560px)] leading-[0.8] font-bold tracking-[-0.07em] whitespace-nowrap text-transparent [filter:drop-shadow(0_0_24px_rgba(82,255,61,0.35))] [-webkit-text-stroke:2px_rgba(82,255,61,0.75)]">
          404
        </div>
      </div>

      <img
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 z-[1] h-[min(78vh,760px)] w-auto -translate-x-1/2 [mask-image:linear-gradient(180deg,#000_55%,transparent_95%)]"
        src={AVATAR_SRC}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-[2] h-[46%] bg-[linear-gradient(180deg,rgba(2,8,7,0),rgba(2,8,7,0.85)_55%,#020807)]"
      />

      <main className="absolute inset-x-0 bottom-[clamp(32px,6vh,64px)] z-[3] flex flex-col items-center px-5 text-center">
        <h1 className="font-display m-0 text-[clamp(28px,3.4vw,46px)] leading-none font-bold tracking-[-0.035em]">
          You&apos;ve left the map.
        </h1>
        <p className="text-muted mt-3 mb-0 max-w-[420px] text-[15.5px] leading-[1.6]">
          This page doesn&apos;t exist or has moved. Head back and continue the
          quest.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <Link className={statusPrimaryButton} to="/">
            <ArrowLabel>Back to home →</ArrowLabel>
          </Link>
          <Link className={statusSecondaryButton} to="/programme">
            Explore the programme
          </Link>
        </div>
      </main>
    </div>
  </StatusShell>
);
