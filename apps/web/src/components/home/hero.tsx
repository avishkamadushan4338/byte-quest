import { Container } from "@byte-quest/ui/components/container";
import { Button } from "@byte-quest/ui/primitives/button";
import { Link } from "@tanstack/react-router";

import { ArrowLabel } from "@/components/site/arrow-label";

import { crestAlt } from "./data";
import { HeroDots } from "./hero-dots";

const AVATAR_SRC = "/assets/hero-avatar.png";
const CREST_SRC = "/assets/sacoba-logo.png";

export const Hero = () => (
  <section
    className="relative flex min-h-[max(100svh,860px)] items-center overflow-hidden px-[clamp(20px,5vw,64px)] pt-[120px] pb-14"
    id="top"
    style={{
      background:
        "radial-gradient(42% 60% at 26% 46%, rgba(82,255,61,0.20) 0%, rgba(0,169,154,0.12) 35%, rgba(0,169,154,0.04) 65%, transparent 85%), radial-gradient(50% 55% at 24% 45%, rgba(0,169,154,0.16), rgba(0,169,154,0.06) 45%, transparent 75%), radial-gradient(40% 50% at 100% 30%, rgba(82,255,61,0.12), transparent 75%), #020807",
    }}
  >
    <HeroDots />

    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-[-6%] z-[1] aspect-[1024/1536] h-[82%] opacity-42 min-[980px]:left-[clamp(40px,5vw,120px)] min-[980px]:h-[min(calc(100%_-_86px),1240px)] min-[980px]:opacity-100"
    >
      <div
        className="absolute top-[40%] left-1/2 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle closest-side, rgba(82,255,61,0.30) 0%, rgba(0,169,154,0.16) 30%, rgba(0,169,154,0.06) 58%, rgba(0,169,154,0.015) 80%, rgba(0,169,154,0) 100%)",
        }}
      />
      <div className="relative size-full overflow-hidden [mask-image:linear-gradient(180deg,#000_0%,#000_58%,rgba(0,0,0,0.75)_72%,rgba(0,0,0,0.35)_84%,rgba(0,0,0,0.1)_93%,transparent_100%)] [-webkit-mask-image:linear-gradient(180deg,#000_0%,#000_58%,rgba(0,0,0,0.75)_72%,rgba(0,0,0,0.35)_84%,rgba(0,0,0,0.1)_93%,transparent_100%)]">
        <img
          alt=""
          className="absolute top-0 left-0 block h-auto w-full origin-[50%_0] scale-[1.28]"
          src={AVATAR_SRC}
        />
      </div>
    </div>

    <div
      aria-hidden="true"
      className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(2,8,7,0.2),rgba(2,8,7,0.7))] min-[980px]:bg-[linear-gradient(90deg,transparent_40%,rgba(2,8,7,0.35)_62%,transparent_100%)]"
    />
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-[-1px] z-[1] h-[34%] bg-[linear-gradient(180deg,rgba(2,8,7,0),rgba(2,8,7,0.7)_60%,#020807)]"
    />

    <Container className="relative z-[2] flex justify-end">
      <div className="[container-type:inline-size] -mt-[70px] w-[min(100%,600px)] min-[980px]:mr-[clamp(-48px,-3vw,0px)]">
        <h1 className="m-0 leading-none">
          <img
            alt="BYTE QUEST"
            className="block h-auto w-full max-w-[600px]"
            src="/assets/bq-logo.png"
          />
        </h1>

        <div className="font-display text-muted mt-6 flex flex-wrap gap-x-[18px] gap-y-2 text-[clamp(15px,1.5vw,20px)] font-semibold tracking-[0.16em]">
          <span>LEARN.</span>
          <span>BUILD.</span>
          <span className="text-lime">INNOVATE.</span>
          <span className="text-gold-bright">INSPIRE.</span>
        </div>

        <div className="font-display mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[clamp(16px,1.6vw,22px)] font-bold tracking-[0.02em]">
          <span>St. Aloysius&apos; College</span>
          <span className="text-volt">|</span>
          <span>INTER SCHOOL</span>
          <span className="text-volt">·</span>
          <span className="text-lime">2026</span>
        </div>

        <p className="text-fg-dim mt-[22px] max-w-[540px] text-[clamp(17px,1.5vw,20px)] leading-[1.65] text-pretty">
          A three month innovation and coding programme where Sri Lanka&apos;s
          young innovators learn, build and turn ideas into impact.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <Button
            className="h-auto px-6 py-[15px] text-[14.5px]"
            nativeButton={false}
            render={<Link to="/register/team" />}
          >
            <ArrowLabel>Register your team →</ArrowLabel>
          </Button>
          <Button
            className="h-auto px-6 py-[15px] text-[14.5px]"
            nativeButton={false}
            render={<Link aria-label="Explore the programme" to="/programme" />}
            variant="outline"
          >
            Explore the programme
          </Button>
        </div>

        <div className="border-line mt-12 flex flex-wrap items-end gap-x-9 gap-y-5 border-t pt-5">
          <div>
            <div className="text-muted-2 font-mono text-[11.5px] tracking-[0.14em]">
              PROUDLY PRESENTED BY
            </div>
            <img
              alt={crestAlt}
              className="mt-3.5 block h-16 w-auto"
              src={CREST_SRC}
            />
          </div>
        </div>
      </div>
    </Container>
  </section>
);
