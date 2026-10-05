import { Container } from "@byte-quest/ui/components/container";
import { Button } from "@byte-quest/ui/primitives/button";
import { Link } from "@tanstack/react-router";

import { crestAlt, heroArms, heroPresenter } from "./data";

const AVATAR_SRC = "/assets/hero-avatar.png";
const CREST_SRC = "/assets/crest.png";

export const Hero = () => (
  <section
    className="relative flex min-h-[max(100vh,860px)] items-center overflow-hidden px-[clamp(20px,5vw,64px)] pt-[120px] pb-14"
    id="top"
    style={{
      background:
        "radial-gradient(42% 60% at 26% 46%, rgba(82,255,61,0.20) 0%, rgba(0,169,154,0.12) 35%, rgba(0,169,154,0.04) 65%, transparent 85%), radial-gradient(50% 55% at 24% 45%, rgba(0,169,154,0.16), rgba(0,169,154,0.06) 45%, transparent 75%), radial-gradient(40% 50% at 100% 30%, rgba(82,255,61,0.12), transparent 75%), #020807",
    }}
  >
    <div
      aria-hidden="true"
      className="absolute top-[48%] left-[26%] hidden size-0 opacity-40 min-[640px]:block min-[980px]:opacity-100"
    >
      {heroArms.map((arm) => (
        <div
          className="absolute top-0 left-0 h-[clamp(48px,7vh,80px)] w-[clamp(180px,26vh,300px)] rounded-[16px] border-2"
          key={arm.rotation}
          style={{
            borderColor: arm.border,
            transform: `translate(-50%,-50%) rotate(${arm.rotation}deg) translateX(clamp(150px,22vh,260px))`,
          }}
        />
      ))}
    </div>

    <div
      aria-hidden="true"
      className="absolute bottom-0 left-[-16%] z-[1] aspect-[1024/1536] h-[82%] opacity-42 min-[980px]:left-[clamp(-40px,-1vw,20px)] min-[980px]:h-[min(calc(100%_-_86px),1240px)] min-[980px]:opacity-100"
    >
      <div
        className="absolute top-[40%] left-1/2 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle closest-side, rgba(82,255,61,0.30) 0%, rgba(0,169,154,0.16) 30%, rgba(0,169,154,0.06) 58%, rgba(0,169,154,0.015) 80%, rgba(0,169,154,0) 100%)",
        }}
      />
      <img
        alt=""
        className="relative block h-full w-full [mask-image:linear-gradient(180deg,#000_0%,#000_78%,transparent_100%)] object-contain object-bottom [-webkit-mask-image:linear-gradient(180deg,#000_0%,#000_78%,transparent_100%)]"
        src={AVATAR_SRC}
      />
    </div>

    <div
      aria-hidden="true"
      className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(2,8,7,0.2),rgba(2,8,7,0.7))] min-[980px]:bg-[linear-gradient(90deg,transparent_40%,rgba(2,8,7,0.35)_62%,transparent_100%)]"
    />
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-[-1px] z-[1] h-[28%] bg-[linear-gradient(180deg,rgba(2,8,7,0),#020807)]"
    />

    <Container className="relative z-[2] flex justify-end">
      <div className="[container-type:inline-size] -mt-[200px] mr-[clamp(-48px,-3vw,0px)] w-[min(100%,600px)]">
        <h1 className="font-display text-[min(88px,calc(100cqw/8.8))] leading-[1] font-bold tracking-[-0.02em] whitespace-nowrap">
          BYTE{" "}
          <span className="bg-[linear-gradient(90deg,#52FF3D,#B7F000_55%,#00A99A)] bg-clip-text text-transparent">
            QUEST
          </span>
          <span className="text-volt ml-[6px] inline-block align-top text-[0.38em] leading-[1]">
            /
          </span>
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

        <p className="text-fg-dim mt-[22px] max-w-[500px] text-[clamp(15.5px,1.25vw,17.5px)] leading-[1.65] text-pretty">
          A three-month innovation and coding programme where Sri Lanka&apos;s
          young innovators learn, build and turn ideas into impact — guided by
          mentors and celebrated at the Innovation Expo.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <Button
            className="h-auto px-6 py-[15px] text-[14.5px]"
            render={<Link to="/register" />}
          >
            Register your team <span aria-hidden="true">→</span>
          </Button>
          <Button
            className="h-auto px-6 py-[15px] text-[14.5px]"
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
            <div className="mt-3 flex items-center gap-4">
              <img alt={crestAlt} className="h-[54px] w-auto" src={CREST_SRC} />
              <div className="text-muted text-[15.5px] leading-[1.45]">
                <span className="text-fg font-semibold">
                  {heroPresenter.line1}
                </span>
                <br />
                {heroPresenter.line2}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
);
