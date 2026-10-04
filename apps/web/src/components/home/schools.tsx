import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Marquee } from "@byte-quest/ui/components/marquee";
import { Section } from "@byte-quest/ui/components/section";

const schoolSlots = Array.from({ length: 10 }, (_, index) => index);

export const Schools = () => (
  <Section
    bleed
    className="border-line-soft border-y"
    id="schools"
    tone="schools"
  >
    <Container className="px-[clamp(20px,5vw,64px)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Kicker>Participating Schools</Kicker>
        <div className="text-faint font-mono text-[10.5px] tracking-[0.12em]">
          LOGOS PUBLISHED ON CONFIRMATION
        </div>
      </div>

      <div className="mt-7">
        <Marquee>
          {schoolSlots.map((slot) => (
            <div
              className="border-line mr-4 flex h-[88px] w-[200px] shrink-0 items-center justify-center gap-3 rounded-2xl border bg-[repeating-linear-gradient(135deg,#061C16_0_10px,#04140F_10px_20px)]"
              key={slot}
            >
              <span className="border-line-strong size-9 rounded-full border border-dashed" />
              <span className="text-faint font-mono text-[10.5px] tracking-[0.1em]">
                SCHOOL LOGO
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </Container>
  </Section>
);
