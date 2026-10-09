import { Container } from "@byte-quest/ui/components/container";
import { Button } from "@byte-quest/ui/primitives/button";
import { Link } from "@tanstack/react-router";

import { ArrowLabel } from "@/components/site/arrow-label";

import { HeroDots } from "./hero-dots";

const AVATAR_SRC = "/assets/hero-avatar-1024.webp";
const AVATAR_SRCSET =
  "/assets/hero-avatar-640.webp 640w, /assets/hero-avatar-1024.webp 1024w";
const AVATAR_SIZES = "(min-width: 1024px) 800px, 92vw";

export const Hero = () => (
  <section
    className="split:min-h-[max(100svh,860px)] split:flex-row split:items-center split:pt-[120px] relative flex flex-col overflow-hidden px-[clamp(20px,5vw,64px)] pt-[88px] pb-14"
    id="top"
    style={{
      background:
        "radial-gradient(42% 60% at 26% 46%, rgba(82,255,61,0.20) 0%, rgba(0,169,154,0.12) 35%, rgba(0,169,154,0.04) 65%, transparent 85%), radial-gradient(50% 55% at 24% 45%, rgba(0,169,154,0.16), rgba(0,169,154,0.06) 45%, transparent 75%), radial-gradient(40% 50% at 100% 30%, rgba(82,255,61,0.12), transparent 75%), #020807",
    }}
  >
    <HeroDots />

    <div
      aria-hidden="true"
      className="split:absolute split:bottom-0 split:left-[clamp(40px,5vw,120px)] split:mx-0 split:aspect-[1024/1536] split:h-[min(calc(100%_-_86px),1240px,62vw)] split:w-auto pointer-events-none relative z-[1] mx-auto aspect-square w-[min(92vw,540px)] shrink-0"
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
          decoding="async"
          fetchPriority="high"
          height={1536}
          width={1024}
          sizes={AVATAR_SIZES}
          src={AVATAR_SRC}
          srcSet={AVATAR_SRCSET}
        />
      </div>
    </div>

    <div
      aria-hidden="true"
      className="split:bg-[linear-gradient(90deg,transparent_40%,rgba(2,8,7,0.35)_62%,transparent_100%)] absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(2,8,7,0.2),rgba(2,8,7,0.7))]"
    />
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-[-1px] z-[1] h-[34%] bg-[linear-gradient(180deg,rgba(2,8,7,0),rgba(2,8,7,0.7)_60%,#020807)]"
    />

    <Container className="split:mt-0 split:justify-end relative z-[2] -mt-[16vw] flex min-[540px]:-mt-[88px]">
      <div className="split:-mt-[70px] split:mr-[clamp(-48px,-3vw,0px)] split:w-[min(100%,calc(100vw-500px),600px)] [container-type:inline-size] w-full">
        <h1 className="m-0 leading-none">
          <img
            alt="BYTE QUEST"
            className="block h-auto w-full max-w-[600px]"
            height={604}
            width={4064}
            src="/assets/bq-logo.webp"
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
            render={<Link to="/volunteers" />}
          >
            <ArrowLabel>Join as Volunteer →</ArrowLabel>
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
            <div className="mt-3.5 flex flex-wrap items-center gap-6">
              <img
                alt="SACOBA - Old Boys' Association, St. Aloysius' College"
                className="block h-14 w-auto"
                height={56}
                loading="lazy"
                width={189}
                src="/assets/sacoba-logo.webp"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
);
