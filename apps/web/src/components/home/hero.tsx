import { Container } from "@byte-quest/ui/components/container";
import { Button } from "@byte-quest/ui/primitives/button";
import { Link } from "@tanstack/react-router";

import { heroStrip } from "./data";

const CREST_SRC = "/assets/crest.png";

const dust = [
  { className: "left-[18%] top-[26%] size-1 bg-volt/70 delay-[0ms]" },
  { className: "left-[62%] top-[18%] size-1.5 bg-mint/60 delay-[700ms]" },
  { className: "left-[78%] top-[54%] size-1 bg-lime/60 delay-[1200ms]" },
  { className: "left-[42%] top-[72%] size-1.5 bg-teal/70 delay-[1800ms]" },
  { className: "left-[88%] top-[76%] size-1 bg-gold-bright/60 delay-[2400ms]" },
];

export const Hero = () => (
  <section
    className="relative flex min-h-svh flex-col justify-center overflow-hidden px-[clamp(20px,5vw,64px)] pt-32 pb-10"
    id="top"
  >
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(55% 65% at 74% 45%, rgba(8,122,85,0.38), transparent 62%), radial-gradient(35% 35% at 82% 72%, rgba(212,175,55,0.08), transparent 70%), linear-gradient(180deg,#020807 0%, #04130F 65%, #020807 100%)",
      }}
    />
    <div aria-hidden="true" className="absolute inset-0">
      {dust.map((particle) => (
        <span
          className={`animate-pulse-dot absolute rounded-full ${particle.className}`}
          key={particle.className}
        />
      ))}
    </div>

    <Container className="relative z-10">
      <div className="max-w-[640px]">
        <div className="border-gold/30 text-gold-bright inline-flex max-w-full items-center gap-2.5 overflow-hidden rounded-full border bg-[rgba(6,28,22,0.55)] py-[7px] pr-3.5 pl-2.5 font-mono text-[10.5px] tracking-[0.12em] whitespace-nowrap">
          <span className="animate-pulse-dot bg-volt size-1.5 shrink-0 rounded-full shadow-[0_0_10px_#52FF3D]" />
          INTER SCHOOL INNOVATION &amp; CODING PROGRAMME
        </div>

        <h1 className="text-fg mt-6 text-[clamp(60px,10vw,148px)] leading-[0.86] tracking-[-0.055em]">
          BYTE
          <br />
          <span className="bg-[linear-gradient(90deg,#52FF3D,#B7F000_55%,#00A99A)] bg-clip-text text-transparent">
            QUEST
          </span>
        </h1>

        <div className="font-display mt-[26px] flex flex-wrap gap-x-5 gap-y-2 text-[clamp(13px,1.3vw,16px)] font-semibold tracking-[0.16em]">
          <span>LEARN.</span>
          <span>BUILD.</span>
          <span className="text-lime">INNOVATE.</span>
          <span className="text-gold-bright">INSPIRE.</span>
        </div>

        <p className="text-muted mt-5 max-w-[440px] text-[clamp(16px,1.35vw,18px)] leading-[1.6]">
          Where Sri Lanka&apos;s young innovators turn ideas into impact.
        </p>

        <div className="mt-[34px] flex flex-wrap gap-2.5">
          <Button render={<Link to="/auth/login" />}>
            Register your team <span aria-hidden="true">→</span>
          </Button>
          <Button
            render={<a aria-label="Explore the programme" href="#programme" />}
            variant="outline"
          >
            Explore the programme
          </Button>
        </div>

        <a
          className="text-muted-2 hover:text-volt mt-[18px] inline-flex font-mono text-[11.5px] tracking-[0.1em]"
          href="#projects"
        >
          EXPLORE STUDENT PROJECTS <span className="ml-1">→</span>
        </a>
      </div>
    </Container>

    <Container className="relative z-10 mt-16">
      <div className="border-line-soft grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))] overflow-hidden rounded-2xl border bg-[rgba(2,8,7,0.55)] backdrop-blur-xl">
        <div className="flex items-center gap-3.5 px-5 py-4">
          <img alt="" className="h-9 w-auto" src={CREST_SRC} />
          <div className="text-muted-2 text-[12.5px] leading-[1.45]">
            <span className="text-fg font-semibold">
              St. Aloysius&apos; College, Galle
            </span>
            <br />
            Old Boys&apos; Association
          </div>
        </div>
        {heroStrip.map((item) => (
          <a
            className="border-line-soft text-fg hover:bg-volt/4 flex flex-col justify-center gap-1 border-t px-5 py-4 transition-colors md:border-t-0 md:border-l"
            href="#programme"
            key={item.key}
          >
            <span
              className="font-mono text-[10px] tracking-[0.14em]"
              style={{ color: item.accent }}
            >
              {item.key}
            </span>
            <span className="font-display flex items-center justify-between gap-2 text-[15px] font-semibold">
              {item.title}
              <span className="text-faint font-mono text-[10.5px] font-normal tracking-[0.08em]">
                TBA
              </span>
            </span>
          </a>
        ))}
      </div>
    </Container>
  </section>
);
